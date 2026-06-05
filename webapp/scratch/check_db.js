import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ekjrwizpsestbuvoyiry.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVranJ3aXpwc2VzdGJ1dm95aXJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MDc2MDMsImV4cCI6MjA5NTQ4MzYwM30.61syLmRtYPfd2pEj27LNBtmbHZJDBku_xlNxnV64-98";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log("Fetching public.organizations...");
  const { data, error } = await supabase
    .from("organizations")
    .select("*");
  
  if (error) {
    console.error("Error fetching organizations:", error);
  } else {
    console.log("Organizations:", data);
  }
}

run();
