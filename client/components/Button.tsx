'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type DarkGlossyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const DarkGlossyButton: React.FC<DarkGlossyButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        'px-4 md:px-6 py-2.5 md:py-3 text-white font-medium text-sm md:text-base rounded-xl transition-all duration-150 ease-in-out',
        'bg-gradient-to-b from-[#404146] to-[#272729]',
        'shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.9)]',
        'hover:brightness-110 active:scale-95',
        className
      )}
    >
      {children}
    </button>
  );
};

export default DarkGlossyButton;
