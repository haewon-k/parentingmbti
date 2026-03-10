import React from 'react';
import { User } from '../types';

interface WatermarkProps {
  user: User;
}

export const Watermark: React.FC<WatermarkProps> = ({ user }) => {
  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.substring(0, 3)}***@${domain}`;
  };

  const displayText = `라이선스 등록: ${maskEmail(user.email)} - Key: ${user.licenseKey.substring(0, 8)}...`;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none print-watermark" aria-hidden="true">
      <div className="absolute inset-0 flex flex-wrap items-center justify-center content-center opacity-[0.03] rotate-[-15deg] gap-24">
         {Array.from({ length: 20 }).map((_, i) => (
           <div key={i} className="text-xl font-bold text-slate-900 whitespace-nowrap p-12">
             {displayText}
           </div>
         ))}
      </div>
    </div>
  );
};