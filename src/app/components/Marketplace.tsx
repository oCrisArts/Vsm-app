import { useState } from 'react';
import { Search } from 'lucide-react';

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

interface MarketplaceProps {
  onSelectCourse: (courseId: number) => void;
}

const COURSES = [
  { id: 1, title: 'Dominação Absoluta', subtitle: 'Controle Total', image: imgImageDominacaoAbsoluta, tag: 'Avançado' },
  { id: 2, title: 'Arte da Conquista', subtitle: 'Sedução Refinada', image: imgImageArteDaConquista, tag: 'Intermediário' },
  { id: 3, title: 'Psicologia Dark', subtitle: 'Manipulação Ética', image: imgImagePsicologiaDark, tag: 'Avançado' },
  { id: 4, title: 'Linguagem Corporal', subtitle: 'Presença Alpha', image: imgImageLinguagemCorporal, tag: 'Iniciante' },
  { id: 5, title: 'Storytelling Avançado', subtitle: 'Narrativas Poderosas', image: imgImageStorytellingAvancado, tag: 'Novo' },
  { id: 6, title: 'Frame Control', subtitle: 'Domínio De Situações', image: imgImageFrameControl, tag: 'Novo' },
  { id: 7, title: 'Atração De Alto Valor', subtitle: 'Magnetismo Pessoal', image: imgImageAtracaoDeAltoValor, tag: 'Novo' },
  { id: 8, title: 'Calibração Social', subtitle: 'Inteligência De Campo', image: imgImageCalibracaoSocial, tag: 'Iniciante' },
];

const CATEGORIES = ['Todos', 'Iniciante', 'Intermediário', 'Avançado', 'Novo'];

export function Marketplace({ onSelectCourse }: MarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = activeCategory === 'Todos' || c.tag === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div
        className="px-5 pt-4 pb-5"
        style={{ background: `linear-gradient(to bottom, #0A1220, ${BG})` }}
      >
        <h1
          className="text-white mb-1"
          style={{ fontSize: 28, fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.3 }}
        >
          Aprender
        </h1>
        <p style={{ color: TEXT_SECONDARY, fontSize: 13, fontWeight: 400, lineHeight: 1.5 }}>
          Todos Os Cursos Disponíveis
        </p>
      </div>

      {/* Search */}
      <div className="px-5 mb-5">
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}
        >
          <Search size={15} style={{ color: TEXT_TERTIARY, flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-[#666] outline-none"
            style={{ fontSize: 14, fontWeight: 400 }}
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="px-5 mb-6">
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="flex-shrink-0 px-4 py-2"
                style={{
                  borderRadius: 100,
                  backgroundColor: active ? PRIMARY : 'transparent',
                  color: active ? '#fff' : TEXT_SECONDARY,
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.01em',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses grid — 2 col */}
      <div className="px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(course => (
            <button
              key={course.id}
              onClick={() => onSelectCourse(course.id)}
              className="text-left group"
            >
              {/* 9:16 Card */}
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: 12, border: `1px solid ${BORDER}`, aspectRatio: '9/16' }}
              >
                {/* Photo */}
                <img
                  src={course.image}
                  alt={course.title}
                  className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                {/* Cold overlay — harmonizes with Sapphire Blue */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,0.55) 50%, rgba(30,64,175,0.08) 100%)',
                  }}
                />

                {/* Tag badge — top right */}
                <div className="absolute top-3 right-3">
                  <span
                    className="px-2 py-0.5"
                    style={{
                      backgroundColor: PRIMARY,
                      borderRadius: 6,
                      color: '#fff',
                      fontSize: 9,
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                      display: 'inline-block',
                    }}
                  >
                    {course.tag.toUpperCase()}
                  </span>
                </div>

                {/* Info — bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p
                    className="mb-1"
                    style={{ color: '#93C5FD', fontSize: 10, fontWeight: 500, letterSpacing: '0.03em', lineHeight: 1.5 }}
                  >
                    {course.subtitle}
                  </p>
                  <h4
                    className="text-white mb-4"
                    style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3, letterSpacing: '0.02em' }}
                  >
                    {course.title}
                  </h4>
                  {/* CTA button — glass */}
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
                      letterSpacing: '0.04em',
                    }}
                  >
                    Iniciar
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p style={{ color: TEXT_TERTIARY, fontSize: 14, fontWeight: 400 }}>
              Nenhum curso encontrado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}