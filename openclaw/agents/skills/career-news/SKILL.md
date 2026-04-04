---
name: Career News
description: |
  针对不同职业每日推送全球精选行业新闻。
  来源覆盖 X（Twitter）、Google、Grok、全球主流媒体。
  支持中英双语、多职业分类、关键词筛选、定时早推。
keywords:
  - news
  - career
  - profession
  - daily
  - x
  - google
  - grok
  - industry
metadata:
  openclaw:
    runtime:
      node: ">=18"
---

# Career News

为不同职业的用户，每天早上从 **X（Twitter）、Google News、Grok、全球媒体** 聚合最相关的行业动态，生成一份精简、有价值的职业新闻早报。

## 支持职业

| 职业 slug | 中文 | 英文 |
|-----------|------|------|
| `doctor` | 医生/医疗从业者 | Doctor / Healthcare |
| `lawyer` | 律师/法律从业者 | Lawyer / Legal |
| `engineer` | 工程师（泛） | Engineer |
| `developer` | 软件开发者 | Software Developer |
| `designer` | 设计师 | Designer |
| `product-manager` | 产品经理 | Product Manager |
| `investor` | 投资人/金融从业者 | Investor / Finance |
| `teacher` | 教师/教育从业者 | Teacher / Educator |
| `journalist` | 记者/媒体从业者 | Journalist / Media |
| `entrepreneur` | 创业者 | Entrepreneur |
| `researcher` | 研究员/学者 | Researcher |
| `marketing` | 市场营销 | Marketing |
| `hr` | 人力资源 | HR |
| `sales` | 销售 | Sales |

## 脚本说明

| 脚本 | 功能 |
|------|------|
| `scripts/morning-push.js` | 每日早 7:00 推送，遍历所有用户 |
| `scripts/news-query.js` | 即时查询指定职业新闻 |
| `scripts/register.js` | 注册/查看/列出用户 |
| `scripts/push-toggle.js` | 开关推送 |

## 用法

```bash
# 注册用户
node scripts/register.js alice --profession developer --lang zh
node scripts/register.js bob --profession investor --lang en

# 即时查询
node scripts/news-query.js developer
node scripts/news-query.js investor --lang en --region us

# 手动触发推送
node scripts/morning-push.js
node scripts/morning-push.js --user alice
node scripts/morning-push.js --profession doctor   # 覆盖职业

# 开关推送
node scripts/push-toggle.js --userId alice         # 切换状态
node scripts/push-toggle.js                        # 显示 cron 命令
```

## Cron 设置

```bash
openclaw cron add "0 7 * * *" "cd /path/to/career-news && node scripts/morning-push.js"
```

## 新闻来源策略

推送 prompt 要求 agent 按以下顺序检索：

1. **X (Twitter)** — 搜索职业相关关键词的最新高互动帖子
2. **Google News** — 该职业领域过去 24 小时新闻
3. **Grok** — 请求对当日行业动态的 AI 综合摘要
4. **全球媒体** — Bloomberg、Reuters、TechCrunch、Nature 等按职业匹配

## 用户数据格式

`data/users/<userId>.json`:
```json
{
  "userId": "alice",
  "profession": "developer",
  "language": "zh",
  "region": "cn",
  "keywords": ["AI", "开源"],
  "pushEnabled": true,
  "createdAt": "2026-04-04T00:00:00.000Z",
  "updatedAt": "2026-04-04T00:00:00.000Z"
}
```
