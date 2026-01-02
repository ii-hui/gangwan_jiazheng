import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '仅支持GET请求' })
  }

  try {
    const { path } = req.query

    if (!path) {
      return res.status(400).json({ error: '缺少path参数' })
    }

    const { data, error } = await supabaseAdmin.storage
      .from('job-seekers')
      .createSignedUrl(path, 3600)

    if (error) {
      return res.status(500).json({ error: '生成签名URL失败', detail: error.message })
    }

    return res.status(200).json({ signedUrl: data.signedUrl })
  } catch (error) {
    return res.status(500).json({ error: '服务器错误', detail: error.message })
  }
}
