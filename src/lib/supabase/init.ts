import { createClient } from '@supabase/supabase-js';
const SUPABASEURL = `${process.env.SUPABASEURL}`;
const SUPABASEKEY = `${process.env.SUPABASEKEY}`;
const supabase = createClient(SUPABASEURL, SUPABASEKEY);

export default supabase;
