import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Check if keys are present to prevent runtime errors
if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase environment variables");
}

// This client has admin privileges. Use it only on the server!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);