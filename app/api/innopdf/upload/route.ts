import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import pdfParse from 'pdf-parse';
import { createWorker } from 'tesseract.js';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { extractKeywords } from '@/app/utils/sectionUtils';

const execAsync = promisify(exec);

interface Section {
  title: string;
  content: string;
  section_order: number;
  keywords: string[];
}

interface PolicyMetadata {
  title: string;
  version: string;
  effectiveDate?: Date;
}

// Supabase 클라이언트 초기화
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 임시 디렉토리 생성 함수
async function ensureTempDir() {
  const tempDir = path.join(process.cwd(), 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
}

// PDF를 이미지로 변환 (pdf-poppler 사용)
async function convertPdfToImages(pdfPath: string, outputDir: string) {
  try {
    // Windows의 경우 pdftoppm 명령어 사용
    const command = `pdftoppm -jpeg -r 300 "${pdfPath}" "${path.join(outputDir, 'page')}"`;
    await execAsync(command);
    return fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
  } catch (error) {
    console.error('PDF to Image 변환 에러:', error);
    throw error;
  }
}

// OCR 처리 함수
async function performOCR(imagePath: string): Promise<string> {
  const worker = await createWorker('kor');
  try {
    const { data: { text } } = await worker.recognize(imagePath);
    return text;
  } finally {
    await worker.terminate();
  }
}

// 텍스트 추출 함수 (일반 PDF 또는 OCR)
async function extractTextFromPDF(buffer: Buffer, fileName: string): Promise<string> {
  try {
    // 먼저 일반적인 PDF 텍스트 추출 시도
    const pdfData = await pdfParse(buffer);
    
    // 텍스트가 충분히 추출되었는지 확인
    if (pdfData.text.trim().length > 100) {
      console.log('일반 PDF 텍스트 추출 성공');
      return pdfData.text;
    }
    
    console.log('일반 추출 실패, OCR 시도...');
    
    // OCR 처리를 위한 준비
    const tempDir = await ensureTempDir();
    const pdfPath = path.join(tempDir, fileName);
    
    // PDF 파일 임시 저장
    fs.writeFileSync(pdfPath, buffer);
    
    // PDF를 이미지로 변환
    const imageFiles = await convertPdfToImages(pdfPath, tempDir);
    
    // 각 이미지에 대해 OCR 수행
    let fullText = '';
    for (const imageFile of imageFiles) {
      const imagePath = path.join(tempDir, imageFile);
      const pageText = await performOCR(imagePath);
      fullText += pageText + '\n';
      
      // 임시 이미지 파일 삭제
      fs.unlinkSync(imagePath);
    }
    
    // 임시 PDF 파일 삭제
    fs.unlinkSync(pdfPath);
    
    return fullText;
  } catch (error) {
    console.error('텍스트 추출 에러:', error);
    throw error;
  }
}

// 메타데이터 추출 함수
function extractPolicyMetadata(filename: string, content: string) {
  const title = filename.replace(/\.pdf$/i, '');
  
  // 버전 정보 추출 패턴
  const versionPatterns = [
    /버전[:\s]*([0-9.]+)/i,
    /version[:\s]*([0-9.]+)/i,
    /개정[:\s]*([0-9.]+)/i,
    /\(([0-9.]+)\s*개정\)/,
    /제([0-9.]+)\s*차\s*개정/
  ];

  // 시행일자 추출 패턴
  const datePatterns = [
    /시행일[자]?[:\s]*(\d{4}[-/년]\s*\d{1,2}[-/월]\s*\d{1,2}[일]?)/,
    /시행\s*(\d{4}[-/년]\s*\d{1,2}[-/월]\s*\d{1,2}[일]?)/,
    /(\d{4}[-/년]\s*\d{1,2}[-/월]\s*\d{1,2}[일]?)\s*시행/,
    /개정일[자]?[:\s]*(\d{4}[-/년]\s*\d{1,2}[-/월]\s*\d{1,2}[일]?)/
  ];

  let version = '1.0';
  let effectiveDate = new Date();

  // 버전 찾기
  for (const pattern of versionPatterns) {
    const match = content.match(pattern);
    if (match) {
      version = match[1];
      break;
    }
  }

  // 시행일자 찾기
  for (const pattern of datePatterns) {
    const match = content.match(pattern);
    if (match) {
      const dateStr = match[1].replace(/[년월일]/g, '').replace(/[-/]/g, '-');
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        effectiveDate = parsedDate;
        break;
      }
    }
  }

  return { title, version, effectiveDate };
}

// 텍스트 정제 함수
function sanitizeText(text: string): string {
  return text
    .replace(/\u0000/g, '') // NULL 문자 제거
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // 제어 문자 제거
    .replace(/\s+/g, ' ') // 연속된 공백 정리
    .trim();
}

// 섹션과 조항 추출 함수
function extractSectionsAndArticles(text: string) {
  const sections: any[] = [];
  let currentSection: any = null;
  let sectionOrder = 0;

  // 텍스트를 줄 단위로 분리하고 전처리
  const lines = text.split('\n')
    .map(line => sanitizeText(line))
    .filter(line => line.length > 0);

  console.log('전체 라인 수:', lines.length);

  // 섹션 패턴 정의
  const sectionPatterns = [
    // 장/편/부 매칭
    /^[제]?\s*(\d+)\s*[장편부]\s*(.+)/,
    /^Chapter\s*(\d+)\s*(.+)/i,
    /^[제]?\s*(\d+)\s*절\s*(.+)/,
    // 주요 섹션 제목 매칭
    /^(일반사항|보장종목|보상내용|보험금|계약|보험료|해지|분쟁|기타사항)(.+)?/,
    // 큰 제목 형식 매칭
    /^제\s*(\d+)\s*[장편부]\s*([가-힣\s]+)/,
    // 번호 없는 섹션 제목 매칭
    /^([가-힣\s]{2,})(보험금|계약|약관|특별약관|배상|보상|지급)$/,
    // 조 단위도 섹션으로 처리
    /^[제]?\s*(\d+)\s*조\s*[\(（]?([^）\)]+)[\)）]?/
  ];

  for (const line of lines) {
    // 섹션 매칭 시도
    let isSectionMatch = false;
    for (const pattern of sectionPatterns) {
      const match = line.match(pattern);
      if (match) {
        console.log('섹션 매칭:', line);
        if (currentSection) {
          // 현재 섹션의 키워드 추출
          currentSection.keywords = extractKeywords(currentSection.content);
          sections.push(currentSection);
        }
        currentSection = {
          title: match[2] || match[1] || line,
          content: line + '\n',  // 제목도 content에 포함
          section_order: sectionOrder++,
          keywords: []  // 키워드는 섹션 완료 시 추출
        };
        isSectionMatch = true;
        break;
      }
    }
    if (isSectionMatch) continue;

    // 현재 섹션에 내용 추가
    if (currentSection) {
      currentSection.content += line + '\n';
    } else {
      // 첫 번째 섹션이 없는 경우 기본 섹션 생성
      currentSection = {
        title: '일반사항',
        content: line + '\n',
        section_order: sectionOrder++,
        keywords: []
      };
    }
  }

  // 마지막 섹션 처리
  if (currentSection) {
    currentSection.keywords = extractKeywords(currentSection.content);
    sections.push(currentSection);
  }

  console.log('추출된 섹션 수:', sections.length);
  sections.forEach((section, index) => {
    console.log(`섹션 ${index + 1}: { title: '${section.title}', contentLength: ${section.content.length}, keywords: [${section.keywords.join(', ')}] }`);
  });

  return sections;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('PDF 처리 시작:', file.name);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 텍스트 추출 (일반 PDF 또는 OCR)
    console.log('텍스트 추출 시작...');
    const text = await extractTextFromPDF(buffer, file.name);
    console.log('텍스트 추출 완료. 길이:', text.length);
    
    // 추출된 텍스트 샘플 출력 (디버깅용)
    console.log('추출된 텍스트 샘플 (처음 500자):', text.substring(0, 500));

    // 메타데이터 추출
    console.log('메타데이터 추출...');
    const metadata = extractPolicyMetadata(file.name, text);
    console.log('추출된 메타데이터:', metadata);

    // 보험 약관 생성
    console.log('보험 약관 저장 시작...');
    const { data: policy, error: policyError } = await supabase
      .from('insurance_policies')
      .insert({
        title: metadata.title,
        version: metadata.version,
        effective_date: metadata.effectiveDate.toISOString()
      })
      .select()
      .single();

    if (policyError) {
      console.error('보험 약관 저장 에러:', policyError);
      throw policyError;
    }
    console.log('보험 약관 저장 완료:', policy);

    // 섹션과 조항 추출 및 저장
    console.log('섹션과 조항 추출 시작...');
    const sections = extractSectionsAndArticles(text);
    console.log(`추출된 섹션 수: ${sections.length}`);

    // 각 섹션과 조항 저장
    console.log('섹션 저장 시작...');
    for (const section of sections) {
      console.log(`섹션 저장 중: ${section.title}`);
      console.log('키워드:', section.keywords);
      
      const { data: savedSection, error: sectionError } = await supabase
        .from('policy_sections')
        .insert({
          policy_id: policy.id,
          title: section.title,
          content: section.content,
          section_order: section.section_order,
          keywords: section.keywords
        })
        .select()
        .single();

      if (sectionError) {
        console.error('섹션 저장 에러:', sectionError);
        continue;
      }
      console.log('섹션 저장 완료:', savedSection.title);
    }
    console.log('모든 섹션 저장 완료');

    return NextResponse.json({ 
      success: true, 
      message: 'PDF successfully processed',
      policy,
      sectionCount: sections.length
    });

  } catch (error: any) {
    console.error('PDF 처리 에러:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF', details: error.message },
      { status: 500 }
    );
  }
} 