require("dotenv").config();
const supabase = require('./config/supabase');

async function test() {
  const { data, error } = await supabase.from('images').insert({
    title: 'Test',
    description: 'Test desc',
    image_url: 'https://example.com/test.jpg',
    user_id: '2948a56e-5c35-42be-8636-9e1f846804e1',
    category_id: '539acdd5-d703-497b-8bd0-1f76332602ab'
  }).select();
  console.log('Insert data:', data);
  console.log('Insert error:', error);
}
test();
