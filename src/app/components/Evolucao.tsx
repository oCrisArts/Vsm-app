import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ChevronLeft, Dumbbell, Utensils, DollarSign, TrendingUp, Zap, Flame, BookOpen, Play } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  AreaChart, Area,
} from 'recharts';

import imgImageDominacaoAbsoluta from "figma:asset/9d0b0475eccd0337994da6766bb60e9be4982b13.png";
import imgImageArteDaConquista from "figma:asset/85bb2779d47fe59ded6690ec8da200446d0a5024.png";
import imgImagePsicologiaDark from "figma:asset/e5a64e3be5e34ec4cec4aa5c50b48f504b380c62.png";
import imgImageLinguagemCorporal from "figma:asset/337640c5cf08e0ad9c23e8ae900fd272e0d526d6.png";

// ── Design Tokens ──────────────────────────────────────────────
const BG      = '#121212';
const SURFACE  = '#1E1E1E';
const SURFACE2 = '#252525';
const BORDER   = '#2A2A2A';
const PRIMARY  = '#1E40AF';
const TEXT     = '#FFFFFF';
const TEXT2    = '#9E9E9E';
const TEXT3    = '#666666';
const SUCCESS  = '#16A34A';
const DANGER   = '#DC2626';

// ── Helpers ────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-white mb-4" style={{ fontSize: 16, fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.5, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {children}
    </h2>
  );
}

function MetricCard({ label, value, unit, sub, onClick }: { label: string; value: number | string; unit: string; sub?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col text-left w-full transition-transform active:scale-[0.98]"
      style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}
    >
      <span style={{ color: TEXT2, fontSize: 11, fontWeight: 400, letterSpacing: '0.02em', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-white" style={{ fontSize: 28, fontWeight: 500, lineHeight: 1.1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{value}</span>
        <span style={{ color: TEXT2, fontSize: 13, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{unit}</span>
      </div>
      {sub && <span style={{ color: TEXT3, fontSize: 11, fontWeight: 400, marginTop: 6, lineHeight: 1.5, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{sub}</span>}
      {onClick && (
        <div className="mt-3" style={{ color: '#93C5FD', fontSize: 11, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Ver histórico →</div>
      )}
    </button>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '8px 12px' }}>
      <p style={{ color: '#93C5FD', fontSize: 12, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {payload[0].value} {payload[0].name === 'weight' ? 'kg' : payload[0].name === 'fat' ? '%' : 'kcal'}
      </p>
      <p style={{ color: TEXT3, fontSize: 10, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{label}</p>
    </div>
  );
}

// ── Heatmap Calendar (35 days, GitHub-style) ─────────────────
function FrequencyHeatmap({ calorieLog, goal }: { calorieLog: { date: string; calories: number }[]; goal: number }) {
  const days = useMemo(() => {
    const result = [];
    const today = new Date();
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = calorieLog.find(e => e.date === dateStr);
      const met = entry ? entry.calories >= goal : false;
      const partial = entry ? entry.calories > 0 && entry.calories < goal : false;
      result.push({ dateStr, met, partial, isToday: i === 0, dayNum: d.getDate() });
    }
    return result;
  }, [calorieLog, goal]);

  const weekLabels = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

  return (
    <div>
      {/* Week day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekLabels.map((l, i) => (
          <div key={i} className="text-center" style={{ color: TEXT3, fontSize: 9, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{l}</div>
        ))}
      </div>
      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            className="aspect-square"
            style={{
              borderRadius: 3,
              backgroundColor: day.met ? PRIMARY : day.partial ? 'rgba(30,64,175,0.3)' : SURFACE2,
              outline: day.isToday ? `2px solid ${PRIMARY}` : 'none',
              outlineOffset: 1,
            }}
            title={`${day.dateStr}${day.met ? ' ✓ Meta atingida' : ''}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-3 mt-2">
        <div className="flex items-center gap-1">
          <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: SURFACE2 }} />
          <span style={{ color: TEXT3, fontSize: 9, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Sem registro</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: PRIMARY }} />
          <span style={{ color: TEXT3, fontSize: 9, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Meta atingida</span>
        </div>
      </div>
    </div>
  );
}

// ── FAB ───────────────────────────────────────────────────────
function FAB({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="fixed z-30 flex items-center gap-2 px-5 py-3.5 shadow-lg"
      style={{
        bottom: 80,   // clears the 64px nav + 16px breathing room
        right: 20,
        backgroundColor: PRIMARY,
        borderRadius: 100,
        boxShadow: `0 4px 20px rgba(30,64,175,0.4)`,
      }}
    >
      <Plus size={18} className="text-white" />
      <span className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{label}</span>
    </button>
  );
}

// ── Bottom Sheet ──────────────────────────────────────────────
function BottomSheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1200] flex items-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full z-10"
            style={{ backgroundColor: SURFACE, borderRadius: '16px 16px 0 0', border: `1px solid ${BORDER}`, padding: '24px 20px 48px' }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-6" style={{ backgroundColor: BORDER }} />
            <h3 className="text-white mb-6" style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h3>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InputField({ label, value, onChange, unit, placeholder }: { label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string }) {
  return (
    <div className="mb-4">
      <label style={{ color: TEXT2, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 text-white outline-none bg-transparent"
          style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', fontSize: 15, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        />
        {unit && <span style={{ color: TEXT2, fontSize: 13, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{unit}</span>}
      </div>
    </div>
  );
}

// ── History View ─────────────────────────────────────────────
function HistoryView({
  title, data, dataKey, unit, onBack, color,
}: {
  title: string; data: { date: string; value: number }[]; dataKey: string; unit: string; onBack: () => void; color?: string;
}) {
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} transition={{ duration: 0.25 }} style={{ backgroundColor: BG, minHeight: '100vh', paddingBottom: 120 }}>
      {/* Nav */}
      <div className="px-5 pt-4 pb-4 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10 }}>
          <ChevronLeft size={18} className="text-white" />
        </button>
        <h1 className="text-white" style={{ fontSize: 18, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{title}</h1>
      </div>

      {/* Chart */}
      <div className="px-5 mb-6">
        <div style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 12px 12px' }}>
          <p style={{ color: TEXT2, fontSize: 11, fontWeight: 400, paddingLeft: 8, marginBottom: 16, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Últimos Registros</p>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color ?? PRIMARY} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={color ?? PRIMARY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={BORDER} strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="date" stroke="transparent" tick={{ fill: TEXT3, fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis stroke="transparent" tick={{ fill: TEXT3, fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="value" name={dataKey} stroke={color ?? PRIMARY} strokeWidth={2} fill="url(#areaGrad)" dot={{ r: 3, fill: color ?? PRIMARY, strokeWidth: 0 }} activeDot={{ r: 5, fill: color ?? PRIMARY, stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Log list */}
      <div className="px-5">
        <p style={{ color: TEXT2, fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', marginBottom: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>HISTÓRICO</p>
        <div className="space-y-2">
          {[...data].reverse().map((entry, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10 }}>
              <span style={{ color: TEXT2, fontSize: 13, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{entry.date}</span>
              <span className="text-white" style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{entry.value} <span style={{ color: TEXT2, fontWeight: 400, fontSize: 12 }}>{unit}</span></span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Mock initial data ─────────────────────────────────────────
const INITIAL_WEIGHT_HISTORY = [
  { date: '01/02', value: 80.0 },
  { date: '05/02', value: 79.5 },
  { date: '09/02', value: 79.0 },
  { date: '14/02', value: 78.5 },
  { date: '20/02', value: 78.1 },
];
const INITIAL_FAT_HISTORY = [
  { date: '01/02', value: 16.2 },
  { date: '05/02', value: 15.8 },
  { date: '09/02', value: 15.2 },
  { date: '14/02', value: 14.6 },
  { date: '20/02', value: 14.2 },
];
const CALORIE_GOAL = 2500;
const TODAY = new Date().toISOString().split('T')[0];

function buildInitialCalLog(): { date: string; calories: number }[] {
  const log = [];
  for (let i = 30; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    // Simulate: met goal 65% of days
    const met = Math.random() > 0.35;
    log.push({ date: dateStr, calories: met ? Math.floor(2400 + Math.random() * 300) : Math.floor(1200 + Math.random() * 1000) });
  }
  return log;
}

const INITIAL_CAL_LOG = buildInitialCalLog();

// ── Courses in progress ───────────────────────────────────────
const IN_PROGRESS_COURSES = [
  { id: 1, title: 'Dominação Absoluta', subtitle: 'Controle Total', progress: 45, image: imgImageDominacaoAbsoluta, lessons: 12, done: 5 },
  { id: 2, title: 'Arte Da Conquista', subtitle: 'Sedução Refinada', progress: 72, image: imgImageArteDaConquista, lessons: 18, done: 13 },
  { id: 3, title: 'Psicologia Dark', subtitle: 'Manipulação Ética', progress: 18, image: imgImagePsicologiaDark, lessons: 15, done: 3 },
  { id: 4, title: 'Linguagem Corporal', subtitle: 'Presença Alpha', progress: 60, image: imgImageLinguagemCorporal, lessons: 10, done: 6 },
];

// ── Main Component ────────────────────────────────────────────
interface EvolucaoProps { onSelectCourse: (id: number) => void; }

export function Evolucao({ onSelectCourse }: EvolucaoProps) {
  const [activeTab, setActiveTab] = useState<'aprendendo' | 'corpo' | 'dieta' | 'financas'>('aprendendo');

  // ── Corpo state ──
  const [weightHistory, setWeightHistory] = useState(INITIAL_WEIGHT_HISTORY);
  const [fatHistory, setFatHistory] = useState(INITIAL_FAT_HISTORY);
  const [bodyView, setBodyView] = useState<'dashboard' | 'weight' | 'fat' | 'calories'>('dashboard');
  const [showRegisterSheet, setShowRegisterSheet] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newFat, setNewFat] = useState('');
  const [xpFlash, setXpFlash] = useState<string | null>(null);

  const currentWeight = weightHistory[weightHistory.length - 1].value;
  const currentFat = fatHistory[fatHistory.length - 1].value;

  const fireXP = (label: string) => {
    setXpFlash(label);
    setTimeout(() => setXpFlash(null), 2000);
  };

  const saveBodyLog = () => {
    const dateLabel = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    if (newWeight) {
      setWeightHistory(h => [...h, { date: dateLabel, value: parseFloat(newWeight) }]);
    }
    if (newFat) {
      setFatHistory(h => [...h, { date: dateLabel, value: parseFloat(newFat) }]);
    }
    setNewWeight('');
    setNewFat('');
    setShowRegisterSheet(false);
    fireXP('+20 XP VSM');
  };

  // ── Dieta state ──
  const [calorieLog, setCalorieLog] = useState(INITIAL_CAL_LOG);
  const [showAddMealSheet, setShowAddMealSheet] = useState(false);
  const [mealCalories, setMealCalories] = useState('');
  const [mealLabel, setMealLabel] = useState('');

  const todayEntry = calorieLog.find(e => e.date === TODAY);
  const todayCalories = todayEntry?.calories ?? 0;
  const calPercent = Math.min(100, Math.round((todayCalories / CALORIE_GOAL) * 100));

  // Streak calc
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = calorieLog.find(e => e.date === dateStr);
      if (entry && entry.calories >= CALORIE_GOAL) count++;
      else if (i > 0) break;
    }
    return count;
  }, [calorieLog]);

  const streakXPMultiplier = streak >= 21 ? 3 : streak >= 14 ? 2.5 : streak >= 7 ? 2 : 1;

  const addMeal = () => {
    const cal = parseInt(mealCalories);
    if (!cal) return;
    setCalorieLog(prev => {
      const idx = prev.findIndex(e => e.date === TODAY);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], calories: updated[idx].calories + cal };
        return updated;
      }
      return [...prev, { date: TODAY, calories: cal }];
    });
    setMealCalories('');
    setMealLabel('');
    setShowAddMealSheet(false);
    fireXP('+10 XP VSM');
  };

  const calChartData = calorieLog.slice(-10).map(e => ({
    date: e.date.slice(5).replace('-', '/'),
    value: e.calories,
  }));
  
  const historyDataCal = calorieLog.map(e => ({
    date: e.date.slice(5).replace('-', '/'),
    value: e.calories
  }));

  // ── Financas state ──
  const [income, setIncome] = useState(8500);
  const [expenses, setExpenses] = useState(4200);
  const [showFinanceSheet, setShowFinanceSheet] = useState<'income' | 'expense' | null>(null);
  const [financeInput, setFinanceInput] = useState('');
  const savings = income - expenses;
  const SAVINGS_GOAL = 10000;

  const saveFinance = () => {
    const val = parseFloat(financeInput);
    if (!val) return;
    if (showFinanceSheet === 'income') setIncome(val);
    else if (showFinanceSheet === 'expense') setExpenses(val);
    setFinanceInput('');
    setShowFinanceSheet(null);
    fireXP('+10 XP VSM');
  };

  // ── Tabs ──
  const tabs = [
    { id: 'aprendendo' as const, label: 'Aprendendo', Icon: BookOpen },
    { id: 'corpo' as const, label: 'Corpo', Icon: Dumbbell },
    { id: 'dieta' as const, label: 'Dieta', Icon: Utensils },
    { id: 'financas' as const, label: 'Finanças', Icon: DollarSign },
  ];

  // ── Full-screen history views ──
  if (bodyView === 'weight') {
    return <HistoryView title="Histórico De Peso" data={weightHistory} dataKey="weight" unit="kg" onBack={() => setBodyView('dashboard')} color={PRIMARY} />;
  }
  if (bodyView === 'fat') {
    return <HistoryView title="Histórico De Gordura" data={fatHistory} dataKey="fat" unit="%" onBack={() => setBodyView('dashboard')} color="#7C3AED" />;
  }
  if (bodyView === 'calories') {
      return <HistoryView title="Histórico De Calorias" data={historyDataCal} dataKey="calories" unit="kcal" onBack={() => setBodyView('dashboard')} color={PRIMARY} />;
  }

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>

      {/* XP Flash */}
      <AnimatePresence>
        {xpFlash && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-20 left-1/2 z-[999] pointer-events-none"
            style={{ transform: 'translateX(-50%)' }}
          >
            <div className="flex items-center gap-2 px-5 py-3" style={{ backgroundColor: PRIMARY, borderRadius: 100, boxShadow: '0 4px 20px rgba(30,64,175,0.5)' }}>
              <Zap size={14} fill="white" className="text-white" />
              <span className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{xpFlash}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(to bottom, #0A1220, ${BG})` }}>
        <h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.3, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Evoluir</h1>
        <p style={{ color: TEXT2, fontSize: 13, fontWeight: 400, lineHeight: 1.5, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Logs De Performance</p>
      </div>

      {/* VSM Score Section */}
      <div className="px-5 mb-6">
          <div className="p-4" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
              <div className="flex items-center justify-between mb-2">
                  <span className="text-white" style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Seu VSM: 76</span>
                  <span style={{ color: PRIMARY, fontSize: 12, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Nível 8</span>
              </div>
              <div className="w-full h-2" style={{ backgroundColor: SURFACE2, borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '76%' }}
                    transition={{ duration: 1 }}
                    style={{ height: '100%', backgroundColor: PRIMARY, borderRadius: 4 }}
                  />
              </div>
          </div>
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
                className="flex-shrink-0 flex items-center justify-center gap-1.5 py-2 px-4"
                style={{
                  borderRadius: 100,
                  backgroundColor: active ? PRIMARY : 'transparent',
                  color: active ? '#fff' : TEXT2,
                  fontSize: 12,
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                  fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── APRENDENDO ── */}
      {activeTab === 'aprendendo' && (
        <div className="px-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white" style={{ fontSize: 16, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Cursos Em Andamento</h2>
            <span style={{ color: TEXT3, fontSize: 12, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{IN_PROGRESS_COURSES.length} cursos</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {IN_PROGRESS_COURSES.map(course => {
              const src = typeof course.image === 'string' ? course.image : (course.image as any)?.src ?? course.image;
              return (
                <button
                  key={course.id}
                  onClick={() => onSelectCourse(course.id)}
                  className="text-left group"
                >
                  <div
                    className="relative overflow-hidden"
                    style={{ aspectRatio: '9/16', borderRadius: 12, border: `1px solid ${BORDER}` }}
                  >
                    {/* Photo */}
                    <img
                      src={src}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Cold overlay */}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,0.55) 50%, rgba(30,64,175,0.08) 100%)' }}
                    />

                    {/* Progress badge — top right */}
                    <div className="absolute top-3 right-3">
                      <span style={{ backgroundColor: 'rgba(30,64,175,0.85)', backdropFilter: 'blur(8px)', borderRadius: 6, color: '#fff', fontSize: 9, fontWeight: 500, padding: '2px 7px', display: 'inline-block', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {course.progress}%
                      </span>
                    </div>

                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p style={{ color: '#93C5FD', fontSize: 10, fontWeight: 500, letterSpacing: '0.03em', lineHeight: 1.5, marginBottom: 4, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {course.subtitle}
                      </p>
                      <h4 className="text-white mb-3" style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.3, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {course.title}
                      </h4>

                      {/* Progress bar */}
                      <div className="w-full h-1 mb-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 3 }}>
                        <motion.div
                          style={{ height: '100%', backgroundColor: PRIMARY, borderRadius: 3 }}
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span style={{ color: TEXT3, fontSize: 10, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                          {course.done}/{course.lessons} aulas
                        </span>
                        <div className="flex items-center gap-1">
                          <Play size={10} style={{ color: PRIMARY }} fill={PRIMARY} />
                          <span style={{ color: '#93C5FD', fontSize: 10, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Continuar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CORPO ── */}
      {activeTab === 'corpo' && (
        <div className="px-5">
          <SectionTitle>Medidas Corporais</SectionTitle>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <MetricCard label="Peso Atual" value={currentWeight} unit="kg" sub={`Meta: 72 kg`} onClick={() => setBodyView('weight')} />
            <MetricCard label="Gordura Corporal" value={currentFat} unit="%" sub={`Ref: < 12%`} onClick={() => setBodyView('fat')} />
          </div>

          {/* Mini weight chart */}
          <div className="mb-5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '20px 12px 12px' }}>
            <div className="flex items-center justify-between px-2 mb-4">
              <p className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Evolução Do Peso</p>
              <span style={{ color: '#93C5FD', fontSize: 11, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {currentWeight < INITIAL_WEIGHT_HISTORY[0].value ? '↓' : '↑'} {Math.abs(currentWeight - INITIAL_WEIGHT_HISTORY[0].value).toFixed(1)} kg
              </span>
            </div>
            <div style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={weightHistory} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke={BORDER} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="date" stroke="transparent" tick={{ fill: TEXT3, fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="transparent" tick={{ fill: TEXT3, fontSize: 9 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="value" name="weight" stroke={PRIMARY} strokeWidth={2} dot={{ r: 3, fill: PRIMARY, strokeWidth: 0 }} activeDot={{ r: 5, fill: PRIMARY, stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress to goal */}
          <div style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Progresso Para A Meta</p>
              <span style={{ color: TEXT2, fontSize: 11, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>72 kg</span>
            </div>
            <div className="w-full h-1.5 mb-2" style={{ backgroundColor: BORDER, borderRadius: 4 }}>
              <motion.div
                style={{ height: '100%', backgroundColor: PRIMARY, borderRadius: 4 }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, (1 - (currentWeight - 72) / (INITIAL_WEIGHT_HISTORY[0].value - 72)) * 100))}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <p style={{ color: TEXT3, fontSize: 11, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{(currentWeight - 72).toFixed(1)} kg restantes para a meta</p>
          </div>

          <FAB onClick={() => setShowRegisterSheet(true)} label="Registrar Medidas" />
        </div>
      )}

      {/* ── DIETA ── */}
      {activeTab === 'dieta' && (
        <div className="px-5">
          {/* Streak */}
          <div className="flex items-center gap-3 mb-5 px-4 py-3" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: streak >= 7 ? 'rgba(30,64,175,0.15)' : SURFACE2 }}>
              <Flame size={18} style={{ color: streak >= 7 ? PRIMARY : TEXT3 }} />
            </div>
            <div className="flex-1">
              <p className="text-white" style={{ fontSize: 14, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {streak} {streak === 1 ? 'dia' : 'dias'} consecutivos
              </p>
              <p style={{ color: TEXT2, fontSize: 11, fontWeight: 400, lineHeight: 1.5, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {streak >= 7
                  ? `Multiplicador de XP ativo: ×${streakXPMultiplier}`
                  : `${7 - streak} dias para desbloquear ×2 XP`}
              </p>
            </div>
            {streak >= 7 && (
              <div className="px-2.5 py-1 flex items-center gap-1" style={{ backgroundColor: PRIMARY, borderRadius: 6 }}>
                <Zap size={11} fill="white" className="text-white" />
                <span className="text-white" style={{ fontSize: 10, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>×{streakXPMultiplier}</span>
              </div>
            )}
          </div>

          {/* Daily card */}
          <MetricCard 
             label="Calorias Hoje" 
             value={todayCalories.toLocaleString()} 
             unit="kcal" 
             sub={`${calPercent}% da meta`} 
             onClick={() => setBodyView('calories')}
          />
          <div className="h-5"></div>

          {/* Frequency heatmap */}
          <div className="mb-5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
            <p className="text-white mb-4" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Calendário De Consistência</p>
            <FrequencyHeatmap calorieLog={calorieLog} goal={CALORIE_GOAL} />
          </div>

          <FAB onClick={() => setShowAddMealSheet(true)} label="Adicionar Refeição" />
        </div>
      )}

      {/* ── FINANÇAS ── */}
      {activeTab === 'financas' && (
        <div className="px-5 space-y-3">
          <SectionTitle>Finanças</SectionTitle>

          <div className="grid grid-cols-2 gap-3">
            {/* Income */}
            <button onClick={() => { setFinanceInput(String(income)); setShowFinanceSheet('income'); }} className="text-left p-5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={13} style={{ color: SUCCESS }} />
                <span style={{ color: TEXT2, fontSize: 11, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Receita</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white" style={{ fontSize: 22, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>R$ {income.toLocaleString()}</span>
              </div>
              <span style={{ color: SUCCESS, fontSize: 11, fontWeight: 500, display: 'block', marginTop: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>+12% vs anterior</span>
              <span style={{ color: '#93C5FD', fontSize: 10, fontWeight: 500, marginTop: 6, display: 'block', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Toque para editar</span>
            </button>

            {/* Expenses */}
            <button onClick={() => { setFinanceInput(String(expenses)); setShowFinanceSheet('expense'); }} className="text-left p-5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={13} style={{ color: DANGER, transform: 'scaleY(-1)' }} />
                <span style={{ color: TEXT2, fontSize: 11, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Gastos</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-white" style={{ fontSize: 22, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>R$ {expenses.toLocaleString()}</span>
              </div>
              <span style={{ color: DANGER, fontSize: 11, fontWeight: 500, display: 'block', marginTop: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {Math.round((expenses / income) * 100)}% da receita
              </span>
              <span style={{ color: '#93C5FD', fontSize: 10, fontWeight: 500, marginTop: 6, display: 'block', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Toque para editar</span>
            </button>
          </div>

          {/* Savings */}
          <div style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p style={{ color: TEXT2, fontSize: 11, fontWeight: 400, marginBottom: 6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Poupança Este Mês</p>
                <div className="flex items-baseline gap-1">
                  <span style={{ color: savings >= 0 ? SUCCESS : DANGER, fontSize: 28, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {savings >= 0 ? '+' : ''}R$ {Math.abs(savings).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p style={{ color: TEXT2, fontSize: 11, fontWeight: 400, marginBottom: 2, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Meta</p>
                <p style={{ color: PRIMARY, fontSize: 15, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>R$ {SAVINGS_GOAL.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-full h-2 mb-2" style={{ backgroundColor: BORDER, borderRadius: 4 }}>
              <motion.div
                style={{ height: '100%', backgroundColor: savings >= SAVINGS_GOAL ? SUCCESS : PRIMARY, borderRadius: 4 }}
                animate={{ width: `${Math.min(100, Math.max(0, (savings / SAVINGS_GOAL) * 100))}%` }}
                transition={{ duration: 0.7 }}
              />
            </div>
            <p style={{ color: TEXT3, fontSize: 11, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {Math.round(Math.max(0, (savings / SAVINGS_GOAL) * 100))}% da meta{savings >= SAVINGS_GOAL ? ' · Meta atingida' : ''}
            </p>
          </div>

          {/* Net */}
          <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
            <p style={{ color: TEXT2, fontSize: 13, fontWeight: 400, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Saldo Líquido</p>
            <span style={{ color: savings >= 0 ? SUCCESS : DANGER, fontSize: 16, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {savings >= 0 ? '+' : ''}R$ {Math.abs(savings).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* ── BOTTOM SHEETS ── */}

      {/* Register body measures */}
      <BottomSheet open={showRegisterSheet} onClose={() => setShowRegisterSheet(false)} title="Registrar Medidas">
        <InputField label="Peso" value={newWeight} onChange={setNewWeight} unit="kg" placeholder="Ex: 78.5" />
        <InputField label="Gordura Corporal" value={newFat} onChange={setNewFat} unit="%" placeholder="Ex: 14.2" />
        <button
          onClick={saveBodyLog}
          className="w-full py-4 text-white mt-2"
          style={{ backgroundColor: PRIMARY, borderRadius: 10, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Salvar Registro
        </button>
      </BottomSheet>

      {/* Add meal */}
      <BottomSheet open={showAddMealSheet} onClose={() => setShowAddMealSheet(false)} title="Adicionar Refeição">
        <InputField label="Descrição (opcional)" value={mealLabel} onChange={setMealLabel} placeholder="Ex: Almoço, Café da manhã..." />
        <InputField label="Calorias" value={mealCalories} onChange={setMealCalories} unit="kcal" placeholder="Ex: 600" />
        <button
          onClick={addMeal}
          className="w-full py-4 text-white mt-2"
          style={{ backgroundColor: PRIMARY, borderRadius: 10, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Adicionar Ao Log
        </button>
      </BottomSheet>

      {/* Finance edit */}
      <BottomSheet
        open={showFinanceSheet !== null}
        onClose={() => setShowFinanceSheet(null)}
        title={showFinanceSheet === 'income' ? 'Editar Receita' : 'Editar Gastos'}
      >
        <InputField
          label={showFinanceSheet === 'income' ? 'Receita Mensal' : 'Gastos Mensais'}
          value={financeInput}
          onChange={setFinanceInput}
          unit="R$"
          placeholder="Ex: 8500"
        />
        <button
          onClick={saveFinance}
          className="w-full py-4 text-white mt-2"
          style={{ backgroundColor: PRIMARY, borderRadius: 10, fontSize: 14, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        >
          Salvar
        </button>
      </BottomSheet>
    </div>
  );
}