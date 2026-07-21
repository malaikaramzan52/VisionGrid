require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL || "https://sszkkweeajmgjrocqzmr.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "sb_publishable_rCc-mrO-FlhVeEWNvnJZ1w_Nf90pKkD";

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;