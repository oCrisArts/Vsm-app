import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';

interface XPToastProps {
  visible: boolean;
  xp: number;
  label?: string;
  onHide: () => void;
}

export function XPToast({ visible, xp, label = 'VSM', onHide }: XPToastProps) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onHide, 2200);
      return () => clearTimeout(t);
    }
  }, [visible, onHide]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          className="fixed bottom-24 left-1/2 z-[999] pointer-events-none"
          style={{ transform: 'translateX(-50%)' }}
        >
          <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#4169FF] shadow-lg shadow-[#4169FF]/40">
            <Zap size={16} fill="white" className="text-white" />
            <span className="text-white text-base" style={{ fontWeight: 900 }}>
              +{xp} XP {label}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
