import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function extractKeywords(content: string): string[] {
  // 1. 불용어 정의 (stopwords)
  const stopwords = new Set(['및', '또는', '등', '것', '수', '그', '이', '저', '때문', '이런', '저런', '하다', '되다']);
  
  // 2. 중요 키워드 가중치 부여
  const importantTerms = new Set(['보험금', '보상', '면책', '계약', '해지', '납입', '사고', '보장']);
  
  // 3. 형태소 분석 및 키워드 추출
  const words = content
    .replace(/[^가-힣a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= 2)  // 2글자 이상만 고려
    .filter(word => !stopwords.has(word));
  
  // 4. 빈도수 기반 키워드 추출
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    const count = wordFreq.get(word) || 0;
    wordFreq.set(word, count + 1);
    // 중요 키워드는 가중치 부여
    if (importantTerms.has(word)) {
      wordFreq.set(word, count + 3);  // 가중치 3 추가
    }
  });

  // 5. 상위 키워드 선정 (빈도수 기준)
  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)  // 상위 10개 키워드만 선택
    .map(([word]) => word);
}

function calculateContextRelevance(content: string, query: string): number {
  // 문맥 관련성 점수 계산
  let score = 0;
  
  // 1. 핵심 문구 매칭
  const keyPhrases = [
    '보험금을 지급하지 않습니다',
    '보상하지 않습니다',
    '보험금을 지급합니다',
    '보상합니다',
    '계약을 해지할 수 있습니다'
  ];

  // 2. 문맥 기반 점수 계산
  if (query.includes('보상') || query.includes('보험금')) {
    keyPhrases.forEach(phrase => {
      if (content.includes(phrase)) {
        score += 15;
      }
    });
  }

  // 3. 질문 유형 기반 점수
  if (query.includes('언제') && content.includes('경우')) score += 10;
  if (query.includes('얼마') && /\d+%|\d+원/.test(content)) score += 10;
  if (query.includes('어떻게') && content.includes('절차')) score += 10;

  return score;
}

function calculateRelevanceScore(section: any, queryKeywords: string[], userQuery: string): number {
  let score = 0;

  // 1. 키워드 매칭 점수
  const keywordMatches = section.keywords.filter((k: string) => 
    queryKeywords.includes(k)
  ).length;
  score += keywordMatches * 10;  // 키워드 매칭당 10점

  // 2. 제목 유사도 점수
  if (section.title.includes(userQuery)) {
    score += 50;  // 제목에 질문 내용이 포함되면 높은 점수
  }

  // 3. 컨텍스트 관련성 점수
  const contextRelevance = calculateContextRelevance(section.content, userQuery);
  score += contextRelevance * 5;

  // 4. 섹션 위치 가중치
  score += Math.max(0, 10 - section.section_order);  // 앞쪽 섹션에 약간의 가중치

  return score;
}

export interface SectionMatch {
  section: any;
  score: number;
  matchedKeywords: string[];
}

function findMatchedKeywords(section: any, queryKeywords: string[]): string[] {
  return section.keywords.filter((k: string) => queryKeywords.includes(k));
}

export async function findRelevantSections(userQuery: string): Promise<SectionMatch[]> {
  // 1. 사용자 질문에서 키워드 추출
  const queryKeywords = extractKeywords(userQuery);
  
  // 2. Supabase에서 관련 섹션 검색
  const { data: sections, error } = await supabase
    .from('policy_sections')
    .select('*');

  if (error) throw error;

  // 3. 섹션 랭킹 계산
  const rankedSections = sections.map((section: any) => {
    const score = calculateRelevanceScore(section, queryKeywords, userQuery);
    return {
      section,
      score,
      matchedKeywords: findMatchedKeywords(section, queryKeywords)
    };
  });

  // 4. 상위 관련 섹션 반환
  return rankedSections
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);  // 상위 3개 섹션만 선택
} 