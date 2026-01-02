import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST请求' })
  }

  try {
    const { password, seekerId, action, rejectReason } = req.body

    // 验证必填字段
    if (!password || !seekerId || !action) {
      return res.status(400).json({ error: '缺少必填字段' })
    }

    // 验证管理员密码
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password !== adminPassword) {
      return res.status(401).json({ error: '密码错误' })
    }

    // 验证操作类型
    if (!['approve', 'reject', 'deactivate'].includes(action)) {
      return res.status(400).json({ error: '无效的操作类型' })
    }

    // 更新求职者状态
    const updates = {
      reviewed_at: new Date().toISOString(),
      reviewed_by: 'admin'
    }

    if (action === 'approve') {
      updates.is_approved = true
      updates.is_active = true
    } else if (action === 'reject') {
      updates.is_approved = false
      updates.is_active = false
      updates.reject_reason = rejectReason || '不符合要求'
    } else if (action === 'deactivate') {
      updates.is_active = false
      updates.deactivated_at = new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('job_seekers')
      .update(updates)
      .eq('id', seekerId)
      .select()
      .single()

    if (error) {
      console.error('更新求职者状态失败:', error)
      return res.status(500).json({ error: '操作失败', detail: error.message })
    }

    return res.status(200).json({
      success: true,
      message: action === 'approve' ? '审核通过' : action === 'reject' ? '已拒绝' : '已下架',
      seeker: data
    })
  } catch (error) {
    console.error('审核求职者时出错:', error)
    return res.status(500).json({ error: '服务器错误', detail: error.message })
  }
}
