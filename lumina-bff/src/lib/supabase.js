import { createClient } from '@supabase/supabase-js';

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let client = null;

export function getSupabase() {
  if (!URL || !KEY) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 未配置');
  }
  if (!client) {
    client = createClient(URL, KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
