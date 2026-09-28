import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit3, Headphones, BookOpen, FileText, Search, X, Trash2, Eye, EyeOff } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import {
  createLibraryItem,
  deleteLibraryItem,
  removeReplacedLibraryFiles,
  replaceLibraryFiles,
  updateLibraryItem,
  useLibraryItems,
  type LibraryItemView,
} from '../../../lib/hooks/useLibrary';
import type { LibraryItemInput, LibraryItemType } from '../../../lib/types';

const BG = '#121212';
const SURFACE = '#1E1E1E';
const SURFACE2 = '#252525';
const BORDER = '#2A2A2A';
const PRIMARY = '#7C3AED';
const TEXT2 = '#9E9E9E';
const TEXT3 = '#666666';

type FilterType = 'all' | LibraryItemType;
type FormState = {
  type: LibraryItemType;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  content: string;
  duration_minutes: string;
  pages: string;
  is_published: boolean;
  order_index: string;
};

const EMPTY_FORM: FormState = {
  type: 'audio', title: '', subtitle: '', description: '', category: '', content: '',
  duration_minutes: '', pages: '', is_published: true, order_index: '0',
};

const typeIcon: Record<LibraryItemType, typeof Headphones> = { audio: Headphones, book: BookOpen, script: FileText, pdf: FileText };
const typeColor: Record<LibraryItemType, string> = { audio: '#4169FF', book: '#FF8C42', script: '#A78BFA', pdf: '#16A34A' };
const typeLabel: Record<LibraryItemType, string> = { audio: 'Áudio', book: 'Livro', script: 'Script', pdf: 'PDF' };

function InputField({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={{ color: TEXT3, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{label}</label>{children}</div>;
}

const inputStyle = { backgroundColor: SURFACE2, border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' };

export function AdminConsultarPage() {
  const { items, loading, error, reload } = useLibraryItems(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [showSheet, setShowSheet] = useState(false);
  const [editingItem, setEditingItem] = useState<LibraryItemView | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filtered = items.filter(item => {
    const term = search.toLowerCase();
    return (item.title.toLowerCase().includes(term) || (item.category ?? '').toLowerCase().includes(term))
      && (activeFilter === 'all' || item.type === activeFilter);
  });
  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'Todos' }, { id: 'audio', label: 'Áudios' }, { id: 'book', label: 'Livros' },
    { id: 'script', label: 'Scripts' }, { id: 'pdf', label: 'PDFs' },
  ];

  const closeSheet = () => {
    setShowSheet(false); setEditingItem(null); setForm(EMPTY_FORM);
    setCoverFile(null); setContentFile(null); setFormError(null);
  };
  const openCreate = () => {
    setEditingItem(null);
    setForm({ ...EMPTY_FORM, order_index: String(items.length ? Math.max(...items.map(item => item.order_index)) + 1 : 1) });
    setCoverFile(null); setContentFile(null); setFormError(null); setShowSheet(true);
  };
  const openEdit = (item: LibraryItemView) => {
    setEditingItem(item);
    setForm({
      type: item.type, title: item.title, subtitle: item.subtitle ?? '', description: item.description ?? '',
      category: item.category ?? '', content: item.content ?? '', duration_minutes: item.duration_minutes?.toString() ?? '',
      pages: item.pages?.toString() ?? '', is_published: item.is_published, order_index: String(item.order_index),
    });
    setCoverFile(null); setContentFile(null); setFormError(null); setShowSheet(true);
  };
  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm(current => ({ ...current, [key]: value }));

  const save = async () => {
    if (!form.title.trim()) { setFormError('Informe o título.'); return; }
    setSaving(true); setFormError(null);
    let uploaded: { coverPath: string | null; filePath: string | null } | null = null;
    try {
      uploaded = await replaceLibraryFiles(editingItem, coverFile, contentFile);
      const text = form.content.trim();
      const payload: LibraryItemInput = {
        type: form.type,
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        description: form.description.trim() || null,
        category: form.category.trim() || null,
        cover_url: uploaded.coverPath,
        file_url: form.type === 'script' ? null : uploaded.filePath,
        content: form.type === 'script' ? text || null : null,
        duration_minutes: form.type === 'audio' && form.duration_minutes ? Number(form.duration_minutes) : null,
        pages: (form.type === 'book' || form.type === 'pdf') && form.pages ? Number(form.pages) : null,
        line_count: form.type === 'script' && text ? text.split(/\r?\n/).length : editingItem?.type === 'script' ? editingItem.line_count : null,
        is_published: form.is_published,
        order_index: Number(form.order_index) || 0,
      };
      const result = editingItem ? await updateLibraryItem(editingItem.id, payload) : await createLibraryItem(payload);
      if (result.error) throw result.error;
      await removeReplacedLibraryFiles(editingItem, payload.cover_url, payload.file_url);
      await reload();
      closeSheet();
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : 'Não foi possível salvar o conteúdo.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: LibraryItemView) => {
    if (!window.confirm(`Excluir “${item.title}”?`)) return;
    const result = await deleteLibraryItem(item);
    if (result.error) window.alert(result.error.message);
    else await reload();
  };

  const togglePublished = async (item: LibraryItemView) => {
    const result = await updateLibraryItem(item.id, { is_published: !item.is_published });
    if (result.error) window.alert(result.error.message);
    else await reload();
  };

  return <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
    <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(to bottom, #0D0822, ${BG})` }}><h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Consultar</h1><p style={{ color: TEXT2, fontSize: 13 }}>Gerenciamento do arsenal de conteúdos</p></div>
    <div className="px-5 mb-4"><div className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}><Search size={15} style={{ color: TEXT3, flexShrink: 0 }} /><input type="text" placeholder="Buscar conteúdo..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-white placeholder-[#666] outline-none" style={{ fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }} /></div></div>
    <div className="px-5 mb-5"><div className="flex gap-1 overflow-x-auto no-scrollbar">{filters.map(filter => <button key={filter.id} onClick={() => setActiveFilter(filter.id)} className="flex-shrink-0 px-4 py-2" style={{ borderRadius: 100, backgroundColor: activeFilter === filter.id ? PRIMARY : 'transparent', color: activeFilter === filter.id ? '#fff' : TEXT2, fontSize: 12, fontWeight: 500, transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{filter.label}</button>)}</div></div>

    <div className="px-5"><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {filtered.map(item => { const Icon = typeIcon[item.type]; const color = typeColor[item.type]; const detail = item.type === 'audio' ? `${item.duration_minutes ?? 0} min` : item.type === 'script' ? `${item.line_count ?? 0} linhas` : `${item.pages ?? 0} pág`; return <div key={item.id} className="relative group"><div className="relative overflow-hidden" style={{ aspectRatio: '9/16', borderRadius: 12, border: `1px solid ${BORDER}`, opacity: item.is_published ? 1 : .65 }}>
        <ImageWithFallback src={item.cover_src ?? ''} alt={item.title} className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1" style={{ backgroundColor: color + '25', backdropFilter: 'blur(8px)', borderRadius: 6 }}><Icon size={11} style={{ color }} /><span style={{ color, fontSize: 9, fontWeight: 500 }}>{typeLabel[item.type]}</span></div>
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          <button onClick={() => openEdit(item)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(124,58,237,0.85)', backdropFilter: 'blur(8px)' }}><Edit3 size={11} className="text-white" /></button>
          <button onClick={() => void togglePublished(item)} title={item.is_published ? 'Despublicar' : 'Publicar'} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(30,64,175,0.85)', backdropFilter: 'blur(8px)' }}>{item.is_published ? <Eye size={11} className="text-white" /> : <EyeOff size={11} className="text-white" />}</button>
          <button onClick={() => void remove(item)} className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(220,38,38,0.75)', backdropFilter: 'blur(8px)' }}><Trash2 size={11} className="text-white" /></button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3"><p style={{ color, fontSize: 9, fontWeight: 500, marginBottom: 2, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.category}</p><h4 className="text-white mb-2" style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.3, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.title}</h4><div className="flex justify-between"><span style={{ color: TEXT3, fontSize: 9, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{detail}</span><span style={{ color: TEXT2, fontSize: 9, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.views} views</span></div></div>
      </div></div>; })}
    </div>
    {(loading || error || filtered.length === 0) && <div className="py-12 text-center" style={{ color: TEXT3, fontSize: 14 }}>{loading ? 'Carregando conteúdos...' : error ? 'Não foi possível carregar os conteúdos.' : 'Nenhum conteúdo encontrado.'}</div>}</div>

    <button onClick={openCreate} className="fixed z-30 flex items-center gap-2 px-5 py-3.5 shadow-lg" style={{ bottom: 80, right: 20, backgroundColor: PRIMARY, borderRadius: 100, boxShadow: '0 4px 20px rgba(124,58,237,0.4)' }}><Plus size={18} className="text-white" /><span className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Novo Conteúdo</span></button>

    <AnimatePresence>{showSheet && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1200] flex items-end"><div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeSheet} /><motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} className="relative w-full z-10 space-y-4 max-h-[92vh] overflow-y-auto" style={{ backgroundColor: SURFACE, borderRadius: '16px 16px 0 0', border: `1px solid ${BORDER}`, padding: '24px 20px 48px' }}>
      <div className="w-10 h-1 rounded-full mx-auto" style={{ backgroundColor: BORDER }} /><div className="flex items-center justify-between"><h3 className="text-white" style={{ fontSize: 18, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{editingItem ? 'Editar Conteúdo' : 'Novo Conteúdo'}</h3><button onClick={closeSheet}><X size={18} style={{ color: TEXT2 }} /></button></div>
      <InputField label="TIPO"><select value={form.type} onChange={e => setField('type', e.target.value as LibraryItemType)} className="w-full text-white outline-none" style={inputStyle}><option value="audio">Áudio</option><option value="book">Livro</option><option value="pdf">PDF</option><option value="script">Script</option></select></InputField>
      <InputField label="TÍTULO"><input value={form.title} onChange={e => setField('title', e.target.value)} type="text" placeholder="Nome do conteúdo" className="w-full text-white outline-none" style={inputStyle} /></InputField>
      {(form.type === 'book' || form.type === 'pdf') && <InputField label="SUBTÍTULO"><input value={form.subtitle} onChange={e => setField('subtitle', e.target.value)} type="text" placeholder="Subtítulo" className="w-full text-white outline-none" style={inputStyle} /></InputField>}
      <InputField label="DESCRIÇÃO"><textarea value={form.description} onChange={e => setField('description', e.target.value)} placeholder="Descrição do conteúdo" rows={3} className="w-full text-white outline-none resize-none" style={inputStyle} /></InputField>
      <InputField label="CATEGORIA"><input value={form.category} onChange={e => setField('category', e.target.value)} type="text" placeholder="Categoria" className="w-full text-white outline-none" style={inputStyle} /></InputField>
      <InputField label={form.type === 'script' ? 'CAPA (OPCIONAL)' : 'CAPA'}><input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] ?? null)} className="w-full text-white" style={inputStyle} /></InputField>
      {form.type !== 'script' && <InputField label={form.type === 'audio' ? 'ARQUIVO DE ÁUDIO' : 'ARQUIVO'}><input type="file" accept={form.type === 'audio' ? 'audio/*' : '.pdf,.epub,application/pdf,application/epub+zip'} onChange={e => setContentFile(e.target.files?.[0] ?? null)} className="w-full text-white" style={inputStyle} /></InputField>}
      {(form.type === 'book' || form.type === 'pdf') && <InputField label="PÁGINAS"><input value={form.pages} onChange={e => setField('pages', e.target.value)} type="number" min="0" className="w-full text-white outline-none" style={inputStyle} /></InputField>}
      {form.type === 'audio' && <InputField label="DURAÇÃO (MINUTOS)"><input value={form.duration_minutes} onChange={e => setField('duration_minutes', e.target.value)} type="number" min="0" className="w-full text-white outline-none" style={inputStyle} /></InputField>}
      {form.type === 'script' && <InputField label="CONTEÚDO TEXTUAL"><textarea value={form.content} onChange={e => setField('content', e.target.value)} placeholder="Digite o script" rows={8} className="w-full text-white outline-none resize-y" style={inputStyle} /><p style={{ color: TEXT3, fontSize: 10, marginTop: 6 }}>{form.content.trim() ? form.content.trim().split(/\r?\n/).length : 0} linhas</p></InputField>}
      <InputField label="ORDEM"><input value={form.order_index} onChange={e => setField('order_index', e.target.value)} type="number" className="w-full text-white outline-none" style={inputStyle} /></InputField>
      <label className="flex items-center gap-3 text-white text-sm"><input type="checkbox" checked={form.is_published} onChange={e => setField('is_published', e.target.checked)} /> Publicado</label>
      {formError && <p className="text-sm" style={{ color: '#FCA5A5' }}>{formError}</p>}
      <button disabled={saving} onClick={() => void save()} className="w-full py-4 text-white" style={{ backgroundColor: PRIMARY, borderRadius: 10, fontSize: 14, fontWeight: 500, opacity: saving ? .6 : 1, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{saving ? 'Salvando...' : editingItem ? 'Salvar Alterações' : 'Criar Conteúdo'}</button>
    </motion.div></motion.div>}</AnimatePresence>
  </div>;
}
