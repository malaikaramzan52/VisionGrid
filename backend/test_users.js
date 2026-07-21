require("dotenv").config();
const supabase = require('./config/supabase');

async function test() {
  const { data, error } = await supabase.from('users').select('*');
  console.log('Users data:', data);
  console.log('Users error:', error);
}
test();
