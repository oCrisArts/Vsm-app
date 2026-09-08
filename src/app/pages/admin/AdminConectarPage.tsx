import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit3, Calendar, MapPin, Users, TrendingUp, X } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const BG      = '#121212';
const SURFACE  = '#1E1E1E';
const SURFACE2 = '#252525';
const BORDER   = '#2A2A2A';
const PRIMARY  = '#7C3AED';
const TEXT2    = '#9E9E9E';
const TEXT3    = '#666666';

const MEETINGS = [
  { id: 1, student: 'Ricardo Alves',   contact: 'Isabela',  date: '21 Fev', time: '20:00', location: 'Bar Astor',           status: 'confirmado', avatar: 'https://images.unsplash.com/photo-1621012649112-d1724740b0da?w=100&q=80' },
  { id: 2, student: 'Gabriel Santos',  contact: 'Camila',   date: '22 Fev', time: '18:30', location: 'Parque Ibirapuera',   status: 'pendente',   avatar: 'https://images.unsplash.com/photo-1749700332031-cf99864959ea?w=100&q=80' },
  { id: 3, student: 'Felipe Moreira',  contact: 'Fernanda', date: '24 Fev', time: '19:00', location: 'Restaurante Lentini', status: 'confirmado', avatar: 'https://images.unsplash.com/photo-1630845175575-b5c2495cb409?w=100&q=80' },
  { id: 4, student: 'Lucas Oliveira',  contact: 'Larissa',  date: '25 Fev', time: '21:00', location: 'Rooftop W Hotel',     status: 'pendente',   avatar: 'https://images.unsplash.com/photo-1680520919302-29d5e104ba7c?w=100&q=80' },
  { id: 5, student: 'Mateus Costa',    contact: 'Vitória',  date: '26 Fev', time: '17:00', location: 'Praia de Boa Viagem', status: 'confirmado', avatar: 'https://images.unsplash.com/photo-1762195020829-835d05d3ee80?w=100&q=80' },
];

export function AdminConectarPage() {
  const [showSheet, setShowSheet] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'confirmado' | 'pendente'>('todos');

  const filtered = MEETINGS.filter(m => filter === 'todos' || m.status === filter);
  const confirmed = MEETINGS.filter(m => m.status === 'confirmado').length;

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(to bottom, #0D0822, ${BG})` }}>
        <h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Conectar</h1>
        <p style={{ color: TEXT2, fontSize: 13 }}>Gerenciamento de contatos e encontros</p>
      </div>

      {/* Stats */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Encontros',   value: MEETINGS.length, Icon: Calendar,  color: PRIMARY    },
            { label: 'Confirmados', value: confirmed,        Icon: TrendingUp, color: '#16A34A'  },
            { label: 'Alunos',      value: 6,                Icon: Users,     color: '#FF8C42'  },
          ].map(({ label, value, Icon, color }) => (
            <div key={label} style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: color + '20' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <p style={{ color, fontSize: 22, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</p>
                <p style={{ color: TEXT2, fontSize: 10, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 mb-5">
        <div className="flex gap-1">
          {(['todos', 'confirmado', 'pendente'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 capitalize"
              style={{ borderRadius: 100, backgroundColor: filter === f ? PRIMARY : 'transparent', color: filter === f ? '#fff' : TEXT2, fontSize: 12, fontWeight: 500, transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {f === 'todos' ? 'Todos' : f === 'confirmado' ? 'Confirmados' : 'Pendentes'}
            </button>
          ))}
        </div>
      </div>

      {/* Meeting list */}
      <div className="px-5 space-y-3">
        {filtered.map(meeting => (
          <motion.div
            key={meeting.id}
            whileTap={{ scale: 0.99 }}
            className="flex items-start gap-3 px-4 py-4"
            style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}
          >
            <ImageWithFallback src={meeting.avatar} alt={meeting.contact} className="w-11 h-11 rounded-full object-cover flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white truncate" style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {meeting.student} → {meeting.contact}
                </p>
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] flex-shrink-0"
                  style={{
                    backgroundColor: meeting.status === 'confirmado' ? '#14532D' : '#44380A',
                    color: meeting.status === 'confirmado' ? '#86EFAC' : '#FDE68A',
                    fontWeight: 500,
                  }}
                >
                  {meeting.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-0.5">
                <Calendar size={10} style={{ color: '#93C5FD' }} />
                <span style={{ color: TEXT2, fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{meeting.date} · {meeting.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={10} style={{ color: TEXT3 }} />
                <span style={{ color: TEXT3, fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{meeting.location}</span>
              </div>
            </div>

            <button style={{ color: TEXT2, flexShrink: 0 }}><Edit3 size={14} /></button>
          </motion.div>
        ))}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowSheet(true)}
        className="fixed z-30 flex items-center gap-2 px-5 py-3.5 shadow-lg"
        style={{ bottom: 80, right: 20, backgroundColor: PRIMARY, borderRadius: 100, boxShadow: `0 4px 20px rgba(124,58,237,0.4)` }}
      >
        <Plus size={18} className="text-white" />
        <span className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Novo Encontro</span>
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
                <h3 className="text-white" style={{ fontSize: 18, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Novo Encontro</h3>
                <button onClick={() => setShowSheet(false)}><X size={18} style={{ color: TEXT2 }} /></button>
              </div>
              {[
                { label: 'ALUNO', placeholder: 'Selecione o aluno', type: 'text' },
                { label: 'DATA', placeholder: '', type: 'date' },
                { label: 'LOCAL', placeholder: 'Bar, Restaurante...', type: 'text' },
              ].map(field => (
                <div key={field.label}>
                  <label style={{ color: TEXT3, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder} className="w-full text-white outline-none" style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif', colorScheme: 'dark' }} />
                </div>
              ))}
              <button onClick={() => setShowSheet(false)} className="w-full py-4 text-white" style={{ backgroundColor: PRIMARY, borderRadius: 10, fontSize: 14, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Registrar Encontro</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
