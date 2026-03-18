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
      subtitle: 'PhD Student in Demography, Department of Sociology, The University of Hong Kong',
      description: 'Research Interests: Social Stratification, Marriage and Family, Demography.',
      contactButton: 'Contact Me'
    },
    research: {
      title: 'Research Interests',
      interests: [
        'Social Stratification',
        'Marriage and Family',
        'Demography'
      ]
    },
    publications: {
      title: 'Publications',
      papers: [
        {
          title: 'Fertility Transition of Han and Ethnic Minorities in China: A Tale of Convergence and Variation',
          authors: 'Yongai Jin, Wenbo Hu, Donghui Wang',
          venue: 'Chinese Journal of Sociology, 9(4), 522-552',
          year: '2023'
        },
        {
          title: 'Diverging Destinies: The Transition of Induced Abortion in China',
          authors: 'Yongai Jin, Wenbo Hu',
          venue: 'China Population and Development Studies, 7(1), 63-94',
          year: '2023'
        },
        {
          title: 'Internet Use and the Life of Older Adults Aged 50 and above in Digital Era: Findings from a National Survey',
          authors: 'Yongai Jin, Wenbo Hu, Yang Feng',
          venue: 'Population Research, 48(1), 40-55',
          year: '2024 (in Chinese)'
        },
        {
          title: 'The Transition of Intergenerational Coresidence and Its Driving Mechanism in China: An Analysis Based on the Data on Nine Phases of China Health and Nutrition Survey 1991-2015',
          authors: 'Ting Li, Wenbo Hu',
          venue: 'Population and Economics, (06), 54-67',
          year: '2021 (in Chinese)'
        },
        {
          title: 'Short Video App Use and the Life of Mid-age and Older Adults: An Exploratory Study Based on a Social Survey',
          authors: 'Yongai Jin, Wenli Liu, Menghan Zhao, Donghui Wang, Wenbo Hu',
          venue: 'Population Research, 45(3), 31-45',
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
          degree: 'PhD Student in Demography',
          institution: 'Department of Sociology, The University of Hong Kong',
          year: '2025 - Present',
          description: 'Current doctoral training in demography'
        },
        {
          degree: 'M.A. in Demography',
          institution: 'School of Population and Health, Renmin University of China',
          year: '2022 - 2025',
          description: 'GPA: 3.95/4.0'
        },
        {
          degree: 'B.A. in Management',
          institution: 'School of Social Research, Renmin University of China',
          year: '2018 - 2022',
          description: 'GPA: 3.77/4.0'
        }
      ]
    },
    contact: {
      title: 'Contact Information',
      email: 'huwenbo@connect.hku.hk',
      address: '8/F, The Jockey Club Tower, Centennial Campus, The University of Hong Kong',
      office: '8/F, The Jockey Club Tower, Centennial Campus',
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
      subtitle: '香港大学社会学系人口学博士研究生',
      description: '研究兴趣：社会分层、婚姻与家庭、人口学。',
      contactButton: '联系我'
    },
    research: {
      title: '研究方向',
      interests: [
        '社会分层',
        '婚姻与家庭',
        '人口学'
      ]
    },
    publications: {
      title: '发表论文',
      papers: [
        {
          title: 'Fertility Transition of Han and Ethnic Minorities in China: A Tale of Convergence and Variation',
          authors: 'Yongai Jin, Wenbo Hu, Donghui Wang',
          venue: 'Chinese Journal of Sociology, 9(4), 522-552',
          year: '2023'
        },
        {
          title: 'Diverging Destinies: The Transition of Induced Abortion in China',
          authors: 'Yongai Jin, Wenbo Hu',
          venue: 'China Population and Development Studies, 7(1), 63-94',
          year: '2023'
        },
        {
          title: 'Internet Use and the Life of Older Adults Aged 50 and above in Digital Era: Findings from a National Survey',
          authors: 'Yongai Jin, Wenbo Hu, Yang Feng',
          venue: 'Population Research, 48(1), 40-55',
          year: '2024（中文）'
        },
        {
          title: 'The Transition of Intergenerational Coresidence and Its Driving Mechanism in China: An Analysis Based on the Data on Nine Phases of China Health and Nutrition Survey 1991-2015',
          authors: 'Ting Li, Wenbo Hu',
          venue: 'Population and Economics, (06), 54-67',
          year: '2021（中文）'
        },
        {
          title: 'Short Video App Use and the Life of Mid-age and Older Adults: An Exploratory Study Based on a Social Survey',
          authors: 'Yongai Jin, Wenli Liu, Menghan Zhao, Donghui Wang, Wenbo Hu',
          venue: 'Population Research, 45(3), 31-45',
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
          degree: '人口学博士研究生',
          institution: '香港大学 社会学系',
          year: '2025年 - 至今',
          description: '当前进行人口学方向博士训练'
        },
        {
          degree: '人口学硕士',
          institution: '中国人民大学 人口与健康学院',
          year: '2022年 - 2025年',
          description: 'GPA：3.95/4.0'
        },
        {
          degree: '管理学学士',
          institution: '中国人民大学 社会与人口学院',
          year: '2018年 - 2022年',
          description: 'GPA：3.77/4.0'
        }
      ]
    },
    contact: {
      title: '联系方式',
      email: 'huwenbo@connect.hku.hk',
      address: '香港大学百周年校区赛马会楼 8/F',
      office: '赛马会楼 8/F',
      university: '香港大学'
    }
  }
}
