import React, { useState, useEffect } from 'react';
import { X, Save, User as UserIcon } from 'lucide-react';
import { authService } from '../services/authService';
import { ChildProfile, MBTIType } from '../types';
import { PRODUCTS } from '../constants';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const ChildProfileModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [profile, setProfile] = useState<ChildProfile>({
    name: '',
    age: '',
    gender: 'male',
    schoolType: '어린이집',
    mbti: 'ENTP',
    notes: ''
  });
  
  const [availableMbtis, setAvailableMbtis] = useState<string[]>([]);

  useEffect(() => {
    const user = authService.getUser();
    if (user) {
      const hasBundle = user.purchasedProducts.includes('prod_bundle');
      const mbtis = hasBundle
        ? Object.values(MBTIType).filter(t => t !== 'BUNDLE')
        : PRODUCTS.filter(p => user.purchasedProducts.includes(p.id) && p.mbtiType !== 'BUNDLE').map(p => p.mbtiType);
      
      setAvailableMbtis(mbtis);
      
      if (user.childProfile) {
        setProfile(user.childProfile);
      } else if (mbtis.length > 0) {
        setProfile(prev => ({ ...prev, mbti: mbtis[0] }));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateProfile(profile);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            자녀 프로필 설정
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">이름 (선택)</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="예: 지민"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">나이/학년</label>
              <input
                type="text"
                required
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="예: 7세, 초3"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">성별</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
              >
                <option value="male">남자</option>
                <option value="female">여자</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">MBTI</label>
              <select
                value={profile.mbti}
                onChange={(e) => setProfile({ ...profile, mbti: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                disabled={availableMbtis.length === 0}
              >
                {availableMbtis.length === 0 ? (
                  <option value="">구매한 가이드 없음</option>
                ) : (
                  availableMbtis.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">학교/기관 종류</label>
            <select
              value={profile.schoolType}
              onChange={(e) => setProfile({ ...profile, schoolType: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              <option value="어린이집">어린이집</option>
              <option value="유치원">유치원</option>
              <option value="초등학교">초등학교</option>
              <option value="중학교">중학교</option>
              <option value="일반고">일반고</option>
              <option value="특성화고">특성화고</option>
              <option value="특목고(과학고/외고 등)">특목고(과학고/외고 등)</option>
              <option value="자율고">자율고</option>
              <option value="국제학교">국제학교</option>
              <option value="대안학교">대안학교</option>
              <option value="홈스쿨링">홈스쿨링</option>
              <option value="기타">기타</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">특이사항 (선택)</label>
            <textarea
              value={profile.notes || ''}
              onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[80px]"
              placeholder="예: 예민한 편임, 수학을 싫어함, 친구 관계 고민 등"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
            >
              <Save className="w-5 h-5" />
              프로필 저장하기
            </button>
          </div>
          
          <p className="text-xs text-center text-slate-400 mt-2">
            * 저장된 정보는 AI 코칭의 정확도를 높이는 데에만 사용됩니다.
          </p>
        </form>
      </div>
    </div>
  );
};
