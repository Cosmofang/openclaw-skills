#!/usr/bin/env node
/**
 * openclaw-healthcheck — check-telegram.js
 * PROMPT GENERATOR ONLY — no outbound network requests.
 * Diagnoses Telegram bot status: token validity, webhook, silence detection.
 * Handles re-auth (new bot token or re-pair device code).
 *
 * Usage:
 *   node scripts/check-telegram.js
 *   node scripts/check-telegram.js --lang en
 *   node scripts/check-telegram.js --reauth   # force re-pair flow
 *   node scripts/check-telegram.js --webhook  # check/reset webhook
 */

const args = process.argv.slice(2);
const langIdx = args.indexOf('--lang');
const lang = langIdx !== -1 ? args[langIdx + 1] : 'zh';
const reauth = args.includes('--reauth');
const checkWebhook = args.includes('--webhook');

if (lang === 'en') {
  console.log(`=== openclaw-healthcheck — Telegram Diagnostics ===
Mode: ${reauth ? 'Re-auth flow' : checkWebhook ? 'Webhook check' : 'Full check'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1 — Check token configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  # Check env var
  test -n "$TELEGRAM_BOT_TOKEN" && echo "TOKEN_SET" || echo "TOKEN_MISSING"

  # Check openclaw config file
  cat ~/.openclaw/telegram/config.json 2>/dev/null | \\
    python3 -c "import sys,json; d=json.load(sys.stdin); print('CONFIG:', 'token' in d)" \\
    2>/dev/null || echo "NO_CONFIG_FILE"

  → TOKEN_MISSING + NO_CONFIG_FILE: Telegram not configured. Skip to STEP 4 to configure.
  → TOKEN_SET or config has token: proceed to STEP 2.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2 — Test bot API connectivity
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  curl -s --max-time 15 \\
    "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"

  Expected: { "ok": true, "result": { "username": "...", "id": ... } }
  → ok=true:  bot is alive. Record username.
  → ok=false: "Unauthorized" → token is invalid. Proceed to STEP 4 (re-pair).
  → Timeout / connection refused: network issue. Check internet and retry.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3 — Check for silence (bot alive but not receiving)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  # Get last update timestamp
  curl -s --max-time 15 \\
    "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates?limit=1&timeout=5"

  # Check webhook status
  curl -s --max-time 15 \\
    "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo"

  Analyze:
  → webhook url is set + has_custom_certificate=false + last_error_date is recent:
    WEBHOOK_ERROR — the endpoint is unreachable. Run with --webhook to reset.
  → webhook url is empty + updates array is empty + bot was previously sending:
    SILENT — possible getUpdates polling conflict. Restart openclaw cron push.
  → webhook url is empty + updates array has recent items:
    OK — bot is receiving normally via polling.

  If webhook error detected:
    # Clear the webhook to fall back to polling
    curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/deleteWebhook"
    → Then restart the openclaw push cron.

${reauth ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4 — Re-pair bot / get new token  ⚠️ REQUIRES USER ACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Send this message to the user:
  "Your Telegram bot token is invalid or expired. To fix this:
   1. Open Telegram and search for @BotFather
   2. Send /mybots → select your bot → API Token → Revoke current token → Generate new token
   3. Copy the new token and share it here.
   OR: If you want to use a new bot, send /newbot to @BotFather and follow the steps."

After user provides new token:
  export TELEGRAM_BOT_TOKEN="<new token>"
  # Update openclaw config
  python3 -c "
  import json, os
  cfg = json.load(open(os.path.expanduser('~/.openclaw/telegram/config.json')))
  cfg['token'] = '<new token>'
  json.dump(cfg, open(os.path.expanduser('~/.openclaw/telegram/config.json'), 'w'))
  print('Config updated.')
  "
  # Verify
  curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"

` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT — Update data/health-report.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  "telegram": {
    "status": "OK | SILENT | TOKEN_INVALID | NOT_CONFIGURED | WEBHOOK_ERROR",
    "botUsername": "<username if known>",
    "webhookStatus": "none | active | error",
    "detail": "..."
  }
`);
} else {
  console.log(`=== openclaw-healthcheck — Telegram 诊断 ===
模式：${reauth ? '重新配对流程' : checkWebhook ? 'Webhook 检查' : '全量检查'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
第 1 步 — 检查 token 配置
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  # 检查环境变量
  test -n "$TELEGRAM_BOT_TOKEN" && echo "TOKEN_SET" || echo "TOKEN_MISSING"

  # 检查 openclaw 配置文件
  cat ~/.openclaw/telegram/config.json 2>/dev/null | \\
    python3 -c "import sys,json; d=json.load(sys.stdin); print('CONFIG:', 'token' in d)" \\
    2>/dev/null || echo "NO_CONFIG_FILE"

  → TOKEN_MISSING + NO_CONFIG_FILE：Telegram 未配置，跳到第 4 步配置。
  → TOKEN_SET 或配置文件有 token：进入第 2 步。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
第 2 步 — 测试 Bot API 连通性
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  curl -s --max-time 15 \\
    "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"

  期望返回：{ "ok": true, "result": { "username": "...", "id": ... } }
  → ok=true：bot 存活，记录用户名。
  → ok=false（"Unauthorized"）：token 无效，进入第 4 步重新配对。
  → 超时 / 连接拒绝：网络问题，检查网络后重试。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
第 3 步 — 检测静默（bot 活着但收不到消息）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  # 获取最新更新时间戳
  curl -s --max-time 15 \\
    "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getUpdates?limit=1&timeout=5"

  # 检查 webhook 状态
  curl -s --max-time 15 \\
    "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getWebhookInfo"

  分析：
  → webhook url 已设置 + last_error_date 是近期时间：
    WEBHOOK_ERROR — 端点不可达，加 --webhook 参数重置。
  → webhook url 为空 + updates 为空 + bot 之前有推送记录：
    SILENT — 可能 getUpdates 轮询冲突，重启 openclaw push cron。
  → webhook url 为空 + updates 有近期消息：
    OK — bot 正在通过轮询正常接收。

  如检测到 webhook 错误：
    # 清除 webhook，回退到轮询模式
    curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/deleteWebhook"
    → 然后重启 openclaw push cron。

${reauth ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
第 4 步 — 重新配对 / 获取新 token  ⚠️ 需要用户操作
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

向用户发送此消息：
  "您的 Telegram bot token 无效或已过期。修复步骤：
   1. 打开 Telegram，搜索 @BotFather
   2. 发送 /mybots → 选择您的 bot → API Token → Revoke current token → 生成新 token
   3. 复制新 token 发给我。
   或：如需新建 bot，向 @BotFather 发送 /newbot 并按提示操作。"

用户提供新 token 后：
  export TELEGRAM_BOT_TOKEN="<新 token>"
  # 更新 openclaw 配置
  python3 -c "
  import json, os
  cfg = json.load(open(os.path.expanduser('~/.openclaw/telegram/config.json')))
  cfg['token'] = '<新 token>'
  json.dump(cfg, open(os.path.expanduser('~/.openclaw/telegram/config.json'), 'w'))
  print('配置已更新。')
  "
  # 验证
  curl -s "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"

` : ''}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
输出 — 更新 data/health-report.json
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  "telegram": {
    "status": "OK | SILENT | TOKEN_INVALID | NOT_CONFIGURED | WEBHOOK_ERROR",
    "botUsername": "<用户名（如已知）>",
    "webhookStatus": "none | active | error",
    "detail": "..."
  }
`);
}
