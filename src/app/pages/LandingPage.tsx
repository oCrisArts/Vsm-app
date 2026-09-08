import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, Shield, BookOpen, TrendingUp, Calendar, Library,
  Play, Zap, MapPin, Headphones, FileText, ChevronRight,
  CheckCircle2,
} from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

import imgDominacao   from "figma:asset/9d0b0475eccd0337994da6766bb60e9be4982b13.png";
import imgConquista   from "figma:asset/85bb2779d47fe59ded6690ec8da200446d0a5024.png";
import imgPsicologia  from "figma:asset/e5a64e3be5e34ec4cec4aa5c50b48f504b380c62.png";
import imgLinguagem   from "figma:asset/337640c5cf08e0ad9c23e8ae900fd272e0d526d6.png";
import imgStorytelling from "figma:asset/a03b26e01c9e37942fa239356e6fab2f6c5e59cb.png";
import imgFrameControl from "figma:asset/a1d81e5262848e5e04280b59f72fc7b1f64f4009.png";

// ── Design tokens (identical to app) ──────────────────────────
const BG      = '#121212';
const SURFACE  = '#1E1E1E';
const SURFACE2 = '#252525';
const BORDER   = '#2A2A2A';
const PRIMARY  = '#1E40AF';
const ACCENT   = '#4169FF';
const TEXT2    = '#9E9E9E';
const TEXT3    = '#666666';

// ── Reusable mini components ──────────────────────────────────

function StageBadge({ label, bg, color }: { label: string; bg: string; color: string }) {
  return (
    <span style={{ backgroundColor: bg, color, fontSize: 9, fontWeight: 500, borderRadius: 6, padding: '2px 7px', letterSpacing: '0.04em', display: 'inline-block' }}>
      {label}
    </span>
  );
}

// ── App Mockup — CRM Tab ──────────────────────────────────────

function MockupCRM() {
  const contacts = [
    { name: 'Isabela', age: 24, stage: 'Encontro Solicitado', stageBg: '#14532D', stageColor: '#86EFAC', progress: 88, platform: 'Tinder', photo: 'https://images.unsplash.com/photo-1621012649112-d1724740b0da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', date: 'Sex 21 Fev · Bar Astor' },
    { name: 'Camila', age: 26, stage: 'Conforto Estabelecido', stageBg: '#1E3A5F', stageColor: '#93C5FD', progress: 68, platform: 'Instagram', photo: 'https://images.unsplash.com/photo-1749700332031-cf99864959ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', date: null },
    { name: 'Fernanda', age: 23, stage: 'Conversa Fluindo', stageBg: '#1C2B1A', stageColor: '#86EFAC', progress: 42, platform: 'Bumble', photo: 'https://images.unsplash.com/photo-1630845175575-b5c2495cb409?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400', date: null },
  ];

  return (
    <div style={{ backgroundColor: BG, borderRadius: 16, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
      {/* Mini header */}
      <div className="px-4 py-3" style={{ background: 'linear-gradient(to bottom, #0A1220, #121212)' }}>
        <p style={{ color: PRIMARY, fontSize: 10, fontWeight: 500, marginBottom: 2 }}>CRM SOCIAL</p>
        <h3 className="text-white" style={{ fontSize: 18, fontWeight: 500 }}>Conectar</h3>
      </div>

      {/* Contact cards */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-2">
        {contacts.map(c => (
          <div key={c.name} className="relative overflow-hidden" style={{ aspectRatio: '9/16', borderRadius: 10, border: `1px solid ${BORDER}` }}>
            <ImageWithFallback src={c.photo} alt={c.name} className="absolute inset-0 w-full h-full object-cover object-top" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,0.55) 50%, transparent 100%)' }} />
            <div className="absolute top-2 left-1.5">
              <span style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', color: '#CCC', fontSize: 7, fontWeight: 400, borderRadius: 4, padding: '1px 4px' }}>{c.platform}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <div className="inline-flex items-center px-1.5 py-0.5 mb-1" style={{ backgroundColor: c.stageBg, borderRadius: 4 }}>
                <span style={{ color: c.stageColor, fontSize: 6, fontWeight: 500 }}>{c.stage.split(' ')[0]}</span>
              </div>
              <p className="text-white" style={{ fontSize: 10, fontWeight: 500, lineHeight: 1.2, marginBottom: 1 }}>{c.name}, {c.age}</p>
              {c.date && (
                <div className="flex items-center gap-0.5">
                  <MapPin size={7} style={{ color: '#93C5FD' }} />
                  <span style={{ color: '#93C5FD', fontSize: 7, fontWeight: 400 }}>Confirmado</span>
                </div>
              )}
              <div className="w-full h-0.5 mt-1 mb-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 2 }}>
                <div style={{ height: '100%', width: `${c.progress}%`, backgroundColor: PRIMARY, borderRadius: 2 }} />
              </div>
              <div className="flex justify-between">
                <span style={{ color: TEXT3, fontSize: 7 }}>Match</span>
                <span style={{ color: '#93C5FD', fontSize: 7, fontWeight: 500 }}>{c.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App Mockup — VSM Tab ──────────────────────────────────────

function MockupVSM() {
  const vsm = 76;
  const metrics = [
    { label: 'Valor Social', value: 82, color: PRIMARY },
    { label: 'Pré-seleção', value: 71, color: '#7C3AED' },
    { label: 'Presença', value: 79, color: '#00C97E' },
  ];

  return (
    <div style={{ backgroundColor: BG, borderRadius: 16, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
      {/* Mini header */}
      <div className="px-4 py-3" style={{ background: 'linear-gradient(to bottom, #0A1220, #121212)' }}>
        <p style={{ color: TEXT2, fontSize: 10, fontWeight: 400, marginBottom: 2 }}>LOGS DE PERFORMANCE</p>
        <h3 className="text-white" style={{ fontSize: 18, fontWeight: 500 }}>Evoluir</h3>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {/* VSM Score */}
        <div className="p-3" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-white" style={{ fontSize: 11, fontWeight: 500 }}>Seu VSM</p>
              <p style={{ color: '#93C5FD', fontSize: 9, fontWeight: 500 }}>Status: Elite</p>
            </div>
            <span style={{ color: PRIMARY, fontSize: 28, fontWeight: 500, lineHeight: 1 }}>{vsm}</span>
          </div>
          <div className="w-full h-1.5" style={{ backgroundColor: SURFACE2, borderRadius: 3 }}>
            <motion.div
              style={{ height: '100%', backgroundColor: PRIMARY, borderRadius: 3 }}
              initial={{ width: 0 }}
              animate={{ width: `${vsm}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span style={{ color: TEXT3, fontSize: 8 }}>Nível 8</span>
            <span style={{ color: TEXT3, fontSize: 8 }}>de 100</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2">
          {metrics.map(m => (
            <div key={m.label} className="p-2 text-center" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10 }}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{ backgroundColor: m.color + '20' }}>
                <Zap size={10} style={{ color: m.color }} />
              </div>
              <p style={{ color: m.color, fontSize: 14, fontWeight: 500 }}>{m.value}</p>
              <p style={{ color: TEXT2, fontSize: 8, fontWeight: 400, lineHeight: 1.3 }}>{m.label}</p>
            </div>
          ))}
        </div>

        {/* Tab strip */}
        <div className="flex gap-1">
          {['Aprendendo', 'Corpo', 'Dieta', 'Finanças'].map((t, i) => (
            <div key={t} className="flex-shrink-0 px-2.5 py-1" style={{ borderRadius: 100, backgroundColor: i === 0 ? PRIMARY : 'transparent', color: i === 0 ? '#fff' : TEXT3, fontSize: 8, fontWeight: 500 }}>{t}</div>
          ))}
        </div>

        {/* Course progress cards */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { title: 'Dominação Absoluta', pct: 45, img: imgDominacao },
            { title: 'Arte Da Conquista', pct: 72, img: imgConquista },
          ].map(c => {
            const src = typeof c.img === 'string' ? c.img : (c.img as any)?.src ?? c.img;
            return (
              <div key={c.title} className="relative overflow-hidden" style={{ aspectRatio: '9/14', borderRadius: 8, border: `1px solid ${BORDER}` }}>
                <img src={src} alt={c.title} className="absolute inset-0 w-full h-full object-cover object-top" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,0.55) 60%, transparent 100%)' }} />
                <div className="absolute top-1.5 right-1.5">
                  <span style={{ backgroundColor: 'rgba(30,64,175,0.85)', borderRadius: 4, color: '#fff', fontSize: 7, fontWeight: 500, padding: '1px 5px' }}>{c.pct}%</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white" style={{ fontSize: 9, fontWeight: 500, lineHeight: 1.2, marginBottom: 4 }}>{c.title}</p>
                  <div className="w-full h-0.5" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${c.pct}%`, backgroundColor: PRIMARY, borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── App Mockup — Arsenal Tab ──────────────────────────────────

function MockupArsenal() {
  const items = [
    { type: 'audio', label: 'PNL',       title: 'Hipnose Conversacional', meta: '45 min',  color: '#FF8C42', icon: Headphones, img: 'https://images.unsplash.com/photo-1697739348487-75f668fdb6fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    { type: 'script', label: 'Abordagem', title: 'Abertura Direta',         meta: '15 linhas', color: '#A78BFA', icon: FileText,  img: 'https://images.unsplash.com/photo-1535311631117-da5b8ab9c505?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    { type: 'book',   label: 'Estratégia',title: 'As 48 Leis Do Poder',     meta: '452 pgs', color: '#4169FF', icon: BookOpen,  img: 'https://images.unsplash.com/photo-1728731152406-8390889b2489?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    { type: 'audio',  label: 'Mindset',   title: 'Afirmações De Poder',      meta: '30 min',  color: '#FF8C42', icon: Headphones, img: 'https://images.unsplash.com/photo-1576629679906-08e08bfaed82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    { type: 'script', label: 'Sedução',   title: 'Escalada De Tensão',       meta: '20 linhas', color: '#A78BFA', icon: FileText,  img: 'https://images.unsplash.com/photo-1619198652021-75a0b4ac7462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
    { type: 'book',   label: 'Sedução',   title: 'A Arte Da Sedução',        meta: '420 pgs', color: '#4169FF', icon: BookOpen,  img: 'https://images.unsplash.com/photo-1487252502161-75020a813bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400' },
  ];

  return (
    <div style={{ backgroundColor: BG, borderRadius: 16, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
      {/* Mini header */}
      <div className="px-4 py-3" style={{ background: 'linear-gradient(to bottom, #0D0822, #121212)' }}>
        <p style={{ color: '#A78BFA', fontSize: 10, fontWeight: 500, marginBottom: 2 }}>ARSENAL TÁTICO</p>
        <h3 className="text-white" style={{ fontSize: 18, fontWeight: 500 }}>Consultar</h3>
      </div>

      {/* Category chips */}
      <div className="px-4 pb-2 flex gap-1">
        {['Tudo', 'Áudio', 'Scripts', 'Livros'].map((c, i) => (
          <div key={c} style={{ borderRadius: 100, backgroundColor: i === 0 ? '#7C3AED' : 'transparent', color: i === 0 ? '#fff' : TEXT3, fontSize: 8, fontWeight: 500, padding: '3px 8px', flexShrink: 0 }}>{c}</div>
        ))}
      </div>

      {/* Items grid */}
      <div className="px-4 pb-4 grid grid-cols-3 gap-2">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="relative overflow-hidden" style={{ aspectRatio: '9/14', borderRadius: 10, border: `1px solid ${BORDER}` }}>
              <ImageWithFallback src={item.img} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,0.6) 55%, transparent 100%)' }} />
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded flex items-center justify-center" style={{ backgroundColor: item.color + '30', backdropFilter: 'blur(8px)' }}>
                <Icon size={9} style={{ color: item.color }} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <span style={{ backgroundColor: item.color + '25', color: item.color, fontSize: 6, fontWeight: 500, borderRadius: 3, padding: '1px 4px', display: 'inline-block', marginBottom: 3 }}>{item.label}</span>
                <p className="text-white" style={{ fontSize: 8, fontWeight: 500, lineHeight: 1.2, marginBottom: 2 }}>{item.title}</p>
                <p style={{ color: TEXT3, fontSize: 7, fontWeight: 400 }}>{item.meta}</p>
                <div className="flex items-center gap-1 mt-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 4, padding: '2px 5px' }}>
                  <Play size={7} style={{ color: item.color }} fill={item.color} />
                  <span style={{ color: '#ccc', fontSize: 7, fontWeight: 500 }}>Acessar</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Landing Page ─────────────────────────────────────────

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const NAV_LINKS = [
  { label: 'O Problema',   target: 'section-story'    },
  { label: 'O App',        target: 'section-showcase'  },
  { label: 'A Solução',    target: 'section-pillars'   },
  { label: 'Depoimentos',  target: 'section-proof'     },
];

export function LandingPage() {
  const navigate = useNavigate();

  const heroBg = 'https://images.unsplash.com/photo-1737623342152-b49e12f7ccf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

  const courseCoverImages = [
    { img: imgDominacao, title: 'Dominação\nAbsoluta' },
    { img: imgConquista, title: 'Arte Da\nConquista' },
    { img: imgPsicologia, title: 'Psicologia\nDark' },
    { img: imgLinguagem, title: 'Linguagem\nCorporal' },
    { img: imgStorytelling, title: 'Storytelling\nAvançado' },
    { img: imgFrameControl, title: 'Frame\nControl' },
  ];

  const pillars = [
    {
      Icon: BookOpen,
      color: '#4169FF',
      title: 'Aprender',
      desc: 'Cursos em vídeo sobre frame, sedução e psicologia aplicada. Cada aula é um bloco do seu VSM.',
      stat: '8 cursos',
    },
    {
      Icon: TrendingUp,
      color: '#00C97E',
      title: 'Evoluir',
      desc: 'Dashboard único para peso, gordura, dieta, finanças e pontuação VSM. O que se mede, evolui.',
      stat: '4 pilares',
    },
    {
      Icon: Calendar,
      color: '#FF8C42',
      title: 'Conectar',
      desc: 'CRM social com funil de contatos. Do primeiro abridor ao encontro confirmado — rastreado e planejado.',
      stat: 'Funil ativo',
    },
  ];

  const testimonials = [
    {
      quote: "Ter o script certo na hora certa salvou meus contatos. Meu VSM subiu 15 pontos em um mês.",
      name: "Rafael M.",
      vsm: "VSM 91",
    },
    {
      quote: "Tratar a sedução como um CRM mudou o jogo. Fim do vácuo, fim do ghost. Controle total.",
      name: "Lucas T.",
      vsm: "VSM 84",
    },
  ];

  return (
    <div className="dark" style={{ backgroundColor: BG, fontFamily: 'Plus Jakarta Sans, sans-serif', overflowX: 'hidden' }}>

      {/* ── NAV ─────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
        style={{
          backgroundColor: 'rgba(18,18,18,0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${BORDER}`,
          height: 56,
        }}
        aria-label="Navegação principal"
      >
        {/* Logo */}
        <button
          onClick={() => scrollTo('section-hero')}
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
            <Shield size={14} className="text-white" />
          </div>
          <div className="hidden sm:flex items-baseline gap-1">
            <span className="text-white text-sm" style={{ fontWeight: 500, letterSpacing: '0.06em' }}>CÓDIGO</span>
            <span className="text-sm" style={{ color: ACCENT, fontWeight: 500, letterSpacing: '0.06em' }}>DA SEDUÇÃO</span>
          </div>
        </button>

        {/* Section links — hidden on very small screens */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, target }) => (
            <button
              key={target}
              onClick={() => scrollTo(target)}
              className="px-3 py-1.5 rounded-lg text-xs transition-colors hover:text-white"
              style={{ color: TEXT2, fontWeight: 500, letterSpacing: '0.04em' }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Login CTA */}
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white transition-all"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 500 }}
        >
          Login <ChevronRight size={13} />
        </button>
      </nav>

      {/* ── HEADER — Atenção / Hook ───────────────── */}
      <header
        id="section-hero"
        className="relative min-h-screen flex flex-col justify-end"
        style={{ paddingTop: 56 }}
      >
        {/* Background */}
        <div className="absolute inset-0">
          <ImageWithFallback src={heroBg} alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #121212 0%, rgba(18,18,18,0.85) 40%, rgba(18,18,18,0.4) 100%)' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 pb-16 pt-24 max-w-2xl mx-auto w-full">
          {/* Open loop tag */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-5"
          >
            <Zap size={13} style={{ color: ACCENT }} />
            <span style={{ color: ACCENT, fontSize: 11, fontWeight: 500, letterSpacing: '0.08em' }}>VALOR SEXUAL DE MERCADO</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-white mb-4"
            style={{ fontSize: 'clamp(36px, 8vw, 56px)', fontWeight: 500, lineHeight: 1.1, letterSpacing: '0.01em' }}
          >
            O Jogo Tem Regras.
            <br />
            <span style={{ color: '#93C5FD' }}>Você Sabe a Sua</span>
            <br />
            Pontuação?
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mb-8"
            style={{ color: TEXT2, fontSize: 15, fontWeight: 400, lineHeight: 1.7, maxWidth: 480 }}
          >
            A atração não é sorte, é uma métrica. Descubra como gerenciar seus contatos e evoluir seu Valor Sexual de Mercado (VSM) com sistema e precisão.
          </motion.p>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={() => navigate('/cadastro')}
              className="flex items-center justify-center gap-2 px-8 py-4 text-white rounded-xl transition-all"
              style={{ backgroundColor: PRIMARY, fontSize: 14, fontWeight: 500, letterSpacing: '0.04em' }}
            >
              Descobrir Meu VSM <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center justify-center gap-2 px-8 py-4 text-white rounded-xl transition-all"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}`, fontSize: 14, fontWeight: 500 }}
            >
              Já tenho conta
            </button>
          </motion.div>

          {/* Social proof mini — numbers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex items-center gap-6 mt-10"
          >
            {[
              { value: '2.400+', label: 'Alunos' },
              { value: '8', label: 'Cursos' },
              { value: '76', label: 'VSM médio' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-white" style={{ fontSize: 20, fontWeight: 500, letterSpacing: '0.02em' }}>{s.value}</p>
                <p style={{ color: TEXT3, fontSize: 11, fontWeight: 400 }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* ── MAIN ─────────────────────────────────────── */}
      <main>

        {/* ── SECTION 1 — Interesse / Storytelling ─── */}
        <section id="section-story" aria-labelledby="story-heading" style={{ backgroundColor: SURFACE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          <div className="max-w-5xl mx-auto px-6 py-20 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Text block */}
              <div>
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-6 h-px" style={{ backgroundColor: PRIMARY }} />
                  <span style={{ color: TEXT2, fontSize: 11, fontWeight: 500, letterSpacing: '0.08em' }}>O PROBLEMA</span>
                </div>
                <h2 id="story-heading" className="text-white mb-6" style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 500, lineHeight: 1.25 }}>
                  Você já sentiu que está perdendo oportunidades enquanto outros parecem ter um "código" secreto?
                </h2>
                <p style={{ color: TEXT2, fontSize: 15, fontWeight: 400, lineHeight: 1.8, marginBottom: 20 }}>
                  A verdade é que a atração é medida em milissegundos. Antes de você dizer "oi", ela já avaliou seu corpo, sua postura, sua confiança e, inconscientemente, sua vida financeira.
                </p>
                <p style={{ color: TEXT2, fontSize: 15, fontWeight: 400, lineHeight: 1.8, marginBottom: 24 }}>
                  Esses homens não têm sorte. Eles têm sistema. Código da Sedução traduz esse sistema em dados — e dados em resultados.
                </p>
                <div style={{ borderLeft: `3px solid ${PRIMARY}`, paddingLeft: 16 }}>
                  <p style={{ color: '#93C5FD', fontSize: 14, fontWeight: 500, fontStyle: 'italic', lineHeight: 1.7 }}>
                    "A maioria dos homens nunca soube que podia elevar essa nota. Você pode."
                  </p>
                </div>
              </div>

              {/* Course images — floating cards */}
              <div className="relative" style={{ minHeight: 360 }}>
                <div className="grid grid-cols-3 gap-2">
                  {courseCoverImages.map((c, i) => {
                    const src = typeof c.img === 'string' ? c.img : (c.img as any)?.src ?? c.img;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.5 }}
                        className="relative overflow-hidden"
                        style={{ aspectRatio: '9/16', borderRadius: 10, border: `1px solid ${BORDER}` }}
                      >
                        <img src={src} alt={c.title} className="absolute inset-0 w-full h-full object-cover object-top" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,0.4) 60%, transparent 100%)' }} />
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <p className="text-white" style={{ fontSize: 8, fontWeight: 500, lineHeight: 1.3, whiteSpace: 'pre-line' }}>{c.title}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2 — Desejo / Showcase Funcional ─ */}
        <section id="section-showcase" aria-labelledby="showcase-heading" style={{ backgroundColor: BG }}>
          <div className="max-w-4xl mx-auto px-6 py-20 lg:py-28">
            {/* Label */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2">
                <div className="w-6 h-px" style={{ backgroundColor: PRIMARY }} />
                <span style={{ color: TEXT2, fontSize: 11, fontWeight: 500, letterSpacing: '0.08em' }}>O APP</span>
                <div className="w-6 h-px" style={{ backgroundColor: PRIMARY }} />
              </div>
            </div>

            <h2 id="showcase-heading" className="text-white text-center mb-3" style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 500, lineHeight: 1.25 }}>
              O Jogo Visto Por Dentro
            </h2>
            <p className="text-center mb-12" style={{ color: TEXT2, fontSize: 14, fontWeight: 400, lineHeight: 1.7 }}>
              Cada seção do app é uma ferramenta. Explore o sistema real.
            </p>

            {/* Tabs component */}
            <Tabs defaultValue="crm" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList
                  className="flex gap-1 h-auto p-1"
                  style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}
                >
                  <TabsTrigger
                    value="crm"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    <Calendar size={14} />
                    CRM Social
                  </TabsTrigger>
                  <TabsTrigger
                    value="vsm"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    <TrendingUp size={14} />
                    Painel VSM
                  </TabsTrigger>
                  <TabsTrigger
                    value="arsenal"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                  >
                    <Library size={14} />
                    Arsenal
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab content with description + mockup */}
              <TabsContent value="crm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="crm"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="grid lg:grid-cols-2 gap-10 items-center"
                  >
                    <div>
                      <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,140,66,0.12)', border: '1px solid rgba(255,140,66,0.2)' }}>
                        <Calendar size={13} style={{ color: '#FF8C42' }} />
                        <span style={{ color: '#FF8C42', fontSize: 11, fontWeight: 500 }}>Conectar</span>
                      </div>
                      <h3 className="text-white mb-3" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3 }}>Seu funil de contatos.</h3>
                      <p style={{ color: TEXT2, fontSize: 14, fontWeight: 400, lineHeight: 1.8, marginBottom: 20 }}>
                        Acompanhe o estágio de cada conversa e saiba exatamente quando chamar para o encontro. Do primeiro abridor ao encontro confirmado — tudo rastreado.
                      </p>
                      {['Funil visual com 4 estágios', 'Agendamento de encontros', 'Notas estratégicas por contato', 'Score de match por conversa'].map(f => (
                        <div key={f} className="flex items-center gap-2.5 mb-2.5">
                          <CheckCircle2 size={14} style={{ color: '#FF8C42', flexShrink: 0 }} />
                          <span style={{ color: TEXT2, fontSize: 13, fontWeight: 400 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <MockupCRM />
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="vsm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="vsm"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="grid lg:grid-cols-2 gap-10 items-center"
                  >
                    <div>
                      <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(30,64,175,0.12)', border: '1px solid rgba(30,64,175,0.2)' }}>
                        <TrendingUp size={13} style={{ color: '#93C5FD' }} />
                        <span style={{ color: '#93C5FD', fontSize: 11, fontWeight: 500 }}>Evoluir</span>
                      </div>
                      <h3 className="text-white mb-3" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3 }}>O controle da sua evolução.</h3>
                      <p style={{ color: TEXT2, fontSize: 14, fontWeight: 400, lineHeight: 1.8, marginBottom: 20 }}>
                        Monitore peso, dieta, finanças e conhecimento em um dashboard único. Seu VSM cresce quando todos os pilares avançam juntos.
                      </p>
                      {['Score VSM em tempo real', 'Registro de peso e gordura', 'Calendário de consistência', 'Controle financeiro mensal'].map(f => (
                        <div key={f} className="flex items-center gap-2.5 mb-2.5">
                          <CheckCircle2 size={14} style={{ color: PRIMARY, flexShrink: 0 }} />
                          <span style={{ color: TEXT2, fontSize: 13, fontWeight: 400 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <MockupVSM />
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="arsenal">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="arsenal"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="grid lg:grid-cols-2 gap-10 items-center"
                  >
                    <div>
                      <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.2)' }}>
                        <Library size={13} style={{ color: '#A78BFA' }} />
                        <span style={{ color: '#A78BFA', fontSize: 11, fontWeight: 500 }}>Consultar</span>
                      </div>
                      <h3 className="text-white mb-3" style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.3 }}>Respostas na palma da mão.</h3>
                      <p style={{ color: TEXT2, fontSize: 14, fontWeight: 400, lineHeight: 1.8, marginBottom: 20 }}>
                        Acesso imediato a scripts, áudios e guias para qualquer situação de campo. O arsenal tático de um homem preparado.
                      </p>
                      {['Scripts de abertura e fechamento', 'Áudios de condicionamento mental', 'Livros e estratégias filtradas', 'Acesso offline aos materiais'].map(f => (
                        <div key={f} className="flex items-center gap-2.5 mb-2.5">
                          <CheckCircle2 size={14} style={{ color: '#A78BFA', flexShrink: 0 }} />
                          <span style={{ color: TEXT2, fontSize: 13, fontWeight: 400 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <MockupArsenal />
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* ── SECTION 3 — Solução / Pilares ─────────── */}
        <section id="section-pillars" aria-labelledby="pillars-heading" style={{ backgroundColor: SURFACE, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
          <div className="max-w-5xl mx-auto px-6 py-20 lg:py-28">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2">
                <div className="w-6 h-px" style={{ backgroundColor: PRIMARY }} />
                <span style={{ color: TEXT2, fontSize: 11, fontWeight: 500, letterSpacing: '0.08em' }}>A SOLUÇÃO</span>
                <div className="w-6 h-px" style={{ backgroundColor: PRIMARY }} />
              </div>
            </div>
            <h2 id="pillars-heading" className="text-white text-center mb-3" style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 500 }}>
              O Código De Um Homem Elite
            </h2>
            <p className="text-center mb-14" style={{ color: TEXT2, fontSize: 14, fontWeight: 400, lineHeight: 1.7 }}>
              Três pilares. Um sistema. Resultado mensurável.
            </p>

            <div className="grid sm:grid-cols-3 gap-5">
              {pillars.map((p, i) => {
                const Icon = p.Icon;
                return (
                  <motion.article
                    key={p.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: p.color + '18' }}>
                      <Icon size={20} style={{ color: p.color }} />
                    </div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full mb-3" style={{ backgroundColor: p.color + '15' }}>
                      <span style={{ color: p.color, fontSize: 10, fontWeight: 500 }}>{p.stat}</span>
                    </div>
                    <h3 className="text-white mb-2" style={{ fontSize: 18, fontWeight: 500 }}>{p.title}</h3>
                    <p style={{ color: TEXT2, fontSize: 13, fontWeight: 400, lineHeight: 1.7 }}>{p.desc}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 4 — Prova Social / Autoridade ─── */}
        <section id="section-proof" aria-labelledby="proof-heading" style={{ backgroundColor: BG }}>
          <div className="max-w-4xl mx-auto px-6 py-20 lg:py-28">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2">
                <div className="w-6 h-px" style={{ backgroundColor: PRIMARY }} />
                <span style={{ color: TEXT2, fontSize: 11, fontWeight: 500, letterSpacing: '0.08em' }}>RESULTADOS REAIS</span>
                <div className="w-6 h-px" style={{ backgroundColor: PRIMARY }} />
              </div>
            </div>
            <h2 id="proof-heading" className="text-white text-center mb-14" style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 500 }}>
              A Elite Não Conta Com a Sorte.
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              {testimonials.map((t, i) => (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24 }}
                >
                  {/* Quote marks */}
                  <div className="mb-4" style={{ color: PRIMARY, fontSize: 32, fontWeight: 900, lineHeight: 1 }}>"</div>
                  <blockquote>
                    <p style={{ color: TEXT2, fontSize: 14, fontWeight: 400, lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>
                      {t.quote}
                    </p>
                  </blockquote>
                  <footer className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${PRIMARY}, #1e3a8a)` }}>
                        <span className="text-white text-xs" style={{ fontWeight: 500 }}>{t.name[0]}</span>
                      </div>
                      <span className="text-white" style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(30,64,175,0.15)' }}>
                      <span style={{ color: '#93C5FD', fontSize: 11, fontWeight: 500 }}>{t.vsm}</span>
                    </div>
                  </footer>
                </motion.article>
              ))}
            </div>

            {/* Urgency nudge */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 px-5 py-4 flex items-center gap-3"
              style={{ backgroundColor: 'rgba(30,64,175,0.08)', border: `1px solid rgba(30,64,175,0.25)`, borderRadius: 12 }}
            >
              <Zap size={16} style={{ color: ACCENT, flexShrink: 0 }} />
              <p style={{ color: TEXT2, fontSize: 13, fontWeight: 400, lineHeight: 1.6 }}>
                <span className="text-white" style={{ fontWeight: 500 }}>47 novos alunos</span> entraram para a elite esta semana. O próximo pode ser você.
              </p>
            </motion.div>
          </div>
        </section>

      </main>

      {/* ── FOOTER — Ação / CTA Final ─────────────── */}
      <footer
        role="contentinfo"
        className="relative overflow-hidden"
        style={{ backgroundColor: SURFACE, borderTop: `1px solid ${BORDER}` }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(30,64,175,0.12), transparent)' }} />

        <div className="relative max-w-2xl mx-auto px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-6">
              <Zap size={13} style={{ color: ACCENT }} />
              <span style={{ color: ACCENT, fontSize: 11, fontWeight: 500, letterSpacing: '0.08em' }}>ÚLTIMA CHANCE</span>
            </div>

            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 500, lineHeight: 1.2 }}>
              Sua próxima missão
              <br />
              começa agora.
            </h2>
            <p className="mb-10" style={{ color: TEXT2, fontSize: 15, fontWeight: 400, lineHeight: 1.7 }}>
              O tempo passa e outros estão ocupando os espaços. Entre para a elite antes que a janela feche.
            </p>

            {/* Primary CTA — reuses Button component */}
            <Button
              onClick={() => navigate('/cadastro')}
              className="px-10 py-5 text-white rounded-xl text-base font-medium inline-flex items-center gap-2 h-auto"
              style={{ backgroundColor: PRIMARY, letterSpacing: '0.04em' }}
            >
              Começar Minha Jornada <ArrowRight size={16} />
            </Button>

            {/* Secondary link */}
            <p className="mt-6" style={{ color: TEXT3, fontSize: 13, fontWeight: 400 }}>
              Já tem conta?{' '}
              <button
                onClick={() => navigate('/login')}
                style={{ color: ACCENT, fontWeight: 500 }}
              >
                Entrar
              </button>
            </p>

            {/* Footer meta */}
            <div className="mt-16 pt-8 flex items-center justify-center gap-3" style={{ borderTop: `1px solid ${BORDER}` }}>
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
                <Shield size={12} className="text-white" />
              </div>
              <span style={{ color: TEXT3, fontSize: 11, fontWeight: 400 }}>Código da Sedução · Todos os direitos reservados</span>
            </div>
          </motion.div>
        </div>
      </footer>

    </div>
  );
}
