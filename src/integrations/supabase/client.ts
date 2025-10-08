import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// IMPORTANT: Replace with your actual Supabase URL and anon key
const supabaseUrl = "https://tukkzcrkcglfzatvjxbm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1a2t6Y3JrY2dsZnphdHZqeGJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNDI5NzIsImV4cCI6MjA3NDgxODk3Mn0.3CtC0I52kL-k6D57EK91pLi3kcUwdaFip6HZvcOVGbA";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
