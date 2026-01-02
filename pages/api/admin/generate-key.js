import { supabaseAdmin } from '../../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST请求' })
  }

  try {
    const { password, expiresInDays = 7, maxUses = 1, notes } = req.body

    // 验证管理员密码
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123'
    if (password !== adminPassword) {
      return res.status(401).json({ error: '密码错误' })
    }

    // 生成密钥
    const { data: keyCode, error: genError } = await supabaseAdmin.rpc('generate_upload_key')

    if (genError) {
      console.error('生成密钥失败:', genError)
      return res.status(500).json({ error: '生成密钥失败', detail: genError.message })
    }

    // 插入密钥记录
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const { data: keyRecord, error: insertError } = await supabaseAdmin
      .from('upload_keys')
      .insert({
        key_code: keyCode,
        expires_at: expiresAt.toISOString(),
        max_uses: maxUses,
        created_by: 'admin',
        notes: notes || `有效期${expiresInDays}天`
      })
      .select()
      .single()

    if (insertError) {
      console.error('插入密钥记录失败:', insertError)
      return res.status(500).json({ error: '保存密钥失败', detail: insertError.message })
    }

    return res.status(200).json({
      success: true,
      keyCode: keyRecord.key_code,
      expiresAt: keyRecord.expires_at,
      maxUses: keyRecord.max_uses
    })
  } catch (error) {
    console.error('生成密钥时出错:', error)
    return res.status(500).json({ error: '服务器错误', detail: error.message })
  }
}
