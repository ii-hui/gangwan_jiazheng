import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST请求' })
  }

  try {
    const { keyCode } = req.body

    if (!keyCode) {
      return res.status(400).json({ error: '缺少密钥' })
    }

    // 调用数据库函数验证密钥
    const { data, error } = await supabaseAdmin.rpc('validate_upload_key', {
      key_code_input: keyCode
    })

    if (error) {
      console.error('验证密钥时出错:', error)
      return res.status(500).json({ error: '验证失败', detail: error.message })
    }

    return res.status(200).json({ valid: data })
  } catch (error) {
    console.error('验证密钥时出错:', error)
    return res.status(500).json({ error: '服务器错误', detail: error.message })
  }
}
