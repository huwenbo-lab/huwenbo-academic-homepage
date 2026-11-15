# Syllabus Atlas — Sociology & Demography

公开课纲、博士考试书单与有限阅读关联的可视化资料平台。

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

## 文件结构

- `index.html`：网站页面结构
- `assets/styles.css`：样式与响应式布局
- `assets/app.js`：筛选、图谱、阅读时间线、出处抽屉与浏览器端 CSV 导出
- `assets/data.js`：`window.SYLLABUS_DATA` 结构化数据；目前来自第二轮 Excel 目录，不使用第三方 API

前端不依赖框架、CDN、远端数据库、Cookie 或分析服务，静态托管即可运行。点击原始课纲来源需联网。

## 数据模型

```text
resources[]  {id, title, topic, institution, year, status, level, url, ...}
units[]      {unit_id, resource_id, original_heading, source_unit, tags, ...}
readings[]   {edge_id, resource_id, unit_id?, work_id, title_as_listed, requirement, ...}
works[]      {work_id, title, authors_first_source, year_first_source, source_ids, ...}
portals[]    {id, name, url, type, note}
```

其中 `units.original_heading` 是原课程主题；`units.tags` 是编辑添加的检索标签。空的 `unit_id` 代表无法从原资料确认周次，不应人为补齐。

## 以后怎样更新

1. 在原始 Excel / CSV / JSON 文件中维护或补充课程与阅读，保证编号唯一（`S093` 起）、URL 合法，且所有关联能够回指来源编号。
2. 通过转换脚本重建 `assets/data.js`，不要手工修改大量 JSON 文本；保持原始出处、版本判断、书目阅读标记。
3. 检查统计是否对应数据、阅读引用是否存在对应 `resource_id` 与 `work_id`，确认网页筛选、详情抽屉与阅读时间线正常。
4. 向主分支提交修改；现有 GitHub Pages Workflow 会重新生成静态站点。

## 建议的第三阶段

将 A 类课纲逐份完成 **全文层级** 阅读提取，逐篇核验 DOI，区分原教师设置的必读/选读；随后才适合创建 10—15 门跨大学综合课程。综合课程应与原课纲并列展示，不得覆盖教师原始单元。

## 版权与署名

平台只保存来源元数据、编辑摘要、有限书目转录与原站链接。课程大纲、文献、教学资料的权利归原作者及机构所有；是否允许原件再分发需要另行确认。
