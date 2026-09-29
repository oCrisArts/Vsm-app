import { useCallback, useEffect, useState } from 'react';
import { BookOpen, ChevronRight, DollarSign, Dumbbell, Utensils } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { supabase } from '../../../lib/supabase';
import type { BodyLog, DietLog, FinanceRecord, Profile } from '../../../lib/types';

const BG='#121212', SURFACE='#1E1E1E', SURFACE2='#252525', BORDER='#2A2A2A', PRIMARY='#7C3AED', TEXT2='#9E9E9E', TEXT3='#666666';
type MetricItem={id:string;title:string;type:string;value:string};

export function AdminEvoluirRealPage(){
  const [expanded,setExpanded]=useState('shape');
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);
  const [categories,setCategories]=useState<Array<{id:string;label:string;Icon:typeof Dumbbell;color:string;items:MetricItem[]}>>([]);

  const load=useCallback(async()=>{
    setLoading(true);setError(null);
    const [profilesResult,bodyResult,dietResult,financeResult]=await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('body_logs').select('*').order('logged_at',{ascending:false}),
      supabase.from('diet_logs').select('*').order('logged_at',{ascending:false}),
      supabase.from('finance_records').select('*').order('month_year',{ascending:false}),
    ]);
    const firstError=profilesResult.error??bodyResult.error??dietResult.error??financeResult.error;
    if(firstError){setError(firstError.message);setLoading(false);return;}
    const profiles=(profilesResult.data??[]) as Profile[];
    const label=(id:string)=>profiles.find(profile=>profile.id===id)?.display_name||profiles.find(profile=>profile.id===id)?.email||'Usuário';
    const bodies=(bodyResult.data??[]) as BodyLog[];
    const diets=(dietResult.data??[]) as DietLog[];
    const finances=(financeResult.data??[]) as FinanceRecord[];
    setCategories([
      {id:'shape',label:'Shape',Icon:Dumbbell,color:'#FF8C42',items:bodies.map(item=>({id:item.id,title:label(item.user_id),type:new Intl.DateTimeFormat('pt-BR').format(new Date(`${item.logged_at}T12:00:00`)),value:[item.weight!=null?`${item.weight} kg`:null,item.body_fat!=null?`${item.body_fat}%`:null].filter(Boolean).join(' · ')}))},
      {id:'dieta',label:'Dieta',Icon:Utensils,color:'#16A34A',items:diets.map(item=>({id:item.id,title:label(item.user_id),type:item.meal_label||new Intl.DateTimeFormat('pt-BR').format(new Date(`${item.logged_at}T12:00:00`)),value:`${item.calories} kcal`}))},
      {id:'financas',label:'Finanças',Icon:DollarSign,color:'#00C97E',items:finances.map(item=>({id:item.id,title:label(item.user_id),type:item.month_year,value:`R$ ${Number(item.income-item.expenses).toLocaleString('pt-BR')}`}))},
      {id:'conhecimento',label:'Conhecimento',Icon:BookOpen,color:'#4169FF',items:profiles.map(item=>({id:item.id,title:item.display_name||item.email,type:`Nível ${item.vsm_level}`,value:`${item.knowledge_score}/100`}))},
    ]);
    setLoading(false);
  },[]);
  useEffect(()=>{void load();},[load]);
  const total=categories.reduce((sum,category)=>sum+category.items.length,0);

  return <div className="min-h-screen pb-28" style={{backgroundColor:BG}}>
    <div className="px-5 pt-4 pb-5" style={{background:`linear-gradient(to bottom,#0D0822,${BG})`}}><h1 className="text-white mb-1" style={{fontSize:28,fontWeight:500}}>Evoluir</h1><p style={{color:TEXT2,fontSize:13}}>Métricas reais dos usuários</p></div>
    <div className="px-5 mb-6"><div className="grid grid-cols-2 gap-3"><div style={{backgroundColor:SURFACE,border:`1px solid ${BORDER}`,borderRadius:12,padding:16}}><p style={{color:TEXT3,fontSize:11,marginBottom:8}}>Registros</p><p style={{color:PRIMARY,fontSize:28,fontWeight:500}}>{total}</p></div><div style={{backgroundColor:SURFACE,border:`1px solid ${BORDER}`,borderRadius:12,padding:16}}><p style={{color:TEXT3,fontSize:11,marginBottom:8}}>Categorias</p><p style={{color:'#FF8C42',fontSize:28,fontWeight:500}}>{categories.length}</p></div></div></div>
    {loading&&<p className="px-5" style={{color:TEXT3,fontSize:13}}>Carregando métricas...</p>}{error&&<p className="px-5" style={{color:'#FCA5A5',fontSize:13}}>Não foi possível carregar: {error}</p>}
    <div className="px-5 space-y-2">{categories.map(category=>{const Icon=category.Icon;const open=expanded===category.id;return <div key={category.id} style={{backgroundColor:SURFACE,border:`1px solid ${BORDER}`,borderRadius:12,overflow:'hidden'}}><button onClick={()=>setExpanded(open?'':category.id)} className="w-full flex items-center justify-between px-4 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{backgroundColor:category.color+'20'}}><Icon size={16} style={{color:category.color}}/></div><div className="text-left"><p className="text-white" style={{fontSize:14,fontWeight:500}}>{category.label}</p><p style={{color:TEXT3,fontSize:11}}>{category.items.length} registros</p></div></div><motion.div animate={{rotate:open?90:0}}><ChevronRight size={16} style={{color:TEXT3}}/></motion.div></button><AnimatePresence>{open&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><div className="px-3 pb-3 space-y-2">{category.items.length===0&&<p className="px-3 py-4" style={{color:TEXT3,fontSize:12}}>Nenhum registro.</p>}{category.items.map(item=><div key={item.id} className="flex items-center justify-between gap-3 px-3 py-3" style={{backgroundColor:SURFACE2,borderRadius:9}}><div><p className="text-white" style={{fontSize:12}}>{item.title}</p><p style={{color:TEXT3,fontSize:10}}>{item.type}</p></div><span style={{color:category.color,fontSize:12,fontWeight:500}}>{item.value}</span></div>)}</div></motion.div>}</AnimatePresence></div>})}</div>
  </div>;
}
