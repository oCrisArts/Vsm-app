import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase';
import type { Profile } from '../types';

export function useProfile(userId: string | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) { setProfile(null); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setLoading(false);
    if (error) { setError(error.message); return; }
    setProfile(data as Profile);
  }, [userId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();
    if (!error && data) setProfile(data as Profile);
    return { error };
  }, [userId]);

  const markOnboardingDone = useCallback(async () => {
    await updateProfile({ onboarding_done: true });
  }, [updateProfile]);

  const updateVsmScore = useCallback(async (score: number, level: number) => {
    await updateProfile({ vsm_score: score, vsm_level: level });
  }, [updateProfile]);

  return { profile, loading, error, fetchProfile, updateProfile, markOnboardingDone, updateVsmScore };
}
