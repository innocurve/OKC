'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

interface Policy {
  id: string;
  title: string;
  version: string;
  effective_date: string;
  created_at: string;
}

export default function InnoPDFPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  // PDF 목록 가져오기
  const fetchPolicies = async (retryCount = 0) => {
    try {
      console.log('Fetching policies... (attempt:', retryCount + 1, ')');
      setLoading(true);
      
      const response = await fetch('/api/innopdf/list', {
        // 캐시 무시하고 항상 새로운 데이터 가져오기
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      const data = await response.json();
      console.log('Received response:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      
      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${data.error || 'Unknown error'}`
        );
      }
      
      if (data.error) {
        console.error('Error from API:', data.error);
        if (data.details) {
          console.error('Error details:', data.details);
        }
        
        // 최대 2번까지 재시도
        if (retryCount < 2) {
          console.log('Retrying in 1 second...');
          setTimeout(() => fetchPolicies(retryCount + 1), 1000);
          return;
        }
        throw new Error(data.error);
      }
      
      if (Array.isArray(data.policies)) {
        console.log('Setting policies:', data.policies);
        setPolicies(data.policies);
      } else {
        console.error('Invalid policies data:', data.policies);
        setPolicies([]);
      }
    } catch (error: any) {
      console.error('Error fetching policies:', {
        message: error.message,
        error
      });
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시와 업로드 성공 시 PDF 목록 가져오기
  useEffect(() => {
    fetchPolicies();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile?.type === 'application/pdf') {
      setFile(uploadedFile);
      setPreview(uploadedFile.name);
    } else {
      alert('PDF 파일만 업로드 가능합니다.');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/innopdf/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('업로드 실패');
      }

      const data = await response.json();
      console.log('Upload response:', data);
      
      alert('PDF가 성공적으로 업로드되었습니다.\nSupabase 대시보드에서 업로드된 데이터를 확인할 수 있습니다.');
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 섹션 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">InnoPDF Manager</h1>
          <p className="text-gray-300">보험 약관 PDF 관리 시스템</p>
        </motion.div>

        {/* PDF 업로드 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500'}
              transition-colors`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div>
                <p className="text-xl mb-2">선택된 파일:</p>
                <p className="text-blue-400">{preview}</p>
              </div>
            ) : (
              <div>
                <p className="text-xl mb-2">PDF 파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-gray-400">지원 형식: PDF</p>
              </div>
            )}
          </div>

          {/* 업로드 버튼 */}
          {file && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex justify-end"
            >
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md
                  ${uploading ? 'opacity-50 cursor-not-allowed' : ''} transition-colors`}
              >
                {uploading ? '업로드 중...' : '업로드 시작'}
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* 안내 메시지 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4">데이터 확인 방법</h2>
          <div className="space-y-4 text-gray-300">
            <p>Supabase 대시보드에서 다음 순서로 확인하실 수 있습니다:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>insurance_policies 테이블에서 업로드된 약관 확인</li>
              <li>policy_sections 테이블에서 해당 약관의 섹션 확인</li>
              <li>policy_articles 테이블에서 각 섹션의 조항 확인</li>
            </ol>
            <p className="mt-4 text-sm text-gray-400">
              * SQL 쿼리를 통해 한 번에 모든 정보를 확인할 수도 있습니다.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 