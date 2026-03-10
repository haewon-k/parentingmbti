import React, { useState } from 'react';
import { gumroadService } from '../services/gumroadService';
import { authService } from '../services/authService';
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export const Verify: React.FC = () => {
  const [email, setEmail] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const result = await gumroadService.verifyLicense('demo_permalink', licenseKey);

    if (result.success) {
      const grantedProducts = licenseKey.includes("BUNDLE") ? ['prod_bundle'] : ['prod_entp'];
      authService.login(email || result.email || 'user@example.com', licenseKey, grantedProducts);
      setStatus('success');
      setTimeout(() => {
        window.location.hash = '/dashboard';
      }, 1500);
    } else {
      setStatus('error');
      setErrorMsg('유효하지 않은 라이선스 키 또는 이메일입니다. 영수증을 확인해주세요.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 page-enter">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">구매자 로그인</h2>
          <p className="text-xs text-slate-400 mt-1">구매 시 입력한 정보를 입력해주세요</p>
        </div>

        <form onSubmit={handleVerify} className="px-8 pb-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">이메일 주소</label>
            <input
              type="email"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-slate-50 focus:bg-white"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">라이선스 키</label>
            <input
              type="text"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm bg-slate-50 focus:bg-white"
              placeholder="라이선스 키 입력"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
            />
            <p className="text-[11px] text-slate-300 mt-1.5">
              체험: 이메일 <code className="bg-slate-50 px-1 rounded text-slate-400">any</code>, 키 <code className="bg-slate-50 px-1 rounded text-slate-400">DEMO-KEY</code>
            </p>
          </div>

          {status === 'error' && (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-xs leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {errorMsg}
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-600 rounded-lg text-xs">
              <CheckCircle className="w-4 h-4" />
              확인되었습니다! 이동 중...
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full py-2.5 bg-[#223B82] hover:bg-[#1A2D66] disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg font-bold transition-all flex justify-center items-center text-sm mt-2"
          >
            {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : '입장하기'}
          </button>
        </form>
      </div>
    </div>
  );
};
