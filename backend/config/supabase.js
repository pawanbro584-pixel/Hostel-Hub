const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('your-supabase-project')) {
  supabase = createClient(supabaseUrl, supabaseServiceKey);
} else {
  console.warn('Supabase credentials not configured in .env. Storage features will mock uploads locally if unconfigured.');
}

module.exports = supabase;
