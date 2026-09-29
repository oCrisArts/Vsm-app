import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabase';
import type { Course, Enrollment, Lesson, LessonBlock, Module, Quiz, QuizQuestion } from '../types';

export type LearningCourse = Course & { modules: Array<Module & { lessons: Lesson[] }> };
export type LearningQuiz = Quiz & { quiz_questions: QuizQuestion[] };

const isRemoteUrl = (value: string | null | undefined) => Boolean(value && /^https?:\/\//i.test(value));

async function signedAssetUrl(bucket: 'course-covers' | 'lesson-media', value: string | null) {
  if (!value || isRemoteUrl(value)) return value;
  const result = await supabase.storage.from(bucket).createSignedUrl(value, 3600);
  return result.data?.signedUrl ?? null;
}

export function useCourses(includeUnpublished = false) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      let query = supabase.from('courses').select('*').order('order_index');
      if (!includeUnpublished) query = query.eq('is_published', true);
      const result = await query;
      if (!active) return;
      const values = (result.data ?? []) as Course[];
      setCourses(await Promise.all(values.map(async course => ({
        ...course,
        image_url: await signedAssetUrl('course-covers', course.image_url),
      }))));
      setError(result.error?.message ?? null);
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [includeUnpublished]);

  return { courses, loading, error };
}

export function useCourseDetail(slug: string | null) {
  const [course, setCourse] = useState<LearningCourse | null>(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!slug) { setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      const result = await supabase
        .from('courses')
        .select('*, modules(*, lessons(*))')
        .eq('slug', slug)
        .maybeSingle();
      if (!active) return;
      const value = result.data as LearningCourse | null;
      if (value) {
        value.modules.sort((a, b) => a.order_index - b.order_index);
        value.modules.forEach(module => module.lessons.sort((a, b) => a.order_index - b.order_index));
        value.image_url = await signedAssetUrl('course-covers', value.image_url);
      }
      setCourse(value);
      setError(result.error?.message ?? null);
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [slug]);

  const modules = course?.modules ?? [];
  const lessons = useMemo(() => modules.flatMap(module => module.lessons), [modules]);
  return { course, modules, lessons, loading, error };
}

export function useLessonContent(lessonId: string | null) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [blocks, setBlocks] = useState<LessonBlock[]>([]);
  const [quizzes, setQuizzes] = useState<LearningQuiz[]>([]);
  const [loading, setLoading] = useState(Boolean(lessonId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    if (!lessonId) { setLoading(false); return; }
    const load = async () => {
      setLoading(true);
      const [lessonResult, blockResult, quizResult] = await Promise.all([
        supabase.from('lessons').select('*').eq('id', lessonId).maybeSingle(),
        supabase.from('lesson_blocks').select('*').eq('lesson_id', lessonId).order('order_index'),
        supabase.from('quizzes').select('*, quiz_questions(*)').eq('lesson_id', lessonId),
      ]);
      if (!active) return;
      const firstError = lessonResult.error ?? blockResult.error ?? quizResult.error;
      setLesson((lessonResult.data as Lesson | null) ?? null);
      setBlocks(await Promise.all(((blockResult.data ?? []) as LessonBlock[]).map(async block => ({
        ...block,
        media_url: await signedAssetUrl('lesson-media', block.media_url),
      }))));
      setQuizzes((quizResult.data ?? []) as LearningQuiz[]);
      setError(firstError?.message ?? null);
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, [lessonId]);

  return { lesson, blocks, quizzes, loading, error };
}

export function useEnrollments(userId: string | null) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) { setEnrollments([]); setLoading(false); return; }
    setLoading(true);
    const result = await supabase.from('enrollments').select('*').eq('user_id', userId);
    setEnrollments((result.data ?? []) as Enrollment[]);
    setError(result.error?.message ?? null);
    setLoading(false);
  }, [userId]);

  useEffect(() => { void reload(); }, [reload]);
  return { enrollments, loading, error, reload };
}

export function useAllLearningContent() {
  const [courses, setCourses] = useState<LearningCourse[]>([]);
  const [quizzes, setQuizzes] = useState<LearningQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const [courseResult, quizResult] = await Promise.all([
        supabase.from('courses').select('*, modules(*, lessons(*))').order('order_index'),
        supabase.from('quizzes').select('*, quiz_questions(*)'),
      ]);
      if (!active) return;
      const values = (courseResult.data ?? []) as LearningCourse[];
      values.forEach(course => {
        course.modules.sort((a, b) => a.order_index - b.order_index);
        course.modules.forEach(module => module.lessons.sort((a, b) => a.order_index - b.order_index));
      });
      await Promise.all(values.map(async course => {
        course.image_url = await signedAssetUrl('course-covers', course.image_url);
      }));
      if (!active) return;
      setCourses(values);
      setQuizzes((quizResult.data ?? []) as LearningQuiz[]);
      setError((courseResult.error ?? quizResult.error)?.message ?? null);
      setLoading(false);
    };
    void load();
    return () => { active = false; };
  }, []);

  return { courses, quizzes, loading, error };
}
