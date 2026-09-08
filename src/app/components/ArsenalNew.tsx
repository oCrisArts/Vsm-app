import { Headphones, BookOpen, FileText, Search, Play, Download } from 'lucide-react';
import { Card, TextField, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SubscriptionModal } from './SubscriptionModal';

export function ArsenalNew() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'audio' | 'books' | 'scripts'>('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const arsenalItems = [
    {
      id: 1,
      type: 'audio',
      title: 'Hipnose Conversacional',
      duration: '45 min',
      category: 'Pnl',
      image: 'https://images.unsplash.com/photo-1697739348487-75f668fdb6fb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 2,
      type: 'audio',
      title: 'Afirmações De Poder',
      duration: '30 min',
      category: 'Mindset',
      image: 'https://images.unsplash.com/photo-1576629679906-08e08bfaed82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 3,
      type: 'book',
      title: 'As 48 Leis Do Poder',
      pages: 452,
      category: 'Estratégia',
      image: 'https://images.unsplash.com/photo-1728731152406-8390889b2489?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 4,
      type: 'book',
      title: 'A Arte Da Sedução',
      pages: 420,
      category: 'Sedução',
      image: 'https://images.unsplash.com/photo-1487252502161-75020a813bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 5,
      type: 'script',
      title: 'Abertura Direta',
      lines: 15,
      category: 'Abordagem',
      image: 'https://images.unsplash.com/photo-1535311631117-da5b8ab9c505?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 6,
      type: 'script',
      title: 'Rotina Do Cubo',
      lines: 25,
      category: 'Conforto',
      image: 'https://images.unsplash.com/photo-1680174716363-6d71e35014b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 7,
      type: 'audio',
      title: 'Frequência Alfa Mental',
      duration: '60 min',
      category: 'Mindset',
      image: 'https://images.unsplash.com/photo-1724403126398-ea3505a400c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
    {
      id: 8,
      type: 'script',
      title: 'Escalada De Tensão',
      lines: 20,
      category: 'Sedução',
      image: 'https://images.unsplash.com/photo-1619198652021-75a0b4ac7462?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    },
  ];

  const categories = [
    { id: 'all', label: 'Todos', icon: null },
    { id: 'audio', label: 'Áudios', icon: Headphones },
    { id: 'books', label: 'Livros', icon: BookOpen },
    { id: 'scripts', label: 'Scripts', icon: FileText },
  ];

  const filteredItems = arsenalItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'audio' && item.type === 'audio') ||
      (activeCategory === 'books' && item.type === 'book') ||
      (activeCategory === 'scripts' && item.type === 'script');
    return matchesSearch && matchesCategory;
  });

  const handleItemClick = (itemTitle: string) => {
    setSelectedItem(itemTitle);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="bg-gradient-to-b from-[#0A1A3A] to-black p-6 pb-6">
        <h1 className="text-white text-3xl mb-4" style={{ fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Consultar</h1>

        <TextField
          fullWidth
          placeholder="Buscar no Consultar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} className="text-[#666]" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#0A0A0A',
              borderRadius: '12px',
              color: '#fff',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              '& fieldset': { borderColor: '#1A1A1A' },
              '&:hover fieldset': { borderColor: '#4169FF' },
              '&.Mui-focused fieldset': { borderColor: '#4169FF' },
            },
            '& .MuiOutlinedInput-input': {
              padding: '14px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            },
          }}
        />
      </div>

      {/* Filtros */}
      <div className="px-6 mb-6">
        <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className="flex items-center gap-2 px-4 py-2 whitespace-nowrap transition-all flex-shrink-0"
                style={{
                  borderRadius: 100,
                  backgroundColor: isActive ? '#1E40AF' : 'transparent',
                  color: isActive ? '#fff' : '#999',
                  fontWeight: 500,
                  fontSize: 12,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                }}
              >
                {Icon && <Icon size={13} />}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="relative group cursor-pointer"
              onClick={() => handleItemClick(item.title)}
            >
              <Card sx={{ bgcolor: '#0A0A0A', borderRadius: 4, border: '1px solid #1A1A1A', overflow: 'hidden' }}>
                <div className="relative aspect-[9/16] overflow-hidden">
                  {/* Imagem de fundo */}
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: 'center top' }}
                  />

                  {/* Gradiente escuro cinematográfico sobre a imagem */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

                  {/* Type icon badge */}
                  <div className="absolute top-3 left-3">
                    <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                      {item.type === 'audio' && <Headphones size={16} className="text-[#4169FF]" />}
                      {item.type === 'book' && <BookOpen size={16} className="text-[#4169FF]" />}
                      {item.type === 'script' && <FileText size={16} className="text-[#4169FF]" />}
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[#4169FF] text-xs mb-1" style={{ fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.category}</p>
                    <h4 className="text-white text-2xl leading-tight mb-5" style={{ fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.title}</h4>

                    {/* Botão glass sem borda — igual ao padrão Home */}
                    <div
                      className="w-full py-2.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm flex items-center justify-center gap-2"
                      style={{ fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    >
                      {item.type === 'audio'
                        ? <><Play size={14} fill="white" /> Ouvir</>
                        : <><Download size={14} /> Baixar</>
                      }
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-[#666] text-lg" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Nenhum item encontrado</p>
        </div>
      )}

      {/* Modal de assinatura — igual ao fluxo de cursos */}
      <SubscriptionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubscribe={() => setShowModal(false)}
        courseName={selectedItem}
      />
    </div>
  );
}