// 企业微信Webhook通知API
export default async function handler(req, res) {
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST请求' })
  }

  try {
    const { phone, category, name, message } = req.body

    // 验证必填字段
    if (!phone || !category) {
      return res.status(400).json({ error: '缺少必填字段' })
    }

    // 企业微信Webhook URL（从环境变量读取）
    const webhookUrl = process.env.WECHAT_WORK_WEBHOOK_URL

    if (!webhookUrl) {
      console.warn('未配置企业微信Webhook URL')
      return res.status(200).json({ success: true, message: '通知功能未启用' })
    }

    // 构造企业微信消息内容
    const content = `📞 新的客户咨询\n\n` +
      `👤 姓名：${name || '在线咨询'}\n` +
      `📱 电话：${phone}\n` +
      `🏷️ 服务类型：${category}\n` +
      `💬 留言：${message || `咨询${category}服务`}\n\n` +
      `⏰ 时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}`

    // 发送到企业微信
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        msgtype: 'text',
        text: {
          content: content,
          mentioned_list: [] // 可以添加需要@的成员ID
        }
      })
    })

    const result = await response.json()

    if (result.errcode === 0) {
      return res.status(200).json({ success: true, message: '通知发送成功' })
    } else {
      console.error('企业微信通知失败:', result)
      return res.status(500).json({
        success: false,
        error: '通知发送失败',
        detail: result.errmsg
      })
    }

  } catch (error) {
    console.error('发送企业微信通知时出错:', error)
    return res.status(500).json({
      success: false,
      error: '服务器错误',
      detail: error.message
    })
  }
}
