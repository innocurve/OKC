'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Trash2, Send } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { storage } from '@/app/utils/storage';
import Navigation from '@/app/components/Navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

// 링크 변환 함수 추가
function convertLinksToJSX(content: string) {
  const parts = [];
  let lastIndex = 0;
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }

    // Add the link component
    const [_, text, url] = match;
    parts.push(
      <Link
        key={`link-${match.index}`}
        href={url}
        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 underline"
      >
        {text}
      </Link>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last link
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts;
}

export default function InsuranceChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // CSS 스타일 추가
  const thinkingDotsStyle = `
    @keyframes blink {
      0% { opacity: .2; }
      20% { opacity: 1; }
      100% { opacity: .2; }
    }
    .thinking-dots {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .thinking-dots span {
      animation-name: blink;
      animation-duration: 1.4s;
      animation-iteration-count: infinite;
      animation-fill-mode: both;
      font-size: 40px;
      line-height: 20px;
    }
    .thinking-dots span:nth-child(2) { animation-delay: .2s; }
    .thinking-dots span:nth-child(3) { animation-delay: .4s; }
  `;

  // 초기 메시지 설정
  useEffect(() => {
    const savedMessages = storage.get('insuranceChatMessages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        } else {
          setMessages([{
            role: 'assistant',
            content: "안녕하세요! 보험 상담을 도와드리겠습니다. 어떤 보험에 대해 알고 싶으신가요?",
            id: crypto.randomUUID()
          }]);
        }
      } catch (error) {
        console.error('메시지 파싱 오류:', error);
        setMessages([{
          role: 'assistant',
          content: "안녕하세요! 보험 상담을 도와드리겠습니다. 어떤 보험에 대해 알고 싶으신가요?",
          id: crypto.randomUUID()
        }]);
      }
    } else {
      setMessages([{
        role: 'assistant',
        content: "안녕하세요! 보험 상담을 도와드리겠습니다. 어떤 보험에 대해 알고 싶으신가요?",
        id: crypto.randomUUID()
      }]);
    }
  }, []);

  // 메시지가 변경될 때마다 localStorage 업데이트
  useEffect(() => {
    storage.set('insuranceChatMessages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = { 
      role: 'user',
      content: message,
      id: crypto.randomUUID()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/insurance-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage]
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        const assistantMessage: Message = { 
          role: 'assistant', 
          content: data.content,
          id: crypto.randomUUID()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // API 에러 메시지 처리
        let errorMessage = '죄송합니다. 일시적인 오류가 발생했습니다.';
        
        if (data.error?.code === 'context_length_exceeded') {
          errorMessage = '죄송합니다. 대화가 너무 길어져서 이전 대화 내용을 초기화하겠습니다.';
          // 대화 초기화
          const initialMessage: Message = {
            role: 'assistant',
            content: "안녕하세요! 보험 상담을 도와드리겠습니다. 어떤 보험에 대해 알고 싶으신가요?",
            id: crypto.randomUUID()
          };
          setMessages([initialMessage]);
          storage.set('insuranceChatMessages', JSON.stringify([initialMessage]));
          return;
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: error instanceof Error ? error.message : '죄송합니다. 답변 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        id: crypto.randomUUID()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    const initialMessage: Message = {
      role: 'assistant',
      content: "안녕하세요! 보험 상담을 도와드리겠습니다. 어떤 보험에 대해 알고 싶으신가요?",
      id: crypto.randomUUID()
    };
    setMessages([initialMessage]);
    storage.set('insuranceChatMessages', JSON.stringify([initialMessage]));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <style>{thinkingDotsStyle}</style>
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <Navigation language="ko" />
      </div>

      <div className="flex-1 flex justify-center pt-20">
        <div className="w-full max-w-3xl bg-white dark:bg-gray-900 shadow-sm rounded-lg">
          <header className="flex items-center px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2.5">
                <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                <span className="text-base text-gray-600 dark:text-gray-300">Back</span>
              </Link>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1.5">
              <div className="w-14 h-14 relative rounded-full overflow-hidden">
                <Image
                  src="/profile.png"
                  alt="Profile"
                  fill
                  sizes="(max-width: 768px) 56px, 56px"
                  className="rounded-full object-cover object-top"
                  priority
                />
              </div>
              <span className="text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400">
                오경찬&apos;s Clone
              </span>
            </div>
            <button
              onClick={clearMessages}
              className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              title="채팅 내역 비우기"
            >
              <Trash2 className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </header>

          <div className="h-[calc(100vh-280px)] overflow-y-auto px-4">
            <div className="space-y-3 py-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-start`}
                >
                  <div className={`rounded-2xl px-4 py-2.5 max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                  }`}
                  >
                    <div className="whitespace-pre-wrap break-words text-sm">
                      {convertLinksToJSX(message.content)}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-start">
                  <div className="rounded-2xl px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                    <div className="thinking-dots">
                      <span>·</span>
                      <span>·</span>
                      <span>·</span>
                    </div>
                  </div>
                </div>
              )}
              {messages.length === 1 && messages[0].role === 'assistant' && (
                <div className="flex flex-col gap-2 mt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">자주 묻는 질문</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSubmit("실손보험에 대해 알려주세요.")}
                      className="p-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      실손보험이란?
                    </button>
                    <button
                      onClick={() => handleSubmit("암보험 가입시 주의사항은 무엇인가요?")}
                      className="p-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      암보험 가입 주의사항
                    </button>
                    <button
                      onClick={() => handleSubmit("운전자보험은 꼭 필요한가요?")}
                      className="p-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      운전자보험 필요성
                    </button>
                    <button
                      onClick={() => handleSubmit("보험 가입시 필수로 체크해야 할 사항들을 알려주세요.")}
                      className="p-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      보험 가입시 체크사항
                    </button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-lg">
            <div className="relative px-4 py-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-base focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(input);
                  }
                }}
              />
              <button
                onClick={() => handleSubmit(input)}
                disabled={isLoading || !input.trim()}
                className={`absolute right-5 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                  input.trim() && !isLoading
                    ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 hover:scale-110'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 