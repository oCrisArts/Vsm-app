import { useMemo, useState } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLessonContent } from '../../lib/hooks/useLearning';
import { useProgress } from '../../lib/hooks/useProgress';
import type { LessonBlock, QuizQuestion } from '../../lib/types';
import { XPToast } from './XPToast';

type StudyCard = { id: string; type: 'block'; block: LessonBlock } | { id: string; type: 'quiz'; question: QuizQuestion };
interface Props { lessonId: string; userId: string; onClose: () => void; }

export function StudyModeSupabase({ lessonId, userId, onClose }: Props) {
  const { lesson, blocks, quizzes, loading, error } = useLessonContent(lessonId);
  const { markComplete } = useProgress(userId);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);
  const [completionError, setCompletionError] = useState<string | null>(null);
  const cards = useMemo<StudyCard[]>(() => {
    const blockCards = blocks.map(block => ({ id: block.id, type: 'block' as const, block }));
    const quizCards = quizzes.flatMap(quiz => quiz.quiz_questions.sort((a, b) => a.order_index - b.order_index).map(question => ({ id: question.id, type: 'quiz' as const, question })));
    return blockCards.length > 1 ? [...blockCards.slice(0, -1), ...quizCards, blockCards[blockCards.length - 1]] : [...blockCards, ...quizCards];
  }, [blocks, quizzes]);
  if (loading) return <div className="fixed inset-0 bg-black text-[#666] p-6">Carregando aula...</div>;
  if (error) return <div className="fixed inset-0 bg-black text-[#666] p-6">Não foi possível carregar a aula.</div>;
  if (!lesson || cards.length === 0) return <div className="fixed inset-0 bg-black text-[#666] p-6"><button onClick={onClose}>Fechar</button><p className="mt-4">Aula sem conteúdo publicado.</p></div>;
  const currentCard = cards[currentCardIndex]; const isLast = currentCardIndex === cards.length - 1; const isFirst = currentCardIndex === 0;
  const next = async () => { if (currentCard.type === 'quiz' && !showAnswer) { setShowAnswer(true); return; } if (!isLast) { setCurrentCardIndex(i => i + 1); setSelectedAnswer(null); setShowAnswer(false); } else { const result = await markComplete(lessonId); if (result?.error) { setCompletionError(result.error.message); return; } const payload = result?.data as { xp_awarded?: number } | null; const gained = Number(payload?.xp_awarded ?? 0); if (gained > 0) { setXpAwarded(gained); window.setTimeout(onClose, 1200); } else onClose(); } };
  return <div className="fixed inset-0 bg-black z-50 flex flex-col">
    <XPToast visible={xpAwarded > 0} xp={xpAwarded} label="" onHide={() => setXpAwarded(0)} />
    <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A]"><div className="flex items-center gap-4"><button onClick={onClose} className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-[#4169FF] flex items-center justify-center"><X size={20} className="text-white" /></button><div><p className="text-[#4169FF] text-sm" style={{ fontWeight: 800 }}>{lesson.title}</p><p className="text-[#666] text-xs">Card {currentCardIndex + 1} de {cards.length}</p></div></div><div className="flex-1 max-w-md mx-8"><div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden"><div className="h-full bg-[#4169FF] rounded-full transition-all" style={{ width: `${((currentCardIndex + 1) / cards.length) * 100}%` }} /></div></div></div>
    {currentCard.type === 'block' ? <div className="flex-1 flex items-center justify-center p-8">{currentCard.block.type === 'text' ? <h2 className="text-white text-4xl md:text-6xl text-center leading-tight" style={{ fontWeight: 900 }}>{currentCard.block.content}</h2> : currentCard.block.type === 'image' ? <img src={currentCard.block.media_url ?? ''} alt={currentCard.block.title ?? lesson.title} className="max-h-full max-w-full object-contain" /> : <div className="w-full max-w-3xl text-center text-white"><h2 className="text-2xl mb-5">{currentCard.block.title}</h2>{currentCard.block.type === 'video' ? <video controls src={currentCard.block.media_url ?? ''} className="w-full" /> : <audio controls src={currentCard.block.media_url ?? ''} className="w-full" />}</div>}</div> : <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full"><h3 className="text-white text-3xl mb-8 text-center" style={{ fontWeight: 900 }}>{currentCard.question.question}</h3><div className="w-full space-y-3">{currentCard.question.options.map((option, index) => { const selected = selectedAnswer === index; const correct = index === currentCard.question.correct_answer; return <button key={option} onClick={() => !showAnswer && setSelectedAnswer(index)} disabled={showAnswer} className="w-full p-4 rounded-xl text-left transition-all" style={{ backgroundColor: showAnswer && correct ? '#00800020' : selected ? '#4169FF20' : '#0A0A0A', border: showAnswer && correct ? '2px solid #008000' : selected ? '2px solid #4169FF' : '1px solid #1A1A1A' }}><div className="flex items-center justify-between"><span className="text-white" style={{ fontWeight: 700 }}>{option}</span>{showAnswer && correct && <CheckCircle size={24} className="text-[#008000]" />}</div></button>; })}</div></div>}
    {completionError && <p className="px-6 pb-2 text-center text-[#FF6B6B] text-xs">{completionError}</p>}
    <div className="p-6 border-t border-[#1A1A1A] flex items-center justify-between gap-4"><button onClick={() => { if (!isFirst) { setCurrentCardIndex(i => i - 1); setSelectedAnswer(null); setShowAnswer(false); } }} disabled={isFirst} className="flex-1 py-3 rounded-full" style={{ border: `2px solid ${isFirst ? '#333' : '#4169FF'}`, color: isFirst ? '#666' : '#4169FF', fontWeight: 800, opacity: isFirst ? .3 : 1 }}><div className="flex items-center justify-center gap-2"><ChevronLeft size={20} />VOLTAR</div></button><button onClick={() => void next()} disabled={currentCard.type === 'quiz' && selectedAnswer === null && !showAnswer} className="flex-1 py-3 bg-[#4169FF] text-white rounded-full" style={{ fontWeight: 800, opacity: currentCard.type === 'quiz' && selectedAnswer === null && !showAnswer ? .5 : 1 }}><div className="flex items-center justify-center gap-2">{isLast ? 'CONCLUIR' : currentCard.type === 'quiz' && !showAnswer ? 'CONFIRMAR' : 'AVANÇAR'}<ChevronRight size={20} /></div></button></div>
  </div>;
}
