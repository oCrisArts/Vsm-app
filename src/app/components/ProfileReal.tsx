import { ChangeEvent, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Camera, ChevronRight, DollarSign, Dumbbell, LogOut, Trophy, TrendingUp, Users, Zap } from 'lucide-react';
import { Card, CardContent } from '@mui/material';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useGamification, vsmLevelLabel } from '../../lib/hooks/useGamification';
import { supabase } from '../../lib/supabase';

interface Props { onClose?: () => void; onLogout?: () => void; }

const PILLARS = [
  { key: 'shape_score' as const, icon: Dumbbell, label: 'Shape', desc: 'Presença física e energia vital', color: '#FF8C42' },
  { key: 'finance_score' as const, icon: DollarSign, label: 'Finanças', desc: 'Status, segurança e poder', color: '#00C97E' },
  { key: 'knowledge_score' as const, icon: BookOpen, label: 'Conhecimento', desc: 'Mente calibrada e conversas', color: '#4169FF' },
  { key: 'social_score' as const, icon: Users, label: 'Habilidade Social', desc: 'Atração e influência social', color: '#A78BFA' },
];

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return <div className="bg-[#0A0A0A] border border-[#4169FF] rounded-xl px-3 py-2"><p className="text-[#4169FF] text-xs" style={{ fontWeight: 900 }}>VSM {payload[0].value}</p><p className="text-[#666] text-[10px]">{label}</p></div>;
}

export function ProfileReal({ onClose, onLogout }: Props) {
  const { user } = useAuth();
  const { profile, history, achievements, summary, loading, error, reload } = useGamification(user?.id ?? null);
  const [showVsmCard, setShowVsmCard] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    setUploading(true); setFeedback(null);
    const extension = file.name.split('.').pop()?.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'jpg';
    const path = `${user.id}/avatar-${crypto.randomUUID()}.${extension}`;
    const upload = await supabase.storage.from('avatars').upload(path, file, { contentType: file.type || undefined });
    if (upload.error) setFeedback(upload.error.message);
    else {
      const update = await supabase.from('profiles').update({ avatar_url: path }).eq('id', user.id);
      if (update.error) {
        await supabase.storage.from('avatars').remove([path]);
        setFeedback(update.error.message);
      } else {
        if (profile?.avatar_url && !/^https?:\/\//i.test(profile.avatar_url)) await supabase.storage.from('avatars').remove([profile.avatar_url]);
        await reload();
      }
    }
    setUploading(false);
    event.target.value = '';
  };

  if (loading) return <div className="min-h-screen bg-black p-6 text-[#666]">Carregando perfil...</div>;
  if (error || !profile) return <div className="min-h-screen bg-black p-6 text-[#FF6B6B]">{error || 'Perfil não encontrado.'}</div>;

  const name = profile.display_name || profile.email.split('@')[0];
  const initials = name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const chartData = history.map(entry => ({
    date: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(entry.created_at)),
    value: entry.score,
    event: entry.description,
  }));
  const gain = chartData.length > 1 ? chartData[chartData.length - 1].value - chartData[0].value : 0;

  return <div className="min-h-screen bg-black pb-24 overflow-y-auto">
    <div className="bg-gradient-to-b from-[#0A1A3A] to-black px-5 pt-5 pb-8">
      <div className="flex items-center justify-between mb-6"><h1 className="text-white text-3xl" style={{ fontWeight: 900 }}>Perfil</h1>{onClose && <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"><span className="text-white text-xl">×</span></button>}</div>
      <div className="flex items-end gap-5">
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#4169FF] to-[#2845AA] flex items-center justify-center border-4 border-[#4169FF]/50 disabled:opacity-60">
          {profile.avatar_src ? <img src={profile.avatar_src} alt={name} className="w-full h-full object-cover" /> : <span className="text-white text-3xl" style={{ fontWeight: 900 }}>{initials}</span>}
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 flex items-center justify-center"><Camera size={22} className="text-white" /></div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={event => void uploadAvatar(event)} />
        <div className="flex-1 pb-1"><h2 className="text-white text-2xl mb-1" style={{ fontWeight: 900 }}>{name}</h2><div className="flex items-center gap-2"><span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: '#4169FF30', color: '#4169FF', fontWeight: 900 }}>{vsmLevelLabel(profile.vsm_level)}</span><span className="text-[#999] text-sm">Rank #{summary.rank || 1}</span></div></div>
      </div>
      {feedback && <p className="mt-3 text-[#FF6B6B] text-xs">{feedback}</p>}
      <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-[#4169FF]/20">{[
        { val: profile.vsm_score, label: 'Vsm' }, { val: profile.total_xp.toLocaleString('pt-BR'), label: 'Xp Total' }, { val: summary.courses_completed, label: 'Cursos' },
      ].map(stat => <div key={stat.label} className="text-center"><div className="text-[#4169FF] text-2xl mb-0.5" style={{ fontWeight: 900 }}>{stat.val}</div><div className="text-[#666] text-xs">{stat.label}</div></div>)}</div>
    </div>

    <div className="px-5 mb-6"><button onClick={() => setShowVsmCard(value => !value)} className="w-full flex items-center justify-between bg-[#0D1A3A] border border-[#4169FF]/40 rounded-2xl px-5 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-[#4169FF]/20 flex items-center justify-center"><Zap size={16} className="text-[#4169FF]" /></div><div className="text-left"><p className="text-white text-sm" style={{ fontWeight: 900 }}>O Que É Vsm?</p><p className="text-[#666] text-xs">Entenda seu principal indicador</p></div></div><motion.div animate={{ rotate: showVsmCard ? 90 : 0 }}><ChevronRight size={16} className="text-[#4169FF]" /></motion.div></button>
      <motion.div initial={false} animate={{ height: showVsmCard ? 'auto' : 0, opacity: showVsmCard ? 1 : 0 }} className="overflow-hidden"><div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl mt-2 p-5"><p className="text-[#AAA] text-sm mb-4" style={{ lineHeight: 1.7 }}><span className="text-white" style={{ fontWeight: 800 }}>VSM (Valor Sexual de Mercado)</span> reúne os quatro pilares abaixo. A pontuação é calculada no banco a partir dos dados do seu perfil.</p><div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">{PILLARS.map(pillar => { const Icon = pillar.icon; const value = profile[pillar.key]; return <div key={pillar.key} className="bg-[#111] rounded-xl p-3 flex items-start gap-2.5"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: pillar.color + '20' }}><Icon size={14} style={{ color: pillar.color }} /></div><div className="flex-1"><p className="text-white text-xs" style={{ fontWeight: 800 }}>{pillar.label} · {value}</p><p className="text-[#666] text-[10px]">{pillar.desc}</p><div className="mt-1.5 w-full h-1 bg-[#1A1A1A] rounded-full"><div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: pillar.color }} /></div></div></div>; })}</div></div></motion.div>
    </div>

    <div className="px-5 mb-6"><h3 className="text-white text-xl mb-4" style={{ fontWeight: 900 }}>Evolução Vsm</h3><Card sx={{ bgcolor: '#0A0A0A', borderRadius: 4, border: '1px solid #1A1A1A' }}><CardContent sx={{ padding: '24px !important' }}><div className="flex items-center justify-between mb-4"><div><p className="text-[#999] text-sm">Ganho De Poder</p><div className="flex items-center gap-2 mt-1"><TrendingUp size={18} className="text-[#4169FF]" /><span className="text-[#4169FF] text-xl" style={{ fontWeight: 900 }}>{gain >= 0 ? '+' : ''}{gain} Pontos</span></div></div><span className="text-[#666] text-xs">Histórico real</span></div>{chartData.length ? <div style={{ height: 200 }}><ResponsiveContainer width="100%" height={200}><AreaChart data={chartData} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}><defs><linearGradient id="vsmRealGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4169FF" stopOpacity={0.3} /><stop offset="95%" stopColor="#4169FF" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="date" stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis domain={[0, 100]} stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} /><Tooltip content={<ChartTooltip />} /><Area type="monotone" dataKey="value" stroke="#4169FF" strokeWidth={2.5} fill="url(#vsmRealGrad)" /></AreaChart></ResponsiveContainer></div> : <p className="text-[#666] text-sm py-8 text-center">O histórico aparecerá quando o VSM for atualizado.</p>}</CardContent></Card></div>

    <div className="px-5 mb-6"><h3 className="text-white text-xl mb-4" style={{ fontWeight: 900 }}>Conquistas</h3>{achievements.length ? <div className="grid grid-cols-2 gap-3">{achievements.map(achievement => { const unlocked = Boolean(achievement.unlocked_at); return <Card key={achievement.id} sx={{ bgcolor: '#0A0A0A', borderRadius: 3, border: `2px solid ${unlocked ? '#4169FF' : '#1A1A1A'}`, opacity: unlocked ? 1 : .4 }}><CardContent sx={{ padding: '20px !important', textAlign: 'center' }}><div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: unlocked ? '#4169FF20' : '#1A1A1A' }}><Trophy size={26} className={unlocked ? 'text-[#4169FF]' : 'text-[#333]'} /></div><p className="text-white text-sm" style={{ fontWeight: 800 }}>{achievement.title}</p><p className="text-[#666] text-[10px] mt-1">{achievement.description}</p><p className="text-[#4169FF] text-[10px] mt-2">+{achievement.xp_reward} XP</p></CardContent></Card>; })}</div> : <p className="text-[#666] text-sm">Nenhuma conquista ativa.</p>}</div>

    <div className="px-5 mb-6"><h3 className="text-white text-xl mb-4" style={{ fontWeight: 900 }}>Conta</h3><Card sx={{ bgcolor: '#0A0A0A', borderRadius: 4, border: '1px solid #1A1A1A' }}><button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 text-left"><div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#FF6B6B20]"><LogOut size={18} className="text-[#FF6B6B]" /></div><div className="flex-1"><p className="text-[#FF6B6B] text-sm" style={{ fontWeight: 800 }}>Sair</p><p className="text-[#666] text-xs">Encerrar sessão</p></div><ChevronRight size={16} className="text-[#333]" /></button></Card></div>
  </div>;
}
