import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { findRelevantSections, SectionMatch } from '@/app/utils/sectionUtils';
import { OpenAI } from 'openai';
import { getInsuranceTranslation } from '@/app/utils/translations';
import type { Language } from '@/app/utils/translations';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PolicyArticle {
  content: string;
  section_id: string;
  keywords: string[];
  title: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // messages 배열이 없거나 비어있는 경우 체크
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      console.error('잘못된 요청: messages 배열이 없거나 비어있습니다.');
      return new Response(JSON.stringify({
        error: '올바른 메시지 형식이 아닙니다.'
      }), { status: 400 });
    }

    const messages = body.messages;
    const userMessage = messages[messages.length - 1]?.content;

    // userMessage가 없는 경우 체크
    if (!userMessage) {
      console.error('잘못된 요청: 마지막 메시지의 content가 없습니다.');
      return new Response(JSON.stringify({
        error: '메시지 내용이 없습니다.'
      }), { status: 400 });
    }

    console.log('\n=== 챗봇 처리 시작 ===');
    console.log('사용자 질문:', userMessage);

    // 1. 관련 섹션 찾기
    console.log('\n1. 섹션 검색 시작...');
    const relevantSections = await findRelevantSections(userMessage);
    console.log('검색된 섹션 수:', relevantSections.length);
    
    // 2. 시스템 프롬프트 구성
    console.log('\n2. 상위 섹션 선택...');
    const context = relevantSections
      .map(({section, matchedKeywords, score}) => {
        console.log(`\n섹션: ${section.title}`);
        console.log(`- 관련성 점수: ${score}`);
        console.log(`- 매칭된 키워드: ${matchedKeywords.join(', ')}`);
        console.log(`- 내용 길이: ${section.content.length}자`);
        return {
          title: section.title,
          content: section.content,
          keywords: matchedKeywords
        };
      })
      .slice(0, 2);  // 상위 2개 섹션만 사용

    console.log('\n3. GPT 요청 준비...');
    const startTime = Date.now();
    const systemPrompt = `당신은 보험 전문가입니다. 다음과 같은 방식으로 답변해주세요:

1. 보험약관 기반 답변:
${context.length > 0 ? `다음 보험약관 내용을 참고하여 답변하세요:

${context.map(section => `
[${section.title}]
${section.content}
관련 키워드: ${section.keywords.join(', ')}
`).join('\n')}

약관 내용이 있는 경우, 이를 우선적으로 참고하여 답변하고 출처를 명시하세요.` : '관련 약관 내용이 없습니다.'}

2. 일반 보험 상식 답변:
- 약관에 없는 내용이더라도 일반적인 보험 상식이나 기본적인 보험 개념에 대해서는 답변해주세요.
- 보험 관련 용어는 쉽게 풀어서 설명해주세요.
- 구체적인 보험사나 상품명은 언급하지 마세요.

3. 전문가 상담 안내:
- 개인의 구체적인 상황이나 상담이 필요한 경우 아래와 같이 간단히 안내:
  "제가 고객님의 상황에 맞는 맞춤 상담을 도와드리겠습니다. [상담 신청](/inquiry)이나 [전화 문의](/contact)를 남겨주시면 빠르게 답변드리겠습니다."

4. 답변 제한 사항:
- 보험 사기나 불법적인 내용에 대해서는 답변하지 마세요.
- 답변은 한국어로 작성하세요.

5. 답변 형식:
- 약관 내용 인용 시: "[섹션명] 내용..." 형식으로 출처를 표시하세요.
- 일반 상식 답변 시: "일반적으로..." 또는 "보험 업계에서는..." 등으로 시작하세요.
- 상담 필요 시: 위의 정해진 간단한 안내 문구만 사용하세요.`;

    // 3. GPT 모델을 통한 응답 생성
    console.log('GPT 요청 시작...');
    const response = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.slice(-3)  // 최근 3개 메시지만 포함하도록 수정
      ],
      temperature: 0.7,
      max_tokens: 800,        // 토큰 수 조정
      presence_penalty: 0.1,  // 반복 감소
      frequency_penalty: 0.1, // 반복 감소
      response_format: { "type": "text" }  // 텍스트 형식으로 제한
    });

    const endTime = Date.now();
    console.log(`응답 생성 시간: ${endTime - startTime}ms`);
    console.log('=== 챗봇 처리 완료 ===\n');

    return new Response(JSON.stringify({
      role: "assistant",
      content: response.choices[0].message.content
    }));

  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(JSON.stringify({
      error: '죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다.'
    }), { status: 500 });
  }
} 