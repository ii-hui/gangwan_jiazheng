// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 发送企业微信通知
async function sendWechatNotification(data: {
  name: string;
  phone: string;
  service?: string;
  message?: string;
}) {
  const webhookUrl = process.env.WECHAT_WORK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('未配置企业微信 Webhook URL');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        msgtype: 'markdown',
        markdown: {
          content: `## 🔔 新的客户咨询通知

<font color="warning">**【紧急】请尽快联系客户！**</font>

> **👤 客户姓名**：${data.name}
> **📱 联系电话**：<font color="warning">${data.phone}</font>
> **🏠 服务类型**：${data.service || '未指定'}
${data.message ? `> **💬 客户留言**：${data.message}` : ''}
> **⏰ 提交时间**：${new Date().toLocaleString('zh-CN', { 
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
})}

---

💡 **温馨提示**：
- 建议在 **1小时内** 联系客户，提高成单率
- 请确认客户需求并快速响应
- 客户等待时间越短，满意度越高

📞 **快速操作**：复制电话号码 **${data.phone}** 立即拨打`,
        },
      }),
    });

    const result = await response.json();
    
    if (result.errcode === 0) {
      console.log('✅ 企业微信通知发送成功');
    } else {
      console.error('❌ 企业微信通知发送失败:', result);
    }
    
    return result;
  } catch (error) {
    console.error('❌ 发送企业微信通知时出错:', error);
    throw error;
  }
}

// 保存到 Supabase
async function saveToSupabase(data: {
  name: string;
  phone: string;
  service?: string;
  message?: string;
}) {
  const { data: result, error } = await supabase
    .from('contacts')
    .insert([
      {
        name: data.name,
        phone: data.phone,
        service: data.service,
        message: data.message,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error('❌ Supabase 保存失败:', error);
    throw error;
  }

  console.log('✅ 数据已保存到 Supabase');
  return result;
}

// POST 请求处理
export async function POST(request: Request) {
  try {
    // 1. 解析请求数据
    const body = await request.json();
    const { name, phone, service, message } = body;

    // 2. 数据验证
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: '姓名和电话不能为空' },
        { status: 400 }
      );
    }

    // 3. 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { success: false, message: '请输入正确的手机号码' },
        { status: 400 }
      );
    }

    console.log('📝 收到新的咨询:', { name, phone, service });

    // 4. 并行执行保存和通知（提高响应速度）
    const [savedData, notificationResult] = await Promise.all([
      saveToSupabase({ name, phone, service, message }),
      sendWechatNotification({ name, phone, service, message }),
    ]);

    // 5. 返回成功响应
    return NextResponse.json({
      success: true,
      message: '提交成功！我们会尽快与您联系。',
      data: {
        id: savedData?.[0]?.id,
        notificationSent: notificationResult?.errcode === 0,
      },
    });

  } catch (error) {
    console.error('❌ 处理请求时出错:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: '提交失败，请稍后重试或直接拨打电话：18533552006',
      },
      { status: 500 }
    );
  }
}

// GET 请求处理（用于测试）
export async function GET() {
  return NextResponse.json({
    message: '企业微信通知 API 运行正常',
    timestamp: new Date().toISOString(),
  });
}