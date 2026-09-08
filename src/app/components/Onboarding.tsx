import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Sparkles, BookOpen, TrendingUp, Calendar, Library, Zap } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OnboardingProps {
  onComplete: () => void;
}

const screens = [
  {
    id: 0,
    bg: 'https://images.unsplash.com/photo-1626913671142-8a2431ab5219?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tag: 'Realidade',
    headline: 'O Jogo\nTem Regras.',
    body: 'Toda mulher, de forma consciente ou não, avalia você em milissegundos. Existe uma pontuação invisível que define sua atratividade. Essa nota é o VSM.',
    highlight: 'A maioria dos homens nunca soube que podia elevar essa nota.',
    cta: 'Quero Saber Como',
  },
  {
    id: 1,
    bg: 'https://images.unsplash.com/photo-1559335185-5b7ddef49716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tag: 'O Sistema',
    headline: 'VSM É A Soma\nDo Seu Valor.',
    body: 'Valor Sexual de Mercado não é sorte — é uma equação. O aplicativo traduz seus pilares de vida em ferramentas reais:',
    highlight: null,
    cta: 'Entendi O Sistema',
    pillars: [
      { icon: Sparkles, label: 'Iniciar', desc: 'Seu centro de comando.', color: '#FFFFFF' },
      { icon: BookOpen, label: 'Aprender', desc: 'Cursos para sua mente.', color: '#4169FF' },
      { icon: TrendingUp, label: 'Evoluir', desc: 'Seu corpo e finanças.', color: '#00C97E' },
      { icon: Calendar, label: 'Conectar', desc: 'Encontros e contatos.', color: '#FF8C42' },
      { icon: Library, label: 'Consultar', desc: 'Táticas para o campo.', color: '#A78BFA' },
    ],
  },
  {
    id: 2,
    bg: 'https://images.unsplash.com/photo-1737623342152-b49e12f7ccf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tag: 'Seu Convite',
    headline: 'A Elite\nTe Chama.',
    body: 'Você começa hoje com VSM 45. Cada treino registrado, curso concluído e encontro agendado eleva sua pontuação. A sua missão não espera.',
    highlight: 'Sua próxima missão expira em 24h. Comece antes que outro tome seu lugar.',
    cta: 'Começar Minha Jornada',
    isLast: true,
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const screen = screens[step];

  const next = () => {
    if (step < screens.length - 1) setStep(s => s + 1);
    else onComplete();
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ImageWithFallback
            src={screen.bg}
            alt=""
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/30" />
        </motion.div>
      </AnimatePresence>

      {/* Skip */}
      <button
        onClick={onComplete}
        className="absolute top-14 right-6 text-[#777] text-sm z-20 font-medium"
      >
        Pular
      </button>

      {/* Progress dots */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {screens.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all"
            style={{
              width: i === step ? 24 : 6,
              height: 6,
              backgroundColor: i === step ? '#4169FF' : '#333',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end px-6 pb-12 pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Tag */}
            <div className="inline-flex items-center gap-2 mb-4">
              <Zap size={14} className="text-[#4169FF]" />
              <span className="text-[#4169FF] text-sm font-medium tracking-wide">{screen.tag}</span>
            </div>

            {/* Headline */}
            <h1
              className="text-white text-5xl mb-4 font-medium"
              style={{ lineHeight: 1.1, whiteSpace: 'pre-line' }}
            >
              {screen.headline}
            </h1>

            {/* Body */}
            <p className="text-[#CCCCCC] text-base mb-6 font-normal leading-relaxed">
              {screen.body}
            </p>

            {/* Pillars (screen 2 only) */}
            {'pillars' in screen && screen.pillars && (
              <div className="grid grid-cols-1 gap-2 mb-6">
                {screen.pillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div
                      key={pillar.label}
                      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: pillar.color + '20' }}
                      >
                        <Icon size={16} style={{ color: pillar.color }} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-medium">{pillar.label}</span>
                        <span className="text-[#999] text-xs font-normal">{pillar.desc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Highlight / open loop */}
            {screen.highlight && (
              <div className="bg-[#4169FF]/10 border border-[#4169FF]/30 rounded-xl px-4 py-3 mb-6">
                <p className="text-[#DDD] text-sm font-normal italic leading-relaxed">
                  "{screen.highlight}"
                </p>
              </div>
            )}

            {/* VSM badge (last screen) */}
            {'isLast' in screen && screen.isLast && (
              <div className="flex flex-col gap-3 mb-6 bg-[#0A0A0A]/80 backdrop-blur-md border border-[#1A1A1A] rounded-xl px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                     <p className="text-[#888] text-xs font-medium mb-1">Seu VSM Inicial</p>
                     <p className="text-[#4169FF] text-4xl font-medium">45</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[#888] text-xs font-medium mb-1">Meta</p>
                     <p className="text-white text-lg font-medium">100</p>
                  </div>
                </div>
                
                <div className="w-full h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                   <motion.div
                      className="h-full bg-[#4169FF] rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '45%' }}
                      transition={{ delay: 0.4, duration: 1, ease: 'easeOut' }}
                   />
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[#666] text-xs font-normal">Nível Iniciante</span>
                   <span className="text-[#4169FF] text-xs font-medium">Status Elite &rarr;</span>
                </div>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={next}
              className="w-full py-4 rounded-xl text-white flex items-center justify-center gap-2 transition-all font-medium text-sm tracking-wide"
              style={{
                backgroundColor: 'isLast' in screen && (screen as typeof screens[2]).isLast ? '#1E40AF' : 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.1)',
                ...(('isLast' in screen && (screen as typeof screens[2]).isLast) ? { backgroundColor: '#1E40AF', border: 'none' } : {}),
              }}
            >
              {screen.cta}
              <ChevronRight size={16} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
