import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Profile, Role } from '../types';

export type AdminProfile = Profile & {
  courses_count: number;
  progress_count: number;
  avatar_src: string | null;
};

const isRemoteUrl = (value: string | null) => Boolean(value && /^https?:\/\//i.test(value));

async function avatarSource(value: string | null) {
  if (!value || isRemoteUrl(value)) return value;
  const result = await supabase.storage.from('avatars').createSignedUrl(value, 3600);
  return result.data?.signedUrl ?? null;
}

export function useAdminProfiles() {
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [profileResult, enrollmentResult, progressResult] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('enrollments').select('user_id, course_id'),
      supabase.from('progress').select('user_id, lesson_id'),
    ]);
    const firstError = profileResult.error ?? enrollmentResult.error ?? progressResult.error;
    if (firstError) {
      setError(firstError.message);
      setProfiles([]);
      setLoading(false);
      return;
    }
    const enrollments = enrollmentResult.data ?? [];
    const progress = progressResult.data ?? [];
    const values = await Promise.all(((profileResult.data ?? []) as Profile[]).map(async profile => ({
      ...profile,
      avatar_src: await avatarSource(profile.avatar_url),
      courses_count: new Set(enrollments.filter(row => row.user_id === profile.id).map(row => row.course_id)).size,
      progress_count: new Set(progress.filter(row => row.user_id === profile.id).map(row => row.lesson_id)).size,
    })));
    setProfiles(values);
    setLoading(false);
  }, []);

  useEffect(() => { void reload(); }, [reload]);
  return { profiles, loading, error, reload };
}

export async function adminSetUserRole(targetUserId: string, newRole: Role) {
  return supabase.rpc('admin_set_user_role', {
    target_user_id: targetUserId,
    new_role: newRole,
  });
}
