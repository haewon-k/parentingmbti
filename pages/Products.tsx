import React, { useEffect, useState } from 'react';
import { PRODUCTS } from '../constants';
import { MBTIType } from '../types';
import { ShoppingBag, Star, X, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';

export const Products: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const user = authService.getUser();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes('?')) {
      const params = new URLSearchParams(hash.split('?')[1]);
      const type = params.get('type');
      if (type) setSelectedType(type);
    }
  }, []);

  const filteredProducts = selectedType
    ? PRODUCTS.filter(p => p.mbtiType === selectedType || p.mbtiType === MBTIType.BUNDLE)
    : PRODUCTS;

  const isPurchased = (productId: string) => {
    if (!user) return false;
    if (user.purchasedProducts.includes('prod_bundle')) return true;
    return user.purchasedProducts.includes(productId);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 page-enter">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          {selectedType ? `${selectedType} 자녀 맞춤 가이드` : '자녀 MBTI 가이드'}
        </h1>
        {selectedType ? (
          <button
            onClick={() => {
              setSelectedType(null);
              window.history.replaceState(null, '', '#/products');
            }}
            className="mt-3 inline-flex items-center text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-3.5 h-3.5 mr-0.5" />
            전체 보기
          </button>
        ) : (
          <p className="text-sm text-slate-400 mt-2">
            MBTI를 모르시나요? <a href="#/mbti-test" className="text-blue-600 hover:underline font-medium">간이 테스트</a>를 해보세요.
          </p>
        )}
      </div>

      {/* Bundle Highlight */}
      {!isPurchased('prod_bundle') && (
        <div className="mb-10 bg-white rounded-2xl p-6 md:p-8 border-2 border-blue-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-amber-600 tracking-wider text-xs uppercase">Best Value</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">16종 전체 패키지</h2>
              <p className="text-slate-500 text-sm max-w-md">
                다자녀 가정, 교육자, 상담사를 위한 최고의 선택.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end w-full md:w-auto">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-slate-900">63,680원</span>
                <span className="text-slate-400 line-through text-sm">318,400원</span>
              </div>
              <span className="text-xs font-bold text-red-500 mb-2">80% 할인</span>
              <a
                href="https://gumroad.com"
                target="_blank"
                rel="noreferrer"
                className="mt-1 w-full md:w-auto text-center bg-[#223B82] text-white font-bold py-2.5 px-6 rounded-lg hover:bg-[#1A2D66] transition-colors shadow-sm text-sm"
              >
                전체 패키지 구매
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filteredProducts.filter(p => p.mbtiType !== MBTIType.BUNDLE).map((product) => {
          const purchased = isPurchased(product.id);
          return (
            <div
              key={product.id}
              className={`rounded-xl border p-4 md:p-5 flex flex-col transition-all duration-200 ${
                purchased
                  ? 'bg-slate-50/50 border-slate-100'
                  : 'bg-white border-slate-100 hover:shadow-md hover:border-slate-200'
              }`}
            >
              <div className="mb-3 flex justify-between items-center">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${
                  purchased ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-700'
                }`}>
                  {product.mbtiType}
                </span>
                {purchased && <CheckCircle className="w-4 h-4 text-emerald-500" />}
              </div>

              <h3 className={`text-sm font-bold mb-1 ${purchased ? 'text-slate-400' : 'text-slate-800'}`}>
                {product.title}
              </h3>
              <p className={`text-xs mb-4 flex-grow leading-relaxed ${purchased ? 'text-slate-300' : 'text-slate-400'}`}>
                {product.description}
              </p>

              <div className="mt-auto pt-3 border-t border-slate-50">
                {purchased ? (
                  <a
                    href={`#/content/${product.mbtiType}`}
                    className="block w-full text-center text-xs font-bold text-slate-500 hover:text-slate-700 py-1.5 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    가이드 보기
                  </a>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">{product.price}</span>
                    <a
                      href={product.gumroadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      구매 <ShoppingBag className="w-3.5 h-3.5 ml-0.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
