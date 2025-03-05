export type Language = 'ko' | 'en' | 'ja' | 'zh';

export type TranslationKey = string;

// 기본 번역 타입 정의
export type TranslationDictionary = {
  [key in TranslationKey]: {
    [lang in Language]: string;
  };
};

// 음성 대화 설명을 위한 타입 정의
export type VoiceChatDescriptionKey = 
  | 'recognizingVoice'
  | 'pleaseSpeak'
  | 'autoVoiceDetection'
  | 'speakFreely'
  | 'startConversation'
  | 'endConversation'
  | 'iosPermission'
  | 'androidPermission'
  | 'voiceChatTitle';

export type VoiceChatDescriptions = {
  [key in VoiceChatDescriptionKey]: {
    [lang in Language]: string;
  };
};

// 보험 상담 관련 타입과 번역
export interface InsuranceChatTranslation {
  title: string;
  placeholder: string;
  description: string;
  loading: string;
  error: string;
  examples: {
    title: string;
    questions: string[];
  };
}

export const insuranceTranslations: {
  [lang in Language]: InsuranceChatTranslation;
} = {
  ko: {
    title: '보험 상담 챗봇',
    placeholder: '보험 관련 질문을 입력해주세요',
    description: '보험 약관에 대해 궁금한 점을 물어보세요',
    loading: '답변 생성 중...',
    error: '죄송합니다. 답변 생성 중 오류가 발생했습니다',
    examples: {
      title: '질문 예시',
      questions: [
        '실손의료비 보장 범위가 어떻게 되나요?',
        '보험금 청구 절차를 알려주세요',
        '보험 가입 조건은 무엇인가요?',
        '보험료 납입 방법은 어떻게 되나요?'
      ]
    }
  },
  en: {
    title: 'Insurance Consultation Chatbot',
    placeholder: 'Ask questions about insurance policies',
    description: 'Ask any questions about insurance terms and conditions',
    loading: 'Generating answer...',
    error: 'Sorry, an error occurred while generating the answer',
    examples: {
      title: 'Example Questions',
      questions: [
        'What is the coverage for medical expenses?',
        'How do I claim insurance?',
        'What are the conditions for insurance subscription?',
        'How can I pay the insurance premium?'
      ]
    }
  },
  ja: {
    title: '保険相談チャットボット',
    placeholder: '保険に関する質問を入力してください',
    description: '保険約款について気になることを質問してください',
    loading: '回答を生成中...',
    error: '申し訳ありません。回答の生成中にエラーが発生しました',
    examples: {
      title: '質問例',
      questions: [
        '実損医療費の保障範囲はどうなっていますか？',
        '保険金請求の手続きを教えてください',
        '保険加入の条件は何ですか？',
        '保険料の納付方法を教えてください'
      ]
    }
  },
  zh: {
    title: '保险咨询聊天机器人',
    placeholder: '请输入保险相关问题',
    description: '请询问关于保险条款的任何问题',
    loading: '正在生成回答...',
    error: '抱歉，生成回答时发生错误',
    examples: {
      title: '示例问题',
      questions: [
        '实损医疗费的保障范围是怎样的？',
        '请告诉我保险金的申请程序',
        '投保条件是什么？',
        '如何缴纳保险费？'
      ]
    }
  }
};

export const translations: TranslationDictionary = {
  profile: {
    ko: '프로필',
    en: 'Profile',
    ja: 'プロフィール',
    zh: '个人资料',
  },
  values: {
    ko: '가치관',
    en: 'Values',
    ja: '価値観',
    zh: '价值观',
  },
  valuesDescription: {
    ko: 'AI로\n더 나은 삶을 만들고\n인연을 소중히',
    en: 'Creating better lives\nwith AI and\nvaluing relationships',
    ja: 'AIで\nより良い人生を創り\n縁を大切に',
    zh: '用AI\n创造更好的生活\n珍惜缘分',
  },
  history: {
    ko: '연혁',
    en: 'History',
    ja: '経歴',
    zh: '历史',
  },
  activities: {
    ko: '프로젝트',
    en: 'Projects',
    ja: 'プロジェクト',
    zh: '项目',
  },
  name: {
    ko: '오경찬',
    en: 'Kyungchan Oh',
    ja: '吳烱燦',
    zh: '吳烱燦',
  },
  title: {
    ko: 'Financial Planner|사단법인 부본부장',
    en: 'Financial Planner|Vice Director of Non-Profit Organization',
    ja: 'ファイナンシャルプランナー|社団法人副本部長',
    zh: '理财规划师|社团法人副本部长',
  },
  birth: {
    ko: '출생',
    en: 'Birth',
    ja: '生年月日',
    zh: '出生',
  },
  birthDate: {
    ko: '1998년 5월 14일',
    en: 'May 14, 1998',
    ja: '1998年5月14日',
    zh: '1998年5月14日',
  },
  affiliation: {
    ko: '소속',
    en: 'Affiliations',
    ja: '所属',
    zh: '隶属',
  },
  affiliationDescription: {
    ko: '메리츠 RCM본부 2본부 3지점 FP\n(사)대한청년을세계로 대전본부 부본부장\n새마을 대덕구청년미래연대 부회장',
    en: 'Financial Planner, Meritz RCM Division 2 Branch 3\nVice Director, Korea Youth to the World Association Daejeon Branch\nVice Chairman, Saemaul Daedeok-gu Youth Future Alliance',
    ja: 'メリッツRCM本部第2本部第3支店 FP\n(社)大韓青年を世界へ大田本部副本部長\nセマウル大徳区青年未来連帯副会長',
    zh: '美利兹RCM本部第2本部第3支店 理财规划师\n(社)韩国青年走向世界大田本部副本部长\n新村大德区青年未来联合副会长',
  },
  field: {
    ko: '분야',
    en: 'Fields',
    ja: '分野',
    zh: '领域',
  },
  fieldDescription: {
    ko: 'AI, 보험, 청년',
    en: 'AI, Insurance, Youth',
    ja: 'AI、保険、青年',
    zh: 'AI，保险，青年',
  },
  mbti: {
    ko: 'MBTI',
    en: 'MBTI',
    ja: 'MBTI',
    zh: 'MBTI',
  },
  mbtiType: {
    ko: 'ESTJ',
    en: 'ESTJ',
    ja: 'ESTJ',
    zh: 'ESTJ',
  },
  contact: {
    ko: '문의',
    en: 'Contact',
    ja: 'お問い合わせ',
    zh: '联系',
  },
  smartOptions: {
    ko: '스마트 옵션',
    en: 'Smart Options',
    ja: 'スマートオプション',
    zh: '智能选项',
  },
  socialMedia: {
    ko: 'SNS',
    en: 'Social Media',
    ja: 'SNS',
    zh: '社交媒体',
  },
  viewMore: {
    ko: '자세히 보기',
    en: 'View More',
    ja: '詳細を見る',
    zh: '查看更多',
  },
  allRightsReserved: {
    ko: '모든 권리 보유.',
    en: 'All rights reserved.',
    ja: 'All rights reserved.',
    zh: '版权所有。',
  },
  date: {
    ko: '게시일',
    en: 'Date',
    ja: '投稿日',
    zh: '日期',
  },
  summary: {
    ko: '요약',
    en: 'Summary',
    ja: '要約',
    zh: '摘要',
  },
  details: {
    ko: '상세 내용',
    en: 'Details',
    ja: '詳細内容',
    zh: '详情',
  },
  gallery: {
    ko: '갤러리',
    en: 'Gallery',
    ja: 'ギャラリー',
    zh: '画廊',
  },
  backToList: {
    ko: '목록으로 돌아가기',
    en: 'Back to List',
    ja: 'リストに戻る',
    zh: '返回列表',
  },
  expandToggle: {
    ko: '펼쳐보기',
    en: 'Expand',
    ja: '展開する',
    zh: '展开',
  },
  collapseToggle: {
    ko: '숨기기',
    en: 'Collapse',
    ja: '折りたたむ',
    zh: '折叠',
  },
  aiClone: {
    ko: 'AI 클론',
    en: 'AI Clone',
    ja: 'AIクローン',
    zh: 'AI克隆',
  },
  phone: {
    ko: '전화',
    en: 'Phone',
    ja: '電話',
    zh: '电话',
  },
  greetingVideo: {
    ko: '인사 영상',
    en: 'Greeting Video',
    ja: '挨拶動画',
    zh: '问候视频',
  },
  innoCardInquiry: {
    ko: '문의',
    en: 'Inquiry',
    ja: 'お問い合わせ',
    zh: '咨询',
  },
  contactOptions: {
    ko: '연락하기',
    en: 'Get in Touch',
    ja: 'お問い合わせ',
    zh: '联系方式',
  },
  greetingTitle: {
    ko: '희미해지는 것이 아닌,\n더 깊이 새겨지는\n당신의 존재',
    en: 'Not fading away,\nYour presence\nDeepens over time',
    ja: '消えゆくのではなく、\nより深く刻まれゆく\nあなたの存在',
    zh: '不是渐渐褪色，\n而是愈发深刻地\n铭记你的存在',
  },
  greetingDescription: {
    ko: '인간의 존엄이 위협받는 AI 시대에도,\n당신의 이야기는 결코 흐려지지 않습니다.\n\nInnoCard는 당신의 가치를 더 선명하고,\n더 오래도록 기억하게 만듭니다.',
    en: 'Even in the AI era where human dignity is threatened,\nyour story will never fade.\n\nInnoCard makes your value clearer\nand more memorable for longer.',
    ja: '人間の尊厳が脅かされるAI時代でも、\nあなたの物語は決して薄れることはありません。\n\nInnoCardで、あなたの価値を\nより鮮明に、より永く心に刻みます。',
    zh: '即使在人类尊严受到威胁的AI时代，\n你的故事也永远不会褪色。\n\nInnoCard让你的价值\n更清晰，更持久地铭记于心。',
  },
  chatInputPlaceholder: {
    ko: '메시지를 입력하세요...',
    en: 'Type your message...',
    ja: 'メッセージを入力してください...',
    zh: '请输入消息...',
  },
  cloneTitle: {
    ko: "'s Clone",
    en: "'s Clone",
    ja: "'s Clone",
    zh: "'s Clone"
  },
  formName: {
    ko: '이름',
    en: 'Name',
    ja: '名前',
    zh: '姓名',
  },
  formNamePlaceholder: {
    ko: '이름을 입력하세요',
    en: 'Enter your name',
    ja: '名前を入力してください',
    zh: '请输入姓名',
  },
  formBirthdate: {
    ko: '생년월일',
    en: 'Date of Birth',
    ja: '生年月日',
    zh: '出生日期',
  },
  formBirthdatePlaceholder: {
    ko: 'YYYY-MM-DD',
    en: 'YYYY-MM-DD',
    ja: 'YYYY-MM-DD',
    zh: 'YYYY-MM-DD',
  },
  formPhone: {
    ko: '전화번호',
    en: 'Phone Number',
    ja: '電話番号',
    zh: '电话号码',
  },
  formPhonePlaceholder: {
    ko: '전화번호를 입력하세요',
    en: 'Enter your phone number',
    ja: '電話番号を入力してください',
    zh: '请输入电话号码',
  },
  formInquiry: {
    ko: '문의 내용',
    en: 'Inquiry Details',
    ja: 'お問い合わせ内容',
    zh: '咨询内容',
  },
  formInquiryPlaceholder: {
    ko: '예) 제작 문의',
    en: 'e.g., Production inquiry',
    ja: '例）制作に関するお問い合わせ',
    zh: '例如：制作咨询',
  },
  formSubmit: {
    ko: '제출',
    en: 'Submit',
    ja: '送信',
    zh: '提交',
  },
  back: {
    ko: '뒤로',
    en: 'Back',
    ja: '戻る',
    zh: '返回',
  },
  initialGreeting: {
    ko: '안녕하세요! 저는 오경찬입니다. 무엇을 도와드릴까요?',
    en: 'Hello! I am Kyungchan Oh. How can I help you?',
    ja: 'こんにちは！吳烱燦と申します。何かお手伝いできることはありますか？',
    zh: '你好！我是吳烱燦。我能为您做些什么？'
  },
  cloneGreeting: {
    ko: "안녕하세요! 저는 오경찬's Clone입니다. 무엇을 도와드릴까요?",
    en: "Hello! I'm Kyungchan Oh's Clone. How can I help you?",
    ja: "こんにちは！吳烱燦のクローンです。どのようにお手伝いできますか？",
    zh: "你好！我是吳烱燦的克隆。我能为您做些什么？"
  },
  formEmail: {
    ko: '이메일',
    en: 'Email',
    ja: 'メール',
    zh: '电子邮件',
  },
  formEmailPlaceholder: {
    ko: '이메일을 입력하세요',
    en: 'Enter your email',
    ja: 'メールアドレスを入力してください',
    zh: '请输入电子邮件',
  },
  greetingScript: {
    ko: '안녕하세요.\n저는 보험과 AI를 결합해 맞춤형 솔루션을 제공하는 보험 전문가이자, 새마을운동 청년대표 수석부회장으로 함께 성장하는 사회를 만들기 위해 노력하는 오경찬입니다.\n\n빠르게 변화하는 시대 속에서 AI를 활용한 더 정확하고 효율적인 보험 컨설팅을 제공합니다. 고객님의 상황을 분석하고, 꼭 필요한 정보를 제공하며, 실질적인 혜택을 드리는 강력한 도구가 되어드리겠습니다.\n\n보험이 고민될 때, 언제든지 편하게 문의하세요.\nAI와 함께 고객님께 꼭 맞는 솔루션을 찾아드리겠습니다.\n\n보험과 AI를 통해 현실적인 가치를 창출하고, 나눔과 배려가 있는 사회를 만드는 데 앞장서겠습니다.\n\n앞으로도 함께 성장하는 전문가가 되겠습니다.\n감사합니다. ',
    en: 'nice to meet you!\nI am Kyungchan Oh, an insurance expert who integrates AI to provide personalized solutions and the Senior Vice President of the Saemaul Movement Youth Association, striving to create a society where we grow together.\n\nIn this rapidly changing era, I offer more accurate and efficient insurance consulting using AI.\nI analyze your situation, provide only the necessary information, and deliver real benefits through a powerful tool tailored to you.\n\nIf you ever have concerns about insurance, feel free to reach out anytime.\nWith AI, I will help you find the best solution that suits your needs.\n\nThrough insurance and AI, I aim to create real-world value and lead efforts to build a society rooted in sharing and compassion.\n\nI will continue to grow as a dedicated expert.\nThank you.',
    ja: 'こんにちは。\n私はAIと保険を組み合わせて、最適なソリューションを提供する保険専門家であり、セマウル運動青年代表の上級副会長として、共に成長する社会の実現に努めているオ・ギョンチャンです。\n\n急速に変化する時代の中で、AIを活用した、より正確で効率的な保険コンサルティングを提供しています。\nお客様の状況を分析し、必要な情報だけをお届けし、実質的なメリットを提供する強力なツールとなります。\n\n保険についてお悩みの際は、いつでもお気軽にご相談ください。\nAIと共に、お客様に最適なソリューションをご提案いたします。\n\n保険とAIを通じて、現実的な価値を創出し、思いやりと分かち合いのある社会を築くために尽力してまいります。\n\n今後とも成長し続ける専門家でありたいと思います。\nありがとうございます。',
    zh: '您好，\n我是欧京灿，一名将保险与人工智能结合，为客户提供个性化解决方案的保险专家，同时担任新村运动青年代表副会长，致力于打造一个共同成长的社会。\n\n在这个快速变化的时代，我提供基于AI的更精准、高效的保险咨询。\n我将分析您的情况，提供必要的信息，并通过强大的工具为您带来实际的收益。\n\n如果您对保险有任何疑问，欢迎随时咨询。\n我将借助AI，帮助您找到最适合的解决方案。\n\n通过保险和人工智能，我希望创造现实价值，并积极推动一个充满关怀与分享的社会。\n我将不断成长，成为更加专业的保险顾问。\n谢谢！'
  },
  affiliations_1: {
    ko: '메리츠 RCM본부 2본부 3지점',
    en: 'Meritz RCM Division 2 Branch 3',
    ja: 'メリッツRCM本部第2本部第3支店',
    zh: '美利兹RCM本部第2本部第3支店'
  },
  affiliations_2: {
    ko: '이노커브',
    en: 'InnoCurve',
    ja: 'イノカーブ',
    zh: 'InnoCurve'
  },
  affiliations_3: {
    ko: '(사)대한청년을세계로',
    en: 'Korean Youth to the World',
    ja: '(社)韓国青年を世界へ',
    zh: '(社)韩国青年走向世界'
  },
  affiliations_4: {
    ko: '새마을 대덕구청년미래연대',
    en: 'Saemaul Daedeok-gu Youth Future Alliance',
    ja: 'セマウル大徳区青年未来連帯会',
    zh: '新村大德区青年未来联盟'
  },
  linkCopied: {
    ko: '링크가 복사되었습니다',
    en: 'Link copied to clipboard',
    ja: 'リンクがコピーされました',
    zh: '链接已复制'
  },
  voiceChat: {
    ko: '음성 대화',
    en: 'Voice Chat',
    ja: '音声チャット',
    zh: '语音聊天',
  },
  listenAudio: {
    ko: '음성으로 듣기',
    en: 'Listen to Audio',
    ja: '音声で聞く',
    zh: '语音播放',
  },
  voiceInput: {
    ko: '음성 입력',
    en: 'Voice Input',
    ja: '音声入力',
    zh: '语音输入',
  },
  clearChat: {
    ko: '채팅 내역 비우기',
    en: 'Clear Chat History',
    ja: 'チャット履歴をクリア',
    zh: '清除聊天记录',
  },
  stopRecording: {
    ko: '녹음 중지',
    en: 'Stop Recording',
    ja: '録音を停止',
    zh: '停止录音',
  },
  backToChat: {
    ko: '채팅으로 돌아가기',
    en: 'Back to Chat',
    ja: 'チャットに戻る',
    zh: '返回聊天',
  },
};

// 음성 대화 페이지 설명 통합
export const voiceChatDescriptions: VoiceChatDescriptions = {
  recognizingVoice: {
    ko: '음성을 인식하고 있습니다...',
    en: 'Recognizing your voice...',
    ja: '音声を認識しています...',
    zh: '正在识别您的声音...',
  },
  pleaseSpeak: {
    ko: '말씀해 주세요',
    en: 'Please speak',
    ja: 'お話しください',
    zh: '请说话',
  },
  autoVoiceDetection: {
    ko: '자동으로 음성을 감지하여 대화합니다',
    en: 'Automatically detects voice for conversation',
    ja: '自動的に音声を検出して会話します',
    zh: '自动检测语音进行对话',
  },
  speakFreely: {
    ko: '자유롭게 말씀해주세요.\n자동으로 음성을 인식하여 대화를 시작합니다.',
    en: 'Speak freely.\nVoice will be automatically recognized\nto start the conversation.',
    ja: '自由に話してください。\n自動的に音声を認識して会話を始めます。',
    zh: '请自由发言。\n系统会自动识别语音并开始对话。',
  },
  startConversation: {
    ko: '대화 시작하기',
    en: 'Start Conversation',
    ja: '会話を始める',
    zh: '开始对话',
  },
  endConversation: {
    ko: '대화 종료하기',
    en: 'End Conversation',
    ja: '会話を終了する',
    zh: '结束对话',
  },
  iosPermission: {
    ko: 'iOS에서는 마이크 권한을 허용해야 합니다',
    en: 'Microphone permission is required on iOS',
    ja: 'iOSではマイクの権限を許可する必要があります',
    zh: '在iOS上需要麦克风权限',
  },
  androidPermission: {
    ko: '안드로이드에서는 마이크 권한을 허용해야 합니다',
    en: 'Microphone permission is required on Android',
    ja: 'Androidではマイクの権限を許可する必要があります',
    zh: '在Android上需要麦克风权限',
  },
  voiceChatTitle: {
    ko: '{name}과\n음성으로 대화해보세요',
    en: 'Voice chat with\n{name}',
    ja: '{name}と\n音声で会話してみましょう',
    zh: '与{name}\n进行语音对话',
  },
};

// 음성 대화 페이지 설명을 위한 번역 함수
export function translateVoiceChat(key: VoiceChatDescriptionKey, lang: Language): string {
  try {
    return voiceChatDescriptions[key][lang] || voiceChatDescriptions[key]['ko'] || key;
  } catch (error) {
    console.error(`Voice chat translation error for key: ${key}, language: ${lang}`, error);
    return key;
  }
}

// 보험 상담 관련 번역 함수
export function getInsuranceTranslation(lang: Language): InsuranceChatTranslation {
  return insuranceTranslations[lang] || insuranceTranslations['ko'];
}

export function translate(key: TranslationKey, lang: Language): string {
  try {
    const translation = translations[key]?.[lang] ?? translations[key]?.['ko'] ?? key;
    return translation || key;
  } catch (error) {
    console.error(`Translation error for key: ${key}, language: ${lang}`, error);
    return key;
  }
}

