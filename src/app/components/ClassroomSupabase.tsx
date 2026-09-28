import { ArrowLeft, CheckCircle, Play } from 'lucide-react';
import { Card, CardContent } from '@mui/material';
import { useCourseDetail } from '../../lib/hooks/useLearning';
import { useProgress } from '../../lib/hooks/useProgress';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Props { slug: string; userId: string; onBack: () => void; onStartLesson: (lessonId: string) => void; }

export function ClassroomSupabase({ slug, userId, onBack, onStartLesson }: Props) {
  const { course, lessons, loading, error } = useCourseDetail(slug);
  const { progress, loading: progressLoading, isCompleted } = useProgress(userId, course?.id);
  if (loading || progressLoading) return <div className="min-h-screen bg-black text-[#666] p-6">Carregando curso...</div>;
  if (error) return <div className="min-h-screen bg-black text-[#666] p-6">Não foi possível carregar o curso.</div>;
  if (!course) return <div className="min-h-screen bg-black text-[#666] p-6">Curso não encontrado.</div>;
  const progressPct = lessons.length ? Math.round((progress.length / lessons.length) * 100) : 0;
  const currentId = lessons.find(lesson => !isCompleted(lesson.id))?.id;
  return <div className="min-h-screen bg-black pb-24">
    <div className="relative h-[50vh] bg-gradient-to-b from-[#0A1A3A] to-black overflow-hidden">
      <ImageWithFallback src={course.image_url ?? ''} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Play size={80} className="text-[#4169FF] opacity-80" /></div><div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <button onClick={onBack} className="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-[#4169FF]"><ArrowLeft className="text-white" size={24} /></button>
      <div className="absolute bottom-0 left-0 right-0 p-6"><p className="text-[#4169FF] mb-2" style={{ fontWeight: 800 }}>{course.subtitle}</p><h1 className="text-white text-4xl mb-3 uppercase" style={{ fontWeight: 900, lineHeight: 1.1 }}>{course.title}</h1><div className="flex items-center gap-3"><div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden"><div className="h-full bg-[#4169FF] rounded-full" style={{ width: `${progressPct}%` }} /></div><span className="text-[#4169FF] text-sm" style={{ fontWeight: 900 }}>{progressPct}%</span></div></div>
    </div>
    <div className="px-6 mt-6"><h2 className="text-white text-xl mb-4" style={{ fontWeight: 900 }}>CONTEÚDO</h2><div className="space-y-3">
      {lessons.map((lesson, index) => { const completed = isCompleted(lesson.id); const current = lesson.id === currentId; return <button key={lesson.id} onClick={() => onStartLesson(lesson.id)} className="w-full"><Card sx={{ bgcolor: current ? '#4169FF10' : '#0A0A0A', borderRadius: 3, border: current ? '2px solid #4169FF' : '1px solid #1A1A1A', opacity: completed ? .6 : 1 }}><CardContent sx={{ padding: '20px !important' }}><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1A1A1A', border: `2px solid ${completed ? '#4CAF50' : current ? '#4169FF' : '#333'}` }}>{completed ? <CheckCircle size={22} className="text-[#4CAF50]" /> : <span className="text-white" style={{ fontWeight: 900 }}>{index + 1}</span>}</div><div className="flex-1 text-left"><p className="text-white text-lg mb-1" style={{ fontWeight: 800 }}>{lesson.title}</p><p className="text-[#666] text-sm">{lesson.duration}</p></div>{current && <div className="w-10 h-10 rounded-full bg-[#4169FF] flex items-center justify-center"><Play size={18} className="text-white" fill="white" /></div>}</div></CardContent></Card></button>; })}
      {lessons.length === 0 && <p className="text-[#666] text-sm">Nenhuma aula publicada.</p>}
    </div></div>
  </div>;
}
