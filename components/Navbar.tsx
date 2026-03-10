import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { Menu, X, Sparkle } from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  special?: boolean;
  onClick?: () => void;
  active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, special = false, onClick, active = false }) => (
  <a
    href={href}
    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      special
        ? 'bg-[#223B82] text-white hover:bg-[#1A2D66] mx-2 text-center shadow-sm'
        : active
        ? 'text-[#223B82] bg-blue-50'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`}
    onClick={onClick}
  >
    {children}
  </a>
);

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(authService.getUser());
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleProfileUpdate = () => setUser(authService.getUser());
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const toggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const isActive = (path: string) => currentHash === `#${path}` || currentHash.startsWith(`#${path}?`);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-lg border-b border-slate-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-14 items-center">
          <a href="#/" className="text-lg font-bold text-[#112A46] flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Sparkle className="w-5 h-5 fill-current text-[#223B82]" />
            ParentingMBTI
          </a>

          <div className="hidden md:flex items-center gap-1">
            <NavLink href="#/" onClick={closeMenu} active={isActive('/')}>홈</NavLink>
            <NavLink href="#/products" onClick={closeMenu} active={isActive('/products')}>가이드</NavLink>
            <NavLink href="#/faq" onClick={closeMenu} active={isActive('/faq')}>FAQ</NavLink>
            {user ? (
              <>
                <NavLink href="#/dashboard" onClick={closeMenu} active={isActive('/dashboard')}>보관함</NavLink>
                <NavLink href="#/compatibility" onClick={closeMenu} active={isActive('/compatibility')}>궁합분석</NavLink>
                <NavLink href="#/chatbot" onClick={closeMenu} active={isActive('/chatbot')}>AI 코치</NavLink>
                <NavLink href="#/mypage" onClick={closeMenu} active={isActive('/mypage')}>마이</NavLink>
              </>
            ) : (
              <NavLink href="#/verify" special onClick={closeMenu}>로그인</NavLink>
            )}
          </div>

          <button
            onClick={toggle}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            aria-label="메뉴 열기"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-3 space-y-1">
            <NavLink href="#/" onClick={closeMenu} active={isActive('/')}>홈</NavLink>
            <NavLink href="#/products" onClick={closeMenu} active={isActive('/products')}>가이드</NavLink>
            <NavLink href="#/faq" onClick={closeMenu} active={isActive('/faq')}>FAQ</NavLink>
            {user ? (
              <>
                <NavLink href="#/dashboard" onClick={closeMenu} active={isActive('/dashboard')}>보관함</NavLink>
                <NavLink href="#/compatibility" onClick={closeMenu} active={isActive('/compatibility')}>궁합분석</NavLink>
                <NavLink href="#/chatbot" onClick={closeMenu} active={isActive('/chatbot')}>AI 코치</NavLink>
                <NavLink href="#/mypage" onClick={closeMenu} active={isActive('/mypage')}>마이</NavLink>
              </>
            ) : (
              <NavLink href="#/verify" special onClick={closeMenu}>로그인</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
