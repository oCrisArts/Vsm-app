import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase';
import type { LessonProgress } from '../types';

export function useProgress(userId: string | null, courseId?: string) {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProgress = useCallback(async () => {
    if (!userId) { setProgress([]); return; }
    setLoading(true);
    let query = supabase
      .from('progress')
      .select('*, lessons!inner(module_id, modules!inner(course_id))')
      .eq('user_id', userId);

    if (courseId) {
      query = query.eq('lessons.modules.course_id', courseId);
    }

    const { data } = await query;
    setProgress((data ?? []) as LessonProgress[]);
    setLoading(false);
  }, [userId, courseId]);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const markComplete = useCallback(async (lessonId: string) => {
    if (!userId) return { data: null, error: new Error('Authentication required') };
    const result = await supabase.rpc('complete_lesson', { target_lesson_id: lessonId });
    if (!result.error) await fetchProgress();
    return result;
  }, [userId, fetchProgress]);

  const isCompleted = useCallback(
    (lessonId: string) => progress.some(p => p.lesson_id === lessonId),
    [progress]
  );

  const completedCount = progress.length;

  return { progress, loading, markComplete, isCompleted, completedCount, fetchProgress };
}

export function useCourseProgress(userId: string | null, lessonIds: string[]) {
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!userId || lessonIds.length === 0) return;
    supabase
      .from('progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .in('lesson_id', lessonIds)
      .then(({ data }) => {
        if (data) setCompletedLessonIds(new Set(data.map(d => d.lesson_id)));
      });
  }, [userId, lessonIds.join(',')]);

  const progressPct = lessonIds.length > 0
    ? Math.round((completedLessonIds.size / lessonIds.length) * 100)
    : 0;

  return { completedLessonIds, progressPct };
}
