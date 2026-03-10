import React, { useState } from 'react';
import { ArrowRight, User as UserIcon, Smile, FlaskConical, X } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pt-20 pb-12 px-4">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-600 mb-8 shadow-sm">
        <FlaskConical className="w-4 h-4 text-slate-500" />
        MBTI 기반 갈등 분석 리포트
      </div>

      {/* Hero Text */}
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
          아이의 타고난 성향과 싸우지 마세요
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          자녀들이 자신을 이해하는 도구인 MBTI 를 통해 갈등을 다시 바라보세요.<br className="hidden md:block" />
          새로운 훈육, 새로운 관계의 시작이 됩니다.
        </p>
      </div>

      {/* MBTI Selection Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Parent Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">부모 MBTI 선택</h2>
              <p className="text-sm text-slate-500">나의 성격 유형을 정확하게 선택해주세요</p>
            </div>
          </div>
          <div className="border-t border-slate-100 mb-6"></div>
          <div className="grid grid-cols-4 gap-3">
            {MBTI_GRID.flat().map((mbti) => (
              <button
                key={`parent-${mbti}`}
                onClick={() => setParentType(mbti)}
                className={`py-3 px-2 text-sm font-semibold rounded-xl border transition-all ${
                  parentType === mbti
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {mbti}
              </button>
            ))}
          </div>
        </div>

        {/* Child Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Smile className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">자녀 MBTI 선택</h2>
              <p className="text-sm text-slate-500">자녀의 성격 유형을 정확하게 선택해주세요</p>
            </div>
          </div>
          <div className="border-t border-slate-100 mb-6"></div>
          <div className="grid grid-cols-4 gap-3">
            {MBTI_GRID.flat().map((mbti) => (
              <button
                key={`child-${mbti}`}
                onClick={() => setChildType(mbti)}
                className={`py-3 px-2 text-sm font-semibold rounded-xl border transition-all ${
                  childType === mbti
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {mbti}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center w-full max-w-5xl">
        <button
          disabled={!parentType || !childType}
          onClick={() => setShowPromoModal(true)}
          className="w-full max-w-md bg-[#223B82] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1A2D66] disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
        >
          결과 보기 <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Promo Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FlaskConical className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">맞춤형 분석 리포트</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                <span className="font-bold text-blue-600">{parentType}</span> 부모와 <span className="font-bold text-emerald-600">{childType}</span> 자녀를 위한<br/>
                정밀 분석 리포트를 확인하려면<br/>
                해당 성향의 가이드 구매가 필요합니다.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.hash = '#/store'}
                  className="w-full bg-[#223B82] text-white py-3.5 rounded-xl font-bold hover:bg-[#1A2D66] transition-colors shadow-md"
                >
                  가이드 구매하러 가기 (19,900원)
                </button>
                <button
                  onClick={() => window.location.hash = `#/compatibility?parent=${parentType}&child=${childType}`}
                  className="w-full bg-slate-100 text-slate-700 py-3.5 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  이미 구매했어요 (분석하기)
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowPromoModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};