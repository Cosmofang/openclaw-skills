#!/usr/bin/env node
/**
 * Automatic Skill — Stage 2: Design (设计)
 * 输出 Agent 执行 prompt，指导其为选定创意产出完整的 Skill 架构设计。
 *
 * 用法:
 *   node scripts/design.js <skill-slug-or-idea>
 *   node scripts/design.js --from-pipeline   # 从 data/current-pipeline.json 读取 selected
 *   node scripts/design.js --lang en <skill-slug>
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const langIdx = args.indexOf('--lang');
const lang = langIdx !== -1 ? args[langIdx + 1] : 'zh';

let idea = '';
if (args.includes('--from-pipeline')) {
  const pipelinePath = path.join(__dirname, '..', 'data', 'current-pipeline.json');
  if (!fs.existsSync(pipelinePath)) {
    console.error('ERROR: data/current-pipeline.json not found. Run research.js first.');
    process.exit(1);
  }
  const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
  const selected = pipeline.selected || (pipeline.research && pipeline.research.selected);
  if (!selected) {
    console.error('ERROR: No selected idea found in current-pipeline.json. Complete Stage 1 first.');
    process.exit(1);
  }
  idea = `${selected.name} (${selected.slug}): ${selected.description}`;
} else {
  idea = args.filter(a => a !== '--lang' && a !== lang).join(' ');
  if (!idea) {
    console.error('Usage: node scripts/design.js <skill-idea-or-slug>');
    console.error('       node scripts/design.js --from-pipeline');
    process.exit(1);
  }
}

const now = new Date();
const dateISO = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;

if (lang === 'en') {
  console.log(`
=== AUTOMATIC SKILL — Stage 2: Design ===
Skill Idea: ${idea}
Date: ${dateISO}

Design a complete, production-ready openclaw skill for the idea above.

OUTPUT REQUIREMENTS — produce all of the following:

1. SKILL OVERVIEW
   - slug (lowercase, hyphenated)
   - Full name
   - One-paragraph description (for SKILL.md frontmatter)
   - Keywords list (20+ words, mix of Chinese and English)
   - Runtime requirements (Node version, npm packages needed)
   - Environment variables needed (name, required, description)

2. FILE TREE
   List every file the skill needs, e.g.:
   SKILL.md
   package.json
   _meta.json
   .clawhub/origin.json
   data/<filename>.json  (if any persistent data)
   scripts/
     <script-name>.js   (one line per script with its purpose)

3. SCRIPT SPECIFICATIONS
   For each script, provide:
   - Filename
   - Purpose (one sentence)
   - Input: CLI args or flags
   - Output: what console.log prints (prompt text or JSON)
   - Logic: 5-10 bullet points describing the algorithm

4. SKILL.md STRUCTURE
   - Frontmatter fields (name, description, keywords, metadata)
   - Section headings and brief content outline for each section
   - Example commands table

5. DATA SCHEMA
   For each data file, provide the JSON schema with example values.

6. CRON SCHEDULE
   If the skill needs scheduled pushes, list cron expressions and their triggers.

OUTPUT FORMAT (JSON, to be appended into data/current-pipeline.json under key "design"):
{
  "stage": "design",
  "idea": "${idea}",
  "slug": "...",
  "fileTree": ["SKILL.md", "package.json", ...],
  "scripts": [
    { "file": "scripts/xxx.js", "purpose": "...", "args": "...", "output": "...", "logic": [] }
  ],
  "skillMdOutline": { "frontmatter": {}, "sections": [] },
  "dataSchemas": {},
  "cronSchedules": [],
  "completedAt": "<ISO timestamp>"
}

Read the existing data/current-pipeline.json, add the "design" key, and save back.
Then proceed to Stage 3: node scripts/create.js --from-pipeline
`);
} else {
  console.log(`
=== AUTOMATIC SKILL — 阶段 2：设计 ===
Skill 创意：${idea}
日期：${dateISO}

为上述创意设计一个完整的、可投入生产的 openclaw skill。

输出要求 — 产出以下全部内容：

1. SKILL 概要
   - slug（小写，短横线分隔）
   - 全名
   - 一段描述（用于 SKILL.md frontmatter）
   - 关键词列表（20+ 词，中英混合）
   - 运行环境需求（Node 版本、所需 npm 包）
   - 所需环境变量（名称、是否必填、说明）

2. 文件树
   列出 skill 所需的每个文件，例如：
   SKILL.md
   package.json
   _meta.json
   .clawhub/origin.json
   data/<文件名>.json（如有持久化数据）
   scripts/
     <脚本名>.js（每行一个脚本及其用途）

3. 脚本规格
   对每个脚本，提供：
   - 文件名
   - 用途（一句话）
   - 输入：CLI 参数或 flag
   - 输出：console.log 打印的内容（prompt 文本或 JSON）
   - 逻辑：5-10 条描述算法的要点

4. SKILL.md 结构
   - frontmatter 字段（name, description, keywords, metadata）
   - 每个章节的标题和简要内容大纲
   - 示例命令表格

5. 数据 Schema
   对每个数据文件，提供带示例值的 JSON schema。

6. Cron 计划
   如果 skill 需要定时推送，列出 cron 表达式及触发器。

输出格式（JSON，追加到 data/current-pipeline.json 的 "design" 键下）：
{
  "stage": "design",
  "idea": "${idea}",
  "slug": "...",
  "fileTree": ["SKILL.md", "package.json", ...],
  "scripts": [
    { "file": "scripts/xxx.js", "purpose": "...", "args": "...", "output": "...", "logic": [] }
  ],
  "skillMdOutline": { "frontmatter": {}, "sections": [] },
  "dataSchemas": {},
  "cronSchedules": [],
  "completedAt": "<ISO 时间戳>"
}

读取现有的 data/current-pipeline.json，添加 "design" 键后保存回去。
然后进入阶段 3：node scripts/create.js --from-pipeline
`);
}
