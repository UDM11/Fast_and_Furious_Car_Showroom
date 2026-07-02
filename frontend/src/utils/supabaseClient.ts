import { createClient } from '@supabase/supabase-js';

const runtimeConfig = globalThis.__APP_CONFIG__ || {};
const supabaseUrl = runtimeConfig.supabaseUrl || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = runtimeConfig.supabaseAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables! Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export const getAppUrl = () => {
  const runtimeAppUrl = runtimeConfig.appUrl || import.meta.env.VITE_APP_URL;
  if (runtimeAppUrl && runtimeAppUrl.trim()) {
    return runtimeAppUrl.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/$/, '');
  }

  return '';
};
