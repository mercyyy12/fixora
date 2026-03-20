import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true, size = 'md' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      className={`${sizes[size]} border-3 border-brand-200 border-t-brand-500 rounded-full`}
      style={{ borderWidth: 3 }}
    />
  );

  if (!fullScreen) return spinner;

  return (
    <div className="fixed inset-0 bg-canvas dark:bg-gray-950 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        {spinner}
        <p className="text-sm text-ink-2 font-medium">Loading…</p>
      </div>
    </div>
  );
};

export default Loader;
