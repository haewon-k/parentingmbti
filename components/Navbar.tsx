import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User } from '../types';
import { Menu, X, Sparkle } from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  special?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, special = false, onClick }) => (
  <a 
    href={href} 
    className={`block px-4 py-2 text-sm font-medium transition-colors duration-200 ${
      special 
        ? 'bg-blue-600 text-white rounded-md hover:bg-blue-700 mx-2 text-center' 
        : 'text-slate-600 hover:text-blue-600'
    }`}
    onClick={onClick}
  >
    {children}
  </a>
);

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Force re-render when profile updates
  const [user, setUser] = useState<User | null>(authService.getUser());

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUser(authService.getUser());
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const toggle = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <a href="#/" className="text-xl font-bold text-[#112A46] flex items-center gap-2">
              <Sparkle className="w-6 h-6 fill-current text-[#112A46]" />
              ParentingMBTI
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <NavLink href="#/" onClick={closeMenu}>홈</NavLink>
            <NavLink href="#/products" onClick={closeMenu}>상품 보기</NavLink>
            <NavLink href="#/faq" onClick={closeMenu}>자주 묻는 질문</NavLink>
            {user ? (
              <>
                 <NavLink href="#/dashboard" onClick={closeMenu}>내 보관함</NavLink>
                 <NavLink href="#/compatibility" onClick={closeMenu}>부모-자녀 궁합</NavLink>
                 <NavLink href="#/chatbot" onClick={closeMenu}>AI 코치</NavLink>
                 <NavLink href="#/mypage" onClick={closeMenu}>마이페이지</NavLink>
              </>
            ) : (
              <NavLink href="#/verify" special onClick={closeMenu}>구매자 로그인</NavLink>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={toggle} className="text-slate-600 hover:text-slate-900 focus:outline-none">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink href="#/" onClick={closeMenu}>홈</NavLink>
            <NavLink href="#/products" onClick={closeMenu}>상품 보기</NavLink>
            <NavLink href="#/faq" onClick={closeMenu}>자주 묻는 질문</NavLink>
            {user ? (
              <>
                <NavLink href="#/dashboard" onClick={closeMenu}>내 보관함</NavLink>
                <NavLink href="#/compatibility" onClick={closeMenu}>부모-자녀 궁합</NavLink>
                <NavLink href="#/chatbot" onClick={closeMenu}>AI 코치</NavLink>
                <NavLink href="#/mypage" onClick={closeMenu}>마이페이지</NavLink>
              </>
            ) : (
              <NavLink href="#/verify" special onClick={closeMenu}>구매자 로그인</NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};