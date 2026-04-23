---
name: xhsfenxi-pro
version: 2.0.0
description: |
  小红书全链路分析 skill。数据采集（SeleniumBase XHR拦截）+ 博主深度分析（三型分类 + 五层模型 + hsword内核三段论）+ 爆款选题公式（6模型 + 30选题方向）+ 结构化报告 + 黑体Word交付。
  整合 xhscosmoskill（采集引擎）+ xhsfenxi（分析框架）+ hsword（实战案例库）。
keywords:
  - xiaohongshu
  - 小红书分析
  - 博主分析
  - 爆款选题公式
  - 三型博主
  - 选题模型
  - Word报告
  - 账号拆解
---

# xhs-cosmo — 小红书全链路分析 Skill

> 数据采集 × 三型分类 × 内核三段论 × 6模型爆款选题公式 × 黑体Word交付

---

## 工具路径

```
LIB_ROOT:    /Users/zezedabaobei/Desktop/cosmocloud/Deeplumen/cosmowork/xiaohongshu_new
COOKIES:     /Users/zezedabaobei/Desktop/cosmocloud/Deeplumen/cosmowork/shopify-marketing/xhs_cookies.json
COOKIES_ALT: /Users/zezedabaobei/Desktop/cosmocloud/Deeplumen/cosmowork/xiaohongshu_new/xhs_cookies.json
DATA_DIR:    xhscosmoskill/data/          (archetypes.json, bloggers.json)
HSWORD_REF:  openclaw_cosmo/afa/hsword/   (实战案例库)
BUILD_DOCX:  xhscosmoskill/scripts/build_docx.py
```

---

## 能力总览

| 层 | 来源 | 功能 |
|----|------|------|
| **数据采集** | xhscosmoskill | 用户主页笔记、关键词搜索、笔记详情、评论 |
| **分析框架** | xhsfenxi | 三型分类、五层账号模型、证据分级 |
| **内核三段论** | hsword | 外壳/真正内核/三层人设结构 |
| **爆款选题公式** | hsword | 6模型 × 可套用句式 × 30个选题方向 |
| **可迁移框架** | hsword | 如何把博主方法论迁移到自己账号 |
| **报告生成** | 综合 | 结构化报告 + 爆款选题公式 + 多账号对比 |
| **Word交付** | scripts/build_docx.py | 全黑体样式 + 绿色装饰线 |

---

## 三型博主分类系统

### Type A — 荒诞美学型
- **内核：** 荒诞幽默包裹哲学内核，品牌符号统一（如"（劲爆）"）
- **公式：** 荒诞场景 × 品牌符号 × 哲思轻量化 → 审美共鸣
- **代表：** 井越

### Type B — 共鸣命名型
- **内核：** 私人经历 → 普世命题，给模糊情绪命名，`*` 号品牌符号
- **公式：** 私人场景 × 命题化 × 诗意命名 × `*` 印章 → 普世共鸣
- **代表：** xixiCharon、橘一橙NiceFriend

### Type C — 现实策略型
- **内核：** 打破潜规则，提供可执行向上策略，反体面表达
- **公式：** 困境 → 说破规则 → 提供策略 → 爽感执行
- **代表：** 丑穷女孩陈浪浪

### 混合型（最强组合）
- **B+A：** 既"给情绪命名"又"有审美质感" — xixiCharon
- **B+C：** 既"懂你"又"告诉你下一步怎么做"

---

## hsword 内核三段论（必做步骤）

每次分析必须明确三层：

```
外壳是什么？（表面看起来像什么博主）
        ↓
真正的内核是什么？（一句话，带""引号的精炼）
        ↓
三层人设结构：
  表层标签   → 身份/场景/标签
  中层特质   → 性格/能力/气质
  深层价值观 → 鼓励什么/认可什么/传递什么
```

**关键洞察：** 真正让账号成立的是第三层。第一层可模仿，第二层可包装，但第三层必须靠长期内容一致才能被用户相信。

---

## 爆款选题公式体系（6大模型）

### 模型1：场景 × 哲思型（B型均赞最高）
```
[具体地点/场景] + [在这里感受到的哲学状态] + [品牌符号]
```
机制：地点宏大 × 感受日常 × 语言诗意 = 三重张力

### 模型2：状态命名型（高收藏率）
```
[擅长/习惯做X的人] + 对[某事物]的感知是[新的理解]的 + [品牌符号]
```
机制：把混沌状态翻译成可被理解的概念 → 用户"被命名"的满足感

### 模型3：阶段宣言型（节点必出）
```
[时间节点/年龄阶段] + [这个阶段的成长判断] + [品牌符号]
```
机制：时间节点触发情绪浓度 × 个人叙事 × 同龄共鸣

### 模型4：独行宣言型（独立女性共鸣）
```
[我独自/一个人] + [行动] + [反预期结果]
```
机制：独立女性认同 × 行动力展示 × 反预期 = 三重共鸣

### 模型5：情绪逆转型（治愈系高收藏）
```
[消极状态] + 其实是/让我明白了 + [正向领悟] + [品牌符号]
```
机制：情绪低谷共鸣 + 逆转出口 = "被治愈的可能性"

### 模型6：世界观输出型（最强粘性）
```
[持续做X的人/坚持Y的意义] + [是如何理解Z的] + [品牌符号]
```
机制：用户收藏的是"世界观"，会持续追更

---

## 完整分析管道（Full Pipeline）

```
Step 0  Cookie 健康检查
        ↓
Step 1  解析输入（URL/ID/名称）→ 检查数据库是否已有记录
        ↓
Step 2  数据采集（get_user_notes, limit=50, scroll_times=10）
        ↓
Step 3  基础统计（compute_stats）
        ↓
Step 4  三型分类（classify_archetype）
        ↓
Step 5  内核三段论（build_five_layers + 手动补充外壳/内核/深层价值观）
        ↓
Step 6  爆款选题公式生成（generate_formula_report）
        ↓
Step 7  生成结构化报告 Markdown（mode='full'）
        ↓
Step 8  外部文档合并（如有用户提供额外分析文档）
        ↓
Step 9  写入博主数据库（save_blogger）
        ↓
Step 10 生成 Word（scripts/build_docx.py）
```

---

## 数据采集 API

```python
import sys
sys.path.insert(0, "/Users/zezedabaobei/Desktop/cosmocloud/Deeplumen/cosmowork/xiaohongshu_new")
from xhscosmoskill import XhsClient
from xhscosmoskill.analyzer import analyze_account, classify_archetype, compute_stats, build_five_layers
from xhscosmoskill.formula import generate_formula_report
from xhscosmoskill.archetype_registry import save_blogger, list_archetypes, get_blogger

COOKIES = "/Users/zezedabaobei/Desktop/cosmocloud/Deeplumen/cosmowork/shopify-marketing/xhs_cookies.json"

with XhsClient(cookies_file=COOKIES, headless=True, scroll_times=10) as xhs:
    notes = xhs.get_user_notes(user_id, limit=50)
    report = xhs.analyze_account(notes, creator_name=name, mode="full")
```

---

## 报告生成 API

| 函数 | 说明 |
|------|------|
| `analyze_account(notes, creator_name, mode)` | 主入口，mode: full/formula/snapshot |
| `classify_archetype(notes)` | 三型分类，返回类型+置信度 |
| `build_five_layers(notes, archetype)` | 五层账号模型 |
| `compute_stats(notes)` | 基础统计 |
| `generate_formula_report(notes, creator_name, archetype)` | 生成爆款选题公式报告 |

---

## Word 生成

```python
# 单命令生成黑体Word
python3 scripts/build_docx.py <md_path> <out_path> <title> <subtitle>
```

或在代码中：
```python
from xhscosmoskill.scripts.build_docx import build_word
build_word(md_path="/tmp/report.md", out_path="/tmp/report.docx",
           title="xixiCharon", subtitle="爆款选题公式")
```

---

## Cookie 管理

```python
# 优先使用（最新）
COOKIES = ".../shopify-marketing/xhs_cookies.json"

# 备用
COOKIES_ALT = ".../xiaohongshu_new/xhs_cookies.json"

# Cookie 健康检查
from xhscosmoskill.utils import check_cookies
status = check_cookies(COOKIES)  # 返回 {valid: bool, expired_keys: list}
```

**Cookie 过期标志：** notes 返回 ≤ 1 条 → 提示重新运行 `xhs_login.py`

---

## 数据库操作

```python
from xhscosmoskill.archetype_registry import (
    save_blogger,     # 写入/更新博主记录
    get_blogger,      # 按名称查询
    list_bloggers,    # 列出所有博主
    list_archetypes,  # 查看当前类型库
    add_archetype,    # 新增自定义类型
    update_archetype_signals  # 迭代更新类型信号词
)
```

---

## 交付物规范

| 文件 | 格式 | 说明 |
|------|------|------|
| `{博主名}-结构化总结报告.md/.docx` | Markdown + Word | 单账号深度分析（15节）|
| `{博主名}-爆款选题公式.md/.docx` | Markdown + Word | 6模型 + 30选题方向 |
| `选题公式学习-综合版.md/.docx` | Markdown + Word | 多账号对比 |

---

## 证据分级

| 级别 | 来源 | 使用方式 |
|------|------|---------|
| A1 | 小红书公开主页可见数据 | 直接陈述 |
| A2 | 用户提供截图 | 直接陈述 |
| B1 | 第三方公开资料（采访/新榜/百科）| 作为背景补充 |
| C1 | 综合推断 | 明确标注为"推断" |

---

## 参考资源

- **实战案例库（hsword）：** `openclaw_cosmo/afa/hsword/`
  - 井越（Type A）：荒诞美学型完整报告 + 爆款公式
  - 橘一橙NiceFriend（Type B）：共鸣命名型完整报告 + 爆款公式
  - 丑穷女孩陈浪浪（Type C）：现实策略型完整报告 + 爆款公式
  - 选题公式学习-综合版：双系统 + 混合公式 + 6种标题公式
- **分析框架参考：** `references/workflow.md`
- **报告模板：** `references/templates.md`
- **hsword框架：** `references/hsword-frameworks.md`
- **新榜数据：** `https://www.newrank.cn/profile/xiaohongshu/{user_id}`

---

## 已分析博主档案

| 博主 | 类型 | 最高赞 | 均赞 | 分析日期 |
|------|------|--------|------|---------|
| xixiCharon | B+A | 10万+ | 3,148 | 2026-04-23 |

*更多博主将在 `/xhsfx` 调用后自动写入 data/bloggers.json*

---

*整合自 xhscosmoskill v1.0 + xhsfenxi v2.1 + hsword实战案例 · 版本 2.0.0 · 2026-04-23*

---

## Purpose & Capability

**Xhsfenxi Pro** is a full-stack Xiaohongshu (小红书) blogger analysis skill. It combines automated data collection with a structured deep-analysis framework derived from real-world case studies (hsword archive).

| Capability | Description |
|-----------|-------------|
| Data Collection | Scrape user notes via SeleniumBase XHR interception — no API key required |
| Three-Archetype Classification | Classify bloggers as Type A (Absurdist Aesthetics) / B (Resonance Naming) / C (Reality Strategy) or hybrid |
| Core Identity Analysis (hsword) | Three-layer persona deconstruction: surface labels / mid-layer traits / deep values |
| Viral Topic Formula | 6-model formula system with reusable sentence templates and 30 ready-to-use topic directions |
| Structured Reports | Full 15-section analysis report in Markdown |
| Word Output | Black Heiti-font Word documents via `scripts/build_docx.py` |
| Iterative Archetype DB | `data/archetypes.json` evolves as more bloggers are analyzed |

**Does NOT:**
- Require any Xiaohongshu API token (uses browser-based XHR interception)
- Access private/protected notes or accounts
- Store or transmit user credentials
- Generate fake engagement data or fabricate analysis results

---

## Instruction Scope

**In scope — will handle:**
- "Analyze this Xiaohongshu blogger URL"
- "Generate viral topic formula for this account"
- "What archetype is this blogger?"
- "Produce a Word report for this creator"
- "Compare two bloggers"
- Any `/xhsfx` command invocation

**Out of scope — will not handle:**
- Accessing private accounts or bypassing platform security
- Publishing or posting content to Xiaohongshu on behalf of users
- Real-time follower/engagement data (uses public page data only)
- Non-Xiaohongshu platforms

**When cookies expire:**
The browser session cookie file expires approximately every 30 days. If `notes` returns ≤ 1 result, prompt the user to re-run `python3 xhs_login.py` to refresh cookies. The skill will not silently fail — it will detect and report the expired state.

---

## Credentials

This skill uses **no API tokens or platform credentials for analysis**.

| Action | Credential | Scope |
|--------|-----------|-------|
| Data collection | Xiaohongshu session cookie (browser-based) | Local file only — `xhs_cookies.json` |
| Report generation | None | Local file writes only |
| Word output | None | Local file writes only |

Cookie file locations (in priority order):
1. `shopify-marketing/xhs_cookies.json` (preferred — most recent)
2. `xiaohongshu_new/xhs_cookies.json` (fallback)

**Does NOT hardcode tokens, API keys, or account credentials.**
Cookie files are local only and never transmitted.

---

## Persistence & Privilege

| Path | Content | When written |
|------|---------|-------------|
| `data/archetypes.json` | Archetype registry — evolves as bloggers are analyzed | On each `save_blogger()` call |
| `data/bloggers.json` | Analyzed blogger database | On each `save_blogger()` call |
| `/tmp/{creator}-*.md` | Markdown analysis reports | On report generation |
| `/tmp/{creator}-*.docx` | Word documents | On `build_word()` call |

**Does NOT write to:**
- Any system directories outside the skill directory and `/tmp/`
- Shell configuration files (`~/.zshrc` etc.)
- Xiaohongshu platform (read-only)

**Uninstall:** Delete the skill directory. Cookie files at `xhs_cookies.json` paths can be deleted separately.

---

## Install Mechanism

```bash
clawhub install xhsfenxi-pro
```

**Prerequisites:**
```bash
pip install seleniumbase python-docx
```

**First-time cookie setup:**
```bash
python3 xhs_login.py
# Opens browser → log in to Xiaohongshu → cookies saved automatically
```

**Verify installation:**
```python
import sys
sys.path.insert(0, "/path/to/xhscosmoskill/..")
import xhscosmoskill
print(xhscosmoskill.__version__)  # should print: 2.0.0

from xhscosmoskill import print_cookie_status
print_cookie_status()  # ✅ 全部有效 / ❌ 已过期
```

**Quick analysis:**
```python
from xhscosmoskill import XhsClient, analyze_account

with XhsClient() as xhs:
    notes = xhs.get_user_notes("USER_ID_HERE", limit=50)
    report = xhs.analyze_account(notes, creator_name="BloggerName")
    print(report)
```
