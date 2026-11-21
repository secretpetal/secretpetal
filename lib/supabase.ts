import { createClient } from '@supabase/supabase-js';

const isValidHttpUrl = (url?: string): boolean => {
  if (!url) return false;
  const cleaned = url.trim().replace(/^["']|["']$/g, '');
  return cleaned.startsWith('http://') || cleaned.startsWith('https://');
};

const getValidApiUrl = (envUrl?: string, fallbackUrl: string = 'https://abptftyzsxbnhkfqqtju.supabase.co'): string => {
  if (isValidHttpUrl(envUrl)) {
    return envUrl!.trim().replace(/^["']|["']$/g, '');
  }
  return fallbackUrl;
};

const sanitizeEnv = (val?: string, fallback: string = ''): string => {
  if (!val) return fallback;
  return val.trim().replace(/^["']|["']$/g, '');
};

const supabaseUrl = getValidApiUrl(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  'https://abptftyzsxbnhkfqqtju.supabase.co'
);

const supabaseAnonKey = sanitizeEnv(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicHRmdHl6c3hibmhrZnFxdGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNDI5NzcsImV4cCI6MjExMDgxODk3N30.-6H2R_4BlTksGnjRjRI_QrZ6X5j_K5rMr7le4-idF6M'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
