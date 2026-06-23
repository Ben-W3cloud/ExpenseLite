import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

import type { Database } from './database.types';
import { Platform } from 'react-native/Libraries/Utilities/Platform';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL!;

const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[ExpenseLite] Supabase credentials are not set. ' +
      'Define EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in your environment.'
  );
}
// Memory fallback to prevent crashes in Expo Go / missing native links
const memoryStorage = {
  items: {} as Record<string, string>,
  getItem: async (key: string) => memoryStorage.items[key] || null,
  setItem: async (key: string, value: string) => { memoryStorage.items[key] = value; },
  removeItem: async (key: string) => { delete memoryStorage.items[key]; },
};

// Check if AsyncStorage native module is actually accessible
const isAsyncStorageAvailable = () => {
  try {
    return Platform.OS !== 'web' && AsyncStorage !== null;
  } catch {
    return false;
  }
};

export const supabase = createClient<Database>(
  supabaseUrl!,
  supabaseAnonKey!,
  {
    auth: {
      storage: isAsyncStorageAvailable() ? AsyncStorage : memoryStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

export const hasSupabaseCredentials = Boolean(supabaseUrl && supabaseAnonKey);
