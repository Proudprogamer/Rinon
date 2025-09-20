import { createClient } from '@supabase/supabase-js'

const supabaseUrl:string = process.env.SUPABASE_URL as string;
const supabaseServiceKey:string = process.env.SUPABASE_SERVICE_ROLE_KEY as string; // Use service role key for server-side operations

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default supabase;