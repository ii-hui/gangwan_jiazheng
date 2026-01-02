import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST请求' })
  }

  try {
    const { password, seekerId, featured } = req.body

    if (!password || !seekerId || featured === undefined) {
      return res.status(400).json({ error: '缺少必填字段' })
    }

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password !== adminPassword) {
      return res.status(401).json({ error: '密码错误' })
    }

    const { data, error } = await supabaseAdmin
      .from('job_seekers')
      .update({ is_featured: featured })
      .eq('id', seekerId)
      .select()
      .single()

    if (error) {
      return res.status(500).json({ error: '操作失败', detail: error.message })
    }

    return res.status(200).json({
      success: true,
      message: featured ? '已设为首页展示' : '已取消首页展示',
      seeker: data
    })
  } catch (error) {
    return res.status(500).json({ error: '服务器错误', detail: error.message })
  }
}
