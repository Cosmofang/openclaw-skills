---
name: automatic-skill
description: |
  Automatic Skill is a self-evolving meta-skill that lets openclaw (and Claude) autonomously design, build, test, and publish a brand-new skill every day — with zero human input. It runs a fully automated 9-stage pipeline: Research → Design → Create → Review → Self-Run → Self-Check → Upload to GitHub & clawHub → Verify Upload → Final Review. Each stage produces a structured prompt that the agent executes in order. A daily cron fires at 02:00, picks the highest-value skill idea from the research stage, and drives the whole pipeline to completion. The output is a production-ready skill folder committed to GitHub and listed on clawHub.

  Trigger words: 自动生成skill, 每日skill, 自动制作技能, 今日skill, skill流水线, 生成新skill, automatic skill, daily skill, skill pipeline, auto build skill, skill factory, 技能工厂, 自动化技能开发
keywords: 自动skill, 每日skill, skill流水线, 技能工厂, 自动开发, 自动测试, 自动发布, 元技能, automatic skill, skill pipeline, skill factory, meta skill, daily skill, auto build, auto test, auto publish
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

## 🔄 9 阶段流水线

| # | 阶段 | 脚本 | 说明 |
|---|------|------|------|
| 1 | 调研 Research | `research.js` | 搜索趋势话题，分析现有 skill 空白，输出 Top-3 创意 |
| 2 | 设计 Design | `design.js <idea>` | 选定创意，产出完整架构设计（文件树 + 功能说明） |
| 3 | 制作 Create | `create.js <design-file>` | 按设计生成 SKILL.md、scripts、package.json 等全部文件 |
| 4 | 审核 Review | `review.js <skill-dir>` | 对照质量检查单验证内容完整性与逻辑正确性 |
| 5 | 自跑 Self-Run | `self-run.js <skill-dir>` | 执行每个脚本，验证输出无报错 |
| 6 | 自检 Self-Check | `self-check.js <skill-dir>` | 逐项核对必填字段、文件树、脚本签名 |
| 7 | 上传 Upload | `upload.js <skill-dir>` | git commit → push GitHub；clawhub publish |
| 8 | 验收 Verify | `verify-upload.js <skill-name>` | 查询 GitHub API 和 clawHub API 确认上线 |
| 9 | 复查 Final Review | `final-review.js <skill-name>` | 生成完整报告，写入 pipeline-log.json |

---

## 🌐 语言规则

默认中文；用户英文提问时全程切英文；日志和报告统一英文。

---

## 🛠️ 脚本用法

```bash
# 全流水线（推荐）
node scripts/pipeline.js                  # 自动选题 + 全阶段执行
node scripts/pipeline.js --idea "每日诗词" # 指定主题
node scripts/pipeline.js --dry-run        # 只生成到 self-check，不上传

# 单阶段调试
node scripts/research.js                  # 输出调研 prompt
node scripts/design.js "每日诗词"         # 输出设计 prompt
node scripts/create.js /path/design.json  # 输出制作 prompt
node scripts/review.js /path/skill-dir    # 输出审核 prompt
node scripts/self-run.js /path/skill-dir  # 输出自跑 prompt
node scripts/self-check.js /path/skill-dir # 输出自检 prompt
node scripts/upload.js /path/skill-dir    # 输出上传 prompt
node scripts/verify-upload.js skill-name  # 输出验收 prompt
node scripts/final-review.js skill-name   # 输出复查 prompt

# 状态 & 历史
node scripts/status.js                    # 当前流水线状态
node scripts/status.js --history [N]      # 最近 N 次（默认 10）
node scripts/status.js --clear            # 清除当前流水线状态

# 推送管理
node scripts/push-toggle.js on            # 开启每日 02:00 自动跑
node scripts/push-toggle.js off           # 关闭
node scripts/push-toggle.js status        # 查看状态
```

---

## ⏰ Cron 配置

```bash
openclaw cron add "0 2 * * *" "cd ~/.openclaw/workspace/skills/automatic-skill && node scripts/daily-pipeline.js"
openclaw cron list
openclaw cron delete <任务ID>
```

---

## 📁 文件结构

```
data/
  pipeline-log.json       # 历史流水线记录（每次生成追加一条）
  current-pipeline.json   # 当前流水线状态（进行中时存在）
scripts/
  research.js             # 阶段 1
  design.js               # 阶段 2
  create.js               # 阶段 3
  review.js               # 阶段 4
  self-run.js             # 阶段 5
  self-check.js           # 阶段 6
  upload.js               # 阶段 7
  verify-upload.js        # 阶段 8
  final-review.js         # 阶段 9
  pipeline.js             # 编排器
  daily-pipeline.js       # cron 入口
  status.js               # 状态查询
  push-toggle.js          # cron 开关
```

---

## ⚠️ 注意事项

1. 需要设置 `GITHUB_TOKEN`、`GITHUB_REPO`、`CLAWHUB_TOKEN` 三个环境变量
2. 每次生成的 skill 保存在 `SKILL_OUTPUT_DIR`（默认 `~/.openclaw/workspace/skills`）
3. 流水线任一阶段失败时自动记录错误并停止，不会覆盖已有 skill
4. `--dry-run` 模式只跑到 self-check，不做任何网络操作
5. 历史记录保存在 `data/pipeline-log.json`，可随时查阅

---

## 🧪 测试运行记录（2026-04-04）

首次完整 dry-run 结果：

| 阶段 | 状态 | 备注 |
|------|------|------|
| 1 Research | ✅ | 扫描 17 个现有 skill，识别 5 个空白，选定 daily-poem |
| 2 Design | ✅ | 修复：`--from-pipeline` 需从 `pipeline.research.selected` 读取（非顶层 `pipeline.selected`） |
| 3 Create | ✅ | 生成 9 个文件，含 4 个脚本 |
| 4 Review | ✅ | 得分 97/100，1 个警告（data 为空数组，正常） |
| 5 Self-Run | ✅ | 6 次脚本调用全部通过 |
| 6 Self-Check | ✅ | 22/22 项检查通过，得分 100 |
| 7 Upload | ✅ | dry-run 跳过，需设置 `GITHUB_TOKEN`/`GITHUB_REPO`/`CLAWHUB_TOKEN` |
| 8 Verify | ✅ | dry-run 跳过 |
| 9 Final Review | ✅ | 已归档到 pipeline-log.json |

**已修复的 Bug（均在 design.js / upload.js / verify-upload.js / final-review.js）：**
- `pipeline.selected` → `pipeline.research.selected`（design.js `--from-pipeline`）
- slug fallback 链：`p.design.slug || p.research.selected.slug`（upload/verify/final-review）

**上传所需环境变量：**
```bash
export GITHUB_TOKEN=<your-token>
export GITHUB_REPO=<owner/repo>
export CLAWHUB_TOKEN=<your-clawhub-token>
# 可选：
export SKILL_OUTPUT_DIR=~/.openclaw/workspace/skills
```

---

*Version: 1.0.0 · Created: 2026-04-04 · Test Run: 2026-04-04*
