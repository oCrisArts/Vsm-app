import { useState } from 'react';
import { ArrowLeft, Play, Lock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@mui/material';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SubscriptionModal } from './SubscriptionModal';

interface CourseLandingProps {
  courseId: number;
  onBack: () => void;
  onEnroll: (courseId: number) => void;
  isEnrolled?: boolean;
  onOpenClassroom?: (courseId: number) => void;
}

export function CourseLanding({ courseId, onBack, onEnroll, isEnrolled = false, onOpenClassroom }: CourseLandingProps) {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const courseData: Record<number, any> = {
    1: {
      title: 'Dominação Absoluta',
      subtitle: 'Controle Total da Interação',
      description: 'Aprenda as técnicas mais avançadas de domínio social e controle de frame para se tornar a presença mais poderosa em qualquer ambiente.',
      image: 'https://images.unsplash.com/photo-1559335185-5b7ddef49716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lessons: [
        { id: 1, title: 'Fundamentos do Poder', duration: '15 min', locked: false },
        { id: 2, title: 'Frame Control Avançado', duration: '20 min', locked: false },
        { id: 3, title: 'Linguagem Corporal Alpha', duration: '18 min', locked: false },
        { id: 4, title: 'Domínio Verbal', duration: '22 min', locked: !isEnrolled },
        { id: 5, title: 'Manipulação Ética', duration: '25 min', locked: !isEnrolled },
      ],
    },
    2: {
      title: 'Arte da Conquista',
      subtitle: 'Sedução Refinada',
      description: 'Domine a arte da sedução através de técnicas refinadas de aproximação, conexão emocional e escalação física.',
      image: 'https://images.unsplash.com/photo-1567115702188-ea12a355f14a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lessons: [
        { id: 1, title: 'A Regra dos 3 Segundos', duration: '12 min', locked: false },
        { id: 2, title: 'Openers Magnéticos', duration: '16 min', locked: false },
        { id: 3, title: 'Conexão Profunda', duration: '20 min', locked: !isEnrolled },
        { id: 4, title: 'Escalação Física', duration: '18 min', locked: !isEnrolled },
      ],
    },
    3: {
      title: 'Psicologia Dark',
      subtitle: 'Manipulação Ética',
      description: 'Compreenda os gatilhos mentais mais poderosos e aprenda a influenciar decisões de forma ética e eficaz.',
      image: 'https://images.unsplash.com/photo-1700739746391-26561c282181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lessons: [
        { id: 1, title: 'Gatilhos Mentais', duration: '14 min', locked: false },
        { id: 2, title: 'Pnl Avançada', duration: '22 min', locked: false },
        { id: 3, title: 'Persuasão Subliminar', duration: '19 min', locked: !isEnrolled },
        { id: 4, title: 'Leitura Corporal', duration: '17 min', locked: !isEnrolled },
      ],
    },
    4: {
      title: 'Linguagem Corporal',
      subtitle: 'Presença Alpha',
      description: 'Domine a comunicação não-verbal para projetar confiança absoluta e atrair instantaneamente.',
      image: 'https://images.unsplash.com/photo-1757196892661-dd9d35f2d6c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lessons: [
        { id: 1, title: 'Postura de Poder', duration: '15 min', locked: false },
        { id: 2, title: 'Micro-expressões', duration: '18 min', locked: false },
        { id: 3, title: 'O Toque Sutil', duration: '20 min', locked: !isEnrolled },
      ],
    },
    5: {
      title: 'Storytelling Avançado',
      subtitle: 'Narrativas Poderosas',
      description: 'Crie histórias magnéticas que prendem a atenção e geram conexão emocional imediata.',
      image: 'https://images.unsplash.com/photo-1608049429989-ce05a0c5e15c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lessons: [
        { id: 1, title: 'A Jornada do Herói', duration: '25 min', locked: false },
        { id: 2, title: 'Gatilhos Narrativos', duration: '20 min', locked: false },
        { id: 3, title: 'Vulnerabilidade Seletiva', duration: '22 min', locked: !isEnrolled },
      ],
    },
    6: {
      title: 'Frame Control',
      subtitle: 'Domínio de Situações',
      description: 'Mantenha o controle da realidade em qualquer interação social e nunca seja reativo.',
      image: 'https://images.unsplash.com/photo-1684333876081-3139802878f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lessons: [
        { id: 1, title: 'A Psicologia do Frame', duration: '30 min', locked: false },
        { id: 2, title: 'Neutralizando Testes', duration: '25 min', locked: false },
        { id: 3, title: 'Liderança Social', duration: '28 min', locked: !isEnrolled },
      ],
    },
    7: {
      title: 'Atração de Alto Valor',
      subtitle: 'Magnetismo Pessoal',
      description: 'Desenvolva o magnetismo natural que faz com que mulheres de alto valor se aproximem de você espontaneamente.',
      image: 'https://images.unsplash.com/photo-1562519766-9769dafbb374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lessons: [
        { id: 1, title: 'O Efeito Halo', duration: '18 min', locked: false },
        { id: 2, title: 'Pré-seleção Social', duration: '22 min', locked: false },
        { id: 3, title: 'Abundância Genuína', duration: '20 min', locked: !isEnrolled },
        { id: 4, title: 'Missão de Vida', duration: '25 min', locked: !isEnrolled },
      ],
    },
    8: {
      title: 'Calibração Social',
      subtitle: 'Inteligência de Campo',
      description: 'Leia com precisão qualquer ambiente social e ajuste sua estratégia em tempo real para maximizar seus resultados.',
      image: 'https://images.unsplash.com/photo-1694120105801-b51db377f758?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      lessons: [
        { id: 1, title: 'Leitura de Ambiente', duration: '16 min', locked: false },
        { id: 2, title: 'Dinâmicas de Grupo', duration: '20 min', locked: false },
        { id: 3, title: 'Adaptação Rápida', duration: '18 min', locked: !isEnrolled },
      ],
    },
  };

  const course = courseData[courseId] || courseData[1];

  const handleCtaClick = () => {
    if (isEnrolled && onOpenClassroom) {
      onOpenClassroom(courseId);
    } else {
      setShowSubscriptionModal(true);
    }
  };

  const handleSubscribe = () => {
    onEnroll(courseId);
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="relative h-[60vh] bg-gradient-to-b from-[#0A1A3A] to-black overflow-hidden">
        <ImageWithFallback
          src={course.image}
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          style={{ objectPosition: 'center top' }}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#4169FF]/20 backdrop-blur-sm flex items-center justify-center border border-[#4169FF]/40">
            <Play size={36} className="text-[#4169FF] ml-1" fill="#4169FF" />
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <button onClick={onBack} className="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-[#4169FF]">
          <ArrowLeft className="text-white" size={24} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[#4169FF] mb-2" style={{ fontWeight: 800 }}>{course.subtitle}</p>
          <h1 className="text-white text-4xl mb-3" style={{ fontWeight: 900, lineHeight: 1.1 }}>{course.title}</h1>
          <p className="text-[#CCC] text-sm leading-relaxed">{course.description}</p>
        </div>
      </div>

      <div className="px-6 mt-6">
        <h2 className="text-white text-2xl mb-4" style={{ fontWeight: 900 }}>Conteúdo do Curso</h2>
        <div className="space-y-3">
          {course.lessons.map((lesson: any, index: number) => (
            <Card key={lesson.id} sx={{ bgcolor: '#0A0A0A', borderRadius: 3, border: '1px solid #1A1A1A' }}>
              <CardContent sx={{ padding: '16px !important' }}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: lesson.locked ? '#1A1A1A' : '#4169FF20',
                      border: `2px solid ${lesson.locked ? '#333' : '#4169FF'}`,
                    }}
                  >
                    {lesson.locked
                      ? <Lock size={18} className="text-[#666]" />
                      : <span className="text-[#4169FF]" style={{ fontWeight: 900 }}>{index + 1}</span>
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-white" style={{ fontWeight: 700 }}>{lesson.title}</p>
                    <p className="text-[#666] text-xs mt-1">{lesson.duration}</p>
                  </div>
                  {!lesson.locked && isEnrolled && <CheckCircle size={20} className="text-[#4169FF]" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="fixed left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent" style={{ bottom: 64 }}>
        <button
          onClick={handleCtaClick}
          className="w-full py-4 bg-[#4169FF] text-white rounded-full text-lg transition-all hover:bg-[#5B7FFF]"
          style={{ fontWeight: 900 }}
        >
          {isEnrolled ? 'Acessar Curso' : 'Iniciar'}
        </button>
      </div>

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={handleSubscribe}
        courseName={course.title}
      />
    </div>
  );
}