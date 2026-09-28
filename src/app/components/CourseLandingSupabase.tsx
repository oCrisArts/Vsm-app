import { useState } from 'react';
import { ArrowLeft, CheckCircle, Lock, Play } from 'lucide-react';
import { Card, CardContent } from '@mui/material';
import { useCourseDetail } from '../../lib/hooks/useLearning';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SubscriptionModal } from './SubscriptionModal';

interface Props {
  slug: string;
  onBack: () => void;
  onEnroll: (courseId: string) => Promise<void>;
  enrolledCourseIds: string[];
  onOpenClassroom: () => void;
}

export function CourseLandingSupabase({ slug, onBack, onEnroll, enrolledCourseIds, onOpenClassroom }: Props) {
  const { course, lessons, loading, error } = useCourseDetail(slug);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  if (loading) return <div className="min-h-screen bg-black text-[#666] p-6">Carregando curso...</div>;
  if (error) return <div className="min-h-screen bg-black text-[#666] p-6">Não foi possível carregar o curso.</div>;
  if (!course) return <div className="min-h-screen bg-black text-[#666] p-6">Curso não encontrado.</div>;
  const isEnrolled = enrolledCourseIds.includes(course.id);

  const handleCtaClick = () => isEnrolled ? onOpenClassroom() : setShowSubscriptionModal(true);
  const handleSubscribe = async () => { await onEnroll(course.id); };

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="relative h-[60vh] bg-gradient-to-b from-[#0A1A3A] to-black overflow-hidden">
        <ImageWithFallback src={course.image_url ?? ''} alt={course.title} className="absolute inset-0 w-full h-full object-cover opacity-70" style={{ objectPosition: 'center top' }} />
        <div className="absolute inset-0 flex items-center justify-center"><div className="w-20 h-20 rounded-full bg-[#4169FF]/20 backdrop-blur-sm flex items-center justify-center border border-[#4169FF]/40"><Play size={36} className="text-[#4169FF] ml-1" fill="#4169FF" /></div></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <button onClick={onBack} className="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-[#4169FF]"><ArrowLeft className="text-white" size={24} /></button>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[#4169FF] mb-2" style={{ fontWeight: 800 }}>{course.subtitle}</p>
          <h1 className="text-white text-4xl mb-3" style={{ fontWeight: 900, lineHeight: 1.1 }}>{course.title}</h1>
          <p className="text-[#CCC] text-sm leading-relaxed">{course.description}</p>
        </div>
      </div>
      <div className="px-6 mt-6">
        <h2 className="text-white text-2xl mb-4" style={{ fontWeight: 900 }}>Conteúdo do Curso</h2>
        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const locked = !isEnrolled && index > 1;
            return <Card key={lesson.id} sx={{ bgcolor: '#0A0A0A', borderRadius: 3, border: '1px solid #1A1A1A' }}><CardContent sx={{ padding: '16px !important' }}><div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: locked ? '#1A1A1A' : '#4169FF20', border: `2px solid ${locked ? '#333' : '#4169FF'}` }}>{locked ? <Lock size={18} className="text-[#666]" /> : <span className="text-[#4169FF]" style={{ fontWeight: 900 }}>{index + 1}</span>}</div>
              <div className="flex-1"><p className="text-white" style={{ fontWeight: 700 }}>{lesson.title}</p><p className="text-[#666] text-xs mt-1">{lesson.duration}</p></div>
              {!locked && isEnrolled && <CheckCircle size={20} className="text-[#4169FF]" />}
            </div></CardContent></Card>;
          })}
          {lessons.length === 0 && <p className="text-[#666] text-sm">Nenhuma aula publicada.</p>}
        </div>
      </div>
      <div className="fixed left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent" style={{ bottom: 64 }}><button onClick={handleCtaClick} className="w-full py-4 bg-[#4169FF] text-white rounded-full text-lg transition-all hover:bg-[#5B7FFF]" style={{ fontWeight: 900 }}>{isEnrolled ? 'Acessar Curso' : 'Iniciar'}</button></div>
      <SubscriptionModal isOpen={showSubscriptionModal} onClose={() => setShowSubscriptionModal(false)} onSubscribe={handleSubscribe} courseName={course.title} />
    </div>
  );
}
