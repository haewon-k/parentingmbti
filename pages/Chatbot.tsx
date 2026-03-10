import React, { useState, useRef, useEffect } from 'react';
import { authService } from '../services/authService';
import { MessageCircle, Send, User as UserIcon, Bot, Loader2, AlertTriangle } from 'lucide-react';
import { GoogleGenAI, Chat, ThinkingLevel } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// Define message type
interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  error?: boolean;
}

export const Chatbot: React.FC = () => {
  const user = authService.getUser();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '안녕하세요! 저는 MBTI 자녀 지도 AI입니다. 아이의 성향이나 구체적인 갈등 상황에 대해 물어보시면 맞춤형 대화법을 제안해 드릴게요.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      window.location.hash = '/verify';
    }
  }, [user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // 1. Check API Key availability
      if (!process.env.API_KEY) {
        throw new Error("API Key is missing in the environment.");
      }

      // 2. Initialize Chat if not exists
      if (!chatRef.current) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let profileContext = "";
        if (user.childProfile) {
          profileContext += `
            [자녀 정보]
            - 이름: ${user.childProfile.name || '이름 없음'}
            - 나이/학년: ${user.childProfile.age}
            - 성별: ${user.childProfile.gender === 'male' ? '남아' : '여아'}
            - 학교/기관: ${user.childProfile.schoolType}
            - MBTI: ${user.childProfile.mbti || '미정'}
            - 특이사항: ${user.childProfile.notes || '없음'}
          `;
        }
        
        const p1 = user.parentProfile1 || user.parentProfile;
        if (p1) {
          profileContext += `
            [부모 1 정보]
            - 이름: ${p1.name || '이름 없음'}
            - MBTI: ${p1.mbti || '미정'}
            - 특이사항: ${p1.notes || '없음'}
          `;
        }

        const p2 = user.parentProfile2;
        if (p2) {
          profileContext += `
            [부모 2 정보]
            - 이름: ${p2.name || '이름 없음'}
            - MBTI: ${p2.mbti || '미정'}
            - 특이사항: ${p2.notes || '없음'}
          `;
        }
        
        if (profileContext) {
          profileContext += `\n위 정보를 바탕으로 맞춤형 조언을 제공하세요. 자녀의 연령대와 학교 생활 환경, 부모의 성향을 고려해야 합니다.`;
        }

        chatRef.current = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            systemInstruction: `당신은 'ParentingMBTI' 서비스의 MBTI 자녀 지도 전문 AI 코치입니다.
            사용자는 청소년 자녀 양육에 어려움을 겪는 부모입니다.
            ${profileContext}
            
            다음 원칙을 지켜 상담하세요:
            1. 사용자의 감정에 먼저 공감하세요.
            2. 자녀의 MBTI 특성(E/I, N/S, T/F, J/P)을 고려하여 행동의 원인을 분석해주세요.
            3. 실생활에서 바로 사용할 수 있는 구체적인 '대화 스크립트'를 제안하세요.
            4. 말투는 정중하고 따뜻하며 전문적인 한국어를 사용하세요.
            5. 답변은 너무 길지 않게 핵심 위주로 전달하세요.
            6. 중요한 키워드나 강조할 부분은 **볼드체**로 표시하세요.`,
          },
        });
      }

      // 3. Add placeholder for model response
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      // 4. Send Message Stream
      const result = await chatRef.current.sendMessageStream({ message: userMessage });
      
      let fullText = "";
      for await (const chunk of result) {
        const text = chunk.text;
        if (text) {
            fullText += text;
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMsg = newMessages[newMessages.length - 1];
                if (lastMsg.role === 'model') {
                    lastMsg.text = fullText;
                }
                return newMessages;
            });
        }
      }

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        // Remove the empty placeholder if it exists and is empty
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'model' && newMessages[newMessages.length - 1].text === '') {
            newMessages.pop();
        }
        return [...newMessages, { role: 'model', text: "죄송합니다. AI 연결 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.", error: true }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-6 py-3 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#223B82] rounded-full flex items-center justify-center text-white shrink-0">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-slate-900">AI 자녀 코칭</h1>
            {user.childProfile ? (
              <p className="text-[11px] text-slate-400 truncate">
                {user.childProfile.name || '자녀'} ({user.childProfile.mbti})
                {(user.parentProfile1 || user.parentProfile) && ` · ${(user.parentProfile1 || user.parentProfile)?.name || '부모1'} (${(user.parentProfile1 || user.parentProfile)?.mbti})`}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">실시간 AI 상담</p>
            )}
          </div>
        </div>
        <a href="#/dashboard" className="text-xs font-medium text-slate-400 hover:text-slate-700 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
          나가기
        </a>
      </div>
      
      {/* Chat Area */}
      <div className="flex-grow bg-slate-50 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200' : 'bg-blue-100 text-blue-600'}`}>
                {msg.role === 'user' ? <UserIcon className="w-5 h-5 text-slate-500" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Bubble */}
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-slate-800 text-white rounded-tr-none whitespace-pre-wrap' 
                  : msg.error 
                    ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.role === 'model' && msg.text === '' && !msg.error ? (
                  <div className="flex space-x-1 items-center h-5 px-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  msg.role === 'model' ? (
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-blue-700" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="ml-1" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 아이가 밥 먹을 때마다 돌아다녀서 힘들어요."
              className="flex-grow px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-3.5 py-2.5 bg-[#223B82] text-white rounded-lg hover:bg-[#1A2D66] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
        </form>
        <div className="text-center mt-1.5 flex items-center justify-center gap-1 text-[10px] text-slate-300">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>AI는 부정확한 정보를 제공할 수 있습니다.</span>
        </div>
      </div>
    </div>
  );
};