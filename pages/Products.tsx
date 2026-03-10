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
      if (type) {
        setSelectedType(type);
      }
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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-slate-900">
          {selectedType ? `${selectedType} 자녀를 위한 맞춤 가이드` : '자녀의 MBTI를 선택하세요'}
        </h1>
        {selectedType ? (
          <button 
            onClick={() => {
              setSelectedType(null);
              window.history.replaceState(null, '', '#/products');
            }}
            className="mt-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-700 underline"
          >
            <X className="w-4 h-4 mr-1" />
            전체 보기
          </button>
        ) : (
          <p className="text-slate-600 mt-2">아직 모르시나요? <a href="#/mbti-test" className="text-blue-600 underline hover:text-blue-700">간이 테스트</a>를 먼저 해보세요.</p>
        )}
      </div>

      {/* Bundle Highlight */}
      {!isPurchased('prod_bundle') && (
        <div className="mb-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl transform hover:scale-[1.01] transition-transform">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                <span className="font-semibold text-blue-100 tracking-wider text-sm">BEST VALUE</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">MBTI 16종 전체 패키지</h2>
              <p className="text-blue-100 max-w-xl text-lg">
                다자녀 가정, 교육자, 상담사를 위한 최고의 선택. 16가지 모든 유형의 가이드를 평생 소장하세요.
              </p>
            </div>
            <div className="flex flex-col items-end min-w-[200px]">
              <span className="text-4xl font-bold mb-2">129,000원</span>
              <span className="text-blue-200 line-through text-sm mb-4">정가 624,000원</span>
              <a 
                href="https://gumroad.com" 
                target="_blank"
                rel="noreferrer"
                className="w-full text-center bg-white text-blue-700 font-bold py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                전체 패키지 구매
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.filter(p => p.mbtiType !== MBTIType.BUNDLE).map((product) => {
          const purchased = isPurchased(product.id);
          
          return (
            <div 
              key={product.id} 
              className={`rounded-xl border p-6 flex flex-col transition-all ${
                purchased 
                  ? 'bg-slate-50 border-slate-200' 
                  : 'bg-white border-slate-200 hover:shadow-lg'
              }`}
            >
              <div className="mb-4 flex justify-between items-start">
                <span className={`inline-block px-3 py-1 rounded text-xs font-bold tracking-wide ${
                  purchased ? 'bg-slate-200 text-slate-500' : 'bg-slate-100 text-slate-700'
                }`}>
                  {product.mbtiType}
                </span>
                {purchased && <CheckCircle className="w-5 h-5 text-green-500" />}
              </div>
              
              <h3 className={`text-xl font-bold mb-2 ${purchased ? 'text-slate-500' : 'text-slate-900'}`}>
                {product.title}
              </h3>
              <p className={`text-sm mb-6 flex-grow ${purchased ? 'text-slate-400' : 'text-slate-500'}`}>
                {product.description}
              </p>
              
              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                {purchased ? (
                  <a 
                    href={`#/content/${product.mbtiType}`}
                    className="w-full flex items-center justify-center text-sm font-bold text-slate-600 hover:text-slate-800 py-2 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
                  >
                    가이드 보러가기
                  </a>
                ) : (
                  <>
                    <span className="text-lg font-bold text-slate-900">{product.price}</span>
                    <a 
                      href={product.gumroadUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      구매하기 <ShoppingBag className="w-4 h-4 ml-1" />
                    </a>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};