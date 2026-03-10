import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { ChildProfile, ParentProfile, MBTIType } from '../types';
import { PRODUCTS } from '../constants';
import { User as UserIcon, Settings, LogOut, Save, AlertTriangle } from 'lucide-react';

export const MyPage: React.FC = () => {
  const [user, setUser] = useState(authService.getUser());
  
  const [childProfile, setChildProfile] = useState<ChildProfile>({
    name: '',
    age: '',
    gender: 'male',
    schoolType: '어린이집',
    mbti: 'ENTP',
    notes: ''
  });

  const [parentProfile1, setParentProfile1] = useState<ParentProfile>({
    name: '',
    mbti: 'ENTP',
    notes: ''
  });

  const [parentProfile2, setParentProfile2] = useState<ParentProfile>({
    name: '',
    mbti: 'ENTP',
    notes: ''
  });

  const [availableChildMbtis, setAvailableChildMbtis] = useState<string[]>([]);
  const availableParentMbtis = Object.values(MBTIType).filter(t => t !== 'BUNDLE');
  
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const currentUser = authService.getUser();
    setUser(currentUser);
    
    if (currentUser) {
      const hasBundle = currentUser.purchasedProducts.includes('prod_bundle');
      const mbtis = hasBundle
        ? Object.values(MBTIType).filter(t => t !== 'BUNDLE')
        : PRODUCTS.filter(p => currentUser.purchasedProducts.includes(p.id) && p.mbtiType !== 'BUNDLE').map(p => p.mbtiType);
      
      setAvailableChildMbtis(mbtis);
      
      if (currentUser.childProfile) {
        setChildProfile(currentUser.childProfile);
      } else if (mbtis.length > 0) {
        setChildProfile(prev => ({ ...prev, mbti: mbtis[0] }));
      }

      if (currentUser.parentProfile1) {
        setParentProfile1(currentUser.parentProfile1);
      } else if (currentUser.parentProfile) {
        // Migration from old parentProfile
        setParentProfile1(currentUser.parentProfile);
      }

      if (currentUser.parentProfile2) {
        setParentProfile2(currentUser.parentProfile2);
      }
    }
  }, []);

  if (!user) {
    window.location.hash = '/verify';
    return null;
  }

  const handleSaveChild = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateProfile(childProfile);
    showSaveMessage();
  };

  const handleSaveParent1 = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateParentProfile1(parentProfile1);
    showSaveMessage();
  };

  const handleSaveParent2 = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateParentProfile2(parentProfile2);
    showSaveMessage();
  };

  const showSaveMessage = () => {
    setSaveMessage('프로필이 성공적으로 저장되었습니다.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">마이페이지</h1>

      {saveMessage && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-2 animate-in fade-in">
          <Save className="w-5 h-5" />
          {saveMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 mb-12">
        {/* Parent Profile 1 Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-blue-50 rounded-lg">
              <UserIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">부모 프로필 1</h2>
          </div>
          
          <form onSubmit={handleSaveParent1} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">이름 (선택)</label>
              <input
                type="text"
                value={parentProfile1.name}
                onChange={(e) => setParentProfile1({ ...parentProfile1, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="예: 엄마"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">MBTI</label>
              <select
                value={parentProfile1.mbti}
                onChange={(e) => setParentProfile1({ ...parentProfile1, mbti: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              >
                {availableParentMbtis.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">특이사항 (선택)</label>
              <textarea
                value={parentProfile1.notes || ''}
                onChange={(e) => setParentProfile1({ ...parentProfile1, notes: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]"
                placeholder="예: 화를 잘 내는 편임, 원칙을 중요하게 생각함 등"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors"
            >
              <Save className="w-5 h-5" />
              부모 프로필 1 저장
            </button>
          </form>
        </div>

        {/* Parent Profile 2 Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <UserIcon className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">부모 프로필 2</h2>
          </div>
          
          <form onSubmit={handleSaveParent2} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">이름 (선택)</label>
              <input
                type="text"
                value={parentProfile2.name}
                onChange={(e) => setParentProfile2({ ...parentProfile2, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="예: 아빠"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">MBTI</label>
              <select
                value={parentProfile2.mbti}
                onChange={(e) => setParentProfile2({ ...parentProfile2, mbti: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              >
                {availableParentMbtis.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">특이사항 (선택)</label>
              <textarea
                value={parentProfile2.notes || ''}
                onChange={(e) => setParentProfile2({ ...parentProfile2, notes: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px]"
                placeholder="예: 공감을 잘 해줌, 규칙에 관대한 편 등"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors"
            >
              <Save className="w-5 h-5" />
              부모 프로필 2 저장
            </button>
          </form>
        </div>

        {/* Child Profile Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Settings className="w-6 h-6 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">자녀 프로필 설정</h2>
          </div>
          
          <form onSubmit={handleSaveChild} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">이름 (선택)</label>
                <input
                  type="text"
                  value={childProfile.name}
                  onChange={(e) => setChildProfile({ ...childProfile, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="예: 지민"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">나이/학년</label>
                <input
                  type="text"
                  required
                  value={childProfile.age}
                  onChange={(e) => setChildProfile({ ...childProfile, age: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="예: 7세, 초3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">성별</label>
                <select
                  value={childProfile.gender}
                  onChange={(e) => setChildProfile({ ...childProfile, gender: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
                >
                  <option value="male">남자</option>
                  <option value="female">여자</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">MBTI</label>
                <select
                  value={childProfile.mbti}
                  onChange={(e) => setChildProfile({ ...childProfile, mbti: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
                  disabled={availableChildMbtis.length === 0}
                >
                  {availableChildMbtis.length === 0 ? (
                    <option value="">구매한 가이드 없음</option>
                  ) : (
                    availableChildMbtis.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">학교/기관 종류</label>
              <select
                value={childProfile.schoolType}
                onChange={(e) => setChildProfile({ ...childProfile, schoolType: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white"
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
                value={childProfile.notes || ''}
                onChange={(e) => setChildProfile({ ...childProfile, notes: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all min-h-[100px]"
                placeholder="예: 예민한 편임, 수학을 싫어함, 친구 관계 고민 등"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              자녀 프로필 저장
            </button>
          </form>
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl border border-red-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-lg font-bold text-red-800 mb-1">로그아웃</h3>
          <p className="text-sm text-red-600">현재 기기에서 로그아웃합니다. 구매 내역은 유지됩니다.</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          로그아웃
        </button>
      </div>
    </div>
  );
};
