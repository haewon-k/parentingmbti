import React from 'react';
import { MBTIType, ContentSection } from '../types';
import { CONTENTS } from '../constants';
import { authService } from '../services/authService';
import { Watermark } from '../components/Watermark';
import { Lock, ArrowLeft, Printer, ShieldAlert } from 'lucide-react';

interface Props {
  type: string;
}

const SectionRenderer: React.FC<{ section: ContentSection }> = ({ section }) => {
  return (
    <div className="mb-4 p-5 md:p-6 bg-white rounded-xl shadow-sm border border-slate-100">
      <h3 className="text-base font-bold text-slate-800 mb-3 pb-2 border-b border-slate-50">
        {section.title}
      </h3>
      
      {section.type === 'text' && (
        <p className="text-slate-700 leading-relaxed whitespace-pre-line">{section.content as string}</p>
      )}

      {section.type === 'list' && (
        <ul className="space-y-2">
          {(section.content as string[]).map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-slate-700">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.type === 'check' && (
        <div className="space-y-3">
          {(section.content as string[]).map((item, idx) => (
            <label key={idx} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer select-none">
              <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
              <span className="text-slate-700">{item}</span>
            </label>
          ))}
        </div>
      )}

      {section.type === 'script' && (
        <div className="space-y-4">
          {(section.content as string[]).map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-lg border-l-4 border-blue-400 italic text-slate-700">
              "{item}"
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ContentPage: React.FC<Props> = ({ type }) => {
  const mbti = type.toUpperCase() as MBTIType;
  const user = authService.getUser();
  const content = CONTENTS[mbti];
  
  // Verify access (basic local check)
  const productId = `prod_${mbti.toLowerCase()}`;
  const hasAccess = authService.hasAccess(productId);

  if (!user) {
    window.location.hash = '/verify';
    return null;
  }

  if (!hasAccess && mbti !== 'ENTP') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 page-enter">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock className="w-7 h-7 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">접근 권한 없음</h2>
          <p className="text-sm text-slate-500 mb-6">{mbti} 패키지에 대한 라이선스가 없습니다.</p>
          <a href="#/products" className="inline-block px-5 py-2.5 bg-[#223B82] text-white rounded-lg font-bold text-sm hover:bg-[#1A2D66] transition-colors">
            가이드 보러가기
          </a>
        </div>
      </div>
    );
  }

  // Prevent Context Menu
  const handleContext = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="relative min-h-screen bg-slate-50 select-none" 
      onContextMenu={handleContext}
      // Basic copy protection
      onCopy={(e) => { e.preventDefault(); alert("콘텐츠 복사가 제한되어 있습니다."); }}
    >
      <Watermark user={user} />
      
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8 md:py-12 page-enter">
        <div className="flex items-center justify-between mb-6 no-print">
          <a href="#/dashboard" className="flex items-center text-sm text-slate-400 hover:text-slate-700 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> 보관함
          </a>
          <button onClick={() => window.print()} className="flex items-center text-sm text-slate-400 hover:text-blue-600 transition-colors">
            <Printer className="w-3.5 h-3.5 mr-1" /> 인쇄
          </button>
        </div>

        <header className="mb-10 text-center">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold tracking-wide mb-3">
            학부모 필독 가이드
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">{mbti} 자녀 지도 매뉴얼</h1>
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 uppercase tracking-widest">
            <ShieldAlert className="w-3.5 h-3.5" />
            라이선스 소유자: {user.email}
          </div>
        </header>

        <div className="space-y-4">
          {content ? (
            content.sections.map((section, idx) => (
              <SectionRenderer key={idx} section={section} />
            ))
          ) : (
            <div className="text-center py-12 text-sm text-slate-400">콘텐츠를 찾을 수 없습니다.</div>
          )}
        </div>

        <footer className="mt-16 text-center text-slate-300 text-xs border-t border-slate-100 pt-6 no-print">
          <p>© 2024 ParentingMBTI. All rights reserved.</p>
          <p className="mt-1">이 문서는 디지털 워터마크로 보호되며 무단 배포 시 추적될 수 있습니다.</p>
        </footer>
      </div>
    </div>
  );
};