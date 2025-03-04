'use client'

import { useState, useMemo } from 'react'
import SophisticatedButton from './SophisticatedButton'
import { useLanguage } from '../hooks/useLanguage'

type YearHistory = {
  [key: string]: string[]
}

type HistoryByLanguage = {
  [key: string]: YearHistory
}

export default function Career() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { language } = useLanguage()

  const fullHistory: HistoryByLanguage = useMemo(() => ({
    ko: {
      "2025": [
        "(사)대한청년을세계로 대전본부 부본부장"
      ],
      "2024": [
        "메리츠 기네스 달성(신인 3등)",
        "새마을 대덕구청년미래연대 부회장",
        "메리츠 RCM본부 2본부 3지점 입사"
      ]
    },
    en: {
      "2025": [
        "Vice Director, Korea Youth to the World Association Daejeon Branch"
      ],
      "2024": [
        "Meritz Guinness Achievement (Newcomer 3rd place)",
        "Vice Chairman, Saemaul Daedeok-gu Youth Future Alliance",
        "Meritz RCM Division 2 Branch 3 Joined"
      ]
    },
    ja: {
      "2025": [
        "(社)大韓青年を世界へ 大田本部 副本部長"
      ],
      "2024": [
        "メリッツギネス達成 (新人3位)",
        "セマウル大徳区青年未来連帯副会長",
        "メリッツRCM第2本部第3支店 入社"
      ]
    },
    zh: {
      "2025": [
        "(社)大韓青年を世界へ 大田本部 副本部長"
      ],
      "2024": [
        "メリッツギネス達成 (新人3位)",
        "セマウル大徳区青年未来連帯副会長",
        "メリッツRCM第2本部第3支店 入社"
      ]
    }
  }), [])

  const currentHistory = useMemo(() => {
    return fullHistory[language] || fullHistory['ko']
  }, [language, fullHistory])

  const years = useMemo(() => {
    return Object.keys(currentHistory).sort((a, b) => parseInt(b) - parseInt(a))
  }, [currentHistory])

  const displayedYears = useMemo(() => {
    return isExpanded ? years : years.filter(year => parseInt(year) >= 2024)
  }, [isExpanded, years])

  return (
    <section className="mb-4 px-4 md:px-6 lg:px-8" role="region" aria-label="경력 사항">
      <div className="space-y-6">
        {displayedYears.map((year, index) => (
          <div 
            key={year} 
            className={`pb-4 ${index !== displayedYears.length - 1 ? 'border-b border-gray-200' : ''}`}
            role="article"
            aria-labelledby={`year-${year}`}
          >
            <h3 
              id={`year-${year}`}
              className="text-2xl md:text-3xl font-bold text-blue-600 mb-3"
            >
              {year}
            </h3>
            <ul className="space-y-2 text-sm md:text-base" role="list">
              {currentHistory[year]?.map((item: string, index: number) => (
                <li 
                  key={index} 
                  className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                  role="listitem"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6 hidden">
        <SophisticatedButton 
          expanded={isExpanded} 
          onClick={() => setIsExpanded(!isExpanded)} 
          language={language}
          aria-expanded={isExpanded}
          aria-controls="career-history"
        />
      </div>
    </section>
  )
}