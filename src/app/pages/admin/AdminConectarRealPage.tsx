import { useCallback, useEffect, useMemo, useState } from 'react';
import { Calendar, MapPin, TrendingUp, Users } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Contact, Profile } from '../../../lib/types';

const BG='#121212', SURFACE='#1E1E1E', BORDER='#2A2A2A', PRIMARY='#7C3AED', TEXT2='#9E9E9E', TEXT3='#666666';

export function AdminConectarRealPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filter, setFilter] = useState<'todos'|'confirmado'|'pendente'>('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    const [contactResult, profileResult] = await Promise.all([
      supabase.from('contacts').select('*').not('meeting_date', 'is', null).order('meeting_date'),
      supabase.from('profiles').select('*'),
    ]);
    const firstError = contactResult.error ?? profileResult.error;
    if (firstError) setError(firstError.message);
    setContacts((contactResult.data ?? []) as Contact[]);
    setProfiles((profileResult.data ?? []) as Profile[]);
    setLoading(false);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const meetings = useMemo(() => contacts.map(contact => ({ ...contact, confirmed: contact.stage === 'Encontro Solicitado' })), [contacts]);
  const filtered = meetings.filter(meeting => filter === 'todos' || (filter === 'confirmado' ? meeting.confirmed : !meeting.confirmed));
  const nameFor = (userId: string) => profiles.find(profile => profile.id === userId)?.display_name || profiles.find(profile => profile.id === userId)?.email || 'Usuário';

  return <div className="min-h-screen pb-28" style={{ backgroundColor: BG }}>
    <div className="px-5 pt-4 pb-5" style={{ background: `linear-gradient(to bottom, #0D0822, ${BG})` }}><h1 className="text-white mb-1" style={{ fontSize: 28, fontWeight: 500 }}>Conectar</h1><p style={{ color: TEXT2, fontSize: 13 }}>Gerenciamento de contatos e encontros</p></div>
    <div className="px-5 mb-6"><div className="grid grid-cols-3 gap-3">{[
      { label:'Encontros', value:meetings.length, Icon:Calendar, color:PRIMARY },
      { label:'Confirmados', value:meetings.filter(item=>item.confirmed).length, Icon:TrendingUp, color:'#16A34A' },
      { label:'Alunos', value:new Set(meetings.map(item=>item.user_id)).size, Icon:Users, color:'#FF8C42' },
    ].map(({label,value,Icon,color}) => <div key={label} style={{ backgroundColor:SURFACE,border:`1px solid ${BORDER}`,borderRadius:12,padding:16 }}><div className="flex flex-col items-center text-center"><div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{backgroundColor:color+'20'}}><Icon size={16} style={{color}} /></div><p style={{color,fontSize:22,fontWeight:500}}>{value}</p><p style={{color:TEXT2,fontSize:10}}>{label}</p></div></div>)}</div></div>
    <div className="px-5 mb-5 flex gap-1">{(['todos','confirmado','pendente'] as const).map(value=><button key={value} onClick={()=>setFilter(value)} className="px-4 py-2 capitalize" style={{borderRadius:100,backgroundColor:filter===value?PRIMARY:'transparent',color:filter===value?'#fff':TEXT2,fontSize:12}}>{value==='todos'?'Todos':value==='confirmado'?'Confirmados':'Pendentes'}</button>)}</div>
    {loading && <p className="px-5" style={{color:TEXT3,fontSize:13}}>Carregando encontros...</p>}
    {error && <p className="px-5" style={{color:'#FCA5A5',fontSize:13}}>Não foi possível carregar: {error}</p>}
    {!loading && !error && filtered.length===0 && <p className="px-5" style={{color:TEXT3,fontSize:13}}>Nenhum encontro agendado.</p>}
    <div className="px-5 space-y-3">{filtered.map(meeting=><div key={meeting.id} className="flex items-start gap-3 px-4 py-4" style={{backgroundColor:SURFACE,border:`1px solid ${BORDER}`,borderRadius:12}}><div className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{background:'linear-gradient(135deg,#7C3AED,#1E40AF)',fontSize:12}}>{meeting.name.slice(0,2).toUpperCase()}</div><div className="flex-1 min-w-0"><div className="flex items-center gap-2 mb-1"><p className="text-white truncate" style={{fontSize:14,fontWeight:500}}>{nameFor(meeting.user_id)} → {meeting.name}</p><span className="px-1.5 py-0.5 rounded" style={{fontSize:9,backgroundColor:meeting.confirmed?'#14532D':'#44380A',color:meeting.confirmed?'#86EFAC':'#FDE68A'}}>{meeting.confirmed?'CONFIRMADO':'PENDENTE'}</span></div><div className="flex items-center gap-3"><span className="flex items-center gap-1" style={{color:TEXT2,fontSize:11}}><Calendar size={11}/>{meeting.meeting_date ? new Intl.DateTimeFormat('pt-BR').format(new Date(`${meeting.meeting_date}T12:00:00`)) : ''} · {meeting.meeting_time || '--:--'}</span><span className="flex items-center gap-1" style={{color:TEXT3,fontSize:11}}><MapPin size={11}/>{meeting.meeting_location || 'Local a definir'}</span></div></div></div>)}</div>
  </div>;
}
