require("dotenv").config();
const supabase = require('./config/supabase');

async function test() {
  const { data, error } = await supabase.storage.listBuckets();
  console.log('Buckets list:', data);
  console.log('Buckets error:', error);
}
test();
