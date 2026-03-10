import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { PRODUCTS } from '../constants';
import { MBTIType } from '../types';
import { Book, MessageSquare, User as UserIcon, GraduationCap } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState(authService.getUser());

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUser(authService.getUser());
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  if (!user) {
    window.location.hash = '/verify';
    return null;
  }

  // Determine which products the user has
  const hasBundle = user.purchasedProducts.includes('prod_bundle');
  const accessibleProducts = hasBundle 
    ? PRODUCTS.filter(p => p.mbtiType !== MBTIType.BUNDLE) 
    : PRODUCTS.filter(p => user.purchasedProducts.includes(p.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-slate-200 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">내 보관함</h1>
          <p className="text-slate-500 text-sm">환영합니다, {user.email}님</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <a href="#/compatibility" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg font-medium hover:bg-indigo-100 transition-colors shadow-sm">
            <UserIcon className="w-4 h-4" />
            부모-자녀 궁합
          </a>
          <a href="#/chatbot" className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">
            <MessageSquare className="w-4 h-4" />
            AI 자녀 코칭
          </a>
        </div>
      </div>

      {/* Profiles Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Parent Profile 1 Summary */}
        {(user.parentProfile1 || user.parentProfile) && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm text-slate-600">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                {(user.parentProfile1 || user.parentProfile)?.name ? `${(user.parentProfile1 || user.parentProfile)?.name}의` : '부모 1'} 맞춤 정보
              </h3>
              <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="px-2 py-1 bg-white rounded border border-slate-200 font-medium text-slate-700">
                  {(user.parentProfile1 || user.parentProfile)?.mbti}
                </span>
              </div>
              {(user.parentProfile1 || user.parentProfile)?.notes && (
                <p className="mt-3 text-sm text-slate-500 bg-white/50 p-3 rounded-lg border border-slate-100">
                  "{(user.parentProfile1 || user.parentProfile)?.notes}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* Parent Profile 2 Summary */}
        {user.parentProfile2 && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl border border-slate-200 flex items-start gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm text-slate-600">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                {user.parentProfile2.name ? `${user.parentProfile2.name}의` : '부모 2'} 맞춤 정보
              </h3>
              <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="px-2 py-1 bg-white rounded border border-slate-200 font-medium text-slate-700">
                  {user.parentProfile2.mbti}
                </span>
              </div>
              {user.parentProfile2.notes && (
                <p className="mt-3 text-sm text-slate-500 bg-white/50 p-3 rounded-lg border border-slate-100">
                  "{user.parentProfile2.notes}"
                </p>
              )}
            </div>
          </div>
        )}

        {/* Child Profile Summary */}
        {user.childProfile && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-4">
            <div className="p-3 bg-white rounded-full shadow-sm text-indigo-600">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">
                {user.childProfile.name ? `${user.childProfile.name}의` : '자녀'} 맞춤 코칭 정보
              </h3>
              <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="px-2 py-1 bg-white rounded border border-blue-100 font-medium text-blue-700">
                  {user.childProfile.mbti}
                </span>
                <span className="px-2 py-1 bg-white rounded border border-slate-200">
                  {user.childProfile.age}
                </span>
                <span className="px-2 py-1 bg-white rounded border border-slate-200">
                  {user.childProfile.schoolType}
                </span>
                <span className="px-2 py-1 bg-white rounded border border-slate-200">
                  {user.childProfile.gender === 'male' ? '남아' : '여아'}
                </span>
              </div>
              {user.childProfile.notes && (
                <p className="mt-3 text-sm text-slate-500 bg-white/50 p-3 rounded-lg border border-slate-100">
                  "{user.childProfile.notes}"
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {accessibleProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-4">아직 구매한 가이드가 없습니다.</p>
          <a href="#/products" className="text-blue-600 font-semibold hover:underline">스토어 둘러보기</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibleProducts.map(product => (
            <a 
              key={product.id} 
              href={`#/content/${product.mbtiType}`}
              className="group block bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-xl">
                  {product.mbtiType.substring(0, 1)}
                </div>
                <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                  소장중
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center text-sm font-medium text-slate-400 group-hover:text-blue-500">
                <Book className="w-4 h-4 mr-2" />
                가이드 읽기
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};