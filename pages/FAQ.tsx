import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const QA = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-base font-semibold text-slate-800 group-hover:text-blue-700 transition-colors pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-5 pr-8 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

export const FAQ: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12 md:py-16 page-enter">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">자주 묻는 질문</h1>
      <p className="text-sm text-slate-400 text-center mb-8">궁금한 점을 확인해보세요</p>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 md:px-8">
        <QA
          q="우리 아이 MBTI를 모르겠어요."
          a="무료 성격 유형 검사(16Personalities)를 아이와 함께 진행해보시거나, 평소 행동을 관찰해보세요. 확신이 서지 않는다면, 아이가 성장함에 따라 바뀔 수 있는 성향을 모두 커버할 수 있는 '전체 패키지' 구매를 권장합니다."
        />
        <QA
          q="구매 후 콘텐츠는 어떻게 보나요?"
          a="Gumroad에서 결제 후 이메일 영수증으로 '라이선스 키'가 발송됩니다. 상단 메뉴의 '로그인'을 클릭하고 이메일과 해당 키를 입력하면 보관함이 열립니다."
        />
        <QA
          q="배우자와 공유해도 되나요?"
          a="네! 배우자의 기기에서도 같은 라이선스 키로 로그인하여 보실 수 있습니다. 단, 인터넷 카페 등에 전체 공개하거나 공유하는 행위는 디지털 워터마크로 추적되며 저작권법에 의해 금지됩니다."
        />
        <QA
          q="환불이 가능한가요?"
          a="디지털 콘텐츠 특성상, 콘텐츠(가이드)에 접속한 이력이 확인되면 환불이 어렵습니다. 구매 전 무료 미리보기를 충분히 확인해주세요."
        />
      </div>
    </div>
  );
};
