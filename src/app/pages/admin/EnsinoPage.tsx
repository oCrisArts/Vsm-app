import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit3, BookOpen, Video, HelpCircle, X, Layers } from 'lucide-react';
import { useAllLearningContent } from '../../../lib/hooks/useLearning';

const BG      = '#121212';
const SURFACE  = '#1E1E1E';
const SURFACE2 = '#252525';
const BORDER   = '#2A2A2A';
const PRIMARY  = '#7C3AED';
const TEXT2    = '#9E9E9E';
const TEXT3    = '#666666';

type Tab = 'cursos' | 'modulos' | 'aulas' | 'quiz';

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
  const { courses, quizzes, loading, error } = useAllLearningContent();
  const modules = courses.flatMap(course => course.modules.map(module => ({ ...module, courseTitle: course.title })));
  const lessons = modules.flatMap(module => module.lessons.map(lesson => ({ ...lesson, moduleTitle: module.title })));

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
            {courses.map(course => {
              const src = course.image_url ?? '';
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
                        <span style={{ color: TEXT3, fontSize: 9, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{course.modules.flatMap(module => module.lessons).length} aulas</span>
                        <span style={{ color: '#86EFAC', fontSize: 9, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>— alunos</span>
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
          {modules.map(mod => (
            <div key={mod.id} className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: PRIMARY + '20' }}>
                <Layers size={16} style={{ color: PRIMARY }} />
              </div>
              <div className="flex-1">
                <p className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{mod.title}</p>
                <p style={{ color: TEXT3, fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{mod.courseTitle} · {mod.lessons.length} aulas</p>
              </div>
              <button style={{ color: TEXT2 }}><Edit3 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {/* ── AULAS ── */}
      {activeTab === 'aulas' && (
        <div className="px-5 space-y-2">
          {lessons.map(lesson => (
            <div key={lesson.id} className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#1E40AF20' }}>
                <Video size={16} style={{ color: '#93C5FD' }} />
              </div>
              <div className="flex-1">
                <p className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{lesson.title}</p>
                <p style={{ color: TEXT3, fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{lesson.moduleTitle} · {lesson.duration}</p>
              </div>
              <button style={{ color: TEXT2 }}><Edit3 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {/* ── QUIZ ── */}
      {activeTab === 'quiz' && (
        <div className="px-5 space-y-2">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#FF8C4220' }}>
                <HelpCircle size={16} style={{ color: '#FF8C42' }} />
              </div>
              <div className="flex-1">
                <p className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{quiz.title}</p>
                <p style={{ color: TEXT3, fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{courses.find(course => course.id === quiz.course_id)?.title ?? 'Curso'} · {quiz.quiz_questions.length} questões</p>
              </div>
              <button style={{ color: TEXT2 }}><Edit3 size={14} /></button>
            </div>
          ))}
        </div>
      )}

      {(loading || error) && <div className="px-5 py-8" style={{ color: TEXT3, fontSize: 13 }}>{loading ? 'Carregando conteúdo...' : 'Não foi possível carregar o conteúdo.'}</div>}

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
