import { useState } from 'react';
import { Search } from 'lucide-react';
import { useCourses } from '../../lib/hooks/useLearning';

// Design tokens
const BG = '#121212';
const SURFACE = '#1E1E1E';
const BORDER = '#2A2A2A';
const PRIMARY = '#1E40AF';
const TEXT_SECONDARY = '#9E9E9E';
const TEXT_TERTIARY = '#666666';

interface MarketplaceProps {
  onSelectCourse: (slug: string) => void;
}

const CATEGORIES = ['Todos', 'Iniciante', 'Intermediário', 'Avançado', 'Novo'];

export function Marketplace({ onSelectCourse }: MarketplaceProps) {
  const { courses, loading, error } = useCourses();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = courses.filter(c => {
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
              onClick={() => onSelectCourse(course.slug)}
              className="text-left group"
            >
              {/* 9:16 Card */}
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: 12, border: `1px solid ${BORDER}`, aspectRatio: '9/16' }}
              >
                {/* Photo */}
                <img
                  src={course.image_url ?? ''}
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

        {(loading || error || filtered.length === 0) && (
          <div className="text-center py-16">
            <p style={{ color: TEXT_TERTIARY, fontSize: 14, fontWeight: 400 }}>
              {loading ? 'Carregando cursos...' : error ? 'Não foi possível carregar os cursos.' : 'Nenhum curso encontrado.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
