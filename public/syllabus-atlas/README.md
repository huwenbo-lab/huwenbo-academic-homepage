# Syllabus Atlas — Sociology & Demography

公开课纲、博士考试书单与有限阅读关联的可视化资料平台。2026-11-15起优先展示经目录级相关性筛选的核心库，保留扩展、待补及存档来源。

## 网站部署

此子站位于 `huwenbo-academic-homepage/public/syllabus-atlas/`，随主仓库现有的 Vite / GitHub Pages 工作流复制到 `dist/syllabus-atlas/`，无需修改主页路由或安装额外依赖。

预期项目路径：`https://huwenbo-lab.github.io/huwenbo-academic-homepage/syllabus-atlas/`

## 数据来源与范围（截至 2026-11-15）

- 92 条课程、书单与版本记录（不是 92 门独立课程）
- 9 个主要研究主题
- 21 个课程来源入口
- 62 个从 17 份来源选择性整理的原始主题单元
- 76 条选择性提取的课程—阅读关联
- 73 条按题名及年份初步合并的文献记录
- A/B/C = 信息公开与核验程度，不是学术质量排序
- 东亚关联 26 条：混合了区域专门课程、一般课程中的亚洲阅读和区域高校的家庭课，不应等同于 26 门东亚博士课程
- 原始 PDF / DOCX 与文献全文均未在本项目内重新分发

本目录由前两轮检索形成。除第二轮明确复核的旧记录之外，旧材料的访问判断沿用第一轮。**不要将初步提取的阅读当作完整书单，也不要据此计算文献被要求阅读的频率排名。**

## 相关性审核（2026-11-15）

| 展示层级 | 数量 | 用途 |
|---|---:|---|
| core / 核心保留 | 51 | 作为核心社会人口学、婚姻家庭与社会分层等博士学习资料来源 |
| extended / 扩展保留 | 18 | 辅助区域、方法或相关但较宽泛的课程 |
| pending / 待补审查 | 16 | 尚缺完整大纲、阅读书单或更严格的实质核验 |
| archive / 退出主目录 | 7 | 不在主目录优先展示，但历史元数据、原始来源可追溯 |
| **全部来源记录** | **92** | 包含同一书单的不同年份版本与分类资料 |

核心库51条按原资料中已有的`group_id`归并为**46个同源组**。同源组不是经逐份课程内容核实的“46门独立课程”；例如 CUHK Family Demography I/II/III 虽然同属书单家族，却可能对应不同主题、版本或用途。网站可勾选或取消“合并同源版本”，展开查看每条原始来源。

审核不是92份原件的全文复核。证据组成：**19条直接核查原页或可读大纲，4条查阅官方索引，17条复核前轮来源卡片，52条主要沿用前轮目录概述**。这些证据等级及逐条纳入理由均保存在`assets/data.js`和`assets/curation-audit.csv`，并在课程详情显示。A/B/C 是另一独立维度，表示公开可见性而非内容相关性或学术质量。

默认打开核心库；全站搜索可检索全部92条。学科图默认展示51条核心记录，也可切换全部来源。网站“阅读路径”和“文献书目”仍是此前的**选择性提取**成果，尚不能视为某门课的完整指定阅读目录。

## 文件结构

- `index.html`：网站页面结构
- `assets/styles.css`：样式与响应式布局
- `assets/app.js`：筛选、图谱、阅读时间线、出处抽屉与浏览器端 CSV 导出
- `assets/data.js`：`window.SYLLABUS_DATA` 结构化数据，来源为第二轮 Excel 目录与第三步相关性审查，不使用第三方 API
- `assets/curation-audit.csv`：92条逐项人工相关性判断、保留理由及证据等级（含公开来源 URL）

前端不依赖框架、CDN、远端数据库、Cookie 或分析服务，静态托管即可运行。点击原始课纲来源需联网。

## 数据模型

```text
resources[]  {id, title, topic, institution, year, status, level, url, curation, curation_reason, curation_evidence, ...}
units[]      {unit_id, resource_id, original_heading, source_unit, tags, ...}
readings[]   {edge_id, resource_id, unit_id?, work_id, title_as_listed, requirement, ...}
works[]      {work_id, title, authors_first_source, year_first_source, source_ids, ...}
portals[]    {id, name, url, type, note}
```

其中 `units.original_heading` 是原课程主题；`units.tags` 是编辑添加的检索标签。空的 `unit_id` 代表无法从原资料确认周次，不应人为补齐。

## 以后怎样更新

1. 在原始 Excel / CSV / JSON 文件中维护或补充课程与阅读，保证编号唯一（`S093` 起）、URL 合法，且所有关联能够回指来源编号。新增课程必须补充`curation`、`curation_reason`和`curation_evidence`，不可默认为核心。
2. 更新`assets/curation-audit.csv`的逐项审查及同源组，重建`assets/data.js`，不要只修改界面中的硬编码计数；保持原始出处、版本判断、书目阅读标记。
3. 检查四类计数总和是否为全部来源，原始 ID 是否唯一，阅读引用是否存在对应`resource_id`与`work_id`，确认首页、四层筛选、同源组、图谱、详情抽屉与阅读时间线正常。
4. 向主分支提交修改；现有 GitHub Pages Workflow 会重新生成静态站点。

## 建议的第三阶段

将 A 类课纲逐份完成 **全文层级** 阅读提取，逐篇核验 DOI，区分原教师设置的必读/选读；随后才适合创建 10—15 门跨大学综合课程。综合课程应与原课纲并列展示，不得覆盖教师原始单元。

## 版权与署名

平台只保存来源元数据、编辑摘要、有限书目转录与原站链接。课程大纲、文献、教学资料的权利归原作者及机构所有；是否允许原件再分发需要另行确认。
