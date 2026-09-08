import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import type { Role } from '../../lib/types';

export type { Role };

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: Role;
  onboardingDone: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: Role; error?: string }>;
  register: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  markOnboardingDone: () => Promise<void>;
  enrolledCourses: string[];
  enrollCourse: (courseId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function fetchProfile(userId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !data) return null;
  return {
    id: data.id,
    username: data.email,
    displayName: data.display_name,
    email: data.email,
    role: data.role as Role,
    onboardingDone: data.onboarding_done,
  };
}

async function fetchEnrollments(userId: string): Promise<string[]> {
  const { data } = await supabase
    .from('enrollments')
    .select('course_id')
    .eq('user_id', userId);
  return (data ?? []).map((e: { course_id: string }) => e.course_id);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  const loadUserData = useCallback(async (s: Session) => {
    setSession(s);
    const profile = await fetchProfile(s.user.id);
    setUser(profile);
    const enrolled = await fetchEnrollments(s.user.id);
    setEnrolledCourses(enrolled);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (s) loadUserData(s);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      if (s) {
        loadUserData(s);
      } else {
        setSession(null);
        setUser(null);
        setEnrolledCourses([]);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadUserData]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    if (!data.session) return { success: false, error: 'Sessão não iniciada.' };
    const profile = await fetchProfile(data.session.user.id);
    if (!profile) return { success: false, error: 'Perfil não encontrado.' };
    return { success: true, role: profile.role };
  }, []);

  const register = useCallback(async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) return { success: false, error: error.message };
    if (!data.user) return { success: false, error: 'Falha ao criar usuário.' };

    // Create profile row (trigger might handle this; insert with ignore if duplicate)
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email,
      display_name: displayName,
      role: 'student',
      onboarding_done: false,
      vsm_score: 0,
      vsm_level: 1,
    }, { onConflict: 'id' });

    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setEnrolledCourses([]);
  }, []);

  const markOnboardingDone = useCallback(async () => {
    if (!user) return;
    await supabase
      .from('profiles')
      .update({ onboarding_done: true })
      .eq('id', user.id);
    setUser(u => u ? { ...u, onboardingDone: true } : null);
  }, [user]);

  const enrollCourse = useCallback(async (courseId: string) => {
    if (!user) return;
    await supabase.from('enrollments').upsert(
      { user_id: user.id, course_id: courseId },
      { onConflict: 'user_id,course_id' }
    );
    setEnrolledCourses(prev => prev.includes(courseId) ? prev : [...prev, courseId]);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, session, login, register, logout, markOnboardingDone, enrolledCourses, enrollCourse }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
