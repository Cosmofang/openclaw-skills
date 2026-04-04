#!/usr/bin/env node
/**
 * Automatic Skill — Stage 9: Verify Upload (验收)
 * 输出 Agent 执行 prompt，指导其通过 GitHub API 和 clawHub API 确认 skill 已成功上线。
 *
 * 用法:
 *   node scripts/verify-upload.js <skill-slug>
 *   node scripts/verify-upload.js --from-pipeline
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const langIdx = args.indexOf('--lang');
const lang = langIdx !== -1 ? args[langIdx + 1] : 'zh';

let slug = '';
let commitHash = '';
let githubRepo = process.env.GITHUB_REPO || '';

if (args.includes('--from-pipeline')) {
  const pipelinePath = path.join(__dirname, '..', 'data', 'current-pipeline.json');
  if (fs.existsSync(pipelinePath)) {
    const p = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
    slug = (p.design && p.design.slug)
      || (p.research && p.research.selected && p.research.selected.slug)
      || '';
    commitHash = (p.upload && p.upload.github && p.upload.github.commitHash) || '';
  }
}
if (!slug) {
  slug = args.filter(a => a !== '--lang' && a !== lang && !a.startsWith('--'))[0] || '';
}
if (!slug) {
  console.error('Usage: node scripts/verify-upload.js <skill-slug>');
  console.error('       node scripts/verify-upload.js --from-pipeline');
  process.exit(1);
}

if (lang === 'en') {
  console.log(`
=== AUTOMATIC SKILL — Stage 9: Verify Upload ===
Skill slug: ${slug}
Commit hash: ${commitHash || '(read from pipeline)'}
GitHub repo: ${githubRepo || '$GITHUB_REPO'}

Verify that the skill has been successfully published to both GitHub and clawHub.

── GITHUB VERIFICATION ──────────────────────────────────────────

CHECK 1 — Verify commit exists on GitHub
Use the GitHub API or git to confirm the commit is on the remote:
  git fetch origin && git log origin/main --oneline -5
  → Look for a commit message containing "${slug}"

CHECK 2 — Verify skill directory exists on GitHub
Check that the skill files are accessible on the remote branch:
  git ls-tree origin/main openclaw/agents/skills/${slug}/
  → Should list SKILL.md, package.json, _meta.json, scripts/, etc.

CHECK 3 — Verify file count
Count the files in the remote skill directory and compare to local:
  git ls-tree -r origin/main openclaw/agents/skills/${slug}/ | wc -l
  → Should be ≥ 4 (SKILL.md, package.json, _meta.json, ≥1 script)

── CLAWHUB VERIFICATION ─────────────────────────────────────────

CHECK 4 — Query clawHub for the published skill
Attempt to retrieve the skill from clawHub:
  clawhub get ${slug}
  OR via API:
  curl -H "Authorization: Bearer $CLAWHUB_TOKEN" https://api.clawhub.io/v1/skills/${slug}

  → Response must contain: slug, version, ownerId
  → HTTP status must be 200

CHECK 5 — Verify version matches _meta.json
Confirm the published version on clawHub matches the version in _meta.json.

CHECK 6 — Verify skill is searchable (optional)
  clawhub search ${slug}
  → Should return the skill in results

── OUTPUT FORMAT (JSON) ─────────────────────────────────────────
{
  "stage": "verify-upload",
  "slug": "${slug}",
  "github": {
    "commitFound": true | false,
    "directoryExists": true | false,
    "fileCount": <N>,
    "status": "VERIFIED" | "FAILED",
    "detail": "..."
  },
  "clawhub": {
    "skillFound": true | false,
    "publishedVersion": "...",
    "versionMatch": true | false,
    "status": "VERIFIED" | "FAILED",
    "detail": "..."
  },
  "overallVerdict": "FULLY_VERIFIED" | "PARTIAL" | "FAILED",
  "completedAt": "<ISO timestamp>"
}

If overallVerdict is FAILED: identify which upload step failed and re-run upload.js.
If FULLY_VERIFIED or PARTIAL: proceed to Stage 10: node scripts/final-review.js ${slug}

Update data/current-pipeline.json: add "verifyUpload" key with the report above.
`);
} else {
  console.log(`
=== AUTOMATIC SKILL — 阶段 9：验收 ===
Skill slug：${slug}
Commit hash：${commitHash || '（从 pipeline 读取）'}
GitHub 仓库：${githubRepo || '$GITHUB_REPO'}

验证 skill 已成功发布到 GitHub 和 clawHub。

── GitHub 验证 ───────────────────────────────────────────────────

检查 1 — 验证 commit 存在于 GitHub
使用 GitHub API 或 git 确认 commit 在远端：
  git fetch origin && git log origin/main --oneline -5
  → 查找包含 "${slug}" 的 commit 信息

检查 2 — 验证 skill 目录在 GitHub 上存在
确认 skill 文件在远端分支上可访问：
  git ls-tree origin/main openclaw/agents/skills/${slug}/
  → 应列出 SKILL.md, package.json, _meta.json, scripts/ 等

检查 3 — 验证文件数量
统计远端 skill 目录中的文件数并与本地对比：
  git ls-tree -r origin/main openclaw/agents/skills/${slug}/ | wc -l
  → 应 ≥ 4（SKILL.md, package.json, _meta.json, ≥1 脚本）

── clawHub 验证 ──────────────────────────────────────────────────

检查 4 — 从 clawHub 查询已发布的 skill
尝试从 clawHub 获取 skill：
  clawhub get ${slug}
  或通过 API：
  curl -H "Authorization: Bearer $CLAWHUB_TOKEN" https://api.clawhub.io/v1/skills/${slug}

  → 响应必须包含：slug, version, ownerId
  → HTTP 状态码必须为 200

检查 5 — 验证版本与 _meta.json 匹配
确认 clawHub 上发布的版本与 _meta.json 中的 version 一致。

检查 6 — 验证 skill 可被搜索（可选）
  clawhub search ${slug}
  → 应在结果中返回该 skill

── 输出格式（JSON）────────────────────────────────────────────────
{
  "stage": "verify-upload",
  "slug": "${slug}",
  "github": {
    "commitFound": true | false,
    "directoryExists": true | false,
    "fileCount": <N>,
    "status": "VERIFIED" | "FAILED",
    "detail": "..."
  },
  "clawhub": {
    "skillFound": true | false,
    "publishedVersion": "...",
    "versionMatch": true | false,
    "status": "VERIFIED" | "FAILED",
    "detail": "..."
  },
  "overallVerdict": "FULLY_VERIFIED" | "PARTIAL" | "FAILED",
  "completedAt": "<ISO 时间戳>"
}

如果 overallVerdict 为 FAILED：确定哪个上传步骤失败，重新运行 upload.js。
如果 FULLY_VERIFIED 或 PARTIAL：进入阶段 10：node scripts/final-review.js ${slug}

更新 data/current-pipeline.json：添加 "verifyUpload" 键，值为上述报告。
`);
}
