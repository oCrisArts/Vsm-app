import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit3, Dumbbell, Utensils, DollarSign, BookOpen, ChevronRight, X } from 'lucide-react';

const BG      = '#121212';
const SURFACE  = '#1E1E1E';
const SURFACE2 = '#252525';
const BORDER   = '#2A2A2A';
const PRIMARY  = '#7C3AED';
const TEXT2    = '#9E9E9E';
const TEXT3    = '#666666';

const CATEGORIES = [
  {
    id: 'shape',
    label: 'Shape',
    icon: Dumbbell,
    color: '#FF8C42',
    items: [
      { title: 'Treino Full Body A', type: 'Treino',    views: 432 },
      { title: 'Protocolo HIIT',     type: 'Protocolo', views: 289 },
      { title: 'Treino Full Body B', type: 'Treino',    views: 198 },
      { title: 'Flexibilidade',      type: 'Guia',      views: 156 },
    ],
  },
  {
    id: 'dieta',
    label: 'Dieta',
    icon: Utensils,
    color: '#16A34A',
    items: [
      { title: 'Dieta Cutting',      type: 'Plano',     views: 512 },
      { title: 'Dieta Bulking',      type: 'Plano',     views: 341 },
      { title: 'Suplementação',      type: 'Guia',      views: 278 },
    ],
  },
  {
    id: 'financas',
    label: 'Finanças',
    icon: DollarSign,
    color: '#00C97E',
    items: [
      { title: 'Controle Financeiro', type: 'Planilha',  views: 623 },
      { title: 'Investimentos',       type: 'Guia',      views: 445 },
      { title: 'Geração de Renda',    type: 'Curso',     views: 389 },
    ],
  },
  {
    id: 'conhecimento',
    label: 'Conhecimento',
    icon: BookOpen,
    color: '#4169FF',
    items: [
      { title: 'Leitura Diária',     type: 'Rotina',    views: 287 },
      { title: 'Journaling VSM',     type: 'Prática',   views: 198 },
    ],
  },
];

export function AdminEvoluirPage() {
  const [expanded, setExpanded] = useState<string | null>('shape');
  const [showSheet, setShowSheet] = useState(false);

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(to bottom, #0D0822, ${BG})` }}>
        <h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Evoluir</h1>
        <p style={{ color: TEXT2, fontSize: 13 }}>Gerenciamento de conteúdos</p>
      </div>

      {/* Stats row */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
            <p style={{ color: TEXT3, fontSize: 11, fontWeight: 400, marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Total de Conteúdos</p>
            <p style={{ color: PRIMARY, fontSize: 28, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {CATEGORIES.reduce((a, c) => a + c.items.length, 0)}
            </p>
          </div>
          <div style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
            <p style={{ color: TEXT3, fontSize: 11, fontWeight: 400, marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Visualizações Totais</p>
            <p style={{ color: '#FF8C42', fontSize: 28, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {CATEGORIES.reduce((a, c) => a + c.items.reduce((b, i) => b + i.views, 0), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Accordion categories */}
      <div className="px-5 space-y-2">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const isOpen = expanded === cat.id;
          return (
            <div key={cat.id} style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
              {/* Category header */}
              <button
                onClick={() => setExpanded(isOpen ? null : cat.id)}
                className="w-full flex items-center justify-between px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + '20' }}>
                    <Icon size={16} style={{ color: cat.color }} />
                  </div>
                  <div className="text-left">
                    <p className="text-white" style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{cat.label}</p>
                    <p style={{ color: TEXT3, fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{cat.items.length} conteúdos</p>
                  </div>
                </div>
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight size={16} style={{ color: TEXT3 }} />
                </motion.div>
              </button>

              {/* Items */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-4 pb-4 space-y-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                      <div className="h-2" />
                      {cat.items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2.5" style={{ backgroundColor: SURFACE2, borderRadius: 8 }}>
                          <div className="flex-1">
                            <p className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.title}</p>
                            <p style={{ color: TEXT3, fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.type} · {item.views} views</p>
                          </div>
                          <button style={{ color: TEXT2 }}><Edit3 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowSheet(true)}
        className="fixed z-30 flex items-center gap-2 px-5 py-3.5 shadow-lg"
        style={{ bottom: 80, right: 20, backgroundColor: PRIMARY, borderRadius: 100, boxShadow: `0 4px 20px rgba(124,58,237,0.4)` }}
      >
        <Plus size={18} className="text-white" />
        <span className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Novo Conteúdo</span>
      </button>

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
                <h3 className="text-white" style={{ fontSize: 18, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Novo Conteúdo</h3>
                <button onClick={() => setShowSheet(false)}><X size={18} style={{ color: TEXT2 }} /></button>
              </div>
              <div>
                <label style={{ color: TEXT3, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>CATEGORIA</label>
                <select className="w-full text-white outline-none" style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: TEXT3, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>TÍTULO</label>
                <input type="text" placeholder="Título do conteúdo" className="w-full text-white outline-none" style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
              </div>
              <button onClick={() => setShowSheet(false)} className="w-full py-4 text-white" style={{ backgroundColor: PRIMARY, borderRadius: 10, fontSize: 14, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Criar Conteúdo</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
