import { ArrowLeft, Play, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@mui/material';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ClassroomProps {
  courseId: number;
  onBack: () => void;
  onStartLesson: (lessonId: number) => void;
}

export function Classroom({ courseId, onBack, onStartLesson }: ClassroomProps) {
  const courseData: Record<number, any> = {
    1: {
      title: 'DOMINAÇÃO ABSOLUTA',
      subtitle: 'Controle Total da Interação',
      progress: 45,
      image: 'https://images.unsplash.com/photo-1630996407754-99a016d1c09b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJsYWNrJTIwbGluZ2VyaWUlMjBib2R5c3VpdCUyMGxlYXRoZXIlMjBjaW5lbWF0aWMlMjBkYXJrJTIwZnVsbCUyMGJvZHl8ZW58MXx8fHwxNzcxNTIxODMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      lessons: [
        { id: 1, title: 'Fundamentos do Poder', duration: '15 min', completed: true },
        { id: 2, title: 'Frame Control Avançado', duration: '20 min', completed: true },
        { id: 3, title: 'Linguagem Corporal Alpha', duration: '18 min', completed: false, current: true },
        { id: 4, title: 'Domínio Verbal', duration: '22 min', completed: false },
        { id: 5, title: 'Manipulação Ética', duration: '25 min', completed: false },
      ],
    },
    2: {
      title: 'ARTE DA CONQUISTA',
      subtitle: 'Sedução Refinada',
      progress: 0,
      image: 'https://images.unsplash.com/photo-1753268477077-b0df6e84b912?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGx1eHVyeSUyMGxpbmdlcmllJTIwYmVkcm9vbSUyMGRhcmslMjBjaW5lbWF0aWMlMjBnbGFtb3VyJTIwZWRpdG9yaWFsJTIwZnVsbCUyMGJvZHl8ZW58MXx8fHwxNzcxNTIxODMwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      lessons: [
        { id: 1, title: 'A Regra dos 3 Segundos', duration: '12 min', completed: false, current: true },
        { id: 2, title: 'Openers Magnéticos', duration: '16 min', completed: false },
        { id: 3, title: 'Conexão Profunda', duration: '20 min', completed: false },
        { id: 4, title: 'Escalação Física', duration: '18 min', completed: false },
      ],
    },
    3: {
      title: 'PSICOLOGIA DARK',
      subtitle: 'Manipulação Ética',
      progress: 78,
      image: 'https://images.unsplash.com/photo-1750190321915-5cb0fa1eb640?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGNpbGslMjByb2JlJTIwYm91ZG9pciUyMGRhcmslMjBsaWdodGluZyUyMGdsYW1vdXIlMjBmdWxsJTIwYm9keXxlbnwxfHx8fDE3NzE1MjE4MzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      lessons: [
        { id: 1, title: 'Gatilhos Mentais', duration: '14 min', completed: true },
        { id: 2, title: 'PNL Avançada', duration: '22 min', completed: true },
        { id: 3, title: 'Persuasão Subliminar', duration: '19 min', completed: true },
        { id: 4, title: 'Leitura Corporal', duration: '17 min', completed: false, current: true },
      ],
    },
    4: {
      title: 'LINGUAGEM CORPORAL',
      subtitle: 'Presença Alpha',
      progress: 0,
      image: 'https://images.unsplash.com/photo-1741514374662-a597fe342fea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGZhc2hpb24lMjBlZGl0b3JpYWwlMjBkYXJrJTIwZHJhbWF0aWMlMjBsaWdodGluZyUyMGhpZ2glMjBjb250cmFzdCUyMGZ1bGwlMjBib2R5fGVufDF8fHx8MTc3MTUyMTgzNnww&ixlib=rb-4.1.0&q=80&w=1080',
      lessons: [
        { id: 1, title: 'Postura de Poder', duration: '15 min', completed: false, current: true },
        { id: 2, title: 'Micro-expressões', duration: '18 min', completed: false },
        { id: 3, title: 'O Toque Sutil', duration: '20 min', completed: false },
      ],
    },
    5: {
      title: 'STORYTELLING AVANÇADO',
      subtitle: 'Narrativas Poderosas',
      progress: 0,
      image: 'https://images.unsplash.com/photo-1661340654042-edd0eb6746c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGx1eHVyeSUyMHN3aW13ZWFyJTIwcG9vbCUyMG5pZ2h0JTIwY2luZW1hdGljJTIwZ2xhbW91ciUyMGZ1bGwlMjBib2R5fGVufDF8fHx8MTc3MTUyMTgzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      lessons: [
        { id: 1, title: 'A Jornada do Herói', duration: '25 min', completed: false, current: true },
        { id: 2, title: 'Gatilhos Narrativos', duration: '20 min', completed: false },
        { id: 3, title: 'Vulnerabilidade Seletiva', duration: '22 min', completed: false },
      ],
    },
    6: {
      title: 'FRAME CONTROL',
      subtitle: 'Domínio de Situações',
      progress: 0,
      image: 'https://images.unsplash.com/photo-1653012165674-b5b41837d142?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJpa2luaSUyMGx1eHVyeSUyMGJlYWNoJTIwbmlnaHQlMjBjaW5lbWF0aWMlMjBkYXJrJTIwZ2xhbW91ciUyMGZ1bGwlMjBib2R5fGVufDF8fHx8MTc3MTUyMTgzMHww&ixlib=rb-4.1.0&q=80&w=1080',
      lessons: [
        { id: 1, title: 'A Psicologia do Frame', duration: '30 min', completed: false, current: true },
        { id: 2, title: 'Neutralizando Testes', duration: '25 min', completed: false },
        { id: 3, title: 'Liderança Social', duration: '28 min', completed: false },
      ],
    },
  };

  const course = courseData[courseId] || courseData[1];

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="relative h-[50vh] bg-gradient-to-b from-[#0A1A3A] to-black overflow-hidden">
        {/* Image Background */}
        <ImageWithFallback 
          src={course.image}
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Play size={80} className="text-[#4169FF] opacity-80" />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <button onClick={onBack} className="absolute top-6 left-6 w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-[#4169FF]">
          <ArrowLeft className="text-white" size={24} />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-[#4169FF] mb-2" style={{ fontWeight: 800 }}>{course.subtitle}</p>
          <h1 className="text-white text-4xl mb-3" style={{ fontWeight: 900, lineHeight: 1.1 }}>{course.title}</h1>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div className="h-full bg-[#4169FF] rounded-full" style={{ width: `${course.progress}%` }} />
            </div>
            <span className="text-[#4169FF] text-sm" style={{ fontWeight: 900 }}>{course.progress}%</span>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6">
        <h2 className="text-white text-xl mb-4" style={{ fontWeight: 900 }}>CONTEÚDO</h2>
        <div className="space-y-3">
          {course.lessons.map((lesson: any, index: number) => (
            <button key={lesson.id} onClick={() => onStartLesson(lesson.id)} disabled={lesson.completed} className="w-full">
              <Card sx={{ bgcolor: lesson.current ? '#4169FF10' : '#0A0A0A', borderRadius: 3, border: lesson.current ? '2px solid #4169FF' : '1px solid #1A1A1A', opacity: lesson.completed ? 0.6 : 1 }}>
                <CardContent sx={{ padding: '20px !important' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: lesson.completed ? '#1A1A1A' : lesson.current ? '#4169FF20' : '#1A1A1A', border: `2px solid ${lesson.completed ? '#4CAF50' : lesson.current ? '#4169FF' : '#333'}` }}>
                      {lesson.completed ? <CheckCircle size={22} className="text-[#4CAF50]" /> : <span className="text-white" style={{ fontWeight: 900 }}>{index + 1}</span>}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white text-lg mb-1" style={{ fontWeight: 800 }}>{lesson.title}</p>
                      <p className="text-[#666] text-sm">{lesson.duration}</p>
                    </div>
                    {lesson.current && (
                      <div className="w-10 h-10 rounded-full bg-[#4169FF] flex items-center justify-center">
                        <Play size={18} className="text-white" fill="white" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}