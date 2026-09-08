import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit3, Headphones, BookOpen, FileText, Search, X, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const BG      = '#121212';
const SURFACE  = '#1E1E1E';
const SURFACE2 = '#252525';
const BORDER   = '#2A2A2A';
const PRIMARY  = '#7C3AED';
const TEXT2    = '#9E9E9E';
const TEXT3    = '#666666';

type ContentType = 'audio' | 'book' | 'script' | 'pdf';
type FilterType = 'all' | ContentType;

const CONTENT_ITEMS = [
  { id: 1, type: 'audio' as ContentType,  title: 'Hipnose Conversacional',  category: 'PNL',       detail: '45 min', views: 892, image: 'https://images.unsplash.com/photo-1697739348487-75f668fdb6fb?w=400&q=80' },
  { id: 2, type: 'audio' as ContentType,  title: 'Afirmações De Poder',      category: 'Mindset',   detail: '30 min', views: 634, image: 'https://images.unsplash.com/photo-1576629679906-08e08bfaed82?w=400&q=80' },
  { id: 3, type: 'book' as ContentType,   title: 'As 48 Leis Do Poder',      category: 'Estratégia',detail: '452 pág',views: 1243,image: 'https://images.unsplash.com/photo-1728731152406-8390889b2489?w=400&q=80' },
  { id: 4, type: 'book' as ContentType,   title: 'A Arte Da Sedução',        category: 'Sedução',   detail: '420 pág',views: 978, image: 'https://images.unsplash.com/photo-1487252502161-75020a813bf0?w=400&q=80' },
  { id: 5, type: 'script' as ContentType, title: 'Abertura Direta',          category: 'Abordagem', detail: '15 linhas', views: 756, image: 'https://images.unsplash.com/photo-1535311631117-da5b8ab9c505?w=400&q=80' },
  { id: 6, type: 'script' as ContentType, title: 'Rotina Do Cubo',           category: 'Conforto',  detail: '25 linhas', views: 543, image: 'https://images.unsplash.com/photo-1680174716363-6d71e35014b0?w=400&q=80' },
  { id: 7, type: 'audio' as ContentType,  title: 'Frequência Alfa Mental',   category: 'Mindset',   detail: '60 min', views: 421, image: 'https://images.unsplash.com/photo-1724403126398-ea3505a400c9?w=400&q=80' },
  { id: 8, type: 'script' as ContentType, title: 'Escalada De Tensão',       category: 'Sedução',   detail: '20 linhas', views: 389, image: 'https://images.unsplash.com/photo-1619198652021-75a0b4ac7462?w=400&q=80' },
  { id: 9, type: 'pdf' as ContentType,    title: 'Guia De Abordagem',        category: 'Abordagem', detail: '24 pág', views: 667, image: 'https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=400&q=80' },
  { id: 10,type: 'pdf' as ContentType,    title: 'Manual Do Conforto',       category: 'Conforto',  detail: '18 pág', views: 512, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80' },
  { id: 11,type: 'pdf' as ContentType,    title: 'Scripts de Escalada',      category: 'Sedução',   detail: '32 pág', views: 445, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { id: 12,type: 'pdf' as ContentType,    title: 'Guia de Frame Control',    category: 'Estratégia',detail: '28 pág', views: 378, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80' },
];

const typeIcon: Record<ContentType, typeof Headphones> = {
  audio: Headphones, book: BookOpen, script: FileText, pdf: FileText,
};
const typeColor: Record<ContentType, string> = {
  audio: '#4169FF', book: '#FF8C42', script: '#A78BFA', pdf: '#16A34A',
};
const typeLabel: Record<ContentType, string> = {
  audio: 'Áudio', book: 'Livro', script: 'Script', pdf: 'PDF',
};

export function AdminConsultarPage() {
  const [search, setSearch]           = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showSheet, setShowSheet]     = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const filtered = CONTENT_ITEMS.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = activeFilter === 'all' || item.type === activeFilter;
    return matchSearch && matchFilter;
  });

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all',    label: 'Todos'   },
    { id: 'audio',  label: 'Áudios'  },
    { id: 'book',   label: 'Livros'  },
    { id: 'script', label: 'Scripts' },
    { id: 'pdf',    label: 'PDFs'    },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(to bottom, #0D0822, ${BG})` }}>
        <h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Consultar</h1>
        <p style={{ color: TEXT2, fontSize: 13 }}>Gerenciamento do arsenal de conteúdos</p>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
          <Search size={15} style={{ color: TEXT3, flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar conteúdo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-[#666] outline-none"
            style={{ fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 mb-5">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className="flex-shrink-0 px-4 py-2"
              style={{ borderRadius: 100, backgroundColor: activeFilter === f.id ? PRIMARY : 'transparent', color: activeFilter === f.id ? '#fff' : TEXT2, fontSize: 12, fontWeight: 500, transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(item => {
            const Icon = typeIcon[item.type];
            const color = typeColor[item.type];
            return (
              <div key={item.id} className="relative group">
                <div className="relative overflow-hidden" style={{ aspectRatio: '9/16', borderRadius: 12, border: `1px solid ${BORDER}` }}>
                  <ImageWithFallback src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

                  {/* Type badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1" style={{ backgroundColor: color + '25', backdropFilter: 'blur(8px)', borderRadius: 6 }}>
                    <Icon size={11} style={{ color }} />
                    <span style={{ color, fontSize: 9, fontWeight: 500 }}>{typeLabel[item.type]}</span>
                  </div>

                  {/* Admin controls - top right */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    <button
                      onClick={() => setSelectedItem(item.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(124,58,237,0.85)', backdropFilter: 'blur(8px)' }}
                    >
                      <Edit3 size={11} className="text-white" />
                    </button>
                    <button
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(220,38,38,0.75)', backdropFilter: 'blur(8px)' }}
                    >
                      <Trash2 size={11} className="text-white" />
                    </button>
                  </div>

                  {/* Bottom info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p style={{ color, fontSize: 9, fontWeight: 500, marginBottom: 2, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.category}</p>
                    <h4 className="text-white mb-2" style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.title}</h4>
                    <div className="flex justify-between">
                      <span style={{ color: TEXT3, fontSize: 9, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.detail}</span>
                      <span style={{ color: TEXT2, fontSize: 9, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowSheet(true)}
        className="fixed z-30 flex items-center gap-2 px-5 py-3.5 shadow-lg"
        style={{ bottom: 80, right: 20, backgroundColor: PRIMARY, borderRadius: 100, boxShadow: `0 4px 20px rgba(124,58,237,0.4)` }}
      >
        <Plus size={18} className="text-white" />
        <span className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Novo Conteúdo</span>
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
                <h3 className="text-white" style={{ fontSize: 18, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Novo Conteúdo</h3>
                <button onClick={() => setShowSheet(false)}><X size={18} style={{ color: TEXT2 }} /></button>
              </div>
              <div>
                <label style={{ color: TEXT3, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>TIPO</label>
                <select className="w-full text-white outline-none" style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <option value="audio">Áudio</option>
                  <option value="book">Livro / PDF</option>
                  <option value="script">Script</option>
                </select>
              </div>
              <div>
                <label style={{ color: TEXT3, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>TÍTULO</label>
                <input type="text" placeholder="Nome do conteúdo" className="w-full text-white outline-none" style={{ backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }} />
              </div>
              <button onClick={() => setShowSheet(false)} className="w-full py-4 text-white" style={{ backgroundColor: PRIMARY, borderRadius: 10, fontSize: 14, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Publicar Conteúdo</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
