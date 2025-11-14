export interface TranslationContent {
  nav: {
    home: string
    research: string
    publications: string
    education: string
    contact: string
    language: string
  }
  hero: {
    title: string
    subtitle: string
    description: string
    contactButton: string
  }
  research: {
    title: string
    interests: string[]
  }
  publications: {
    title: string
    papers: {
      title: string
      authors: string
      venue: string
      year: string
    }[]
  }
  education: {
    title: string
    degrees: {
      degree: string
      institution: string
      year: string
      description: string
    }[]
  }
  contact: {
    title: string
    email: string
    office: string
    university: string
  }
}

export const translations: Record<string, TranslationContent> = {
  en: {
    nav: {
      home: 'Home',
      research: 'Research',
      publications: 'Publications',
      education: 'Education',
      contact: 'Contact',
      language: '中文'
    },
    hero: {
      title: 'PhD Student',
      subtitle: 'Hong Kong University',
      description: 'Welcome to my academic homepage. I am a PhD student focusing on advanced research in my field.',
      contactButton: 'Contact Me'
    },
    research: {
      title: 'Research Interests',
      interests: [
        'Machine Learning and Artificial Intelligence',
        'Data Mining and Big Data Analytics',
        'Computer Vision and Pattern Recognition',
        'Natural Language Processing',
        'Deep Learning Applications'
      ]
    },
    publications: {
      title: 'Publications',
      papers: [
        {
          title: 'Advanced Methods in Machine Learning',
          authors: 'John Doe, Jane Smith',
          venue: 'International Conference on Machine Learning',
          year: '2024'
        },
        {
          title: 'Deep Learning for Computer Vision',
          authors: 'John Doe, et al.',
          venue: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
          year: '2023'
        },
        {
          title: 'Natural Language Processing Techniques',
          authors: 'John Doe, Jane Smith, Bob Johnson',
          venue: 'Annual Meeting of the Association for Computational Linguistics',
          year: '2023'
        }
      ]
    },
    education: {
      title: 'Education',
      degrees: [
        {
          degree: 'PhD in Computer Science',
          institution: 'Hong Kong University',
          year: '2022 - Present',
          description: 'Doctoral studies focusing on machine learning and artificial intelligence'
        },
        {
          degree: 'MSc in Computer Science',
          institution: 'Top University',
          year: '2020 - 2022',
          description: 'Master\'s degree with distinction in computer science'
        },
        {
          degree: 'BSc in Computer Science',
          institution: 'Renowned University',
          year: '2016 - 2020',
          description: 'Bachelor\'s degree with honors in computer science'
        }
      ]
    },
    contact: {
      title: 'Contact Information',
      email: 'your.email@hku.hk',
      office: 'Office: Room XXX, Academic Building',
      university: 'Hong Kong University'
    }
  },
  zh: {
    nav: {
      home: '首页',
      research: '研究方向',
      publications: '发表论文',
      education: '教育背景',
      contact: '联系方式',
      language: 'English'
    },
    hero: {
      title: '博士研究生',
      subtitle: '香港高校',
      description: '欢迎来到我的学术主页。我是一名博士研究生，专注于我所在领域的前沿研究。',
      contactButton: '联系我'
    },
    research: {
      title: '研究方向',
      interests: [
        '机器学习与人工智能',
        '数据挖掘与大数据分析',
        '计算机视觉与模式识别',
        '自然语言处理',
        '深度学习应用'
      ]
    },
    publications: {
      title: '发表论文',
      papers: [
        {
          title: '机器学习中的先进方法',
          authors: '张三, 李四',
          venue: '国际机器学习会议',
          year: '2024'
        },
        {
          title: '计算机视觉的深度学习',
          authors: '张三 等',
          venue: 'IEEE模式分析与机器智能汇刊',
          year: '2023'
        },
        {
          title: '自然语言处理技术',
          authors: '张三, 李四, 王五',
          venue: '计算语言学协会年会',
          year: '2023'
        }
      ]
    },
    education: {
      title: '教育背景',
      degrees: [
        {
          degree: '计算机科学博士',
          institution: '香港高校',
          year: '2022 - 至今',
          description: '博士研究，专注于机器学习与人工智能'
        },
        {
          degree: '计算机科学硕士',
          institution: '知名大学',
          year: '2020 - 2022',
          description: '计算机科学硕士学位，优秀毕业生'
        },
        {
          degree: '计算机科学学士',
          institution: '著名大学',
          year: '2016 - 2020',
          description: '计算机科学学士学位，荣誉毕业生'
        }
      ]
    },
    contact: {
      title: '联系方式',
      email: 'your.email@hku.hk',
      office: '办公室：学术大楼 XXX室',
      university: '香港高校'
    }
  }
}