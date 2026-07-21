require("dotenv").config();
const supabase = require('./config/supabase');

async function test() {
  const { data, error } = await supabase.schema('storage').from('buckets').select('*');
  console.log('Storage Buckets data:', data);
  console.log('Storage Buckets error:', error);
}
test();
