import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Checking Supabase configuration...');
console.log('Supabase URL exists:', !!supabaseUrl);
console.log('Supabase Key exists:', !!supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing required environment variables');
}

// Supabase 클라이언트 초기화
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  db: { schema: 'public' }
});

export async function GET() {
  try {
    console.log('API Route: Starting request...');
    console.log('Supabase URL:', supabaseUrl);

    // 연결 테스트
    console.log('Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('insurance_policies')
      .select('count');

    if (testError) {
      console.error('Supabase connection test error:', testError);
      return NextResponse.json(
        { error: `Database connection failed: ${testError.message}` },
        { status: 500 }
      );
    }

    console.log('Connection test successful');

    // 실제 데이터 조회
    console.log('Fetching policy data...');
    const { data: policies, error } = await supabase
      .from('insurance_policies')
      .select('id, title, version, effective_date, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        { error: `Query failed: ${error.message}` },
        { status: 500 }
      );
    }

    if (!policies) {
      console.log('No policies found, returning empty array');
      return NextResponse.json({ policies: [] });
    }

    console.log('Successfully fetched policies. Count:', policies.length);
    return NextResponse.json({ 
      policies,
      message: 'Successfully fetched policies'
    });
    
  } catch (error: any) {
    console.error('Unexpected error in API route:', error);
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 