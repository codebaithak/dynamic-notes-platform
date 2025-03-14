
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL = "https://pdetgxvakyczotjqsjsm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZXRneHZha3ljem90anFzanNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4ODk5NzEsImV4cCI6MjA1NzQ2NTk3MX0.ym9KvMr4yScwDVBL5125LIpYIvq0Q4k1BRMzwzv6RkE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
