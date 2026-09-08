import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface StudyModeProps {
  lessonId: number;
  onClose: () => void;
}

type CardType = 'video' | 'text' | 'image' | 'quiz';

interface StudyCard {
  id: number;
  type: CardType;
  content: string;
  quizOptions?: string[];
  correctAnswer?: number;
}

export function StudyMode({ lessonId, onClose }: StudyModeProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const lessonCards: StudyCard[] = [
    { id: 1, type: 'text', content: 'O PODER NÃO É DADO. É TOMADO.' },
    { id: 2, type: 'text', content: 'QUEM CONTROLA O FRAME CONTROLA A INTERAÇÃO.' },
    { id: 3, type: 'text', content: 'SUA PRESENÇA DEVE SER SENTIDA ANTES MESMO DE VOCÊ FALAR.' },
    {
      id: 4,
      type: 'quiz',
      content: 'Qual é o elemento mais importante do frame control?',
      quizOptions: ['Falar mais alto que os outros', 'Manter sua realidade inabalável', 'Concordar com tudo', 'Ser agressivo'],
      correctAnswer: 1
    },
    { id: 5, type: 'text', content: 'PARABÉNS! VOCÊ DOMINOU OS FUNDAMENTOS DO PODER.' }
  ];

  const currentCard = lessonCards[currentCardIndex];
  const isLastCard = currentCardIndex === lessonCards.length - 1;
  const isFirstCard = currentCardIndex === 0;

  const handleNext = () => {
    if (currentCard.type === 'quiz' && !showAnswer) {
      setShowAnswer(true);
      return;
    }
    if (currentCardIndex < lessonCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const renderCardContent = () => {
    switch (currentCard.type) {
      case 'text':
        return (
          <div className="flex-1 flex items-center justify-center p-8">
            <h2 className="text-white text-4xl md:text-6xl text-center leading-tight" style={{ fontWeight: 900 }}>
              {currentCard.content}
            </h2>
          </div>
        );
      case 'quiz':
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full">
            <h3 className="text-white text-3xl mb-8 text-center" style={{ fontWeight: 900 }}>{currentCard.content}</h3>
            <div className="w-full space-y-3">
              {currentCard.quizOptions?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentCard.correctAnswer;
                const showResult = showAnswer;
                return (
                  <button
                    key={index}
                    onClick={() => !showAnswer && setSelectedAnswer(index)}
                    disabled={showAnswer}
                    className="w-full p-4 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: showResult ? (isCorrect ? '#00800020' : isSelected && !isCorrect ? '#4169FF20' : '#0A0A0A') : isSelected ? '#4169FF20' : '#0A0A0A',
                      border: showResult ? (isCorrect ? '2px solid #008000' : isSelected && !isCorrect ? '2px solid #4169FF' : '1px solid #1A1A1A') : isSelected ? '2px solid #4169FF' : '1px solid #1A1A1A',
                      cursor: showAnswer ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white" style={{ fontWeight: 700 }}>{option}</span>
                      {showResult && isCorrect && <CheckCircle size={24} className="text-[#008000]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-[#4169FF] flex items-center justify-center">
            <X size={20} className="text-white" />
          </button>
          <div>
            <p className="text-[#4169FF] text-sm" style={{ fontWeight: 800 }}>AULA {lessonId}</p>
            <p className="text-[#666] text-xs">Card {currentCardIndex + 1} de {lessonCards.length}</p>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div className="h-full bg-[#4169FF] rounded-full transition-all" style={{ width: `${((currentCardIndex + 1) / lessonCards.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {renderCardContent()}

      <div className="p-6 border-t border-[#1A1A1A] flex items-center justify-between gap-4">
        <button onClick={handleBack} disabled={isFirstCard} className="flex-1 py-3 rounded-full transition-all" style={{ border: '2px solid #4169FF', color: isFirstCard ? '#666' : '#4169FF', borderColor: isFirstCard ? '#333' : '#4169FF', fontWeight: 800, opacity: isFirstCard ? 0.3 : 1, cursor: isFirstCard ? 'not-allowed' : 'pointer' }}>
          <div className="flex items-center justify-center gap-2">
            <ChevronLeft size={20} />
            VOLTAR
          </div>
        </button>

        <button onClick={handleNext} disabled={currentCard.type === 'quiz' && selectedAnswer === null && !showAnswer} className="flex-1 py-3 bg-[#4169FF] text-white rounded-full transition-all hover:bg-[#5B7FFF]" style={{ fontWeight: 800, opacity: currentCard.type === 'quiz' && selectedAnswer === null && !showAnswer ? 0.5 : 1 }}>
          <div className="flex items-center justify-center gap-2">
            {isLastCard ? 'CONCLUIR' : currentCard.type === 'quiz' && !showAnswer ? 'CONFIRMAR' : 'AVANÇAR'}
            <ChevronRight size={20} />
          </div>
        </button>
      </div>
    </div>
  );
}
