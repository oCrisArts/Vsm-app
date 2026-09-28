import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Shield, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { adminSetUserRole, useAdminProfiles } from '../../../lib/hooks/useAdminProfiles';
import type { Role } from '../../../lib/types';

const BG = '#121212';
const SURFACE = '#1E1E1E';
const BORDER = '#2A2A2A';
const PRIMARY = '#7C3AED';
const TEXT2 = '#9E9E9E';
const TEXT3 = '#666666';

export function ComunidadeAdminPage() {
  const { user } = useAuth();
  const { profiles, loading, error, reload } = useAdminProfiles();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todos' | Role>('todos');
  const [changingId, setChangingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filtered = useMemo(() => profiles.filter(profile => {
    const term = search.trim().toLowerCase();
    return (!term || profile.display_name?.toLowerCase().includes(term) || profile.email.toLowerCase().includes(term))
      && (filter === 'todos' || profile.role === filter);
  }), [profiles, search, filter]);
  const students = profiles.filter(profile => profile.role === 'student').length;
  const admins = profiles.filter(profile => profile.role === 'admin').length;
  const averageVsm = profiles.length ? Math.round(profiles.reduce((total, profile) => total + profile.vsm_score, 0) / profiles.length) : 0;

  const changeRole = async (targetId: string, currentRole: Role) => {
    const nextRole: Role = currentRole === 'admin' ? 'student' : 'admin';
    const action = nextRole === 'admin' ? 'tornar este usuário administrador' : 'tornar este administrador estudante';
    if (!window.confirm(`Confirma que deseja ${action}?`)) return;
    setChangingId(targetId);
    setFeedback(null);
    const result = await adminSetUserRole(targetId, nextRole);
    if (result.error) setFeedback({ type: 'error', text: result.error.message });
    else {
      await reload();
      setFeedback({ type: 'success', text: nextRole === 'admin' ? 'Usuário promovido a administrador.' : 'Administrador alterado para estudante.' });
    }
    setChangingId(null);
  };

  return <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
    <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(to bottom, #0D0822, ${BG})` }}><h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500 }}>Comunidade</h1><p style={{ color: TEXT2, fontSize: 13 }}>Gestão de alunos e usuários</p></div>
    {feedback && <div className="mx-5 mb-4 px-4 py-3 rounded-xl" style={{ backgroundColor: feedback.type === 'success' ? '#16A34A20' : '#EF444420', color: feedback.type === 'success' ? '#86EFAC' : '#FCA5A5', border: `1px solid ${feedback.type === 'success' ? '#16A34A' : '#EF4444'}40`, fontSize: 12 }}>{feedback.text}</div>}

    <div className="px-5 mb-6"><div className="grid grid-cols-3 gap-3">{[
      { label: 'Alunos', value: students, Icon: Users, color: PRIMARY },
      { label: 'Admins', value: admins, Icon: Shield, color: '#1E40AF' },
      { label: 'VSM Médio', value: averageVsm, Icon: TrendingUp, color: '#FF8C42' },
    ].map(({ label, value, Icon, color }) => <div key={label} style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}><div className="flex flex-col items-center text-center"><div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: color + '20' }}><Icon size={16} style={{ color }} /></div><p style={{ color, fontSize: 22, fontWeight: 500 }}>{value}</p><p style={{ color: TEXT2, fontSize: 10 }}>{label}</p></div></div>)}</div></div>

    <div className="px-5 mb-4"><div className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}><Search size={15} style={{ color: TEXT3 }} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar por nome ou e-mail..." className="flex-1 bg-transparent text-white placeholder-[#666] outline-none" style={{ fontSize: 14 }} /></div></div>
    <div className="px-5 mb-5 flex gap-1">{(['todos', 'student', 'admin'] as const).map(value => <button key={value} onClick={() => setFilter(value)} className="px-4 py-2" style={{ borderRadius: 100, backgroundColor: filter === value ? PRIMARY : 'transparent', color: filter === value ? '#fff' : TEXT2, fontSize: 12 }}>{value === 'todos' ? 'Todos' : value === 'student' ? 'Estudantes' : 'Administradores'}</button>)}</div>

    {loading && <div className="px-5 py-8" style={{ color: TEXT3, fontSize: 13 }}>Carregando usuários...</div>}
    {error && <div className="px-5 py-8" style={{ color: '#FCA5A5', fontSize: 13 }}>Não foi possível carregar os usuários: {error}</div>}
    {!loading && !error && filtered.length === 0 && <div className="px-5 py-8" style={{ color: TEXT3, fontSize: 13 }}>Nenhum usuário encontrado.</div>}

    <div className="px-5 space-y-2">{filtered.map(profile => {
      const name = profile.display_name || profile.email.split('@')[0];
      const isCurrent = profile.id === user?.id;
      return <motion.div key={profile.id} whileTap={{ scale: 0.995 }} className="px-4 py-3" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
        <div className="flex items-center gap-3">
          {profile.avatar_src ? <img src={profile.avatar_src} alt={name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" /> : <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-white" style={{ background: 'linear-gradient(135deg, #7C3AED, #1E40AF)', fontSize: 13, fontWeight: 600 }}>{name.slice(0, 2).toUpperCase()}</div>}
          <div className="flex-1 min-w-0"><div className="flex items-center gap-2"><p className="text-white truncate" style={{ fontSize: 14, fontWeight: 500 }}>{name}</p><span className="px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontSize: 9, backgroundColor: profile.role === 'admin' ? '#1E40AF30' : '#7C3AED25', color: profile.role === 'admin' ? '#93C5FD' : '#C4B5FD' }}>{profile.role === 'admin' ? 'Admin' : 'Estudante'}</span></div><p className="truncate" style={{ color: TEXT3, fontSize: 10 }}>{profile.email}</p></div>
          <div className="text-right"><p style={{ color: PRIMARY, fontSize: 18, fontWeight: 500 }}>{profile.vsm_score}</p><p style={{ color: TEXT3, fontSize: 9 }}>VSM</p></div>
        </div>
        <div className="mt-3 pt-3 grid grid-cols-4 gap-2" style={{ borderTop: `1px solid ${BORDER}` }}>
          <Metric label="Nível" value={profile.vsm_level} /><Metric label="XP" value={profile.total_xp} /><Metric label="Cursos" value={profile.courses_count} /><Metric label="Progresso" value={profile.progress_count} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3"><span style={{ color: TEXT3, fontSize: 10 }}>Cadastro: {new Intl.DateTimeFormat('pt-BR').format(new Date(profile.created_at))}</span><button disabled={isCurrent || changingId === profile.id} onClick={() => void changeRole(profile.id, profile.role)} className="px-3 py-2 rounded-lg disabled:opacity-40" style={{ color: profile.role === 'admin' ? '#FCA5A5' : '#93C5FD', backgroundColor: profile.role === 'admin' ? '#EF444415' : '#1E40AF20', fontSize: 10, fontWeight: 600 }}>{changingId === profile.id ? 'Alterando...' : profile.role === 'admin' ? 'Tornar estudante' : 'Tornar administrador'}</button></div>
      </motion.div>;
    })}</div>
  </div>;
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="text-center"><p className="text-white" style={{ fontSize: 12, fontWeight: 500 }}>{value}</p><p style={{ color: TEXT3, fontSize: 9 }}>{label}</p></div>;
}
