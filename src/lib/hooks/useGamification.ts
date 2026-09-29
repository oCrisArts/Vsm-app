import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Achievement, Profile, UserAchievement, VsmHistoryEntry, XpEvent } from '../types';

export interface GamificationAchievement extends Achievement {
  unlocked_at: string | null;
}

export interface GamificationSummary {
  rank: number;
  courses_completed: number;
}

async function avatarSource(value: string | null) {
  if (!value || /^https?:\/\//i.test(value)) return value;
  const result = await supabase.storage.from('avatars').createSignedUrl(value, 3600);
  return result.data?.signedUrl ?? null;
}

export function useGamification(userId: string | null) {
  const [profile, setProfile] = useState<(Profile & { avatar_src: string | null }) | null>(null);
  const [history, setHistory] = useState<VsmHistoryEntry[]>([]);
  const [xpEvents, setXpEvents] = useState<XpEvent[]>([]);
  const [achievements, setAchievements] = useState<GamificationAchievement[]>([]);
  const [summary, setSummary] = useState<GamificationSummary>({ rank: 0, courses_completed: 0 });
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) {
      setProfile(null); setHistory([]); setXpEvents([]); setAchievements([]); setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const [profileResult, historyResult, xpResult, achievementResult, unlockedResult, summaryResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('vsm_history').select('*').eq('user_id', userId).order('created_at'),
      supabase.from('xp_events').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
      supabase.from('achievements').select('*').eq('is_active', true).order('title'),
      supabase.from('user_achievements').select('*').eq('user_id', userId),
      supabase.rpc('get_my_gamification_summary'),
    ]);
    const firstError = profileResult.error ?? historyResult.error ?? xpResult.error ?? achievementResult.error ?? unlockedResult.error ?? summaryResult.error;
    if (firstError) {
      setError(firstError.message);
      setLoading(false);
      return;
    }
    const value = profileResult.data as Profile;
    setProfile({ ...value, avatar_src: await avatarSource(value.avatar_url) });
    setHistory((historyResult.data ?? []) as VsmHistoryEntry[]);
    setXpEvents((xpResult.data ?? []) as XpEvent[]);
    const unlocked = new Map(((unlockedResult.data ?? []) as UserAchievement[]).map(item => [item.achievement_id, item.unlocked_at]));
    setAchievements(((achievementResult.data ?? []) as Achievement[]).map(item => ({ ...item, unlocked_at: unlocked.get(item.id) ?? null })));
    const summaryRow = Array.isArray(summaryResult.data) ? summaryResult.data[0] : summaryResult.data;
    setSummary({ rank: Number(summaryRow?.rank ?? 0), courses_completed: Number(summaryRow?.courses_completed ?? 0) });
    setLoading(false);
  }, [userId]);

  useEffect(() => { void reload(); }, [reload]);
  return { profile, history, xpEvents, achievements, summary, loading, error, reload };
}

export function vsmLevelLabel(level: number) {
  if (level >= 5) return 'Elite';
  if (level === 4) return 'Avançado';
  if (level === 3) return 'Intermediário';
  if (level === 2) return 'Em evolução';
  return 'Iniciante';
}
