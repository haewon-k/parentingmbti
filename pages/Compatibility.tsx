import React, { useState, useRef, useEffect } from 'react';
import { MBTIType } from '../types';
import { ArrowRight, MessageCircle, Loader2, User as UserIcon, Smile } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { authService } from '../services/authService';
import { PRODUCTS } from '../constants';
import compatibilityData from '../compatibilityData.json';

const MBTI_GRID = [
  ['ISTJ', 'ISFJ', 'INFJ', 'INTJ'],
  ['ISTP', 'ISFP', 'INFP', 'INTP'],
  ['ESTP', 'ESFP', 'ENFP', 'ENTP'],
  ['ESTJ', 'ESFJ', 'ENFJ', 'ENTJ']
];

const MBTI_LIST = Object.values(MBTIType).filter(t => t !== 'BUNDLE');

const compatMap = compatibilityData as Record<string, string>;

export const Compatibility: React.FC = () => {
  const [parentType, setParentType] = useState<string>('');
  const [childType, setChildType] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [availableChildMbtis, setAvailableChildMbtis] = useState<string[]>([]);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      const hasBundle = user.purchasedProducts.includes('prod_bundle');
      const mbtis = hasBundle
        ? MBTI_LIST
        : PRODUCTS.filter(p => user.purchasedProducts.includes(p.id) && p.mbtiType !== 'BUNDLE').map(p => p.mbtiType);

      setAvailableChildMbtis(mbtis);
    }
  }, []);

  const showAnalysis = () => {
    if (!parentType || !childType || isLoading) return;

    setIsLoading(true);
    setAnalysisResult('');

    const delay = 3000 + Math.random() * 2000; // 3~5초 랜덤

    setTimeout(() => {
      const key = `${parentType}_${childType}`;
      const result = compatMap[key];
      if (result) {
        setAnalysisResult(result);
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      setIsLoading(false);
    }, delay);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 page-enter">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">부모-자녀 MBTI 궁합 분석</h1>
      <p className="text-slate-500 text-center mb-10">인지 기능 충돌 원인부터 맞춤형 대화법까지, AI 전문가가 분석해드립니다.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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
            {MBTI_GRID.flat().map((mbti) => {
              const isAvailable = availableChildMbtis.includes(mbti);
              return (
                <button
                  key={`child-${mbti}`}
                  onClick={() => isAvailable && setChildType(mbti)}
                  disabled={!isAvailable}
                  className={`py-3 px-2 text-sm font-semibold rounded-xl border transition-all ${
                    childType === mbti
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                      : isAvailable
                      ? 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {mbti}
                </button>
              );
            })}
          </div>
          {availableChildMbtis.length === 0 && (
            <p className="text-xs text-red-500 mt-4 text-center">구매한 가이드가 없습니다. 먼저 가이드를 구매해주세요.</p>
          )}
        </div>
      </div>

      <div className="flex justify-center mb-12">
        <button
          onClick={showAnalysis}
          disabled={!parentType || !childType || isLoading}
          className="w-full max-w-md bg-[#223B82] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#1A2D66] disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-md flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI가 정밀 분석 중입니다...
            </>
          ) : (
            <>
              정밀 분석 시작하기 <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {analysisResult && (
        <div ref={resultRef} className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          {/* Analysis Result Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

            <div className="prose prose-slate max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-slate-900 mt-6 mb-4 pb-2 border-b border-slate-200" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold text-slate-800 mt-6 mb-3 flex items-center gap-2" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="text-slate-600 leading-relaxed mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 space-y-1 text-slate-600 mb-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 space-y-1 text-slate-600 mb-4" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-slate-900 bg-yellow-50 px-1 rounded" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-4 bg-slate-50 italic text-slate-600 rounded-r" {...props} />,
                  code: ({node, ...props}) => <code className="bg-slate-100 px-1 py-0.5 rounded text-sm font-mono text-slate-700" {...props} />,
                }}
              >
                {analysisResult}
              </ReactMarkdown>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                더 구체적인 상황이 궁금하신가요?
              </h3>
              <p className="text-blue-100">
                AI 자녀 코치에게 "우리 아이는 게임만 하면 화를 내요"라고 물어보세요.
              </p>
            </div>
            <a
              href="#/chatbot"
              className="px-6 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg whitespace-nowrap"
            >
              AI 코칭 받기
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
