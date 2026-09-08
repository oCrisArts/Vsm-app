import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, TrendingUp, Shield, Users, X, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const BG      = '#121212';
const SURFACE  = '#1E1E1E';
const SURFACE2 = '#252525';
const BORDER   = '#2A2A2A';
const PRIMARY  = '#7C3AED';
const TEXT2    = '#9E9E9E';
const TEXT3    = '#666666';

const MOCK_STUDENTS = [
  { id: 1, name: 'Ricardo Alves',   vsm: 82, level: 'Elite',       status: 'ativo',   lastSeen: 'Hoje',      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80', coursesCount: 5 },
  { id: 2, name: 'Gabriel Santos',  vsm: 74, level: 'Avançado',    status: 'ativo',   lastSeen: 'Ontem',     avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', coursesCount: 3 },
  { id: 3, name: 'Felipe Moreira',  vsm: 61, level: 'Intermediário',status: 'ativo',   lastSeen: '2d atrás',  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80', coursesCount: 2 },
  { id: 4, name: 'Bruno Carvalho',  vsm: 55, level: 'Iniciante',   status: 'ativo',   lastSeen: '5d atrás',  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', coursesCount: 1 },
  { id: 5, name: 'Thiago Ferreira', vsm: 48, level: 'Iniciante',   status: 'inativo', lastSeen: '12d atrás', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&q=80', coursesCount: 1 },
  { id: 6, name: 'Lucas Oliveira',  vsm: 69, level: 'Avançado',    status: 'ativo',   lastSeen: 'Hoje',      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&q=80', coursesCount: 4 },
  { id: 7, name: 'Mateus Costa',    vsm: 77, level: 'Elite',       status: 'ativo',   lastSeen: 'Hoje',      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80', coursesCount: 5 },
  { id: 8, name: 'André Lima',      vsm: 52, level: 'Intermediário',status: 'inativo', lastSeen: '8d atrás',  avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80', coursesCount: 2 },
];

const levelColor: Record<string, string> = {
  Elite: '#1E40AF', Avançado: '#7C3AED', Intermediário: '#FF8C42', Iniciante: '#666666',
};

export function ComunidadePage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [showSheet, setShowSheet] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const filtered = MOCK_STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const activeCount   = MOCK_STUDENTS.filter(s => s.status === 'ativo').length;
  const avgVsm        = Math.round(MOCK_STUDENTS.reduce((a, s) => a + s.vsm, 0) / MOCK_STUDENTS.length);

  const handleSave = () => {
    setShowSheet(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(to bottom, #0D0822, ${BG})` }}>
        <h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.3, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Comunidade
        </h1>
        <p style={{ color: TEXT2, fontSize: 13, fontWeight: 400 }}>Gestão de alunos e usuários</p>
      </div>

      {/* Stats */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Alunos',    value: MOCK_STUDENTS.length, Icon: Users,      color: PRIMARY },
            { label: 'Ativos',    value: activeCount,          Icon: CheckCircle2, color: '#16A34A' },
            { label: 'VSM Médio', value: avgVsm,               Icon: TrendingUp,  color: '#FF8C42' },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: color + '20' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <p style={{ color, fontSize: 22, fontWeight: 500, marginBottom: 2, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</p>
                <p style={{ color: TEXT2, fontSize: 10, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
          <Search size={15} style={{ color: TEXT3, flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar aluno..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-[#666] outline-none"
            style={{ fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-5 mb-5">
        <div className="flex gap-1">
          {(['todos', 'ativo', 'inativo'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 capitalize"
              style={{
                borderRadius: 100,
                backgroundColor: filter === f ? PRIMARY : 'transparent',
                color: filter === f ? '#fff' : TEXT2,
                fontSize: 12, fontWeight: 500,
                transition: 'all 0.2s',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              {f === 'todos' ? 'Todos' : f === 'ativo' ? 'Ativos' : 'Inativos'}
            </button>
          ))}
        </div>
      </div>

      {/* Student list */}
      <div className="px-5 space-y-2">
        {filtered.map(student => (
          <motion.div
            key={student.id}
            whileTap={{ scale: 0.99 }}
            className="flex items-center gap-3 px-4 py-3"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, cursor: 'pointer' }}
          >
            <div className="relative flex-shrink-0">
              <ImageWithFallback
                src={student.avatar}
                alt={student.name}
                className="w-11 h-11 rounded-full object-cover"
              />
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2"
                style={{
                  backgroundColor: student.status === 'ativo' ? '#16A34A' : TEXT3,
                  borderColor: SURFACE,
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white truncate" style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{student.name}</p>
                <span className="px-1.5 py-0.5 rounded text-[9px] flex-shrink-0" style={{ backgroundColor: levelColor[student.level] + '25', color: levelColor[student.level], fontWeight: 500 }}>
                  {student.level}
                </span>
              </div>
              <p style={{ color: TEXT3, fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {student.coursesCount} cursos · Visto: {student.lastSeen}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <p style={{ color: PRIMARY, fontSize: 18, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{student.vsm}</p>
              <p style={{ color: TEXT3, fontSize: 9, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>VSM</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Saved flash */}
      <AnimatePresence>
        {savedFlash && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="fixed top-20 left-1/2 z-[999] pointer-events-none"
            style={{ transform: 'translateX(-50%)' }}
          >
            <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: '#16A34A', borderRadius: 100, boxShadow: '0 4px 20px rgba(22,163,74,0.5)' }}>
              <CheckCircle2 size={14} className="text-white" />
              <span className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Convite enviado!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <button
        onClick={() => setShowSheet(true)}
        className="fixed z-30 flex items-center gap-2 px-5 py-3.5 shadow-lg"
        style={{ bottom: 80, right: 20, backgroundColor: PRIMARY, borderRadius: 100, boxShadow: `0 4px 20px rgba(124,58,237,0.4)` }}
      >
        <Plus size={18} className="text-white" />
        <span className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Convidar Aluno</span>
      </button>

      {/* Bottom sheet */}
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
                <h3 className="text-white" style={{ fontSize: 18, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Convidar Aluno</h3>
                <button onClick={() => setShowSheet(false)}><X size={18} style={{ color: TEXT2 }} /></button>
              </div>
              <div>
                <label style={{ color: TEXT3, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>E-MAIL OU TELEFONE</label>
                <input
                  type="text"
                  placeholder="aluno@email.com"
                  className="w-full text-white outline-none"
                  style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                />
              </div>
              <div>
                <label style={{ color: TEXT3, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>PLANO</label>
                <select
                  className="w-full text-white outline-none"
                  style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  <option value="basic">Básico</option>
                  <option value="premium">Premium</option>
                  <option value="elite">Elite</option>
                </select>
              </div>
              <button
                onClick={handleSave}
                className="w-full py-4 text-white"
                style={{ backgroundColor: PRIMARY, borderRadius: 10, fontSize: 14, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                Enviar Convite
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
