import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseKey } from './credensial';
// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
