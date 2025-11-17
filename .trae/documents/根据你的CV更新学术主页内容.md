## 目标
- 将主页内容完整替换为你的CV信息，并保持中英双语展示、样式与现有分区一致。

## 内容映射
- 头像与首屏：`Hero` 显示姓名、头衔与院系信息；头像使用 `public/profile.jpg`。
- 顶部导航：新增“Conference Papers/会议论文”分区。
- 教育：以三段教育经历替换当前示例。
- 发表论文：以你的5篇期刊论文替换当前示例。
- 会议论文：新增组件展示3条会议论文。
- 联系方式：补充电话与详细地址。

## 数据填充（英文）
- `hero.title`: `Wenbo HU`
- `hero.subtitle`: `PhD Student in Sociology, Department of Sociology, The University of Hong Kong`
- `hero.description`: `Research on fertility transition, abortion, aging & digital society`
- `research.interests`: `['Fertility transition', 'Induced abortion', 'Aging & digital society', 'Intergenerational coresidence', 'Son preference']`
- `education.degrees`:
  1) `PhD Student in Sociology` — `Department of Sociology, University of Hong Kong` — `Sept 2025 - Present`
  2) `M.A. in Demography` — `School of Population and Health, Renmin University of China` — `Sept 2022 – Jun 2025`
  3) `B.A. in Management` — `School of Social Research, Renmin University of China` — `Sept 2018 – Jun 2022`
- `publications.papers`（5条）：
  1) `Fertility Transition of Han and Ethnic Minorities in China: A Tale of Convergence and Variation` — `Yongai Jin, Wenbo Hu, Donghui Wang` — `Chinese Journal of Sociology` — `2023`
  2) `Diverging Destinies: The Transition of Induced Abortion in China` — `Yongai Jin, Wenbo Hu` — `China Population and Development Studies` — `2023`
  3) `Internet Use and the Life of Older Adults Aged 50 and above in Digital Era: Findings from a National Survey` — `Yongai Jin, Wenbo Hu, Yang Feng` — `Population Research` — `2024`（in Chinese）
  4) `The Transition of Intergenerational Coresidence and Its Driving Mechanism in China: ... CHNS 1991-2015` — `Ting Li, Wenbo Hu` — `Population and Economics` — `2021`（in Chinese）
  5) `Short Video App Use and the Life of Mid-age and Older Adults: An Exploratory Study Based on a Social Survey` — `Yongai Jin, Wenli Liu, Menghan Zhao, Donghui Wang, Wenbo Hu` — `Population Research` — `2021`（in Chinese）
- `conference.papers`（新增3条）：
  1) `Impact of Working Time on Fertility Intention ...` — `Yongai Jin, Wenbo Hu` — `Conference for Research on East Asian Demography and Inequality, PKU, Beijing, China, Jul 2024`
  2) `Explaining the Uncertainty Relationship between Development and Son Preference in Rural China ...` — `Wenbo Hu` — `SSJDA Seminars, University of Tokyo, Tokyo, Japan, Dec 2023`
  3) `Impact of Intergenerational Mobility on Fertility Intention and Rural-urban Differences` — `Wenbo Hu` — `Annual Meeting of China Population Association, online, Jul 2022`
- `contact`（扩展）：`email: huwenbo@connect.hku.hk`，`phone: (+852)84971644`，`address: 8F, Postgraduate Hub, The Jockey Club Tower, Centennial Campus, The University of Hong Kong, Pokfulam Road, Hong Kong`，`university: The University of Hong Kong`，`office: Room (optional)`

## 数据填充（中文）
- `hero.title`: `胡文博`
- `hero.subtitle`: `香港大学社会学系博士研究生`
- `hero.description`: `研究方向包含生育转变、流产变迁、老龄化与数字社会等`
- `research.interests`: `['生育转变', '诱导流产变迁', '老龄化与数字社会', '代际同居', '重男轻女与宗族文化']`
- `education`：按照英文对应翻译（院校与时间保持原样或中文名）。
- `publications/conference`：标题可保持英文，期刊/会议名称中文翻译如下：`中国社会学期刊`、`中国人口与发展研究`、`人口研究`、`人口与经济`、`北京大学人口与不平等研究会议`、`东京大学SSJDA研讨会`、`中国人口学会年会`。
- `contact`：`邮箱`、`电话`、`地址`与`大学`中文展示。

## 代码改动
1. `src/hooks/useLanguage.ts`：实现语言上下文（`language`、`setLanguage`、`localStorage` 持久化，默认 `'en'`）。
2. `src/utils/translations.ts`：按上文填充中英数据；扩展 `TranslationContent`，新增 `conference`、`contact.phone`、`contact.address`。
3. `src/components/Contact.tsx`：渲染电话与地址（若存在则显示）。
4. `src/components/Publications.tsx`：保留现有结构，仅替换数据。
5. `src/components/Education.tsx`：保留现有结构，仅替换数据。
6. 新增 `src/components/Conference.tsx`：样式沿用 `Publications` 卡片列表；`App.tsx` 中新增 `<section id='conference'>`；`Navigation.tsx` 增加导航项。
7. `src/components/Hero.tsx`：将主标题显示为姓名，副标题显示头衔与院系；头像指向 `'/profile.jpg'`。

## 验证
- 本地运行后检查：导航滚动、语言切换与持久化、各分区内容、头像加载。
- 中英切换核对：所有文案随语言切换全局更新。

## 需要你确认
- 是否采用上述中文翻译；`office`是否需要具体房间号；头像文件是否提供为 `public/profile.jpg`。

确认后我将基于该计划一次性完成实现与验证。