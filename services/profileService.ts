import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';

import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

const AVATAR_BUCKET = 'avatars';

const extensionFor = (uri: string): string => {
  const cleanUri = uri.split('?')[0];
  const match = /\.([a-zA-Z0-9]+)$/.exec(cleanUri);
  const ext = match ? match[1].toLowerCase() : 'jpg';
  return ext === 'jpeg' ? 'jpg' : ext;
};

const contentTypeFor = (extension: string): string => {
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'heic') return 'image/heic';
  return 'image/jpeg';
};

export const profileService = {
  async ensureProfile(userId: string, email: string, fullName: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;

    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .insert({ id: userId, email, full_name: fullName })
      .select('*')
      .single();
    if (insertError) throw insertError;
    return inserted;
  },

  async get(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async update(userId: string, update: ProfileUpdate): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update(update)
      .eq('id', userId)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async uploadAvatar(userId: string, localUri: string): Promise<string> {
    const extension = extensionFor(localUri);
    const contentType = contentTypeFor(extension);
    const path = `${userId}/avatar-${Date.now()}.${extension}`;

    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(path, decode(base64), {
        contentType,
        upsert: true,
      });
    if (error) throw error;

    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  },
};
