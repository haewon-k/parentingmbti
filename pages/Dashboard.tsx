import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { PRODUCTS } from '../constants';
import { MBTIType } from '../types';
import { Book, MessageSquare, User as UserIcon, GraduationCap, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState(authService.getUser());

  useEffect(() => {
    const handleProfileUpdate = () => setUser(authService.getUser());
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  if (!user) {
    window.location.hash = '/verify';
    return null;
  }

  const hasBundle = user.purchasedProducts.includes('prod_bundle');
  const accessibleProducts = hasBundle
    ? PRODUCTS.filter(p => p.mbtiType !== MBTIType.BUNDLE)
    : PRODUCTS.filter(p => user.purchasedProducts.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 page-enter">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">내 보관함</h1>
          <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <a href="#/compatibility" className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-all">
            <UserIcon className="w-4 h-4" />
            궁합분석
          </a>
          <a href="#/chatbot" className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#223B82] text-white rounded-lg text-sm font-medium hover:bg-[#1A2D66] transition-all shadow-sm">
            <MessageSquare className="w-4 h-4" />
            AI 코치
          </a>
        </div>
      </div>

      {/* Profiles Summary */}
      {(user.parentProfile1 || user.parentProfile || user.parentProfile2 || user.childProfile) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {(user.parentProfile1 || user.parentProfile) && (
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">부모 1</p>
                <p className="text-sm font-bold text-slate-700 truncate">
                  {(user.parentProfile1 || user.parentProfile)?.name || '이름 없음'}
                  <span className="ml-1.5 text-blue-600 font-medium">{(user.parentProfile1 || user.parentProfile)?.mbti}</span>
                </p>
              </div>
            </div>
          )}
          {user.parentProfile2 && (
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">부모 2</p>
                <p className="text-sm font-bold text-slate-700 truncate">
                  {user.parentProfile2.name || '이름 없음'}
                  <span className="ml-1.5 text-indigo-600 font-medium">{user.parentProfile2.mbti}</span>
                </p>
              </div>
            </div>
          )}
          {user.childProfile && (
            <div className="bg-white p-4 rounded-xl border border-blue-50 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">자녀</p>
                <p className="text-sm font-bold text-slate-700 truncate">
                  {user.childProfile.name || '이름 없음'}
                  <span className="ml-1.5 text-blue-600 font-medium">{user.childProfile.mbti}</span>
                  <span className="ml-1 text-slate-400 font-normal text-xs">{user.childProfile.age}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products */}
      {accessibleProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 mb-3 text-sm">아직 구매한 가이드가 없습니다.</p>
          <a href="#/products" className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm hover:underline">
            가이드 둘러보기 <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-400 mb-3">{accessibleProducts.length}개의 가이드</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessibleProducts.map(product => (
              <a
                key={product.id}
                href={`#/content/${product.mbtiType}`}
                className="group block bg-white border border-slate-100 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 font-bold text-lg">
                    {product.mbtiType.substring(0, 2)}
                  </div>
                  <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                    소장중
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {product.title}
                </h3>
                <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center text-xs font-medium text-slate-300 group-hover:text-blue-500 transition-colors">
                  <Book className="w-3.5 h-3.5 mr-1" />
                  읽기
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
