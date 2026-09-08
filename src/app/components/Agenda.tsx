import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, Calendar, ChevronLeft, StickyNote,
  Clock, Edit3, CheckCircle2, User, Hash, X, Plus
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// ── Design tokens ──────────────────────────────────────────
const BG      = '#121212';
const SURFACE  = '#1E1E1E';
const SURFACE2 = '#252525';
const BORDER   = '#2A2A2A';
const PRIMARY  = '#1E40AF';
const TEXT     = '#FFFFFF';
const TEXT2    = '#9E9E9E';
const TEXT3    = '#666666';
const NAV_H    = 64; // bottom nav height in px

// Stage badges — solid background, accessible contrast (WCAG AA)
const stageBadge: Record<Stage, { bg: string; text: string; label: string }> = {
  'Abridor Enviado':       { bg: '#374151', text: '#D1D5DB', label: 'Início' },
  'Conversa Fluindo':      { bg: '#1C2B1A', text: '#86EFAC', label: 'Em Andamento' },
  'Conforto Estabelecido': { bg: '#1E3A5F', text: '#93C5FD', label: 'Avançado' },
  'Encontro Solicitado':   { bg: '#14532D', text: '#86EFAC', label: 'Final' },
};

type Stage = 'Abridor Enviado' | 'Conversa Fluindo' | 'Conforto Estabelecido' | 'Encontro Solicitado';

interface Contact {
  id: number;
  name: string;
  age: number;
  photo: string;
  stage: Stage;
  progress: number;
  platform: string;
  lastContact: string;
  notes: string;
  date?: string;
  time?: string;
  location?: string;
}

const stageColor: Record<Stage, string> = {
  'Abridor Enviado':       '#6B7280',
  'Conversa Fluindo':      '#FF8C42',
  'Conforto Estabelecido': '#1E40AF',
  'Encontro Solicitado':   '#16A34A',
};

const stageProgress: Record<Stage, number> = {
  'Abridor Enviado':       15,
  'Conversa Fluindo':      42,
  'Conforto Estabelecido': 70,
  'Encontro Solicitado':   90,
};

const STAGES: Stage[] = ['Abridor Enviado', 'Conversa Fluindo', 'Conforto Estabelecido', 'Encontro Solicitado'];

const INITIAL_CONTACTS: Contact[] = [
  { id: 1, name: 'Isabela', age: 24, photo: 'https://images.unsplash.com/photo-1621012649112-d1724740b0da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', stage: 'Encontro Solicitado', progress: 88, platform: 'Tinder', lastContact: '1h atrás', notes: 'Adora café e yoga. Respondeu bem ao opener indireto. Gosta de arte contemporânea.', date: '2026-02-21', time: '20:00', location: 'Bar Astor' },
  { id: 2, name: 'Camila', age: 26, photo: 'https://images.unsplash.com/photo-1749700332031-cf99864959ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', stage: 'Conforto Estabelecido', progress: 68, platform: 'Instagram', lastContact: '3h atrás', notes: 'Personal trainer. Gatilho: desafio e competição. Frame de abundância funcionou bem.' },
  { id: 3, name: 'Fernanda', age: 23, photo: 'https://images.unsplash.com/photo-1630845175575-b5c2495cb409?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', stage: 'Conversa Fluindo', progress: 42, platform: 'Bumble', lastContact: 'Ontem', notes: 'Arquiteta, inteligente. Prefere conversas profundas. Evitar tópicos superficiais.' },
  { id: 4, name: 'Larissa', age: 25, photo: 'https://images.unsplash.com/photo-1680520919302-29d5e104ba7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', stage: 'Conversa Fluindo', progress: 38, platform: 'Hinge', lastContact: '2h atrás', notes: 'Médica residente. Pouco tempo disponível. Responde melhor à noite.' },
  { id: 5, name: 'Vitória', age: 22, photo: 'https://images.unsplash.com/photo-1762195020829-835d05d3ee80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', stage: 'Abridor Enviado', progress: 15, platform: 'Instagram', lastContact: 'Agora', notes: '' },
  { id: 6, name: 'Rafaela', age: 27, photo: 'https://images.unsplash.com/photo-1732615578605-ed5ed7c2b9b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800', stage: 'Abridor Enviado', progress: 20, platform: 'Tinder', lastContact: '4h atrás', notes: '' },
];

const EMPTY_CONTACT: Contact = {
  id: 0,
  name: '',
  age: 18,
  photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
  stage: 'Abridor Enviado',
  progress: 15,
  platform: 'Instagram',
  lastContact: 'Hoje',
  notes: '',
};

/* ───────────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                          */
/* ───────────────────────────────────────────────────────── */
export function Agenda() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Edit draft — mirrors selected while editing
  const [draft, setDraft] = useState<Contact | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const openContact = (c: Contact) => {
    setSelected(c);
    setDraft({ ...c });
    setIsEditing(false);
  };

  const createContact = () => {
    const newContact = { ...EMPTY_CONTACT };
    setSelected(newContact);
    setDraft(newContact);
    setIsEditing(true);
  };

  const startEdit = () => {
    if (!selected) return;
    setDraft({ ...selected });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    if (selected?.id === 0) {
      // If cancelling creation, go back
      back();
    } else {
      setDraft(selected ? { ...selected } : null);
      setIsEditing(false);
    }
  };

  const saveMission = () => {
    if (!draft) return;
    const updated: Contact = {
      ...draft,
      progress: stageProgress[draft.stage],
      id: draft.id === 0 ? Date.now() : draft.id,
    };
    
    setContacts(prev => {
      if (draft.id === 0) return [...prev, updated];
      return prev.map(c => c.id === updated.id ? updated : c);
    });
    
    setSelected(updated);
    setDraft({ ...updated });
    setIsEditing(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const back = () => {
    setSelected(null);
    setDraft(null);
    setIsEditing(false);
  };

  const scheduledDates = contacts.filter(c => c.date);

  /* ── DETAIL PAGE ── */
  if (selected && draft) {
    return (
      <DetailPage
        contact={selected}
        draft={draft}
        isEditing={isEditing}
        savedFlash={savedFlash}
        onDraftChange={setDraft}
        onBack={back}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onSave={saveMission}
      />
    );
  }

  /* ── LIST VIEW ── */
  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(to bottom, #0A1220, ${BG})` }}>
        <h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '0.02em', lineHeight: 1.3, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Conectar
        </h1>
        <p style={{ color: TEXT2, fontSize: 13, fontWeight: 400, lineHeight: 1.5 }}>
          CRM Social — Central De Missões
        </p>
      </div>

      {/* PRÓXIMAS MISSÕES */}
      {scheduledDates.length > 0 && (
        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white" style={{ fontSize: 16, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Próximas Missões</h2>
            <span style={{ color: PRIMARY, fontSize: 12, fontWeight: 500 }}>{scheduledDates.length} confirmadas</span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {scheduledDates.map(d => (
              <motion.div
                key={d.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => openContact(d)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '9/16', borderRadius: 12, border: `1px solid ${BORDER}` }}>
                  <ImageWithFallback src={d.photo} alt={d.name} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,0.55) 50%, rgba(30,64,175,0.08) 100%)' }} />
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <span style={{ backgroundColor: '#14532D', color: '#86EFAC', fontSize: 9, fontWeight: 500, borderRadius: 6, padding: '2px 7px', letterSpacing: '0.04em' }}>CONFIRMADO</span>
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', color: '#CCC', fontSize: 9, fontWeight: 400, borderRadius: 6, padding: '2px 7px' }}>{d.platform}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white mb-0.5" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{d.name}</h4>
                    <p style={{ color: TEXT2, fontSize: 11, fontWeight: 400, marginBottom: 10 }}>{d.age} anos · {d.lastContact}</p>
                    {d.date && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Calendar size={11} style={{ color: '#93C5FD' }} />
                        <span style={{ color: '#93C5FD', fontSize: 11, fontWeight: 500 }}>
                          {new Date(d.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} · {d.time}
                        </span>
                      </div>
                    )}
                    {d.location && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <MapPin size={11} style={{ color: TEXT3 }} />
                        <span style={{ color: TEXT2, fontSize: 11, fontWeight: 400 }}>{d.location}</span>
                      </div>
                    )}
                    <div className="w-full h-1 mb-1" style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${d.progress}%`, backgroundColor: PRIMARY, borderRadius: 3 }} />
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: TEXT3, fontSize: 10, fontWeight: 400 }}>Match</span>
                      <span style={{ color: '#93C5FD', fontSize: 10, fontWeight: 500 }}>{d.progress}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* FUNIL */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white" style={{ fontSize: 16, fontWeight: 500, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Funil De Contatos</h2>
          <span style={{ color: TEXT3, fontSize: 12, fontWeight: 400 }}>{contacts.length} contatos</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contacts.map(contact => {
            const badge = stageBadge[contact.stage];
            return (
              <motion.div
                key={contact.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => openContact(contact)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: '9/16', borderRadius: 12, border: `1px solid ${BORDER}` }}>
                  <ImageWithFallback src={contact.photo} alt={contact.name} className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,0.55) 50%, rgba(30,64,175,0.08) 100%)' }} />
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', color: '#CCC', fontSize: 9, fontWeight: 400, borderRadius: 6, padding: '2px 7px' }}>{contact.platform}</span>
                    <span style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', color: TEXT2, fontSize: 9, fontWeight: 400, borderRadius: 6, padding: '2px 7px' }}>{contact.lastContact}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3.5">
                    <div className="inline-flex items-center px-2 py-0.5 mb-2" style={{ backgroundColor: badge.bg, borderRadius: 6 }}>
                      <span style={{ color: badge.text, fontSize: 9, fontWeight: 500, letterSpacing: '0.03em' }}>{badge.label}</span>
                    </div>
                    <h4 className="text-white mb-0.5" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.3, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{contact.name}</h4>
                    <p style={{ color: TEXT2, fontSize: 11, fontWeight: 400, marginBottom: 12 }}>{contact.age} anos</p>
                    <div className="w-full h-1 mb-1" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 3 }}>
                      <motion.div
                        style={{ height: '100%', backgroundColor: PRIMARY, borderRadius: 3 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${contact.progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: TEXT3, fontSize: 10, fontWeight: 400 }}>Match</span>
                      <span style={{ color: '#93C5FD', fontSize: 10, fontWeight: 500 }}>{contact.progress}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FAB - Cadastrar Contato */}
      <button
        onClick={createContact}
        className="fixed z-30 flex items-center gap-2 px-5 py-3.5 shadow-lg"
        style={{
          bottom: 80, // clears the 64px nav + 16px breathing room
          right: 20,
          backgroundColor: PRIMARY,
          borderRadius: 100,
          boxShadow: `0 4px 20px rgba(30,64,175,0.4)`,
        }}
      >
        <Plus size={18} className="text-white" />
        <span className="text-white" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Cadastrar Contato</span>
      </button>
    </div>
  );
}

/* ───────────────────────────────────────────────────────── */
/*  DETAIL / EDIT PAGE                                      */
/* ───────────────────────────────────────────────────────── */
function DetailPage({
  contact, draft, isEditing, savedFlash,
  onDraftChange, onBack, onStartEdit, onCancelEdit, onSave,
}: {
  contact: Contact;
  draft: Contact;
  isEditing: boolean;
  savedFlash: boolean;
  onDraftChange: (d: Contact) => void;
  onBack: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
}) {
  const color = stageColor[contact.stage];
  const badge = stageBadge[contact.stage];

  const set = (key: keyof Contact, value: any) =>
    onDraftChange({ ...draft, [key]: value });

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="min-h-screen"
      style={{ backgroundColor: BG, paddingBottom: NAV_H + 80 }}
    >

      {/* ── TOP BAR (floats above card) ── */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 sticky top-0 z-30" style={{ backgroundColor: 'transparent' }}>
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'rgba(18,18,18,0.85)', backdropFilter: 'blur(12px)', border: `1px solid ${BORDER}` }}
        >
          <ChevronLeft size={20} className="text-white" />
        </button>

        <div className="flex items-center gap-2">
          {/* Saved flash */}
          <AnimatePresence>
            {savedFlash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="flex items-center gap-1.5 px-3 py-1.5"
                style={{ backgroundColor: '#14532D', borderRadius: 100 }}
              >
                <CheckCircle2 size={12} style={{ color: '#86EFAC' }} />
                <span style={{ color: '#86EFAC', fontSize: 11, fontWeight: 500 }}>Salvo</span>
              </motion.div>
            )}
          </AnimatePresence>

          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={onCancelEdit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full"
                style={{ backgroundColor: 'rgba(18,18,18,0.85)', backdropFilter: 'blur(12px)', border: `1px solid ${BORDER}` }}
              >
                <X size={13} className="text-white" />
                <span className="text-white" style={{ fontSize: 12, fontWeight: 500 }}>Cancelar</span>
              </button>
              <button
                onClick={onSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full"
                style={{ backgroundColor: PRIMARY, border: `1px solid ${PRIMARY}` }}
              >
                <CheckCircle2 size={13} className="text-white" />
                <span className="text-white" style={{ fontSize: 12, fontWeight: 500 }}>Salvar</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onStartEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full"
              style={{ backgroundColor: 'rgba(18,18,18,0.85)', backdropFilter: 'blur(12px)', border: `1px solid ${BORDER}` }}
            >
              <Edit3 size={13} className="text-white" />
              <span className="text-white" style={{ fontSize: 12, fontWeight: 500 }}>Editar</span>
            </button>
          )}
        </div>
      </div>

      {/* ── 9:16 HERO CARD ── */}
      <div className="px-5 mb-6" style={{ marginTop: -52 }}>
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: '9/16', borderRadius: 16, border: `1px solid ${BORDER}`, maxHeight: '72vh' }}
        >
          {/* Photo */}
          <ImageWithFallback
            src={contact.photo}
            alt={contact.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />

          {/* Cold overlay — Elite Skin */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #121212 0%, rgba(14,22,48,0.55) 45%, rgba(30,64,175,0.08) 100%)' }} />

          {/* Platform badge — top left */}
          <div className="absolute top-16 left-4 right-4 flex items-start justify-between">
            <span style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', color: '#CCC', fontSize: 10, fontWeight: 400, borderRadius: 6, padding: '3px 9px' }}>
              {contact.platform}
            </span>
            <span style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', color: TEXT2, fontSize: 10, fontWeight: 400, borderRadius: 6, padding: '3px 9px' }}>
              {contact.lastContact}
            </span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {/* Stage badge */}
            <div className="inline-flex items-center px-3 py-1 mb-3" style={{ backgroundColor: badge.bg, borderRadius: 8 }}>
              <span style={{ color: badge.text, fontSize: 10, fontWeight: 500, letterSpacing: '0.04em' }}>{badge.label} · {contact.stage}</span>
            </div>

            {/* Name + Age */}
            <h1 className="text-white mb-1" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.2, letterSpacing: '0.02em', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {contact.name || 'Nova Pessoa'}, {contact.age}
            </h1>
            <p style={{ color: TEXT2, fontSize: 13, fontWeight: 400, marginBottom: 16 }}>
              {contact.platform} · {contact.lastContact}
            </p>

            {/* Match progress */}
            <div className="w-full h-1.5 mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 4 }}>
              <motion.div
                style={{ height: '100%', backgroundColor: PRIMARY, borderRadius: 4 }}
                initial={{ width: 0 }}
                animate={{ width: `${contact.progress}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: TEXT3, fontSize: 11, fontWeight: 400 }}>Match Score</span>
              <span style={{ color: '#93C5FD', fontSize: 12, fontWeight: 500 }}>{contact.progress}%</span>
            </div>

            {/* Scheduled badge */}
            {contact.date && (
              <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: `1px solid rgba(255,255,255,0.08)` }}>
                <Calendar size={12} style={{ color: '#86EFAC' }} />
                <span style={{ color: '#86EFAC', fontSize: 11, fontWeight: 500 }}>
                  {new Date(contact.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} · {contact.time}
                </span>
                {contact.location && (
                  <>
                    <span style={{ color: TEXT3, fontSize: 11 }}>·</span>
                    <MapPin size={11} style={{ color: TEXT3 }} />
                    <span style={{ color: TEXT2, fontSize: 11, fontWeight: 400 }}>{contact.location}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── EDIT FORM ── */}
      <div className="px-5 space-y-5">

        {/* ── Dados Pessoais ── */}
        <Section label="Dados Da Pessoa" icon={<User size={14} style={{ color: PRIMARY }} />}>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Nome">
              <input
                disabled={!isEditing}
                value={draft.name}
                onChange={e => set('name', e.target.value)}
                className="w-full px-3 py-3 text-white text-sm focus:outline-none transition-all"
                style={{
                  backgroundColor: isEditing ? SURFACE2 : 'transparent',
                  border: `1px solid ${isEditing ? PRIMARY : BORDER}`,
                  borderRadius: 10,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  color: isEditing ? TEXT : TEXT2,
                  cursor: isEditing ? 'text' : 'default',
                }}
              />
            </Field>
            <Field label="Idade">
              <input
                disabled={!isEditing}
                type="number"
                value={draft.age}
                onChange={e => set('age', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-3 text-sm focus:outline-none transition-all"
                style={{
                  backgroundColor: isEditing ? SURFACE2 : 'transparent',
                  border: `1px solid ${isEditing ? PRIMARY : BORDER}`,
                  borderRadius: 10,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  color: isEditing ? TEXT : TEXT2,
                  cursor: isEditing ? 'text' : 'default',
                }}
              />
            </Field>
          </div>
        </Section>

        {/* ── Estágio da Conversa ── */}
        <Section label="Estágio Da Conversa" icon={<Hash size={14} style={{ color: PRIMARY }} />}>
          <div className="space-y-2">
            {STAGES.map(s => {
              const isActive = draft.stage === s;
              const sc = stageColor[s];
              return (
                <button
                  key={s}
                  onClick={() => isEditing && set('stage', s)}
                  disabled={!isEditing}
                  className="w-full flex items-center justify-between px-4 py-3 transition-all"
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${isActive ? sc : BORDER}`,
                    backgroundColor: isActive ? sc + '18' : 'transparent',
                    cursor: isEditing ? 'pointer' : 'default',
                    opacity: !isEditing && !isActive ? 0.45 : 1,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: isActive ? sc : BORDER }} />
                    <span style={{ color: isActive ? sc : TEXT2, fontSize: 13, fontWeight: 500, letterSpacing: '0.01em' }}>{s}</span>
                  </div>
                  {isActive && <CheckCircle2 size={15} style={{ color: sc }} />}
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Agendamento ── */}
        <Section label="Agendamento Do Encontro" icon={<Calendar size={14} style={{ color: PRIMARY }} />}>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Field label="Data">
              <input
                disabled={!isEditing}
                type="date"
                value={draft.date || ''}
                onChange={e => set('date', e.target.value)}
                className="w-full px-3 py-3 text-sm focus:outline-none transition-all"
                style={{
                  backgroundColor: isEditing ? SURFACE2 : 'transparent',
                  border: `1px solid ${isEditing ? PRIMARY : BORDER}`,
                  borderRadius: 10,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  color: isEditing ? TEXT : TEXT2,
                  colorScheme: 'dark',
                  cursor: isEditing ? 'pointer' : 'default',
                }}
              />
            </Field>
            <Field label="Horário">
              <input
                disabled={!isEditing}
                type="time"
                value={draft.time || ''}
                onChange={e => set('time', e.target.value)}
                className="w-full px-3 py-3 text-sm focus:outline-none transition-all"
                style={{
                  backgroundColor: isEditing ? SURFACE2 : 'transparent',
                  border: `1px solid ${isEditing ? PRIMARY : BORDER}`,
                  borderRadius: 10,
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  color: isEditing ? TEXT : TEXT2,
                  colorScheme: 'dark',
                  cursor: isEditing ? 'pointer' : 'default',
                }}
              />
            </Field>
          </div>
          <Field label="Local">
            <input
              disabled={!isEditing}
              type="text"
              value={draft.location || ''}
              onChange={e => set('location', e.target.value)}
              placeholder={isEditing ? 'Ex: Bar Astor, Rooftop...' : '—'}
              className="w-full px-3 py-3 text-sm focus:outline-none transition-all"
              style={{
                backgroundColor: isEditing ? SURFACE2 : 'transparent',
                border: `1px solid ${isEditing ? PRIMARY : BORDER}`,
                borderRadius: 10,
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                color: isEditing ? TEXT : TEXT2,
                cursor: isEditing ? 'text' : 'default',
              }}
            />
          </Field>
        </Section>

        {/* ── Notas Estratégicas ── */}
        <Section label="Notas Estratégicas" icon={<StickyNote size={14} style={{ color: PRIMARY }} />}>
          <textarea
            disabled={!isEditing}
            value={draft.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder={isEditing ? 'Anote interesses, gatilhos, detalhes relevantes...' : 'Sem notas ainda.'}
            rows={4}
            className="w-full px-4 py-3 text-sm focus:outline-none resize-none transition-all"
            style={{
              backgroundColor: isEditing ? SURFACE2 : 'transparent',
              border: `1px solid ${isEditing ? PRIMARY : BORDER}`,
              borderRadius: 10,
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              color: isEditing ? TEXT : TEXT2,
              cursor: isEditing ? 'text' : 'default',
              lineHeight: 1.6,
            }}
          />
        </Section>
        
        {/* Breathing room */}
        <div className="h-8" />
      </div>
    </motion.div>
  );
}

// ── Helper Components ──

function Section({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <span className="text-white" style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.02em' }}>{label}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="w-full">
      <label className="block mb-1.5" style={{ color: TEXT3, fontSize: 10, fontWeight: 500, letterSpacing: '0.04em' }}>{label}</label>
      {children}
    </div>
  );
}