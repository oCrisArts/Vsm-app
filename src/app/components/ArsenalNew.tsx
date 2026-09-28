import { Headphones, BookOpen, FileText, Search, Play, Download, X } from 'lucide-react';
import { Card, TextField, InputAdornment } from '@mui/material';
import { useState } from 'react';
import { useLibraryItems, type LibraryItemView } from '../../lib/hooks/useLibrary';
import { ImageWithFallback } from './figma/ImageWithFallback';

type Category = 'all' | 'audio' | 'books' | 'scripts' | 'pdfs';

export function ArsenalNew() {
  const { items, loading, error } = useLibraryItems();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedScript, setSelectedScript] = useState<LibraryItemView | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  const categories = [
    { id: 'all' as const, label: 'Todos', icon: null },
    { id: 'audio' as const, label: 'Áudios', icon: Headphones },
    { id: 'books' as const, label: 'Livros', icon: BookOpen },
    { id: 'scripts' as const, label: 'Scripts', icon: FileText },
    { id: 'pdfs' as const, label: 'PDFs', icon: FileText },
  ];

  const filteredItems = items.filter(item => {
    const term = searchQuery.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(term) || (item.category ?? '').toLowerCase().includes(term);
    const matchesCategory = activeCategory === 'all'
      || (activeCategory === 'audio' && item.type === 'audio')
      || (activeCategory === 'books' && item.type === 'book')
      || (activeCategory === 'scripts' && item.type === 'script')
      || (activeCategory === 'pdfs' && item.type === 'pdf');
    return matchesSearch && matchesCategory;
  });

  const openItem = (item: LibraryItemView) => {
    setActionMessage('');
    if (item.type === 'script') {
      if (item.content) setSelectedScript(item);
      else setActionMessage('Este script ainda não possui conteúdo textual disponível.');
      return;
    }
    if (item.file_src) window.open(item.file_src, '_blank', 'noopener,noreferrer');
    else setActionMessage('Este conteúdo ainda não possui arquivo disponível.');
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <div className="bg-gradient-to-b from-[#0A1A3A] to-black p-6 pb-6">
        <h1 className="text-white text-3xl mb-4" style={{ fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Consultar</h1>
        <TextField fullWidth placeholder="Buscar no Consultar..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search size={20} className="text-[#666]" /></InputAdornment> }}
          sx={{ '& .MuiOutlinedInput-root': { backgroundColor: '#0A0A0A', borderRadius: '12px', color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif', '& fieldset': { borderColor: '#1A1A1A' }, '&:hover fieldset': { borderColor: '#4169FF' }, '&.Mui-focused fieldset': { borderColor: '#4169FF' } }, '& .MuiOutlinedInput-input': { padding: '14px', fontFamily: 'Plus Jakarta Sans, sans-serif' } }}
        />
      </div>

      <div className="px-6 mb-6"><div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => { const Icon = cat.icon; const active = activeCategory === cat.id; return <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className="flex items-center gap-2 px-4 py-2 whitespace-nowrap transition-all flex-shrink-0" style={{ borderRadius: 100, backgroundColor: active ? '#1E40AF' : 'transparent', color: active ? '#fff' : '#999', fontWeight: 500, fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{Icon && <Icon size={13} />}{cat.label}</button>; })}
      </div></div>

      <div className="px-4 md:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => <div key={item.id} className="relative group cursor-pointer" onClick={() => openItem(item)}>
            <Card sx={{ bgcolor: '#0A0A0A', borderRadius: 4, border: '1px solid #1A1A1A', overflow: 'hidden' }}><div className="relative aspect-[9/16] overflow-hidden">
              <ImageWithFallback src={item.cover_src ?? ''} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: 'center top' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
              <div className="absolute top-3 left-3"><div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">{item.type === 'audio' ? <Headphones size={16} className="text-[#4169FF]" /> : item.type === 'book' ? <BookOpen size={16} className="text-[#4169FF]" /> : <FileText size={16} className="text-[#4169FF]" />}</div></div>
              <div className="absolute bottom-0 left-0 right-0 p-4"><p className="text-[#4169FF] text-xs mb-1" style={{ fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.category}</p><h4 className="text-white text-2xl leading-tight mb-5" style={{ fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.title}</h4>
                <div className="w-full py-2.5 bg-white/10 backdrop-blur-md text-white rounded-full text-sm flex items-center justify-center gap-2" style={{ fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.type === 'audio' ? <><Play size={14} fill="white" /> Ouvir</> : item.type === 'script' ? <><FileText size={14} /> Ler</> : <><Download size={14} /> Baixar</>}</div>
              </div>
            </div></Card>
          </div>)}
        </div>
        {(loading || error || filteredItems.length === 0) && <div className="px-6 py-12 text-center"><p className="text-[#666] text-lg" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{loading ? 'Carregando biblioteca...' : error ? 'Não foi possível carregar a biblioteca.' : 'Nenhum item encontrado'}</p></div>}
        {actionMessage && <div className="px-6 py-4 text-center"><p className="text-[#666] text-sm">{actionMessage}</p></div>}
      </div>

      {selectedScript && <div className="fixed inset-0 z-[1200] flex items-end"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedScript(null)} /><div className="relative w-full max-h-[80vh] overflow-y-auto z-10" style={{ backgroundColor: '#1E1E1E', borderRadius: '16px 16px 0 0', border: '1px solid #2A2A2A', padding: '24px 20px 48px' }}><div className="flex items-center justify-between mb-5"><div><p className="text-[#4169FF] text-xs mb-1">{selectedScript.category}</p><h3 className="text-white text-xl">{selectedScript.title}</h3></div><button onClick={() => setSelectedScript(null)}><X size={18} className="text-[#999]" /></button></div><p className="text-[#CCC] whitespace-pre-wrap leading-relaxed">{selectedScript.content}</p></div></div>}
    </div>
  );
}
