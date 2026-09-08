import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Eye, EyeOff, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BG = '#121212';
const SURFACE = '#1E1E1E';
const BORDER = '#1A1A1A';
const PRIMARY = '#1E40AF';

export function CadastroPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  if (user) return <Navigate to={user.role === 'admin' ? '/admin/comunidade' : '/app/iniciar'} replace />;

  return (
    <div className="min-h-screen flex flex-col dark" style={{ backgroundColor: BG }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-6">
        <button
          onClick={() => navigate('/login')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div>
          <h1 className="text-white text-xl" style={{ fontWeight: 500 }}>Criar Conta</h1>
          <p style={{ color: '#666', fontSize: 12 }}>Junte-se à elite</p>
        </div>
      </div>

      <div className="flex-1 px-6 space-y-4">
        {/* Name */}
        <div>
          <label style={{ color: '#666', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>NOME COMPLETO</label>
          <div className="flex items-center gap-3 px-4 py-4" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
            <User size={16} style={{ color: '#444' }} />
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={e => setName(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-[#444] outline-none"
              style={{ fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={{ color: '#666', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>E-MAIL</label>
          <div className="flex items-center gap-3 px-4 py-4" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
            <Mail size={16} style={{ color: '#444' }} />
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-[#444] outline-none"
              style={{ fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label style={{ color: '#666', fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>SENHA</label>
          <div className="relative flex items-center gap-3 px-4 py-4" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
            <Lock size={16} style={{ color: '#444' }} />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-[#444] outline-none pr-8"
              style={{ fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            />
            <button onClick={() => setShowPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444]">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
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

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={async () => {
            setError('');
            if (!name.trim()) { setError('Informe seu nome.'); return; }
            if (!email.trim()) { setError('Informe seu e-mail.'); return; }
            if (password.length < 6) { setError('Senha mínima de 6 caracteres.'); return; }
            setLoading(true);
            const result = await register(email.trim(), password, name.trim());
            setLoading(false);
            if (result.success) navigate('/onboarding');
            else setError(result.error ?? 'Erro ao criar conta.');
          }}
          disabled={loading}
          className="w-full py-4 text-white mt-4 flex items-center justify-center"
          style={{ backgroundColor: PRIMARY, borderRadius: 12, fontSize: 14, fontWeight: 500, letterSpacing: '0.04em', fontFamily: 'Plus Jakarta Sans, sans-serif', opacity: loading ? 0.7 : 1 }}
        >
          {loading
            ? <span className="inline-block w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : 'CRIAR MINHA CONTA'}
        </motion.button>

        <p className="text-center" style={{ color: '#444', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Já tem conta?{' '}
          <button onClick={() => navigate('/login')} style={{ color: PRIMARY, fontWeight: 500 }}>Entrar</button>
        </p>

        <p style={{ color: '#333', fontSize: 11, textAlign: 'center', lineHeight: 1.6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Ao criar uma conta você concorda com os{' '}
          <span style={{ color: PRIMARY }}>Termos de Uso</span>
          {' '}e a{' '}
          <span style={{ color: PRIMARY }}>Política de Privacidade</span>
        </p>
      </div>
    </div>
  );
}
