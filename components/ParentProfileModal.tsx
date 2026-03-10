import React, { useState, useEffect } from 'react';
import { X, Save, User as UserIcon } from 'lucide-react';
import { authService } from '../services/authService';
import { ParentProfile, MBTIType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const ParentProfileModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [profile, setProfile] = useState<ParentProfile>({
    name: '',
    mbti: 'ENTP',
    notes: ''
  });
  
  const availableMbtis = Object.values(MBTIType).filter(t => t !== 'BUNDLE');

  useEffect(() => {
    const user = authService.getUser();
    if (user && user.parentProfile) {
      setProfile(user.parentProfile);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authService.updateParentProfile(profile);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-blue-600" />
            부모 프로필 설정
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">이름 (선택)</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="예: 엄마, 아빠"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">MBTI</label>
            <select
              value={profile.mbti}
              onChange={(e) => setProfile({ ...profile, mbti: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              {availableMbtis.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">특이사항 (선택)</label>
            <textarea
              value={profile.notes || ''}
              onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[80px]"
              placeholder="예: 화를 잘 내는 편임, 원칙을 중요하게 생각함 등"
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
