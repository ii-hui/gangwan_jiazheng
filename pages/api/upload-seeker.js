import { supabaseAdmin } from '../../lib/supabaseAdmin'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST请求' })
  }

  try {
    const {
      keyCode,
      name,
      phone,
      age,
      category,
      experience,
      skills,
      description,
      avatarBase64,
      workPhotosBase64
    } = req.body

    // 验证必填字段
    if (!keyCode || !name || !phone || !category) {
      return res.status(400).json({ error: '缺少必填字段' })
    }

    // 验证密钥
    const { data: isValid, error: validateError } = await supabaseAdmin.rpc('validate_upload_key', {
      key_code_input: keyCode
    })

    if (validateError || !isValid) {
      return res.status(401).json({ error: '密钥无效或已过期' })
    }

    // 上传头像
    let avatarUrl = null
    if (avatarBase64) {
      const avatarBuffer = Buffer.from(avatarBase64.split(',')[1], 'base64')
      const avatarPath = `avatars/${Date.now()}-${phone}.jpg`

      const { error: uploadError } = await supabaseAdmin.storage
        .from('job-seekers')
        .upload(avatarPath, avatarBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
          cacheControl: '3600',
          metadata: {
            alt: `秦皇岛${category}-${name}`,
            description: `秦皇岛${category}服务人员${name}的照片`
          }
        })

      if (uploadError) {
        console.error('上传头像失败:', uploadError)
      } else {
        avatarUrl = avatarPath
      }
    }

    // 上传工作照片
    const workPhotos = []
    if (workPhotosBase64 && Array.isArray(workPhotosBase64)) {
      for (let i = 0; i < workPhotosBase64.length; i++) {
        const photoBuffer = Buffer.from(workPhotosBase64[i].split(',')[1], 'base64')
        const photoPath = `work-photos/${Date.now()}-${phone}-${i}.jpg`

        const { error: uploadError } = await supabaseAdmin.storage
          .from('job-seekers')
          .upload(photoPath, photoBuffer, {
            contentType: 'image/jpeg',
            upsert: false,
            cacheControl: '3600',
            metadata: {
              alt: `秦皇岛${category}工作照-${name}`,
              description: `秦皇岛${category}服务人员${name}的工作照片${i + 1}`
            }
          })

        if (!uploadError) {
          workPhotos.push({
            url: photoPath,
            alt: `秦皇岛${category}工作照-${name}`,
            caption: `${category}工作照${i + 1}`
          })
        }
      }
    }

    // 插入求职者信息
    const { data: seeker, error: insertError } = await supabaseAdmin
      .from('job_seekers')
      .insert({
        name,
        phone,
        age: age ? parseInt(age) : null,
        category,
        experience,
        skills: skills || [],
        description,
        avatar_url: avatarUrl,
        work_photos: workPhotos,
        upload_key: keyCode,
        uploaded_by: phone
      })
      .select()
      .single()

    if (insertError) {
      console.error('插入求职者信息失败:', insertError)
      return res.status(500).json({ error: '提交失败', detail: insertError.message })
    }

    // 更新密钥使用次数
    const { data: keyData } = await supabaseAdmin
      .from('upload_keys')
      .select('current_uses')
      .eq('key_code', keyCode)
      .single()

    if (keyData) {
      const { error: updateError } = await supabaseAdmin
        .from('upload_keys')
        .update({
          current_uses: keyData.current_uses + 1,
          used_at: new Date().toISOString(),
          used_by_phone: phone
        })
        .eq('key_code', keyCode)

      if (updateError) {
        console.error('更新密钥使用次数失败:', updateError)
      }
    }

    // 发送企业微信通知
    const webhookUrl = process.env.WECHAT_WORK_WEBHOOK_URL
    if (webhookUrl) {
      const content = `🆕 新的求职者提交\n\n` +
        `👤 姓名：${name}\n` +
        `📱 电话：${phone}\n` +
        `🏷️ 类别：${category}\n` +
        `📝 经验：${experience || '无'}\n\n` +
        `⏰ 时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}\n\n` +
        `请登录管理后台审核`

      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          msgtype: 'text',
          text: { content }
        })
      }).catch(err => console.error('发送通知失败:', err))
    }

    return res.status(200).json({
      success: true,
      message: '提交成功，等待审核',
      seekerId: seeker.id
    })
  } catch (error) {
    console.error('提交求职者信息时出错:', error)
    return res.status(500).json({ error: '服务器错误', detail: error.message })
  }
}
