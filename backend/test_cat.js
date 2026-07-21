require("dotenv").config();
const supabase = require('./config/supabase');

async function test() {
  const { data, error } = await supabase.from('categories').select('*');
  console.log('Categories data:', data);
  console.log('Categories error:', error);
}
test();
