import { createClient } from "@supabase/supabase-js";

// =========================================================================
// 1. SUPABASE PROJECT URL
// Paste your Supabase Project URL or Project ID below:
// (e.g. "https://ecegujtfzkipwpaiosxi.supabase.co" or "{ecegujtfzkipwpaiosxi}")
// =========================================================================
const SUPABASE_URL = "{ecegujtfzkipwpaiosxi}";

// =========================================================================
// 2. SUPABASE PUBLIC / ANON KEY
// Paste your Supabase anon/public key below:
// =========================================================================
const SUPABASE_PUBLIC_KEY = "{eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZWd1anRmemtpcHdwYWlvc3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMTE0MjAsImV4cCI6MjEwNjg4NzQyMH0.lfOzRNN6HiZpPf2dEcKZQXLDa4pTSHfq8nIYzGEBs3M}";

// Clean and normalize the Supabase URL
const cleanUrl = SUPABASE_URL.replace(/[{}]/g, "").trim();
const normalizedUrl = cleanUrl.startsWith("http")
  ? cleanUrl
  : `https://${cleanUrl}.supabase.co`;

// Clean the public key (removes placeholder curly braces if present)
const cleanPublicKey = SUPABASE_PUBLIC_KEY.replace(/[{}]/g, "").trim();

// Reference alias for publishable key if referred directly
const sb_publishable_O9OOsFVcAX8MyDmUEIkw_Q_U3y9zdsw = cleanPublicKey;

// =========================================================================
// 3. EXPORT THE SUPABASE CLIENT
// =========================================================================
export const supabase = createClient(
  normalizedUrl,
  sb_publishable_O9OOsFVcAX8MyDmUEIkw_Q_U3y9zdsw || cleanPublicKey
);
