'use client'

import { useState } from 'react'
import { Language, translate } from '../utils/translations'
import SophisticatedButton from './SophisticatedButton'

interface MyValuesProps {
  language: Language
}

const MyValues: React.FC<MyValuesProps> = ({ language }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const content = {
    ko: [
      translate('valuesDescription', language),
      "세상은 빠르게 변화하고 있지만, 모든 변화가 사람들에게 실질적인 도움이 되는 것은 아닙니다. 저는 작은 만남이라도 소중히 여기며, 인공지능을 활용해 현실적인 가치를 제공하는 것이 중요하다고 생각합니다.",
      "AI는 단순한 기술이 아니라, 어려움을 겪는 사람들에게 해결책을 제시하고, 개인과 사회가 함께 성장할 수 있도록 돕는 도구가 되어야 합니다. 누구나 쉽게 접근하고 활용할 수 있도록 장벽을 낮추고, 이를 통해 더 많은 사람들이 혜택을 누릴 수 있어야 합니다.",
      "저는 AI와 보험을 결합하여 맞춤형 솔루션을 제공하고, 고객이 필요할 때 가장 적절한 정보를 전달하며, 지속적인 관리로 더 나은 선택을 돕고자 합니다. 기술을 활용해 실질적인 가치를 창출하고, 모두가 성장할 수 있는 환경을 만들어가는 것이 저의 목표입니다.",
      "변화하는 시대 속에서도 끊임없이 배우고 혁신하며, 지식과 경험을 나누고 공유하는 것이 진정한 발전이라 믿습니다. 함께 성장하는 사회를 만들기 위해, 오늘도 최선을 다하겠습니다.",
      "감사합니다."
    ],
    en: [
      translate('valuesDescription', language),
      "While the world is rapidly changing, not all changes bring practical benefits to people. I believe in valuing every encounter, no matter how small, and providing practical value through artificial intelligence.",
      "AI is not just a technology; it should be a tool that provides solutions to people facing difficulties and helps both individuals and society grow together. We need to lower barriers so that everyone can easily access and utilize it, allowing more people to benefit.",
      "By combining AI with insurance, I aim to provide customized solutions, deliver the most appropriate information when clients need it, and help make better choices through continuous management. My goal is to create real value through technology and build an environment where everyone can grow.",
      "Even in these changing times, I believe true progress comes from continuous learning, innovation, and sharing knowledge and experience. I will do my best every day to create a society where we can grow together.",
      "Thank you."
    ],
    ja: [
      translate('valuesDescription', language),
      "世界は急速に変化していますが、すべての変化が人々に実質的な助けとなるわけではありません。私は小さな出会いも大切にし、人工知能を活用して現実的な価値を提供することが重要だと考えています。",
      "AIは単なる技術ではなく、困難を抱える人々に解決策を提示し、個人と社会が共に成長できるよう支援するツールでなければなりません。誰もが簡単にアクセスし活用できるよう障壁を下げ、より多くの人々が恩恵を受けられるようにする必要があります。",
      "私はAIと保険を組み合わせてカスタマイズされたソリューションを提供し、お客様が必要とする時に最適な情報を届け、継続的な管理でより良い選択をサポートしていきます。技術を活用して実質的な価値を創出し、皆が成長できる環境を作ることが私の目標です。",
      "変化する時代の中でも、絶え間なく学び革新し、知識と経験を共有することが真の発展だと信じています。共に成長する社会を作るため、今日も最善を尽くしてまいります。",
      "ありがとうございます。"
    ],
    zh: [
      translate('valuesDescription', language),
      "世界正在快速变化，但并非所有的变化都能为人们带来实际帮助。我认为重视每一次相遇，无论多么微小，并通过人工智能提供实际价值都很重要。",
      "AI不仅仅是一项技术，它应该成为为困难中的人们提供解决方案，帮助个人和社会共同成长的工具。我们需要降低门槛，让每个人都能轻松访问和使用它，使更多人受益。",
      "我的目标是通过将AI与保险相结合，提供定制化解决方案，在客户需要时传递最恰当的信息，并通过持续管理帮助做出更好的选择。利用技术创造实际价值，打造一个人人都能成长的环境。",
      "即使在这个变革的时代，我也相信不断学习、创新、分享知识和经验才是真正的进步。为了创造一个共同成长的社会，今天我也将继续努力。",
      "谢谢。"
    ]
  }

  const currentContent = content[language] ?? content['ko'] ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div className="w-full">
        <div className="mb-6 relative px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 flex flex-col items-center">
          <svg className="absolute top-0 left-0 w-5 sm:w-7 md:w-12 h-5 sm:h-7 md:h-12 text-gray-300 dark:text-gray-700 transform -translate-x-1/6 -translate-y-1/6" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <h2 className="text-lg sm:text-2xl md:text-3xl relative z-10 text-center mb-4 sm:mb-5 md:mb-6">
            {translate('valuesDescription', language).split('\n').map((line: string, i: number) => (
              <span key={i} className="block text-lg sm:text-xl md:text-4xl font-mono tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>
          <svg className="absolute bottom-0 right-0 w-5 sm:w-7 md:w-12 h-5 sm:h-7 md:h-12 text-gray-300 dark:text-gray-700 transform translate-x-1/6 translate-y-1/6 rotate-180" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </div>
        <div className="space-y-4">
          {(isExpanded ? currentContent.slice(1) : currentContent.slice(1, 3)).map((paragraph, index) => (
            <p key={index} className="text-gray-600 dark:text-gray-300">{paragraph}</p>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <SophisticatedButton 
            expanded={isExpanded} 
            onClick={() => setIsExpanded(!isExpanded)} 
            language={language}
          />
        </div>
      </div>
    </div>
  )
}

export default MyValues