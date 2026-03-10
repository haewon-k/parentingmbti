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

    // For demo purposes, we will treat any product as valid if the key is "DEMO-..."
    // In real app, you match the permalink to the product the user claims to have bought.
    // Here we use a generic placeholder permalink.
    const result = await gumroadService.verifyLicense('demo_permalink', licenseKey);

    if (result.success) {
      // Simulate mapping product ID. In a real app, Gumroad returns the product_id.
      // We'll grant access to "ENTP" for demo if generic, or Bundle if specified.
      // For this demo, let's just unlock ENTP and BUNDLE for the 'DEMO-' key.
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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 text-center">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">구매자 콘텐츠 입장</h2>
          <p className="text-sm text-slate-500 mt-1">구매 시 입력한 정보를 입력해주세요.</p>
        </div>

        <form onSubmit={handleVerify} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">이메일 주소</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">라이선스 키</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm"
              placeholder="영수증에 적힌 라이선스 키 입력"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-2">
              * 체험용 데모: 이메일 <code className="bg-slate-100 px-1 rounded">any</code>, 키 <code className="bg-slate-100 px-1 rounded">DEMO-KEY</code>
            </p>
          </div>

          {status === 'error' && (
            <div className="flex items-center p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 mr-2" />
              {errorMsg}
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center p-3 bg-green-50 text-green-600 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              확인되었습니다! 이동 중...
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === 'loading' || status === 'success'}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex justify-center items-center"
          >
            {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : '입장하기'}
          </button>
        </form>
      </div>
    </div>
  );
};