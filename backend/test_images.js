require("dotenv").config();
const supabase = require('./config/supabase');

async function test() {
  const { data, error } = await supabase.from('images').select('*').limit(5);
  console.log('Images data:', data);
  console.log('Images error:', error);
}
test();
