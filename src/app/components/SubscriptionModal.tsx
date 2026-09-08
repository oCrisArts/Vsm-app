import { useState } from 'react';
import { X, Shield, CreditCard, Check, Zap } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  courseName: string;
}

export function SubscriptionModal({ isOpen, onClose, onSubscribe, courseName }: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [step, setStep] = useState<'plan' | 'payment' | 'success'>('plan');

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    return cleaned;
  };

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
    setTimeout(() => {
      onSubscribe();
      onClose();
      setStep('plan');
      setCardNumber('');
      setCardName('');
      setExpiry('');
      setCvv('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#0A0A0A] rounded-t-3xl sm:rounded-3xl border border-[#1A1A1A] z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-20"
        >
          <X size={20} className="text-white" />
        </button>

        {step === 'plan' && (
          <div className="p-6 pb-8">
            {/* Header */}
            <div className="text-center mb-6 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-[#4169FF]/20 flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-[#4169FF]" />
              </div>
              <h2 className="text-white text-2xl mb-2" style={{ fontWeight: 900 }}>
                DESBLOQUEAR ACESSO
              </h2>
              <p className="text-[#999] text-sm">
                Assine para acessar <span className="text-[#4169FF]" style={{ fontWeight: 800 }}>{courseName}</span> e todos os cursos
              </p>
            </div>

            {/* Plans */}
            <div className="space-y-3 mb-6">
              {/* Yearly Plan */}
              <button
                onClick={() => setSelectedPlan('yearly')}
                className="w-full p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden"
                style={{
                  backgroundColor: selectedPlan === 'yearly' ? '#4169FF10' : '#111',
                  borderColor: selectedPlan === 'yearly' ? '#4169FF' : '#1A1A1A',
                }}
              >
                {selectedPlan === 'yearly' && (
                  <div className="absolute top-0 right-0 bg-[#4169FF] px-3 py-1 rounded-bl-xl">
                    <span className="text-white text-[10px]" style={{ fontWeight: 900 }}>MELHOR OFERTA</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: selectedPlan === 'yearly' ? '#4169FF' : '#333' }}
                  >
                    {selectedPlan === 'yearly' && (
                      <div className="w-3 h-3 rounded-full bg-[#4169FF]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white" style={{ fontWeight: 800 }}>Plano Anual</p>
                    <p className="text-[#999] text-sm">Economize 60%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xl" style={{ fontWeight: 900 }}>R$ 29<span className="text-sm">,90/mês</span></p>
                    <p className="text-[#666] text-xs line-through">R$ 79,90/mês</p>
                  </div>
                </div>
              </button>

              {/* Monthly Plan */}
              <button
                onClick={() => setSelectedPlan('monthly')}
                className="w-full p-4 rounded-2xl border-2 transition-all text-left"
                style={{
                  backgroundColor: selectedPlan === 'monthly' ? '#4169FF10' : '#111',
                  borderColor: selectedPlan === 'monthly' ? '#4169FF' : '#1A1A1A',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: selectedPlan === 'monthly' ? '#4169FF' : '#333' }}
                  >
                    {selectedPlan === 'monthly' && (
                      <div className="w-3 h-3 rounded-full bg-[#4169FF]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-white" style={{ fontWeight: 800 }}>Plano Mensal</p>
                    <p className="text-[#999] text-sm">Cancele quando quiser</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-xl" style={{ fontWeight: 900 }}>R$ 79<span className="text-sm">,90/mês</span></p>
                  </div>
                </div>
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6 p-4 rounded-2xl bg-[#111] border border-[#1A1A1A]">
              <p className="text-[#4169FF] text-xs mb-2" style={{ fontWeight: 800 }}>O QUE ESTÁ INCLUSO</p>
              {[
                'Acesso a todos os cursos',
                'Arsenal completo de materiais',
                'Atualizações exclusivas',
                'Suporte prioritário',
                'Comunidade VIP',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <Check size={16} className="text-[#4169FF] flex-shrink-0" />
                  <span className="text-white text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleProceedToPayment}
              className="w-full py-4 bg-[#4169FF] text-white rounded-full text-lg transition-all hover:bg-[#5B7FFF]"
              style={{ fontWeight: 900 }}
            >
              CONTINUAR
            </button>

            <div className="flex items-center justify-center gap-2 mt-4">
              <Shield size={14} className="text-[#666]" />
              <p className="text-[#666] text-xs">Pagamento seguro e criptografado</p>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="p-6 pb-8">
            <div className="text-center mb-6 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-[#4169FF]/20 flex items-center justify-center mx-auto mb-4">
                <CreditCard size={32} className="text-[#4169FF]" />
              </div>
              <h2 className="text-white text-2xl mb-2" style={{ fontWeight: 900 }}>
                PAGAMENTO
              </h2>
              <p className="text-[#999] text-sm">
                {selectedPlan === 'yearly' ? 'Plano Anual — R$ 29,90/mês' : 'Plano Mensal — R$ 79,90/mês'}
              </p>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="text-[#999] text-xs block mb-2" style={{ fontWeight: 700 }}>NÚMERO DO CARTÃO</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  className="w-full px-4 py-3 bg-[#111] border border-[#1A1A1A] rounded-xl text-white placeholder-[#333] focus:border-[#4169FF] focus:outline-none transition-colors"
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                  required
                />
              </div>

              {/* Card Name */}
              <div>
                <label className="text-[#999] text-xs block mb-2" style={{ fontWeight: 700 }}>NOME NO CARTÃO</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="NOME COMPLETO"
                  className="w-full px-4 py-3 bg-[#111] border border-[#1A1A1A] rounded-xl text-white placeholder-[#333] focus:border-[#4169FF] focus:outline-none transition-colors"
                  style={{ fontFamily: 'Urbanist, sans-serif' }}
                  required
                />
              </div>

              {/* Expiry & CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[#999] text-xs block mb-2" style={{ fontWeight: 700 }}>VALIDADE</label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/AA"
                    className="w-full px-4 py-3 bg-[#111] border border-[#1A1A1A] rounded-xl text-white placeholder-[#333] focus:border-[#4169FF] focus:outline-none transition-colors"
                    style={{ fontFamily: 'Urbanist, sans-serif' }}
                    required
                  />
                </div>
                <div>
                  <label className="text-[#999] text-xs block mb-2" style={{ fontWeight: 700 }}>CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="000"
                    className="w-full px-4 py-3 bg-[#111] border border-[#1A1A1A] rounded-xl text-white placeholder-[#333] focus:border-[#4169FF] focus:outline-none transition-colors"
                    style={{ fontFamily: 'Urbanist, sans-serif' }}
                    required
                  />
                </div>
              </div>

              {/* Total */}
              <div className="p-4 rounded-2xl bg-[#111] border border-[#1A1A1A]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#999] text-sm">Plano</span>
                  <span className="text-white text-sm" style={{ fontWeight: 700 }}>
                    {selectedPlan === 'yearly' ? 'Anual' : 'Mensal'}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#999] text-sm">Valor</span>
                  <span className="text-white text-sm" style={{ fontWeight: 700 }}>
                    {selectedPlan === 'yearly' ? 'R$ 358,80/ano' : 'R$ 79,90/mês'}
                  </span>
                </div>
                <div className="h-px bg-[#1A1A1A] my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-white" style={{ fontWeight: 800 }}>Total hoje</span>
                  <span className="text-[#4169FF] text-xl" style={{ fontWeight: 900 }}>
                    {selectedPlan === 'yearly' ? 'R$ 358,80' : 'R$ 79,90'}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-[#4169FF] text-white rounded-full text-lg transition-all hover:bg-[#5B7FFF]"
                style={{ fontWeight: 900 }}
              >
                ASSINAR AGORA
              </button>

              <button
                type="button"
                onClick={() => setStep('plan')}
                className="w-full py-3 text-[#999] text-sm"
                style={{ fontWeight: 700 }}
              >
                Voltar para os planos
              </button>

              <div className="flex items-center justify-center gap-2">
                <Shield size={14} className="text-[#666]" />
                <p className="text-[#666] text-xs">Pagamento seguro e criptografado</p>
              </div>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 pb-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 rounded-full bg-[#4169FF]/20 flex items-center justify-center mb-6">
              <Check size={40} className="text-[#4169FF]" />
            </div>
            <h2 className="text-white text-2xl mb-2 text-center" style={{ fontWeight: 900 }}>
              ASSINATURA ATIVADA!
            </h2>
            <p className="text-[#999] text-sm text-center">
              Bem-vindo ao clube. Seu acesso foi liberado.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
