import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.");
}

// Only create client if BOTH URL and Key are valid to prevent crash during module load
const createMockClient = () => {
  const mockDB = {
    select: () => mockDB,
    eq: () => mockDB,
    single: () => Promise.resolve({ data: null, error: new Error("Missing Supabase Credentials") }),
    order: () => mockDB,
    limit: () => mockDB,
    then: (resolve: any) => resolve({ data: null, error: new Error("Missing Supabase Credentials") }),
  };

  return {
    from: () => mockDB,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error("Missing Supabase Credentials") }),
      signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error("Missing Supabase Credentials") }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: new Error("Missing Supabase Credentials") }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  } as any;
};

export const supabase = (supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : createMockClient();
