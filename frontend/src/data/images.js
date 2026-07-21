export const CATEGORIES = ['All', 'Nature', 'Travel', 'Art', 'Tech', 'Cars', 'Anime', 'Architecture'];

function generatePlaceholder(id, title, category, height = 450) {
  const categoriesPalette = {
    Nature:       [140, 160],
    Travel:       [195, 220],
    Art:          [320, 345],
    Tech:         [260, 280],
    Cars:         [15, 35],
    Anime:        [290, 310],
    Architecture: [45, 60],
  };
  const palette = categoriesPalette[category] || [0, 40];
  const startHue = (palette[0] + (id * 13) % (palette[1] - palette[0])) % 360;
  const endHue = (startHue + 35) % 360;
  
  const gradientStart = `hsl(${startHue}, 80%, 55%)`;
  const gradientEnd = `hsl(${endHue}, 85%, 35%)`;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 ${height}" width="100%" height="100%">
    <defs>
      <linearGradient id="g_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientStart}" />
        <stop offset="100%" stop-color="${gradientEnd}" />
      </linearGradient>
      <pattern id="grid_${id}" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1.5" opacity="0.04" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#g_${id})" />
    <rect width="100%" height="100%" fill="url(#grid_${id})" />
    <circle cx="240" cy="${height / 2 - 25}" r="65" fill="white" opacity="0.09" />
    <text x="50%" y="${height / 2 - 20}" dominant-baseline="middle" text-anchor="middle" font-family="'Poppins', 'Inter', sans-serif" font-size="34" font-weight="800" fill="white" opacity="0.9" letter-spacing="-0.5px">${category}</text>
    <text x="50%" y="${height / 2 + 25}" dominant-baseline="middle" text-anchor="middle" font-family="'Inter', sans-serif" font-size="15" font-weight="600" fill="white" opacity="0.75">${title}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const images = [
  // Nature
  { id: 1,  url: generatePlaceholder(1, 'Alpine Sunrise', 'Nature', 620),  title: 'Alpine Sunrise',       category: 'Nature',       author: 'Aria Woods',    likes: 3241, saves: 1891 },
  { id: 2,  url: generatePlaceholder(2, 'Ocean Mist', 'Nature', 360),      title: 'Ocean Mist',           category: 'Nature',       author: 'Liam Waters',   likes: 2109, saves: 743  },
  { id: 3,  url: generatePlaceholder(3, 'Forest Path', 'Nature', 500),     title: 'Forest Path',          category: 'Nature',       author: 'Clara Green',   likes: 4521, saves: 2103 },
  { id: 4,  url: generatePlaceholder(4, 'Wildflower Meadow', 'Nature', 420), title: 'Wildflower Meadow',    category: 'Nature',       author: 'Diana Bloom',   likes: 1876, saves: 892  },
  { id: 5,  url: generatePlaceholder(5, 'Hidden Waterfall', 'Nature', 560),  title: 'Hidden Waterfall',     category: 'Nature',       author: 'Ethan Falls',   likes: 5632, saves: 3201 },
  { id: 6,  url: generatePlaceholder(6, 'Golden Horizon', 'Nature', 340),    title: 'Golden Horizon',       category: 'Nature',       author: 'Fiona Sun',     likes: 2890, saves: 1230 },

  // Travel
  { id: 7,  url: generatePlaceholder(7, 'Paris at Dusk', 'Travel', 580),     title: 'Paris at Dusk',        category: 'Travel',       author: 'Georges Lux',   likes: 6201, saves: 4102 },
  { id: 8,  url: generatePlaceholder(8, 'Tokyo Nights', 'Travel', 380),      title: 'Tokyo Nights',         category: 'Travel',       author: 'Hana Mori',     likes: 4341, saves: 2109 },
  { id: 9,  url: generatePlaceholder(9, 'Bali Temple', 'Travel', 520),       title: 'Bali Temple',          category: 'Travel',       author: 'Ivan Ray',      likes: 3892, saves: 1893 },
  { id: 10, url: generatePlaceholder(10, 'Venice Canals', 'Travel', 420),    title: 'Venice Canals',        category: 'Travel',       author: 'Julia Mar',     likes: 5123, saves: 3241 },
  { id: 11, url: generatePlaceholder(11, 'Sahara Dunes', 'Travel', 640),     title: 'Sahara Dunes',         category: 'Travel',       author: 'Kai Sand',      likes: 2341, saves: 1092 },
  { id: 12, url: generatePlaceholder(12, 'NYC Skyline', 'Travel', 320),      title: 'NYC Skyline',          category: 'Travel',       author: 'Luna City',     likes: 7821, saves: 5103 },

  // Art
  { id: 13, url: generatePlaceholder(13, 'Abstract Motion', 'Art', 540),     title: 'Abstract Motion',      category: 'Art',          author: 'Marco Vinci',   likes: 2891, saves: 1432 },
  { id: 14, url: generatePlaceholder(14, 'Neon Portrait', 'Art', 600),       title: 'Neon Portrait',        category: 'Art',          author: 'Nina Cole',     likes: 3421, saves: 1892 },
  { id: 15, url: generatePlaceholder(15, 'Oil Canvas Dreams', 'Art', 360),   title: 'Oil Canvas Dreams',    category: 'Art',          author: 'Oscar Hue',     likes: 1923, saves: 843  },
  { id: 16, url: generatePlaceholder(16, 'Marble Form', 'Art', 480),         title: 'Marble Form',          category: 'Art',          author: 'Petra Stone',   likes: 2109, saves: 1023 },
  { id: 17, url: generatePlaceholder(17, 'Digital Dreams', 'Art', 420),       title: 'Digital Dreams',       category: 'Art',          author: 'Quinn Pixels',  likes: 4521, saves: 2891 },
  { id: 18, url: generatePlaceholder(18, 'Urban Canvas', 'Art', 380),        title: 'Urban Canvas',         category: 'Art',          author: 'Rio Street',    likes: 3102, saves: 1450 },

  // Tech
  { id: 19, url: generatePlaceholder(19, 'Circuit Dreams', 'Tech', 560),     title: 'Circuit Dreams',       category: 'Tech',         author: 'Sam Code',      likes: 1872, saves: 892  },
  { id: 20, url: generatePlaceholder(20, 'Future Robot', 'Tech', 380),       title: 'Future Robot',         category: 'Tech',         author: 'Tara Bot',      likes: 3241, saves: 1783 },
  { id: 21, url: generatePlaceholder(21, 'Data Center', 'Tech', 460),        title: 'Data Center',          category: 'Tech',         author: 'Uma Data',      likes: 1523, saves: 632  },
  { id: 22, url: generatePlaceholder(22, 'VR Frontier', 'Tech', 320),        title: 'VR Frontier',          category: 'Tech',         author: 'Victor VR',     likes: 4102, saves: 2341 },
  { id: 23, url: generatePlaceholder(23, 'AI Visions', 'Tech', 580),         title: 'AI Visions',           category: 'Tech',         author: 'Wendy AI',      likes: 5203, saves: 3102 },
  { id: 24, url: generatePlaceholder(24, 'Mobile Future', 'Tech', 400),      title: 'Mobile Future',        category: 'Tech',         author: 'Xavier Dev',    likes: 2103, saves: 1021 },

  // Cars
  { id: 25, url: generatePlaceholder(25, 'Speed Machine', 'Cars', 320),      title: 'Speed Machine',        category: 'Cars',         author: 'Yara Race',     likes: 6102, saves: 4201 },
  { id: 26, url: generatePlaceholder(26, 'Classic Elegance', 'Cars', 540),   title: 'Classic Elegance',     category: 'Cars',         author: 'Zack Retro',    likes: 4892, saves: 3102 },
  { id: 27, url: generatePlaceholder(27, 'Electric Dream', 'Cars', 400),     title: 'Electric Dream',       category: 'Cars',         author: 'Amy Volt',      likes: 3201, saves: 1892 },
  { id: 28, url: generatePlaceholder(28, 'Rally Spirit', 'Cars', 360),       title: 'Rally Spirit',         category: 'Cars',         author: 'Bob Rally',     likes: 2891, saves: 1432 },

  // Architecture
  { id: 29, url: generatePlaceholder(29, 'Sky Tower', 'Architecture', 620),  title: 'Sky Tower',            category: 'Architecture', author: 'Cleo Build',    likes: 3892, saves: 2103 },
  { id: 30, url: generatePlaceholder(30, 'Steel Bridge', 'Architecture', 380), title: 'Steel Bridge',         category: 'Architecture', author: 'Dan Bridge',    likes: 2341, saves: 1092 },
  { id: 31, url: generatePlaceholder(31, 'Modern Museum', 'Architecture', 500), title: 'Modern Museum',        category: 'Architecture', author: 'Eve Design',    likes: 4102, saves: 2341 },
  { id: 32, url: generatePlaceholder(32, 'Zen House', 'Architecture', 440),     title: 'Zen House',            category: 'Architecture', author: 'Frank Arch',    likes: 3201, saves: 1782 },
  { id: 33, url: generatePlaceholder(33, 'Ancient Temple', 'Architecture', 560), title: 'Ancient Temple',       category: 'Architecture', author: 'Grace Stone',   likes: 5102, saves: 3201 },
  { id: 34, url: generatePlaceholder(34, 'Glass Towers', 'Architecture', 300),  title: 'Glass Towers',         category: 'Architecture', author: 'Hugo Sky',      likes: 2891, saves: 1450 },

  // Anime
  { id: 35, url: generatePlaceholder(35, 'Dreamy World', 'Anime', 540),      title: 'Dreamy World',         category: 'Anime',        author: 'Iris Art',      likes: 7821, saves: 5432 },
  { id: 36, url: generatePlaceholder(36, 'City Lights', 'Anime', 400),       title: 'City Lights',          category: 'Anime',        author: 'Jake Draw',     likes: 6102, saves: 4201 },
];
