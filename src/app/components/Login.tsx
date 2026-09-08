import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError('');
    if ((email.toLowerCase() === 'joão' || email.toLowerCase() === 'joao') && password.toLowerCase() === 'joão' || password.toLowerCase() === 'joao') {
      setLoading(true);
      setTimeout(() => { setLoading(false); onLogin(); }, 900);
      return;
    }
    if (!email) { setError('Preencha seu e-mail ou usuário.'); return; }
    if (!password) { setError('Preencha sua senha.'); return; }
    setError('Credenciais inválidas. Tente: usuário "joão" senha "joão".');
  };

  const handleSocial = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 700);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Background hero */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1737623342152-b49e12f7ccf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="bg"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/40" />
      </div>

      <div className="relative flex-1 flex flex-col justify-between px-6 pt-16 pb-10">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#4169FF] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl" style={{ fontWeight: 900 }}>CS</span>
          </div>
          <h1 className="text-white text-4xl mb-2" style={{ fontWeight: 900 }}>CÓDIGO DA</h1>
          <h1 className="text-[#4169FF] text-4xl mb-4" style={{ fontWeight: 900 }}>SEDUÇÃO</h1>
          <p className="text-[#999] text-base" style={{ fontWeight: 600 }}>
            A Elite Não Espera.<br />Sua transformação começa agora.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {/* Social logins */}
          <button
            onClick={handleSocial}
            className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl transition-opacity hover:opacity-90"
            style={{ fontWeight: 800 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>

          <button
            onClick={handleSocial}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-4 rounded-2xl transition-opacity hover:opacity-90"
            style={{ fontWeight: 800 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continuar com Facebook
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1A1A1A]" />
            <span className="text-[#444] text-xs" style={{ fontWeight: 700 }}>OU ACESSE COM SENHA</span>
            <div className="flex-1 h-px bg-[#1A1A1A]" />
          </div>

          {/* Email */}
          <div>
            <input
              type="text"
              placeholder="Usuário ou e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-4 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl text-white placeholder-[#444] focus:border-[#4169FF] focus:outline-none transition-colors"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-4 bg-[#0D0D0D] border border-[#1A1A1A] rounded-2xl text-white placeholder-[#444] focus:border-[#4169FF] focus:outline-none transition-colors pr-12"
              style={{ fontFamily: 'Urbanist, sans-serif' }}
            />
            <button
              onClick={() => setShowPass(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444]"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl"
            >
              <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-xs" style={{ fontWeight: 600 }}>{error}</p>
            </motion.div>
          )}

          {/* Hint */}
          <p className="text-[#444] text-xs text-center" style={{ fontWeight: 600 }}>
            Teste: usuário <span className="text-[#4169FF]">joão</span> · senha <span className="text-[#4169FF]">joão</span>
          </p>

          {/* CTA */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-[#4169FF] text-white rounded-2xl text-base transition-all hover:bg-[#5B7FFF] disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ fontWeight: 900 }}
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : 'ENTRAR'}
          </button>

          <p className="text-center text-[#444] text-xs" style={{ fontWeight: 600 }}>
            Ao entrar você concorda com os{' '}
            <span className="text-[#4169FF]">Termos de Uso</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
