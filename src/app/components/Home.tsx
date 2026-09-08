import { ArrowRight, Calendar, MapPin, Play, TrendingUp, Eye, Zap } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

import imgImageDominacaoAbsoluta from "figma:asset/9d0b0475eccd0337994da6766bb60e9be4982b13.png";
import imgImageArteDaConquista from "figma:asset/85bb2779d47fe59ded6690ec8da200446d0a5024.png";
import imgImagePsicologiaDark from "figma:asset/e5a64e3be5e34ec4cec4aa5c50b48f504b380c62.png";
import imgImageLinguagemCorporal from "figma:asset/337640c5cf08e0ad9c23e8ae900fd272e0d526d6.png";
import imgImageStorytellingAvancado from "figma:asset/a03b26e01c9e37942fa239356e6fab2f6c5e59cb.png";
import imgImageFrameControl from "figma:asset/a1d81e5262848e5e04280b59f72fc7b1f64f4009.png";
import imgImageAtracaoDeAltoValor from "figma:asset/1ef4b41b9a29b7b0c38daa419f9f81b4bbae7378.png";
import imgImageCalibracaoSocial from "figma:asset/d265452ca2c553032e02af622bb2c15f7446b618.png";

// Design tokens
const BG = '#121212';
const SURFACE = '#1E1E1E';
const BORDER = '#2A2A2A';
const PRIMARY = '#1E40AF';
const TEXT_SECONDARY = '#9E9E9E';
const TEXT_TERTIARY = '#666666';

interface HomeProps {
  onNavigateToCourse: (courseId: number) => void;
  onNavigateToAgenda?: () => void;
}

const ongoingCourses = [
  { id: 1, title: 'Dominação Absoluta', subtitle: 'Controle Total', progress: 45, image: imgImageDominacaoAbsoluta },
  { id: 2, title: 'Arte Da Conquista', subtitle: 'Sedução Refinada', progress: 72, image: imgImageArteDaConquista },
  { id: 3, title: 'Psicologia Dark', subtitle: 'Manipulação Ética', progress: 18, image: imgImagePsicologiaDark },
  { id: 4, title: 'Linguagem Corporal', subtitle: 'Presença Alpha', progress: 60, image: imgImageLinguagemCorporal },
];

const newCourses = [
  { id: 5, title: 'Storytelling Avançado', subtitle: 'Narrativas Poderosas', image: imgImageStorytellingAvancado },
  { id: 6, title: 'Frame Control', subtitle: 'Domínio De Situações', image: imgImageFrameControl },
  { id: 7, title: 'Atração De Alto Valor', subtitle: 'Magnetismo Pessoal', image: imgImageAtracaoDeAltoValor },
  { id: 8, title: 'Calibração Social', subtitle: 'Inteligência De Campo', image: imgImageCalibracaoSocial },
];

const upcomingEvents = [
  { id: 1, name: 'Isabela', date: 'Sex, 21 Fev', time: '20:00', location: 'Bar Astor', confirmed: true },
  { id: 2, name: 'Camila', date: 'Sáb, 22 Fev', time: '18:30', location: 'Parque Ibirapuera', confirmed: false },
];

const metrics = [
  { title: 'Valor Social', value: 82, Icon: TrendingUp },
  { title: 'Pré-seleção', value: 71, Icon: Eye },
  { title: 'Presença', value: 79, Icon: Zap },
];

const vsmLevel = 76;
const vsmData = [{ value: vsmLevel, fill: PRIMARY }];

// Reusable section label
function SectionLabel({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2
        className="text-white"
        style={{ fontSize: 16, fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.5 }}
      >
        {title}
      </h2>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-1"
          style={{ color: PRIMARY, fontSize: 12, fontWeight: 500 }}
        >
          {action} <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}

// Reusable 9:16 course card
function CourseCard916({
  title, subtitle, image, progress, tag, onClick,
}: {
  title: string; subtitle: string; image: string | { src?: string } | any;
  progress?: number; tag?: string; onClick: () => void;
}) {
  const src = typeof image === 'string' ? image : (image?.src ?? image);
  return (
    <button onClick={onClick} className="text-left group flex-shrink-0 w-[52vw] snap-start md:w-full md:flex-shrink">
      <div
        className="relative overflow-hidden"
        style={{ borderRadius: 12, border: `1px solid ${BORDER}`, aspectRatio: '9/16' }}
      >
        <img
          src={src}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {/* Cold overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,0.55) 50%, rgba(30,64,175,0.08) 100%)' }}
        />

        {/* Tag / badge */}
        {tag && (
          <div className="absolute top-3 right-3">
            <span style={{ backgroundColor: PRIMARY, borderRadius: 6, color: '#fff', fontSize: 9, fontWeight: 500, letterSpacing: '0.04em', padding: '2px 7px', display: 'inline-block' }}>
              {tag}
            </span>
          </div>
        )}

        {/* Progress badge */}
        {progress !== undefined && (
          <div className="absolute top-3 right-3">
            <span style={{ backgroundColor: 'rgba(30,64,175,0.85)', backdropFilter: 'blur(8px)', borderRadius: 6, color: '#fff', fontSize: 9, fontWeight: 500, padding: '2px 7px', display: 'inline-block' }}>
              {progress}%
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p style={{ color: '#93C5FD', fontSize: 10, fontWeight: 500, letterSpacing: '0.03em', lineHeight: 1.5, marginBottom: 4 }}>
            {subtitle}
          </p>
          <h4 className="text-white mb-4" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3, letterSpacing: '0.02em' }}>
            {title}
          </h4>

          {progress !== undefined ? (
            <>
              <div className="w-full h-1 mb-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4 }}>
                <div className="h-full" style={{ width: `${progress}%`, backgroundColor: PRIMARY, borderRadius: 4 }} />
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: TEXT_SECONDARY, fontSize: 10, fontWeight: 400 }}>Progresso</span>
                <div className="flex items-center gap-1">
                  <Play size={11} style={{ color: PRIMARY }} fill={PRIMARY} />
                  <span style={{ color: '#93C5FD', fontSize: 10, fontWeight: 500 }}>Continuar</span>
                </div>
              </div>
            </>
          ) : (
            <div
              className="py-2.5 text-center"
              style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              Iniciar
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export function Home({ onNavigateToCourse, onNavigateToAgenda }: HomeProps) {
  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div
        className="px-5 pt-4 pb-6"
        style={{ background: `linear-gradient(to bottom, #0A1220, ${BG})` }}
      >
        <p style={{ color: TEXT_SECONDARY, fontSize: 13, fontWeight: 400, lineHeight: 1.5, marginBottom: 2 }}>
          Bem-vindo de volta, João
        </p>
        <h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.3 }}>
          Iniciar
        </h1>
        <p style={{ color: '#93C5FD', fontSize: 13, fontWeight: 500 }}>
          Vsm Atual: <span className="text-white">{vsmLevel}</span> · Status: Elite
        </p>
      </div>

      {/* ── EM ANDAMENTO ── */}
      <div className="px-5 mb-8">
        <SectionLabel title="Em Andamento" action={`${ongoingCourses.length} cursos`} />
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-x-visible md:snap-none">
          {ongoingCourses.map(c => (
            <CourseCard916 key={c.id} {...c} onClick={() => onNavigateToCourse(c.id)} />
          ))}
        </div>
      </div>

      {/* ── NOVOS CURSOS ── */}
      <div className="px-5 mb-8">
        <SectionLabel title="Novos Cursos" action="Ver Todos" />
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-x-visible md:snap-none">
          {newCourses.map(c => (
            <CourseCard916 key={c.id} {...c} tag="Novo" onClick={() => onNavigateToCourse(c.id)} />
          ))}
        </div>
      </div>

      {/* ── AGENDA DA SEMANA ── */}
      <div className="px-5 mb-8">
        <SectionLabel title="Agenda Da Semana" action="Ver Agenda" onAction={onNavigateToAgenda} />
        <div className="space-y-2">
          {upcomingEvents.map(event => (
            <button
              key={event.id}
              onClick={onNavigateToAgenda}
              className="w-full text-left flex items-center gap-3 px-4 py-3.5 transition-colors"
              style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(30,64,175,0.15)' }}
              >
                <Calendar size={16} style={{ color: PRIMARY }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white" style={{ fontSize: 13, fontWeight: 500 }}>{event.name}</p>
                  {event.confirmed && (
                    <span style={{ backgroundColor: '#14532D', color: '#86EFAC', fontSize: 9, fontWeight: 500, borderRadius: 4, padding: '1px 6px', letterSpacing: '0.04em' }}>
                      CONFIRMADO
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ color: TEXT_SECONDARY, fontSize: 11, fontWeight: 400 }}>{event.date} · {event.time}</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={10} style={{ color: TEXT_TERTIARY }} />
                    <span style={{ color: TEXT_TERTIARY, fontSize: 11, fontWeight: 400 }}>{event.location}</span>
                  </div>
                </div>
              </div>
              <ArrowRight size={14} style={{ color: TEXT_TERTIARY }} />
            </button>
          ))}
        </div>
      </div>

      {/* ── VSM METER ── */}
      <div className="px-5 mb-6">
        <SectionLabel title="Nível Vsm" />
        <div style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-white" style={{ fontSize: 15, fontWeight: 500, letterSpacing: '0.02em' }}>Valor Sexual de Mercado</p>
              <p style={{ color: '#93C5FD', fontSize: 12, fontWeight: 500, marginTop: 2 }}>Status: Elite</p>
            </div>
            <div className="text-right">
              <div style={{ color: PRIMARY, fontSize: 36, fontWeight: 500 }}>{vsmLevel}</div>
              <p style={{ color: TEXT_TERTIARY, fontSize: 11, fontWeight: 400 }}>de 100</p>
            </div>
          </div>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height={140}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={16} data={vsmData} startAngle={180} endAngle={0}>
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar background={{ fill: BORDER }} dataKey="value" cornerRadius={8} fill={PRIMARY} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── MÉTRICAS ── */}
      <div className="px-5">
        <div className="grid grid-cols-3 gap-3">
          {metrics.map(({ title, value, Icon }) => (
            <div key={title} style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
              <div className="flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2.5" style={{ backgroundColor: 'rgba(30,64,175,0.15)' }}>
                  <Icon size={16} style={{ color: PRIMARY }} />
                </div>
                <p style={{ color: PRIMARY, fontSize: 20, fontWeight: 500, marginBottom: 2 }}>{value}</p>
                <p style={{ color: TEXT_SECONDARY, fontSize: 10, fontWeight: 400, lineHeight: 1.4 }}>{title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
