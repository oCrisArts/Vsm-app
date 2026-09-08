import { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, TrendingUp, Settings, LogOut, ChevronRight, Star, Target, Camera, Dumbbell, DollarSign, BookOpen, Users, Zap } from 'lucide-react';
import { Card, CardContent } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Area, AreaChart } from 'recharts';

interface ProfileNewProps { onClose?: () => void; onLogout?: () => void; }

const VSM_PILLARS = [
  { icon: Dumbbell, label: 'Shape', desc: 'Presença física e energia vital', contribution: 28, color: '#FF8C42' },
  { icon: DollarSign, label: 'Finanças', desc: 'Status, segurança e poder', contribution: 22, color: '#00C97E' },
  { icon: BookOpen, label: 'Conhecimento', desc: 'Mente calibrada e conversas', contribution: 26, color: '#4169FF' },
  { icon: Users, label: 'Habilidade Social', desc: 'Atração e influência social', contribution: 24, color: '#A78BFA' },
];

const vsmHistory = [
  { date: '1 Fev', value: 45, event: 'Início' },
  { date: '3 Fev', value: 52, event: null },
  { date: '5 Fev', value: 58, event: 'Curso +6' },
  { date: '7 Fev', value: 55, event: null },
  { date: '9 Fev', value: 63, event: null },
  { date: '11 Fev', value: 68, event: 'Missão' },
  { date: '13 Fev', value: 71, event: null },
  { date: '15 Fev', value: 76, event: 'Elite' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0A0A0A] border border-[#4169FF] rounded-xl px-3 py-2">
      <p className="text-[#4169FF] text-xs" style={{ fontWeight: 900 }}>VSM {payload[0].value}</p>
      <p className="text-[#666] text-[10px]">{label}</p>
    </div>
  );
};

export function ProfileNew({ onClose, onLogout }: ProfileNewProps) {
  const [avatarHover, setAvatarHover] = useState(false);
  const [showVSMCard, setShowVSMCard] = useState(false);

  const userStats = { name: 'João Silva', level: 'Elite', rank: '#247', vsm: 76, totalXP: 12450, coursesCompleted: 3 };

  const achievements = [
    { id: 1, title: 'Mestre da Persuasão', unlocked: true },
    { id: 2, title: 'Dominador', unlocked: true },
    { id: 3, title: '100 Aproximações', unlocked: true },
    { id: 4, title: 'Imparável', unlocked: false },
  ];

  const menuItems: { icon: typeof Target; label: string; description: string; danger?: boolean; action?: () => void }[] = [
    { icon: Target,   label: 'Metas e Objetivos', description: 'Configure suas metas pessoais' },
    { icon: Star,     label: 'Plano Premium',      description: 'Gerencie sua assinatura'       },
    { icon: Settings, label: 'Configurações',       description: 'Preferências do aplicativo'   },
    { icon: LogOut,   label: 'Sair',               description: 'Encerrar sessão', danger: true, action: onLogout },
  ];

  return (
    <div className="min-h-screen bg-black pb-24 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0A1A3A] to-black px-5 pt-5 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-3xl" style={{ fontWeight: 900 }}>Perfil</h1>
          {onClose && (
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-white text-xl leading-none">×</span>
            </button>
          )}
        </div>

        {/* Avatar editável */}
        <div className="flex items-end gap-5">
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4169FF] to-[#2845AA] flex items-center justify-center border-4 border-[#4169FF]/50">
              <span className="text-white text-3xl" style={{ fontWeight: 900 }}>JS</span>
            </div>
            <motion.div
              animate={{ opacity: avatarHover ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center"
            >
              <Camera size={22} className="text-white" />
            </motion.div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#4169FF] border-2 border-black flex items-center justify-center">
              <Camera size={12} className="text-white" />
            </div>
          </div>

          <div className="flex-1 pb-1">
            <h2 className="text-white text-2xl mb-1" style={{ fontWeight: 900 }}>{userStats.name}</h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: '#4169FF30', color: '#4169FF', fontWeight: 900 }}>
                {userStats.level}
              </span>
              <span className="text-[#999] text-sm">Rank {userStats.rank}</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-[#4169FF]/20">
          {[
            { val: userStats.vsm, label: 'Vsm' },
            { val: userStats.totalXP.toLocaleString(), label: 'Xp Total' },
            { val: userStats.coursesCompleted, label: 'Cursos' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-[#4169FF] text-2xl mb-0.5" style={{ fontWeight: 900 }}>{s.val}</div>
              <div className="text-[#666] text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── O QUE É VSM? ── */}
      <div className="px-5 mb-6">
        <button
          onClick={() => setShowVSMCard(v => !v)}
          className="w-full flex items-center justify-between bg-[#0D1A3A] border border-[#4169FF]/40 rounded-2xl px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4169FF]/20 flex items-center justify-center">
              <Zap size={16} className="text-[#4169FF]" />
            </div>
            <div className="text-left">
              <p className="text-white text-sm" style={{ fontWeight: 900 }}>O Que É Vsm?</p>
              <p className="text-[#666] text-xs">Entenda seu principal indicador</p>
            </div>
          </div>
          <motion.div animate={{ rotate: showVSMCard ? 90 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronRight size={16} className="text-[#4169FF]" />
          </motion.div>
        </button>

        <motion.div
          initial={false}
          animate={{ height: showVSMCard ? 'auto' : 0, opacity: showVSMCard ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          className="overflow-hidden"
        >
          <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl mt-2 p-5">
            <p className="text-[#AAA] text-sm mb-4" style={{ lineHeight: 1.7 }}>
              <span className="text-white" style={{ fontWeight: 800 }}>VSM (Valor Sexual de Mercado)</span> é o indicador que mede sua atratividade total perante o mercado. Não é genética — é construção. É a soma de 4 pilares que você controla.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {VSM_PILLARS.map(p => {
                const Icon = p.icon;
                return (
                  <div key={p.label} className="bg-[#111] rounded-xl p-3 flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: p.color + '20' }}>
                      <Icon size={14} style={{ color: p.color }} />
                    </div>
                    <div>
                      <p className="text-white text-xs mb-0.5" style={{ fontWeight: 800 }}>{p.label}</p>
                      <p className="text-[#666] text-[10px]" style={{ lineHeight: 1.3 }}>{p.desc}</p>
                      <div className="mt-1.5 w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.contribution * 3.2}%`, backgroundColor: p.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[#555] text-xs mt-4 text-center italic">
              "Cada ação no app alimenta um dos 4 pilares. Você decide o ritmo."
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── EVOLUÇÃO VSM — Gráfico interativo ── */}
      <div className="px-5 mb-6">
        <h3 className="text-white text-xl mb-4" style={{ fontWeight: 900 }}>Evolução Vsm</h3>
        <Card sx={{ bgcolor: '#0A0A0A', borderRadius: 4, border: '1px solid #1A1A1A' }}>
          <CardContent sx={{ padding: '24px !important' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[#999] text-sm">Ganho De Poder</p>
                <div className="flex items-center gap-2 mt-1">
                  <TrendingUp size={18} className="text-[#4169FF]" />
                  <span className="text-[#4169FF] text-xl" style={{ fontWeight: 900 }}>+31 Pontos</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[#666] text-xs">Últimos 15 Dias</span>
                <div className="flex items-center gap-1 mt-1 justify-end">
                  <div className="w-2 h-2 rounded-full bg-[#4169FF]" />
                  <span className="text-[#4169FF] text-xs" style={{ fontWeight: 700 }}>VSM Score</span>
                </div>
              </div>
            </div>

            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={vsmHistory} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="vsmGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4169FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4169FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#333" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} domain={[30, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={76} stroke="#4169FF" strokeDasharray="4 4" strokeOpacity={0.4} />
                  <Area type="monotone" dataKey="value" stroke="#4169FF" strokeWidth={2.5} fill="url(#vsmGrad)"
                    dot={({ cx, cy, payload }: any) => payload.event ? (
                      <circle key={`dot-${payload.date}`} cx={cx} cy={cy} r={5} fill="#4169FF" stroke="#0A0A0A" strokeWidth={2} />
                    ) : (
                      <circle key={`dot-${payload.date}`} cx={cx} cy={cy} r={3} fill="#4169FF" opacity={0.6} />
                    )}
                    activeDot={{ r: 7, fill: '#4169FF', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Legend events */}
            <div className="flex gap-3 mt-3 overflow-x-auto pb-1 no-scrollbar">
              {vsmHistory.filter(d => d.event).map(d => (
                <div key={d.date} className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 bg-[#4169FF]/10 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4169FF]" />
                  <span className="text-[#4169FF] text-[10px]" style={{ fontWeight: 700 }}>{d.date}: {d.event}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── CONQUISTAS ── */}
      <div className="px-5 mb-6">
        <h3 className="text-white text-xl mb-4" style={{ fontWeight: 900 }}>Conquistas</h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map(a => (
            <Card key={a.id} sx={{ bgcolor: '#0A0A0A', borderRadius: 3, border: `2px solid ${a.unlocked ? '#4169FF' : '#1A1A1A'}`, opacity: a.unlocked ? 1 : 0.4 }}>
              <CardContent sx={{ padding: '20px !important', textAlign: 'center' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: a.unlocked ? '#4169FF20' : '#1A1A1A' }}>
                  <Trophy size={26} className={a.unlocked ? 'text-[#4169FF]' : 'text-[#333]'} />
                </div>
                <p className="text-white text-sm" style={{ fontWeight: 800, lineHeight: 1.3 }}>{a.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── MENU ── */}
      <div className="px-5 mb-6">
        <h3 className="text-white text-xl mb-4" style={{ fontWeight: 900 }}>Conta</h3>
        <Card sx={{ bgcolor: '#0A0A0A', borderRadius: 4, border: '1px solid #1A1A1A', overflow: 'hidden' }}>
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                <button onClick={item.action} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors text-left">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: item.danger ? '#FF6B6B20' : '#4169FF15' }}>
                    <Icon size={18} className={item.danger ? 'text-[#FF6B6B]' : 'text-[#4169FF]'} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm" style={{ fontWeight: 800, color: item.danger ? '#FF6B6B' : '#fff' }}>{item.label}</p>
                    <p className="text-[#666] text-xs">{item.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#333]" />
                </button>
                {idx < menuItems.length - 1 && <div className="h-px bg-[#1A1A1A] mx-5" />}
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}