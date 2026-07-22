/**
 * Forces browser to download an image file directly to disk instead of opening a new tab.
 * @param {string} url - Image URL
 * @param {string} title - Image title or filename base
 */
export async function triggerDirectDownload(url, title = 'visiongrid-image') {
  if (!url) return;

  // Derive file extension and formatted filename
  const urlPath = url.split('?')[0];
  const extMatch = urlPath.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'jpg';
  const cleanTitle = (title || 'image').replace(/[^a-zA-Z0-9\-_]/g, '-').toLowerCase();
  const filename = `${cleanTitle}.${ext}`;

  try {
    // 1. Primary Strategy: Fetch image as a Blob
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke Object URL after download starts
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
  } catch (err) {
    console.warn('Fetch blob download failed, falling back to Canvas method:', err);
    // 2. Fallback Strategy: Draw image to Canvas and export Blob
    downloadViaCanvas(url, filename);
  }
}

function downloadViaCanvas(url, filename) {
  const img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const isPng = filename.endsWith('.png');
      const mimeType = isPng ? 'image/png' : 'image/jpeg';

      canvas.toBlob((blob) => {
        if (!blob) {
          fallbackDirectLink(url, filename);
          return;
        }
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
      }, mimeType, 0.95);
    } catch {
      fallbackDirectLink(url, filename);
    }
  };

  img.onerror = () => {
    fallbackDirectLink(url, filename);
  };

  img.src = url;
}

function fallbackDirectLink(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  // NOTE: Do NOT set target="_blank"
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
