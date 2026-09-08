import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabase';
import type { Course, Module, Lesson, Quiz, Enrollment } from '../types';

// ─── All published courses ─────────────────────────────────────

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('order_index')
      .then(({ data }) => {
        if (data) setCourses(data as Course[]);
        setLoading(false);
      });
  }, []);

  return { courses, loading };
}

// ─── Single course with modules + lessons ─────────────────────

export function useCourseDetail(courseId: string | null) {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    Promise.all([
      supabase.from('courses').select('*').eq('id', courseId).single(),
      supabase.from('modules').select('*').eq('course_id', courseId).order('order_index'),
    ]).then(async ([courseRes, modulesRes]) => {
      if (courseRes.data) setCourse(courseRes.data as Course);
      const mods = (modulesRes.data ?? []) as Module[];
      setModules(mods);
      if (mods.length > 0) {
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('*')
          .in('module_id', mods.map(m => m.id))
          .order('order_index');
        setLessons((lessonsData ?? []) as Lesson[]);
      }
      setLoading(false);
    });
  }, [courseId]);

  return { course, modules, lessons, loading };
}

// ─── Quizzes for a course ─────────────────────────────────────

export function useCourseQuizzes(courseId: string | null) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    if (!courseId) return;
    supabase
      .from('quizzes')
      .select('*')
      .eq('course_id', courseId)
      .then(({ data }) => { if (data) setQuizzes(data as Quiz[]); });
  }, [courseId]);

  return { quizzes };
}

// ─── Enrollments for a user ───────────────────────────────────

export function useEnrollments(userId: string | null) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEnrollments = useCallback(async () => {
    if (!userId) { setEnrollments([]); return; }
    setLoading(true);
    const { data } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId);
    if (data) setEnrollments(data as Enrollment[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  const enroll = useCallback(async (courseId: string) => {
    if (!userId) return;
    const { data } = await supabase
      .from('enrollments')
      .upsert({ user_id: userId, course_id: courseId })
      .select()
      .single();
    if (data) setEnrollments(prev => [...prev.filter(e => e.course_id !== courseId), data as Enrollment]);
  }, [userId]);

  const isEnrolled = useCallback((courseId: string) =>
    enrollments.some(e => e.course_id === courseId), [enrollments]);

  return { enrollments, loading, enroll, isEnrolled, fetchEnrollments };
}

// ─── Admin: CRUD helpers ──────────────────────────────────────

export async function createCourse(payload: Omit<Course, 'id' | 'created_at' | 'updated_at'>) {
  return supabase.from('courses').insert(payload).select().single();
}

export async function updateCourse(id: string, payload: Partial<Course>) {
  return supabase.from('courses').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single();
}

export async function createModule(payload: Omit<Module, 'id' | 'created_at'>) {
  return supabase.from('modules').insert(payload).select().single();
}

export async function createLesson(payload: Omit<Lesson, 'id' | 'created_at'>) {
  return supabase.from('lessons').insert(payload).select().single();
}

export async function createQuiz(payload: Omit<Quiz, 'id' | 'created_at'>) {
  return supabase.from('quizzes').insert(payload).select().single();
}
