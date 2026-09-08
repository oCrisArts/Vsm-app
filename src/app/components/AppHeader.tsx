import { Bell } from 'lucide-react';

interface AppHeaderProps {
  onOpenProfile: () => void;
}

export function AppHeader({ onOpenProfile }: AppHeaderProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3.5"
      style={{
        backgroundColor: 'rgba(18,18,18,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #2A2A2A',
        height: 56,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#1E40AF' }}
        >
          <span className="text-white text-xs" style={{ fontWeight: 500, letterSpacing: '0.04em' }}>CS</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-white text-sm" style={{ fontWeight: 500, letterSpacing: '0.06em' }}>CÓDIGO</span>
          <span className="text-sm" style={{ color: '#1E40AF', fontWeight: 500, letterSpacing: '0.06em' }}>DA SEDUÇÃO</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2.5">
        <button
          className="relative w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#1E1E1E', border: '1px solid #2A2A2A' }}
        >
          <Bell size={15} style={{ color: '#9E9E9E' }} />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#1E40AF', border: '2px solid #121212' }}
          />
        </button>

        <button
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #1E40AF, #1e3a8a)',
            border: '2px solid #1E40AF',
          }}
        >
          <span className="text-white text-xs" style={{ fontWeight: 500 }}>JS</span>
        </button>
      </div>
    </div>
  );
}
