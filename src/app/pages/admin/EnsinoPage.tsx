import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit3, BookOpen, Video, HelpCircle, X, Layers } from 'lucide-react';

import imgImageDominacaoAbsoluta   from "figma:asset/9d0b0475eccd0337994da6766bb60e9be4982b13.png";
import imgImageArteDaConquista     from "figma:asset/85bb2779d47fe59ded6690ec8da200446d0a5024.png";
import imgImagePsicologiaDark      from "figma:asset/e5a64e3be5e34ec4cec4aa5c50b48f504b380c62.png";
import imgImageLinguagemCorporal   from "figma:asset/337640c5cf08e0ad9c23e8ae900fd272e0d526d6.png";
import imgImageStorytellingAvancado from "figma:asset/a03b26e01c9e37942fa239356e6fab2f6c5e59cb.png";
import imgImageFrameControl        from "figma:asset/a1d81e5262848e5e04280b59f72fc7b1f64f4009.png";
import imgImageAtracaoDeAltoValor  from "figma:asset/1ef4b41b9a29b7b0c38daa419f9f81b4bbae7378.png";
import imgImageCalibracaoSocial    from "figma:asset/d265452ca2c553032e02af622bb2c15f7446b618.png";

const BG      = '#121212';
const SURFACE  = '#1E1E1E';
const SURFACE2 = '#252525';
const BORDER   = '#2A2A2A';
const PRIMARY  = '#7C3AED';
const TEXT2    = '#9E9E9E';
const TEXT3    = '#666666';

type Tab = 'cursos' | 'modulos' | 'aulas' | 'quiz';

const COURSES = [
  { id: 1, title: 'Dominação Absoluta',    subtitle: 'Controle Total',        image: imgImageDominacaoAbsoluta,   lessons: 12, enrolled: 89,  tag: 'Avançado'     },
  { id: 2, title: 'Arte Da Conquista',     subtitle: 'Sedução Refinada',      image: imgImageArteDaConquista,     lessons: 18, enrolled: 134, tag: 'Intermediário' },
  { id: 3, title: 'Psicologia Dark',       subtitle: 'Manipulação Ética',     image: imgImagePsicologiaDark,      lessons: 15, enrolled: 76,  tag: 'Avançado'     },
  { id: 4, title: 'Linguagem Corporal',    subtitle: 'Presença Alpha',        image: imgImageLinguagemCorporal,   lessons: 10, enrolled: 210, tag: 'Iniciante'    },
  { id: 5, title: 'Storytelling Avançado', subtitle: 'Narrativas Poderosas',  image: imgImageStorytellingAvancado,lessons: 8,  enrolled: 45,  tag: 'Novo'         },
  { id: 6, title: 'Frame Control',         subtitle: 'Domínio De Situações',  image: imgImageFrameControl,        lessons: 11, enrolled: 62,  tag: 'Novo'         },
  { id: 7, title: 'Atração De Alto Valor', subtitle: 'Magnetismo Pessoal',    image: imgImageAtracaoDeAltoValor,  lessons: 14, enrolled: 98,  tag: 'Novo'         },
  { id: 8, title: 'Calibração Social',     subtitle: 'Inteligência De Campo', image: imgImageCalibracaoSocial,    lessons: 9,  enrolled: 155, tag: 'Iniciante'    },
];

const MODULES = [
  { id: 1, course: 'Dominação Absoluta',  title: 'Fundamentos',  lessons: 4, order: 1 },
  { id: 2, course: 'Dominação Absoluta',  title: 'Frame Control',lessons: 4, order: 2 },
  { id: 3, course: 'Dominação Absoluta',  title: 'Domínio',      lessons: 4, order: 3 },
  { id: 4, course: 'Arte Da Conquista',   title: 'Aproximação',  lessons: 5, order: 1 },
  { id: 5, course: 'Arte Da Conquista',   title: 'Conexão',      lessons: 7, order: 2 },
  { id: 6, course: 'Psicologia Dark',     title: 'Gatilhos',     lessons: 5, order: 1 },
  { id: 7, course: 'Linguagem Corporal',  title: 'Postura',      lessons: 3, order: 1 },
  { id: 8, course: 'Linguagem Corporal',  title: 'Gestos',       lessons: 4, order: 2 },
];

const LESSONS = [
  { id: 1, title: 'Fundamentos do Poder',     module: 'Fundamentos',  duration: '15 min', type: 'video' },
  { id: 2, title: 'Frame Control Avançado',   module: 'Frame Control',duration: '20 min', type: 'video' },
  { id: 3, title: 'Linguagem Corporal Alpha', module: 'Domínio',      duration: '18 min', type: 'video' },
  { id: 4, title: 'Domínio Verbal',           module: 'Domínio',      duration: '22 min', type: 'video' },
  { id: 5, title: 'A Regra dos 3 Segundos',   module: 'Aproximação',  duration: '12 min', type: 'video' },
  { id: 6, title: 'Openers Magnéticos',       module: 'Aproximação',  duration: '16 min', type: 'video' },
];

const QUIZ_ITEMS = [
  { id: 1, title: 'Quiz: Frame Control',       questions: 10, course: 'Dominação Absoluta' },
  { id: 2, title: 'Quiz: Sedução Avançada',    questions: 8,  course: 'Arte Da Conquista'  },
  { id: 3, title: 'Quiz: PNL Básica',          questions: 12, course: 'Psicologia Dark'    },
  { id: 4, title: 'Quiz: Corpo e Postura',     questions: 6,  course: 'Linguagem Corporal' },
];

function FAB({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="fixed z-30 flex items-center gap-2 px-5 py-3.5 shadow-lg"
      style={{ bottom: 80, right: 20, backgroundColor: PRIMARY, borderRadius: 100, boxShadow: `0 4px 20px rgba(124,58,237,0.4)` }}
    >
      <Plus size={18} className="text-white" />
      <span className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{label}</span>
    </button>
  );
}

export function EnsinoPage() {
  const [activeTab, setActiveTab] = useState<Tab>('cursos');
  const [showSheet, setShowSheet] = useState(false);

  const tabs: { id: Tab; label: string; Icon: typeof BookOpen }[] = [
    { id: 'cursos',  label: 'Cursos',   Icon: BookOpen     },
    { id: 'modulos', label: 'Módulos',  Icon: Layers       },
    { id: 'aulas',   label: 'Aulas',    Icon: Video        },
    { id: 'quiz',    label: 'Quiz',     Icon: HelpCircle   },
  ];

  const fabLabels: Record<Tab, string> = {
    cursos:  'Novo Curso',
    modulos: 'Novo Módulo',
    aulas:   'Nova Aula',
    quiz:    'Novo Quiz',
  };

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(to bottom, #0D0822, ${BG})` }}>
        <h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Ensinar</h1>
        <p style={{ color: TEXT2, fontSize: 13 }}>Cursos, módulos, aulas e quiz</p>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-6">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {tabs.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex-shrink-0 flex items-center gap-1.5 py-2 px-4"
                style={{
                  borderRadius: 100,
                  backgroundColor: active ? PRIMARY : 'transparent',
                  color: active ? '#fff' : TEXT2,
                  fontSize: 12, fontWeight: 500,
                  transition: 'all 0.2s',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CURSOS ── */}
      {activeTab === 'cursos' && (
        <div className="px-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {COURSES.map(course => {
              const src = typeof course.image === 'string' ? course.image : (course.image as any)?.src ?? course.image;
              return (
                <div key={course.id} className="relative group">
                  <div className="relative overflow-hidden" style={{ aspectRatio: '9/16', borderRadius: 12, border: `1px solid ${BORDER}` }}>
                    <img src={src} alt={course.title} className="absolute inset-0 w-full h-full object-cover object-top" />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,0.55) 50%, rgba(30,64,175,0.08) 100%)' }} />
                    {/* Edit overlay */}
                    <div className="absolute top-2 right-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(124,58,237,0.85)', backdropFilter: 'blur(8px)' }}>
                        <Edit3 size={13} className="text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p style={{ color: '#93C5FD', fontSize: 9, fontWeight: 500, marginBottom: 2, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{course.subtitle}</p>
                      <h4 className="text-white mb-2" style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{course.title}</h4>
                      <div className="flex justify-between">
                        <span style={{ color: TEXT3, fontSize: 9, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{course.lessons} aulas</span>
                        <span style={{ color: '#86EFAC', fontSize: 9, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{course.enrolled} alunos</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MÓDULOS ── */}
      {activeTab === 'modulos' && (
        <div className="px-5 space-y-2">
          {MODULES.map(mod => (
            <div key={mod.id} className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: PRIMARY + '20' }}>
                <Layers size={16} style={{ color: PRIMARY }} />
              </div>
              <div className="flex-1">
                <p className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{mod.title}</p>
                <p style={{ color: TEXT3, fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{mod.course} · {mod.lessons} aulas</p>
              </div>
              <button style={{ color: TEXT2 }}><Edit3 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {/* ── AULAS ── */}
      {activeTab === 'aulas' && (
        <div className="px-5 space-y-2">
          {LESSONS.map(lesson => (
            <div key={lesson.id} className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1E40AF20' }}>
                <Video size={16} style={{ color: '#93C5FD' }} />
              </div>
              <div className="flex-1">
                <p className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{lesson.title}</p>
                <p style={{ color: TEXT3, fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{lesson.module} · {lesson.duration}</p>
              </div>
              <button style={{ color: TEXT2 }}><Edit3 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {/* ── QUIZ ── */}
      {activeTab === 'quiz' && (
        <div className="px-5 space-y-2">
          {QUIZ_ITEMS.map(quiz => (
            <div key={quiz.id} className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF8C4220' }}>
                <HelpCircle size={16} style={{ color: '#FF8C42' }} />
              </div>
              <div className="flex-1">
                <p className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{quiz.title}</p>
                <p style={{ color: TEXT3, fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{quiz.course} · {quiz.questions} questões</p>
              </div>
              <button style={{ color: TEXT2 }}><Edit3 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      <FAB onClick={() => setShowSheet(true)} label={fabLabels[activeTab]} />

      {/* Sheet */}
      <AnimatePresence>
        {showSheet && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1200] flex items-end">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowSheet(false)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full z-10 space-y-4"
              style={{ backgroundColor: SURFACE, borderRadius: '16px 16px 0 0', border: `1px solid ${BORDER}`, padding: '24px 20px 48px' }}
            >
              <div className="w-10 h-1 rounded-full mx-auto" style={{ backgroundColor: BORDER }} />
              <div className="flex items-center justify-between">
                <h3 className="text-white" style={{ fontSize: 18, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{fabLabels[activeTab]}</h3>
                <button onClick={() => setShowSheet(false)}><X size={18} style={{ color: TEXT2 }} /></button>
              </div>
              <div>
                <label style={{ color: TEXT3, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>TÍTULO</label>
                <input
                  type="text"
                  placeholder={`Nome d${activeTab === 'aulas' ? 'a' : 'o'} ${fabLabels[activeTab].toLowerCase().replace('novo ', '').replace('nova ', '')}`}
                  className="w-full text-white outline-none"
                  style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                />
              </div>
              <button
                onClick={() => setShowSheet(false)}
                className="w-full py-4 text-white"
                style={{ backgroundColor: PRIMARY, borderRadius: 10, fontSize: 14, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Criar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
