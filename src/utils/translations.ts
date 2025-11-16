export interface TranslationContent {
  nav: {
    home: string
    research: string
    publications: string
    education: string
    contact: string
    conference: string
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
  conference: {
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
    phone?: string
    address?: string
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
      conference: 'Conference Papers',
      education: 'Education',
      contact: 'Contact',
      language: '中文'
    },
    hero: {
      title: 'Wenbo HU',
      subtitle: 'PhD Student in Sociology, Department of Sociology, The University of Hong Kong',
      description: 'Research on fertility transition, abortion, aging & digital society.',
      contactButton: 'Contact Me'
    },
    research: {
      title: 'Research Interests',
      interests: [
        'Fertility transition',
        'Induced abortion',
        'Aging & digital society',
        'Intergenerational coresidence',
        'Son preference'
      ]
    },
    publications: {
      title: 'Publications',
      papers: [
        {
          title: 'Fertility Transition of Han and Ethnic Minorities in China: A Tale of Convergence and Variation',
          authors: 'Yongai Jin, Wenbo Hu, Donghui Wang',
          venue: 'Chinese Journal of Sociology',
          year: '2023'
        },
        {
          title: 'Diverging Destinies: The Transition of Induced Abortion in China',
          authors: 'Yongai Jin, Wenbo Hu',
          venue: 'China Population and Development Studies',
          year: '2023'
        },
        {
          title: 'Internet Use and the Life of Older Adults Aged 50 and above in Digital Era: Findings from a National Survey',
          authors: 'Yongai Jin, Wenbo Hu, Yang Feng',
          venue: 'Population Research',
          year: '2024 (in Chinese)'
        },
        {
          title: 'The Transition of Intergenerational Coresidence and Its Driving Mechanism in China: An Analysis Based on the Data on Nine Phases of China Health and Nutrition Survey 1991-2015',
          authors: 'Ting Li, Wenbo Hu',
          venue: 'Population and Economics',
          year: '2021 (in Chinese)'
        },
        {
          title: 'Short Video App Use and the Life of Mid-age and Older Adults: An Exploratory Study Based on a Social Survey',
          authors: 'Yongai Jin, Wenli Liu, Menghan Zhao, Donghui Wang, Wenbo Hu',
          venue: 'Population Research',
          year: '2021 (in Chinese)'
        }
      ]
    },
    conference: {
      title: 'Conference Papers',
      papers: [
        {
          title: 'The Impact of Working Time on Fertility Intention and the Mediating Roles of Job Satisfaction and Household Assets',
          authors: 'Yongai Jin, Wenbo Hu',
          venue: 'Conference for Research on East Asian Demography and Inequality, Peking University, Beijing, China',
          year: '2024'
        },
        {
          title: 'Explaining the Uncertainty Relationship between Development and Son Preference in Rural China: The Role of Clan Culture',
          authors: 'Wenbo Hu',
          venue: 'Social Science Japan Data Archive (SSJDA) Seminars, University of Tokyo, Tokyo, Japan',
          year: '2023'
        },
        {
          title: 'The Impact of Intergenerational Mobility on Fertility Intention and Rural-urban Differences',
          authors: 'Wenbo Hu',
          venue: 'Annual Meeting of China Population Association (online)',
          year: '2022'
        }
      ]
    },
    education: {
      title: 'Education',
      degrees: [
        {
          degree: 'PhD Student in Sociology',
          institution: 'Department of Sociology, University of Hong Kong',
          year: 'Sept 2025 - Present',
          description: 'Doctoral research in sociology'
        },
        {
          degree: 'M.A. in Demography',
          institution: 'School of Population and Health, Renmin University of China',
          year: 'Sept 2022 – Jun 2025',
          description: 'Graduate studies in demography'
        },
        {
          degree: 'B.A. in Management',
          institution: 'School of Social Research, Renmin University of China',
          year: 'Sept 2018 – Jun 2022',
          description: 'Undergraduate studies in management'
        }
      ]
    },
    contact: {
      title: 'Contact Information',
      email: 'huwenbo@connect.hku.hk',
      phone: '(+852)84971644',
      address: '8F, Postgraduate Hub, The Jockey Club Tower, Centennial Campus, The University of Hong Kong, Pokfulam Road, Hong Kong',
      office: '8F, Postgraduate Hub',
      university: 'The University of Hong Kong'
    }
  },
  zh: {
    nav: {
      home: '首页',
      research: '研究方向',
      publications: '发表论文',
      conference: '会议论文',
      education: '教育背景',
      contact: '联系方式',
      language: 'English'
    },
    hero: {
      title: '胡文博',
      subtitle: '香港大学社会学系博士研究生',
      description: '研究方向包含生育转变、流产变迁、老龄化与数字社会等。',
      contactButton: '联系我'
    },
    research: {
      title: '研究方向',
      interests: [
        '生育转变',
        '诱导流产变迁',
        '老龄化与数字社会',
        '代际同居',
        '重男轻女与宗族文化'
      ]
    },
    publications: {
      title: '发表论文',
      papers: [
        {
          title: 'Fertility Transition of Han and Ethnic Minorities in China: A Tale of Convergence and Variation',
          authors: 'Yongai Jin, Wenbo Hu, Donghui Wang',
          venue: 'Chinese Journal of Sociology',
          year: '2023'
        },
        {
          title: 'Diverging Destinies: The Transition of Induced Abortion in China',
          authors: 'Yongai Jin, Wenbo Hu',
          venue: 'China Population and Development Studies',
          year: '2023'
        },
        {
          title: 'Internet Use and the Life of Older Adults Aged 50 and above in Digital Era: Findings from a National Survey',
          authors: 'Yongai Jin, Wenbo Hu, Yang Feng',
          venue: 'Population Research',
          year: '2024（中文）'
        },
        {
          title: 'The Transition of Intergenerational Coresidence and Its Driving Mechanism in China: ... CHNS 1991-2015',
          authors: 'Ting Li, Wenbo Hu',
          venue: 'Population and Economics',
          year: '2021（中文）'
        },
        {
          title: 'Short Video App Use and the Life of Mid-age and Older Adults: An Exploratory Study Based on a Social Survey',
          authors: 'Yongai Jin, Wenli Liu, Menghan Zhao, Donghui Wang, Wenbo Hu',
          venue: 'Population Research',
          year: '2021（中文）'
        }
      ]
    },
    conference: {
      title: '会议论文',
      papers: [
        {
          title: 'The Impact of Working Time on Fertility Intention and the Mediating Roles of Job Satisfaction and Household Assets',
          authors: 'Yongai Jin, Wenbo Hu',
          venue: '北京大学 东亚人口与不平等研究会议',
          year: '2024'
        },
        {
          title: 'Explaining the Uncertainty Relationship between Development and Son Preference in Rural China: The Role of Clan Culture',
          authors: 'Wenbo Hu',
          venue: '东京大学 SSJDA 研讨会',
          year: '2023'
        },
        {
          title: 'The Impact of Intergenerational Mobility on Fertility Intention and Rural-urban Differences',
          authors: 'Wenbo Hu',
          venue: '中国人口学会年会（线上）',
          year: '2022'
        }
      ]
    },
    education: {
      title: '教育背景',
      degrees: [
        {
          degree: '社会学博士研究生',
          institution: '香港大学 社会学系',
          year: '2025年9月 - 至今',
          description: '社会学领域博士研究'
        },
        {
          degree: '人口学硕士',
          institution: '中国人民大学 人口与健康学院',
          year: '2022年9月 – 2025年6月',
          description: '人口学研究生学习'
        },
        {
          degree: '管理学学士',
          institution: '中国人民大学 社会与人口学院',
          year: '2018年9月 – 2022年6月',
          description: '管理学本科学习'
        }
      ]
    },
    contact: {
      title: '联系方式',
      email: 'huwenbo@connect.hku.hk',
      phone: '(+852)84971644',
      address: '香港大学赛马会楼研究生中心8楼，赛马会校园，香港薄扶林道',
      office: '研究生中心 8层',
      university: '香港大学'
    }
  }
}