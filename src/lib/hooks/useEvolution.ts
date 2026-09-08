import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase';
import type { BodyLog, DietLog, FinanceRecord, EvolutionMetric } from '../types';

// ─── Body Logs (weight + fat) ─────────────────────────────────

export function useBodyLogs(userId: string | null) {
  const [logs, setLogs] = useState<BodyLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!userId) { setLogs([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('body_logs')
      .select('*')
      .eq('user_id', userId)
      .order('logged_at', { ascending: true });
    if (data) setLogs(data as BodyLog[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addLog = useCallback(async (weight: number | null, bodyFat: number | null) => {
    if (!userId) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('body_logs')
      .upsert({
        user_id: userId,
        weight,
        body_fat: bodyFat,
        logged_at: today,
      }, { onConflict: 'user_id,logged_at' })
      .select()
      .single();
    if (data) {
      setLogs(prev => {
        const idx = prev.findIndex(l => l.logged_at === today);
        if (idx >= 0) { const next = [...prev]; next[idx] = data as BodyLog; return next; }
        return [...prev, data as BodyLog];
      });
    }
  }, [userId]);

  const latest = logs[logs.length - 1] ?? null;
  const weightHistory = logs.filter(l => l.weight != null).map(l => ({
    date: l.logged_at.slice(5).replace('-', '/'),
    value: l.weight as number,
  }));
  const fatHistory = logs.filter(l => l.body_fat != null).map(l => ({
    date: l.logged_at.slice(5).replace('-', '/'),
    value: l.body_fat as number,
  }));

  return { logs, loading, addLog, latest, weightHistory, fatHistory, refetch: fetch };
}

// ─── Diet Logs (calories per day) ────────────────────────────

export function useDietLogs(userId: string | null, days = 35) {
  const [logs, setLogs] = useState<DietLog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!userId) { setLogs([]); return; }
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data } = await supabase
      .from('diet_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('logged_at', since.toISOString().split('T')[0])
      .order('logged_at', { ascending: true });
    if (data) setLogs(data as DietLog[]);
    setLoading(false);
  }, [userId, days]);

  useEffect(() => { fetch(); }, [fetch]);

  const addMeal = useCallback(async (calories: number, mealLabel?: string) => {
    if (!userId) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('diet_logs')
      .insert({ user_id: userId, calories, meal_label: mealLabel ?? null, logged_at: today })
      .select()
      .single();
    if (data) setLogs(prev => [...prev, data as DietLog]);
  }, [userId]);

  const todayCalories = logs
    .filter(l => l.logged_at === new Date().toISOString().split('T')[0])
    .reduce((sum, l) => sum + l.calories, 0);

  const caloriesByDay = (() => {
    const map = new Map<string, number>();
    for (const l of logs) {
      map.set(l.logged_at, (map.get(l.logged_at) ?? 0) + l.calories);
    }
    return map;
  })();

  return { logs, loading, addMeal, todayCalories, caloriesByDay, refetch: fetch };
}

// ─── Finance Records ──────────────────────────────────────────

export function useFinanceRecords(userId: string | null) {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(async () => {
    if (!userId) { setRecords([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('finance_records')
      .select('*')
      .eq('user_id', userId)
      .order('month_year', { ascending: false });
    if (data) setRecords(data as FinanceRecord[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const upsertRecord = useCallback(async (income: number, expenses: number) => {
    if (!userId) return;
    const now = new Date().toISOString();
    const { data } = await supabase
      .from('finance_records')
      .upsert(
        { user_id: userId, month_year: currentMonth, income, expenses, updated_at: now },
        { onConflict: 'user_id,month_year' }
      )
      .select()
      .single();
    if (data) {
      setRecords(prev => {
        const idx = prev.findIndex(r => r.month_year === currentMonth);
        if (idx >= 0) { const next = [...prev]; next[idx] = data as FinanceRecord; return next; }
        return [data as FinanceRecord, ...prev];
      });
    }
  }, [userId, currentMonth]);

  const current = records.find(r => r.month_year === currentMonth);

  return { records, loading, upsertRecord, current, currentMonth, refetch: fetch };
}

// ─── VSM Evolution Metrics ────────────────────────────────────

export function useEvolutionMetrics(userId: string | null) {
  const [metrics, setMetrics] = useState<EvolutionMetric[]>([]);

  const fetch = useCallback(async () => {
    if (!userId) { setMetrics([]); return; }
    const { data } = await supabase
      .from('evolution_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false });
    if (data) setMetrics(data as EvolutionMetric[]);
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  const record = useCallback(async (metricName: string, value: number) => {
    if (!userId) return;
    const { data } = await supabase
      .from('evolution_metrics')
      .insert({ user_id: userId, metric_name: metricName, value })
      .select()
      .single();
    if (data) setMetrics(prev => [data as EvolutionMetric, ...prev]);
  }, [userId]);

  const latestFor = (metricName: string) =>
    metrics.find(m => m.metric_name === metricName)?.value ?? 0;

  return { metrics, record, latestFor, refetch: fetch };
}
