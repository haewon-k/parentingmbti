import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

type Question = {
  id: number;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  text: string;
  options: {
    value: string;
    label: string;
  }[];
};

const questions: Question[] = [
  // E vs I
  {
    id: 1,
    dimension: 'EI',
    text: '아이가 친구들과 놀 때 어떤 모습인가요?',
    options: [
      { value: 'E', label: '먼저 다가가고 활발하게 어울리며 에너지를 얻는다.' },
      { value: 'I', label: '친한 친구 몇 명과 놀거나 혼자 노는 것을 더 좋아한다.' },
    ],
  },
  {
    id: 2,
    dimension: 'EI',
    text: '새로운 장소에 갔을 때 아이의 반응은?',
    options: [
      { value: 'E', label: '호기심을 보이며 여기저기 탐색하고 돌아다닌다.' },
      { value: 'I', label: '부모님 곁에 머물며 관찰하다가 천천히 적응한다.' },
    ],
  },
  {
    id: 3,
    dimension: 'EI',
    text: '말하는 것을 좋아하나요?',
    options: [
      { value: 'E', label: '목소리가 크고 생각나는 대로 바로 말하는 편이다.' },
      { value: 'I', label: '생각을 정리한 뒤에 말하거나 조용히 듣는 편이다.' },
    ],
  },
  // S vs N
  {
    id: 4,
    dimension: 'SN',
    text: '아이의 상상력은 어떤가요?',
    options: [
      { value: 'S', label: '현실적인 이야기를 좋아하고 눈에 보이는 것을 믿는다.' },
      { value: 'N', label: '엉뚱한 상상을 자주 하고 "만약에" 놀이를 좋아한다.' },
    ],
  },
  {
    id: 5,
    dimension: 'SN',
    text: '설명을 들을 때 아이는?',
    options: [
      { value: 'S', label: '구체적인 예시와 순서대로 설명해주는 것을 좋아한다.' },
      { value: 'N', label: '전체적인 의미나 비유를 통해 이해하는 것을 좋아한다.' },
    ],
  },
  {
    id: 6,
    dimension: 'SN',
    text: '만들기 놀이를 할 때?',
    options: [
      { value: 'S', label: '설명서대로 꼼꼼하게 만드는 것을 선호한다.' },
      { value: 'N', label: '내 마음대로 독창적인 것을 만드는 것을 선호한다.' },
    ],
  },
  // T vs F
  {
    id: 7,
    dimension: 'TF',
    text: '친구가 울고 있을 때 아이의 반응은?',
    options: [
      { value: 'T', label: '"왜 울어?"라고 이유를 먼저 물어본다.' },
      { value: 'F', label: '같이 슬퍼하거나 위로해주려고 한다.' },
    ],
  },
  {
    id: 8,
    dimension: 'TF',
    text: '칭찬을 들을 때 더 좋아하는 말은?',
    options: [
      { value: 'T', label: '"정말 똑똑하다", "잘했다" 같은 능력에 대한 칭찬.' },
      { value: 'F', label: '"고마워", "사랑해" 같은 감정에 대한 칭찬.' },
    ],
  },
  {
    id: 9,
    dimension: 'TF',
    text: '약속을 어겼을 때?',
    options: [
      { value: 'T', label: '왜 약속을 어겼는지 논리적으로 따진다.' },
      { value: 'F', label: '상대방의 기분이 상할까 봐 걱정한다.' },
    ],
  },
  // J vs P
  {
    id: 10,
    dimension: 'JP',
    text: '숙제나 할 일이 있을 때?',
    options: [
      { value: 'J', label: '미리 계획을 세우고 끝낸 뒤에 논다.' },
      { value: 'P', label: '미루다가 막판에 하거나 기분에 따라 한다.' },
    ],
  },
  {
    id: 11,
    dimension: 'JP',
    text: '방 정리 정돈 상태는?',
    options: [
      { value: 'J', label: '물건이 제자리에 있고 정리정돈을 잘한다.' },
      { value: 'P', label: '어지러워 보이지만 나름의 질서가 있다.' },
    ],
  },
  {
    id: 12,
    dimension: 'JP',
    text: '계획이 갑자기 변경되면?',
    options: [
      { value: 'J', label: '당황하거나 스트레스를 받는다.' },
      { value: 'P', label: '유연하게 대처하거나 오히려 좋아한다.' },
    ],
  },
];

export const MBTITest: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[step].id]: value });
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateResult = () => {
    const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    Object.values(answers).forEach((val) => {
      counts[val as keyof typeof counts]++;
    });

    const result = 
      (counts.E >= counts.I ? 'E' : 'I') +
      (counts.S >= counts.N ? 'S' : 'N') +
      (counts.T >= counts.F ? 'T' : 'F') +
      (counts.J >= counts.P ? 'J' : 'P');
    
    return result;
  };

  if (showResult) {
    const result = calculateResult();
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            우리 아이의 MBTI는?
          </h2>
          <div className="text-6xl font-black text-blue-600 my-8">
            {result}
          </div>
          <p className="text-lg text-slate-600 mb-8">
            {result} 유형에 딱 맞는 자녀 지도 가이드를 확인해보세요.
          </p>
          <a
            href={`#/products?type=${result}`}
            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:text-lg md:px-10 transition-colors"
          >
            맞춤형 가이드 보러가기
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
          <button
            onClick={() => {
              setAnswers({});
              setStep(0);
              setShowResult(false);
            }}
            className="mt-4 text-sm text-slate-500 hover:text-slate-700 underline"
          >
            다시 테스트하기
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Question {step + 1} / {questions.length}
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-4 mb-8">
            {currentQuestion.text}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left p-6 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg text-slate-700 group-hover:text-blue-700 font-medium">
                    {option.label}
                  </span>
                  <Check className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
