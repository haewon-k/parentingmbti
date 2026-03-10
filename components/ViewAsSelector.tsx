import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { Eye, ChevronUp, ChevronDown, User as UserIcon, LogOut, Package, CheckCircle } from 'lucide-react';

export const ViewAsSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(authService.getUser());
  }, []);

  const handleSelect = (type: 'guest' | 'single' | 'bundle') => {
    if (type === 'guest') {
      authService.logout();
    } else if (type === 'single') {
      authService.login('demo@example.com', 'DEMO-LICENSE-KEY', ['prod_entp']);
    } else if (type === 'bundle') {
      authService.login('vip@example.com', 'VIP-LICENSE-KEY', ['prod_bundle']);
    }
    window.location.reload();
  };

  const currentMode = !currentUser 
    ? 'Guest' 
    : currentUser.purchasedProducts.includes('prod_bundle') 
      ? 'VIP Bundle' 
      : 'Single Product';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden w-64 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">View As</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2 space-y-1">
            <button
              onClick={() => handleSelect('guest')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                !currentUser ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LogOut className="w-4 h-4 mr-3 opacity-70" />
              Guest (Not Purchased)
              {!currentUser && <CheckCircle className="w-4 h-4 ml-auto text-blue-600" />}
            </button>
            <button
              onClick={() => handleSelect('single')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                currentUser && !currentUser.purchasedProducts.includes('prod_bundle') 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <UserIcon className="w-4 h-4 mr-3 opacity-70" />
              Customer (ENTP Only)
              {currentUser && !currentUser.purchasedProducts.includes('prod_bundle') && (
                <CheckCircle className="w-4 h-4 ml-auto text-blue-600" />
              )}
            </button>
            <button
              onClick={() => handleSelect('bundle')}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                currentUser?.purchasedProducts.includes('prod_bundle') 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4 mr-3 opacity-70" />
              Customer (Full Bundle)
              {currentUser?.purchasedProducts.includes('prod_bundle') && (
                <CheckCircle className="w-4 h-4 ml-auto text-blue-600" />
              )}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-full shadow-lg hover:bg-slate-800 hover:scale-105 transition-all active:scale-95 font-medium text-sm border border-slate-700"
      >
        <Eye className="w-4 h-4" />
        <span>View: {currentMode}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronUp className="w-4 h-4 opacity-50" />}
      </button>
    </div>
  );
};
