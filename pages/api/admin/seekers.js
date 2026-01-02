import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '仅支持GET请求' })
  }

  try {
    const { password } = req.query

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password !== adminPassword) {
      return res.status(401).json({ error: '密码错误' })
    }

    const { data, error } = await supabaseAdmin
      .from('job_seekers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return res.status(500).json({ error: '获取数据失败', detail: error.message })
    }

    // 为每个求职者生成签名URL（有效期1小时）
    const seekersWithUrls = await Promise.all(data.map(async (seeker) => {
      let avatarUrl = null
      if (seeker.avatar_url) {
        const { data: signedData } = await supabaseAdmin.storage
          .from('job-seekers')
          .createSignedUrl(seeker.avatar_url, 3600)
        avatarUrl = signedData?.signedUrl || null
      }
      return {
        ...seeker,
        avatar_url: avatarUrl
      }
    }))

    return res.status(200).json({ success: true, seekers: seekersWithUrls })
  } catch (error) {
    return res.status(500).json({ error: '服务器错误', detail: error.message })
  }
}
