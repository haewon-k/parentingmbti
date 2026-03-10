import React, { useState } from 'react';
import { ArrowRight, User as UserIcon, Smile, FlaskConical, X, Sparkles } from 'lucide-react';

const MBTI_GRID = [
  ['ISTJ', 'ISFJ', 'INFJ', 'INTJ'],
  ['ISTP', 'ISFP', 'INFP', 'INTP'],
  ['ESTP', 'ESFP', 'ENFP', 'ENTP'],
  ['ESTJ', 'ESFJ', 'ENFJ', 'ENTJ']
];

export const Home: React.FC = () => {
  const [parentType, setParentType] = useState<string>('');
  const [childType, setChildType] = useState<string>('');
  const [showPromoModal, setShowPromoModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center pt-16 md:pt-20 pb-16 px-4 page-enter">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-100 bg-blue-50/50 text-sm font-medium text-blue-700 mb-6">
        <Sparkles className="w-4 h-4" />
        AI 기반 MBTI 갈등 분석
      </div>

      {/* Hero Text */}
      <div className="text-center max-w-2xl mb-10 md:mb-14">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6 tracking-tight leading-tight">
          아이의 타고난 성향과<br />싸우지 마세요
        </h1>
        <p className="text-base md:text-lg text-slate-500 leading-relaxed">
          MBTI를 통해 갈등의 원인을 이해하고,<br className="hidden md:block" />
          새로운 훈육과 관계의 시작을 만들어보세요.
        </p>
      </div>

      {/* MBTI Selection Cards */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8">
        {/* Parent Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">부모 MBTI</h2>
              <p className="text-xs text-slate-400">나의 성격 유형</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_GRID.flat().map((mbti) => (
              <button
                key={`parent-${mbti}`}
                onClick={() => setParentType(mbti)}
                className={`py-2.5 text-xs font-semibold rounded-lg border transition-all duration-150 ${
                  parentType === mbti
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500/20'
                    : 'border-slate-150 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 active:scale-95'
                }`}
              >
                {mbti}
              </button>
            ))}
          </div>
        </div>

        {/* Child Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Smile className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">자녀 MBTI</h2>
              <p className="text-xs text-slate-400">자녀의 성격 유형</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {MBTI_GRID.flat().map((mbti) => (
              <button
                key={`child-${mbti}`}
                onClick={() => setChildType(mbti)}
                className={`py-2.5 text-xs font-semibold rounded-lg border transition-all duration-150 ${
                  childType === mbti
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20'
                    : 'border-slate-150 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 active:scale-95'
                }`}
              >
                {mbti}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        disabled={!parentType || !childType}
        onClick={() => setShowPromoModal(true)}
        className="w-full max-w-md bg-[#223B82] text-white py-3.5 rounded-xl font-bold text-base hover:bg-[#1A2D66] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        결과 보기 <ArrowRight className="w-5 h-5" />
      </button>

      {/* Features */}
      <div className="w-full max-w-4xl grid grid-cols-3 gap-4 mt-14 text-center">
        {[
          { title: '궁합 분석', desc: '인지기능 기반 점수 산출' },
          { title: 'AI 코칭', desc: '실시간 맞춤 대화법 제안' },
          { title: '대화 스크립트', desc: '상황별 실전 대화 가이드' },
        ].map((f) => (
          <div key={f.title} className="py-4">
            <p className="text-sm font-bold text-slate-700">{f.title}</p>
            <p className="text-xs text-slate-400 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Promo Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowPromoModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FlaskConical className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">맞춤형 분석 리포트</h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                <span className="font-bold text-blue-600">{parentType}</span> 부모 x <span className="font-bold text-emerald-600">{childType}</span> 자녀<br/>
                분석 리포트를 확인하려면<br/>
                가이드 구매가 필요합니다.
              </p>
              <div className="space-y-2.5">
                <button
                  onClick={() => window.location.hash = '#/products'}
                  className="w-full bg-[#223B82] text-white py-3 rounded-xl font-bold hover:bg-[#1A2D66] transition-colors shadow-md text-sm"
                >
                  가이드 구매하기 (19,900원)
                </button>
                <button
                  onClick={() => window.location.hash = `#/compatibility?parent=${parentType}&child=${childType}`}
                  className="w-full bg-slate-50 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-100 transition-colors text-sm"
                >
                  이미 구매했어요
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowPromoModal(false)}
              className="absolute top-4 right-4 p-1 text-slate-300 hover:text-slate-500 transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
