---
name: automatic-skill
description: |
  Automatic Skill is a self-evolving meta-skill that lets openclaw (and Claude) autonomously design, build, test, and publish a brand-new skill every day — with zero human input. It runs a fully automated 10-stage pipeline: Research → Design → SEO → Create → Review → Self-Run → Self-Check → Upload to GitHub & clawHub → Verify Upload → Final Review. Each stage produces a structured prompt that the agent executes in order. A daily cron fires at 02:00, picks the highest-value skill idea from the research stage, and drives the whole pipeline to completion. The output is a production-ready skill folder committed to GitHub and listed on clawHub.

  Trigger words: 自动生成skill, 每日skill, 自动制作技能, 今日skill, skill流水线, 生成新skill, automatic skill, daily skill, skill pipeline, auto build skill, skill factory, 技能工厂, 自动化技能开发
keywords: 自动skill, 每日skill, skill流水线, 技能工厂, 自动开发, 自动测试, 自动发布, 元技能, automatic skill, skill pipeline, skill factory, meta skill, daily skill, auto build, auto test, auto publish
requirements:
  node: ">=18"
  binaries:
    - name: gh
      required: true
      description: "GitHub CLI — used for auth, repo access, push verification, and PR creation."
    - name: git
      required: true
      description: "Git — used for staging, committing, and pushing skill files."
    - name: clawhub
      required: true
      description: "ClawHub CLI — used for publishing skills to the registry."
    - name: npx
      required: false
      description: "Node package runner — used optionally during skill creation stage."
  env:
    - name: GITHUB_TOKEN
      required: true
      description: "GitHub personal access token with repo write permission (narrowly scoped to a single repo)."
    - name: GITHUB_REPO
      required: true
      description: "Target repository in owner/repo format, e.g. myorg/openclaw-skills"
    - name: CLAWHUB_TOKEN
      required: true
      description: "ClawHub API token for publishing skills to the registry."
    - name: CLAWHUB_OWNER_ID
      required: false
      description: "ClawHub ownerId override. Defaults to the publishing account."
    - name: SKILL_OUTPUT_DIR
      required: false
      description: "Directory where generated skills are written. Defaults to ~/.openclaw/workspace/skills."
    - name: OPENCLAW_NOTIFY_CHANNEL
      required: false
      description: "Notification channel for pipeline failure alerts (e.g. slack://...)."
metadata:
  openclaw:
    runtime:
      node: ">=18"
    env:
      - name: GITHUB_TOKEN
        required: true
        description: "GitHub personal access token with repo write permission."
      - name: GITHUB_REPO
        required: true
        description: "Target repo in owner/repo format, e.g. zezedabaobei/openclaw-skills"
      - name: CLAWHUB_TOKEN
        required: true
        description: "ClawHub API token for publishing skills."
      - name: CLAWHUB_OWNER_ID
        required: false
        description: "ClawHub ownerId (defaults to kn79bebfnwg15sb0g7cj5z5nyd83gxh0)."
      - name: SKILL_OUTPUT_DIR
        required: false
        description: "Where generated skills are written. Defaults to ~/.openclaw/workspace/skills."
      - name: OPENCLAW_NOTIFY_CHANNEL
        required: false
        description: "Notification channel for pipeline failure alerts."
---

# Automatic Skill — 每日 Skill 自动工厂

> 每天凌晨自动调研 → 设计 → 制作 → 审核 → 自测 → 发布 → 复查，全程无需人工介入

---

## 何时使用

- 用户说"帮我自动生成一个 skill"/"今天有新 skill 吗"/"skill 流水线跑了没"
- 用户想查看今日生成的 skill 是什么
- 用户想手动触发某一阶段重跑
- 用户想查看生成历史或当前流水线状态

---

## 🔄 10-Stage Pipeline

| # | Stage | Script | Description |
|---|-------|--------|-------------|
| 1 | Research | `research.js` | Scan trends, identify skill gaps, output Top-3 ideas |
| 2 | Design | `design.js <idea>` | Produce full architecture: file tree, script specs, data schema |
| 3 | SEO | `seo.js` | Optimize display name, tagline, description, 30+ keywords |
| 4 | Create | `create.js` | Generate all files using design + SEO output |
| 5 | Review | `review.js <skill-dir>` | Quality checklist: structure, scripts, content, security |
| 6 | Self-Run | `self-run.js <skill-dir>` | Execute every script, verify zero errors |
| 7 | Self-Check | `self-check.js <skill-dir>` | Validate required fields, file tree, script signatures |
| 8 | Upload | `upload.js <skill-dir>` | git commit → push GitHub; clawhub publish |
| 9 | Verify | `verify-upload.js <skill-name>` | Confirm live on GitHub and clawHub |
| 10 | Final Review | `final-review.js <skill-name>` | Full report, write to pipeline-log.json |

---

## 🌐 Language Policy

- **SKILL.md content**: English (default)
- **Conversation with user**: match user's language — Chinese if user writes Chinese
- **JSON logs & reports**: English only

---

## 🛠️ Usage

```bash
# Full pipeline (recommended)
node scripts/pipeline.js                   # auto-select topic, run all stages
node scripts/pipeline.js --idea "daily-poem" # specify topic
node scripts/pipeline.js --dry-run         # run through self-check only, no upload

# Per-stage debug
node scripts/research.js                   # output research prompt
node scripts/design.js "daily-poem"        # output design prompt
node scripts/seo.js --from-pipeline        # output SEO optimization prompt
node scripts/create.js --from-pipeline     # output create prompt
node scripts/review.js /path/skill-dir     # output review prompt
node scripts/self-run.js /path/skill-dir   # output self-run prompt
node scripts/self-check.js /path/skill-dir # output self-check prompt
node scripts/upload.js /path/skill-dir     # output upload prompt (direct push)
node scripts/upload.js --pr /path/skill-dir  # output upload prompt (PR workflow)
node scripts/verify-upload.js skill-name   # output verify prompt (gh api checks)
node scripts/final-review.js skill-name    # output final review prompt

# Status & history
node scripts/status.js                     # current pipeline status
node scripts/status.js --history [N]       # last N runs (default 10)
node scripts/status.js --clear             # clear current pipeline state

# Cron toggle
node scripts/push-toggle.js on             # enable daily 02:00 auto-run
node scripts/push-toggle.js off            # disable
node scripts/push-toggle.js status         # show status
```

---

## ⏰ Cron Setup

```bash
openclaw cron add "0 2 * * *" "cd ~/.openclaw/workspace/skills/automatic-skill && node scripts/daily-pipeline.js"
openclaw cron list
openclaw cron delete <job-id>
```

---

## 📁 File Structure

```
data/
  pipeline-log.json       # append-only history of all pipeline runs
  current-pipeline.json   # transient state during active run
scripts/
  research.js             # stage 1
  design.js               # stage 2
  seo.js                  # stage 3 — SEO optimization
  create.js               # stage 4
  review.js               # stage 5
  self-run.js             # stage 6
  self-check.js           # stage 7
  upload.js               # stage 8
  verify-upload.js        # stage 9
  final-review.js         # stage 10
  pipeline.js             # orchestrator
  daily-pipeline.js       # cron entry point
  status.js               # status query
  push-toggle.js          # cron toggle
```

---

## ⚠️ Notes

1. Required env vars: `GITHUB_TOKEN`, `GITHUB_REPO`, `CLAWHUB_TOKEN`
2. Optional: `CLAWHUB_OWNER_ID` (your clawHub owner ID), `SKILL_OUTPUT_DIR` (default: `~/.openclaw/workspace/skills`)
3. **GitHub operations use the `gh` CLI** (inspired by [steipete/github](https://clawhub.ai/steipete/github)): `gh auth status`, `gh repo view`, `gh api`, `gh pr create`. Install with `brew install gh` and run `gh auth login` before first use.
4. Stage 8 supports `--pr` flag for a PR-based GitHub workflow instead of direct push to main.
5. Stage 9 verifies GitHub state live via `gh api repos/{repo}/contents/{path}` — no `git fetch` needed.
6. On any stage failure the pipeline stops and logs the error — no partial overwrites
7. `--dry-run` stops after self-check, no network operations
8. Full run history in `data/pipeline-log.json`
9. All scripts are prompt generators only — no outbound network requests are made by the scripts themselves

---

## 🧪 Test Run Log (2026-04-04)

First full dry-run results:

| Stage | Status | Notes |
|-------|--------|-------|
| 1 Research | ✅ | Scanned 17 existing skills, identified 5 gaps, selected daily-poem |
| 2 Design | ✅ | Fix: `--from-pipeline` reads from `pipeline.research.selected` not top-level |
| 3 SEO | ✅ | Added in v1.1.0 — produces displayName, tagline, 30+ keywords |
| 4 Create | ✅ | Generated 9 files including 4 scripts |
| 5 Review | ✅ | Score 97/100, 1 warning (empty data array, expected) |
| 6 Self-Run | ✅ | 6 script calls, all passed |
| 7 Self-Check | ✅ | 22/22 checks passed, score 100 |
| 8 Upload | ✅ | dry-run skipped — requires GITHUB_TOKEN / GITHUB_REPO / CLAWHUB_TOKEN |
| 9 Verify | ✅ | dry-run skipped |
| 10 Final Review | ✅ | Archived to pipeline-log.json |

**Environment variables:**
```bash
export GITHUB_TOKEN=<your-token>
export GITHUB_REPO=<owner/repo>
export CLAWHUB_TOKEN=<your-clawhub-token>
export CLAWHUB_OWNER_ID=<your-owner-id>   # optional
export SKILL_OUTPUT_DIR=~/.openclaw/workspace/skills  # optional
```

---

*Version: 1.1.3 · Created: 2026-04-04 · Updated: 2026-04-05*
