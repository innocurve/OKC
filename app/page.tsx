'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageToggle from './components/LanguageToggle'
import { useLanguage } from './hooks/useLanguage'
import { translate } from './utils/translations'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import MyValues from './components/MyValues'
import History from './components/Career'
import FadeInSection from './components/FadeInSection'
import { useState, useEffect } from 'react';
import { Menu, X, Mail, Phone, Sun, Moon } from 'lucide-react'
import ContactOptions from './components/ContactOptions'
import type { PostData } from './types/post'
import ShareButton from './components/ShareButton'
import { useDarkMode } from './hooks/useDarkMode'

export default function Home() {
const [isMenuOpen, setIsMenuOpen] = useState(false)
const { language } = useLanguage();
const [posts, setPosts] = useState<PostData[]>([
  { 
    id: 1, 
    title: {
      ko: '메리츠 화재',
      en: 'Meritz Fire & Marine Insurance',
      ja: 'メリッツ火災海上保険',
      zh: '美利车险',
    },
    image: '/postimage/id1image.png',
    description: {
      ko: 'AI 기반 고객맞춤형 보험 컨설팅을 제공합니다. 고객의 상황을 정확하게 분석하고 최적의 보험 상품을 설계하여, 불필요한 보장을 줄이고 실질적인 혜택을 극대화할 수 있도록 도와드리겠습니다. 빠르게 변화하는 금융 환경 속에서 더 스마트하고 효율적인 보험 솔루션을 제시해드립니다.',
      en: 'We offer AI-based personalized insurance consulting services. We analyze your situation accurately and design the best insurance products, minimizing unnecessary coverage and maximizing practical benefits. We will help you in the rapidly changing financial environment with smarter and more efficient insurance solutions.',
      ja: 'AIベースの顧客マッチング型保険相談サービスを提供します。お客様の状況を正確に分析し、最適な保険商品を設計し、不要な保険を減らし、実践的な利点を最大化することを支援します。急速に変化する金融環境で、よりスマートで効率的な保険ソリューションをご提案します。',
      zh: '我们提供基于AI的客户匹配型保险咨询服务。我们准确分析您的状况，设计最佳保险产品，减少不必要的保险，最大化实际利益。在快速变化的金融环境中，我们提供更智能和高效的保险解决方案。',
    },
    tags: {
      ko: ['#메리츠화재', '#AI', '#고객맞춤', '#보험컨설팅'],
      en: ['#Meritz', '#AI', '#Customer-Centric', '#InsuranceConsulting'],
      ja: ['#Meritz', '#AI', '#顧客マッチング', '#金融環境'],
      zh: ['#Meritz', '#AI', '#客户匹配', '#保险咨询']
    }
  },
  { 
    id: 2, 
    title: {
      ko: '(사)대한청년을세계로\n미래전략포럼 개최',
      en: 'Future Strategy Forum held by\nKorean Youth to the World Association',
      ja: '(社)大韓青年を世界へ\n未来戦略フォーラム開催',
      zh: '(社)韩国青年走向世界\n举办未来战略论坛',
    },
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%AF%B8%EB%9E%98%EC%A0%84%EB%9E%B5%ED%8F%AC%EB%9F%BC.jpg-lobjD33dLn9HHvFaqwYC57KhFIHDJb.jpeg',
    description: {
      ko: '기술혁신의 시대속에서 청년들의 미래를 위한 전략을 논의하는 포럼을 개최합니다.',
      en: 'Hosting a forum to discuss strategies for the future of youth in the era of technological innovation.',
      ja: '技術革新の時代における若者の未来のための戦略を議論するフォーラムを開催します。',
      zh: '举办论坛，讨论技术创新时代青年未来的战略。',
    },
    tags: {
      ko: ['#청년미래', '#기술혁신', '#전략포럼', '#글로벌비전'],
      en: ['#YouthFuture', '#TechInnovation', '#StrategyForum', '#GlobalVision'],
      ja: ['#青年未来', '#技術革新', '#戦略フォーラム', '#グローバルビジョン'],
      zh: ['#青年未来', '#技术创新', '#战略论坛', '#全球愿景']
    }
  },
  { 
    id: 3, 
    title: {
      ko: '새마을 대덕구청년미래연대',
      en: 'Daedeok-gu Youth Future Alliance',
      ja: '大徳区青年未来連帯会',
      zh: '大德区青年未来联盟',
    },
    image: '/postimage/id3image.png',
    description: {
      ko: '새마을 대덕구청년미래연대는 청년들의 성장과 지역 사회 발전을 위해 활동하는 단체입니다. 다양한 봉사와 네트워킹을 통해 공동체 의식을 함양하고, 청년들의 역량 강화를 지원하며, 지속 가능한 지역 발전을 위한 다양한 프로젝트를 진행하고 있습니다.',
      en: 'Daedeok-gu Youth Future Alliance is an organization that works for the growth of young people and the development of the local community. Through various volunteer activities and networking, we foster community awareness, support youth capacity building, and conduct various projects for sustainable local development.',
      ja: '大徳区青年未来連帯会は、若者の成長と地域社会の発展のために活動する団体です。様々なボランティア活動とネットワーキングを通じて、コミュニティ意識を育み、若者の能力向上を支援し、持続可能な地域発展のための様々なプロジェクトを推進しています。',
      zh: '大德区青年未来联盟是一个致力于青年成长和地区社会发展的组织。通过各种志愿服务和社交活动，培养社区意识，支持青年能力建设，并开展各种可持续地区发展项目。',
    },
    tags: {
      ko: ['#청년성장', '#지역발전', '#봉사활동', '#네트워킹'],
      en: ['#YouthGrowth', '#LocalDevelopment', '#Volunteering', '#Networking'],
      ja: ['#青年成長', '#地域発展', '#ボランティア', '#ネットワーキング'],
      zh: ['#青年成长', '#地区发展', '#志愿服务', '#社交网络']
    }
  }
]);

const router = useRouter();
const { isDarkMode, toggleDarkMode } = useDarkMode()

// 로컬스토리지 초기화 함수
const resetLocalStorage = () => {
  localStorage.removeItem('posts');
  localStorage.setItem('posts', JSON.stringify(posts));
  setPosts(posts);
};

// 초기 데이터 로드
useEffect(() => {
  resetLocalStorage(); // 항상 초기화하도록 변경
}, []); // 컴포넌트 마운트 시 한 번만 실행

// localStorage 데이터 변경 감지 및 상태 업데이트
useEffect(() => {
  const handleStorageChange = () => {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
}, []); // 컴포넌트 마운트 시 이벤트 리스너 등록

// 페이지 포커스 시 데이터 새로고침
useEffect(() => {
  const handleFocus = () => {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  };

  window.addEventListener('focus', handleFocus);
  return () => {
    window.removeEventListener('focus', handleFocus);
  };
}, []); // 컴포넌트 마운트 시 이벤트 리스너 등록

const handlePostClick = (postId: number) => {
  router.push(`/post/${postId}`);
};

const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 100; // 네비게이션 바 높이 + 여유 공간
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
};

return (
  <div className="font-sans min-h-screen flex flex-col bg-white dark:bg-gray-900">
    <style jsx global>{`
      html {
        scroll-behavior: smooth;
      }
      .swiper-container {
        width: 100%;
        height: 100%;
        padding: 20px 0;
      }
      .swiper-slide {
        height: auto;
        padding: 1px;
      }
      @media (max-width: 640px) {
        .swiper-button-next,
        .swiper-button-prev {
          display: none;
        }
      }
    `}</style>
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="이노커브 로고" 
                width={160} 
                height={64} 
                priority
                className="object-contain cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <Link href="#profile" onClick={(e) => handleScrollTo(e, 'profile')} className="nav-link">{translate('profile', language)}</Link>
              <Link href="#smart-options" onClick={(e) => handleScrollTo(e, 'smart-options')} className="nav-link">{translate('smartOptions', language)}</Link>
              <Link href="#history" onClick={(e) => handleScrollTo(e, 'history')} className="nav-link">{translate('history', language)}</Link>
              <Link href="#values" onClick={(e) => handleScrollTo(e, 'values')} className="nav-link">{translate('values', language)}</Link>
              <Link href="#community" onClick={(e) => handleScrollTo(e, 'community')} className="nav-link">{translate('activities', language)}</Link>
            </nav>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <LanguageToggle />
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? 
                <X className="w-6 h-6 text-gray-600 dark:text-gray-300" /> : 
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              }
            </button>
          </div>
        </div>
      </div>
    </header>
    <AnimatePresence>
      {isMenuOpen && (
        <motion.nav
          className="md:hidden bg-white dark:bg-gray-800 fixed top-[72px] left-0 right-0 z-40 shadow-lg border-b border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col">
            <Link href="#profile" onClick={(e) => { setIsMenuOpen(false); handleScrollTo(e, 'profile'); }} className="block py-5 px-6 text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition duration-300 font-mono tracking-tight border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">{translate('profile', language)}</Link>
            <Link href="#smart-options" onClick={(e) => { setIsMenuOpen(false); handleScrollTo(e, 'smart-options'); }} className="block py-5 px-6 text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition duration-300 font-mono tracking-tight border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">{translate('smartOptions', language)}</Link>
            <Link href="#history" onClick={(e) => { setIsMenuOpen(false); handleScrollTo(e, 'history'); }} className="block py-5 px-6 text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition duration-300 font-mono tracking-tight border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">{translate('history', language)}</Link>
            <Link href="#values" onClick={(e) => { setIsMenuOpen(false); handleScrollTo(e, 'values'); }} className="block py-5 px-6 text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition duration-300 font-mono tracking-tight border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">{translate('values', language)}</Link>
            <Link href="#community" onClick={(e) => { setIsMenuOpen(false); handleScrollTo(e, 'community'); }} className="block py-5 px-6 text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 transition duration-300 font-mono tracking-tight hover:bg-gray-50 dark:hover:bg-gray-700">{translate('activities', language)}</Link>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
    <main className="w-full max-w-4xl mx-auto p-5 pt-24 flex-grow overflow-x-hidden">
      <div className="w-full overflow-x-hidden">
        <FadeInSection>
          <section id="profile" className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 sm:p-10 shadow-lg overflow-hidden relative">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-40 h-40 sm:w-56 sm:h-56 relative">
                <Image 
                  src="/profile.png"
                  alt={translate('name', language)} 
                  fill
                  sizes="(max-width: 640px) 160px, 224px"
                  priority
                  className="rounded-full object-cover object-top w-auto h-auto" 
                />
              </div>
              <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold mb-3 text-gray-900 dark:text-white">{translate('name', language)}</h2>
                <p className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-300 mb-6">
                  {translate('title', language).split('|').map((part, index) => (
                    <span key={index} className="sm:inline block">
                      {index > 0 && <span className="sm:inline hidden"> · </span>}
                      {part}
                    </span>
                  ))}
                </p>
              </div>
              <div className="w-full max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <ProfileItem label={translate('birth', language)} value={[translate('birthDate', language)]} className="text-center" />
                  <ProfileItem label={translate('mbti', language)} value={[translate('mbtiType', language)]} className="text-center" />
                  <ProfileItem 
                    label={translate('affiliation', language)} 
                    value={translate('affiliationDescription', language).split('\n')} 
                    className="text-center"
                  />
                  <ProfileItem 
                    label={translate('field', language)} 
                    value={[translate('fieldDescription', language)]} 
                    className="text-center"
                  />
                </div>
              </div>
            </div>
          </section>
        </FadeInSection>
      </div>

      <div className="w-full overflow-x-hidden">
        <FadeInSection>
          <section id="smart-options" className="mb-8">
            <ContactOptions language={language} />
          </section>
        </FadeInSection>
      </div>

      <div className="w-full overflow-x-hidden">
        <FadeInSection>
          <section id="history" className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg overflow-hidden relative">
            <History />
          </section>
        </FadeInSection>
      </div>
      <div className="w-full overflow-x-hidden">
        <FadeInSection>
          <section id="values" className="mb-8 pt-8">
            <MyValues language={language} />
          </section>
        </FadeInSection>
      </div>
      <div className="w-full overflow-x-hidden">
        <FadeInSection>
          <section id="community" className="py-16">
            <div className="container mx-auto">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                loop={posts.length > 1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  stopOnLastSlide: false
                }}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    centeredSlides: true,
                  },
                  640: {
                    slidesPerView: Math.min(2, posts.length),
                    spaceBetween: 20,
                    centeredSlides: false,
                  },
                  1024: {
                    slidesPerView: Math.min(3, posts.length),
                    spaceBetween: 20,
                    centeredSlides: false,
                  }
                }}
                className="swiper-container !pb-12"
              >
                {posts.map((post) => (
                  <SwiperSlide 
                    key={post.id}
                    className="h-[340px] px-4 md:p-2"
                  >
                    <div
                      onClick={() => handlePostClick(post.id)}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 cursor-pointer transform transition-all duration-300 hover:scale-105 h-[340px] flex flex-col border border-gray-100 dark:border-gray-700 origin-center hover:z-10"
                    >
                      <div className="relative h-[200px] rounded-t-lg overflow-hidden bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                        <Image
                          src={post.image}
                          alt={post.title[language]}
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold mb-2 overflow-hidden whitespace-pre-line text-gray-900 dark:text-white"
                            style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: '2',
                              minHeight: '3.5rem',
                              lineHeight: '1.5rem'
                            }}
                        >{post.title[language]}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 overflow-hidden"
                           style={{
                             display: '-webkit-box',
                             WebkitBoxOrient: 'vertical',
                             WebkitLineClamp: '3',
                             minHeight: '3rem',
                             lineHeight: '1.25rem'
                           }}
                        >{post.description[language]}</p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {post.tags[language].map((tag, index) => (
                            <span key={index} className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        </FadeInSection>
      </div>
    </main>

    <ShareButton language={language} />

    <footer className="bg-gray-800 dark:bg-gray-800 text-white py-12 mt-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{translate('contact', language)}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <Mail className="w-5 h-5" />
              <p>zhrpxk0514@naver.com</p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5" />
              <p>010-9984-9308</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{translate('affiliation', language)}</h3>
            <div className="space-y-2">
              <p className="block text-white">
                {translate('affiliations_1', language)}
              </p>
              <p>{translate('affiliations_3', language)}</p>
              <p>{translate('affiliations_4', language)}</p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">{translate('socialMedia', language)}</h3>
            <div className="space-y-2">
              <Link href="https://www.instagram.com/o_ooookc/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-400 transition duration-300">
                <span>Instagram</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
)
}

function ProfileItem({ label, value, className = '' }: { label: string, value: string[], className?: string }) {
  return (
    <div className={`mb-2 ${className}`}>
      {label && <span className="font-bold text-blue-600 dark:text-blue-400 block mb-1 text-xl text-label">{label}</span>}
      {(value ?? []).map((item, index) => (
        <p key={index} className="text-lg text-gray-700 dark:text-gray-300 text-content">{item}</p>
      ))}
    </div>
  )
}