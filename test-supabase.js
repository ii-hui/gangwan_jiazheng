// Supabase连接诊断脚本
// 用于检查 case_studies 表数据是否正常

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// 读取 .env.local 文件
const envPath = path.join(__dirname, '.env.local')
let supabaseUrl = ''
let supabaseKey = ''

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const lines = envContent.split('\n')
  lines.forEach(line => {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = trimmedLine.replace('NEXT_PUBLIC_SUPABASE_URL=', '').trim()
    }
    if (trimmedLine.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = trimmedLine.replace('NEXT_PUBLIC_SUPABASE_ANON_KEY=', '').trim()
    }
  })
}

console.log('🔍 开始诊断 Supabase 连接...\n')
console.log('Supabase URL:', supabaseUrl ? '✓ 已配置' : '✗ 未配置')
console.log('Supabase Key:', supabaseKey ? '✓ 已配置' : '✗ 未配置')
console.log()

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 环境变量未配置！请检查 .env.local 文件')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('📊 查询 case_studies 表...\n')

    // 1. 查询所有数据（不过滤）
    const { data: allData, error: allError } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false })

    if (allError) {
      console.error('❌ 查询失败:', allError)
      return
    }

    console.log(`✓ 找到 ${allData.length} 条记录（包括未启用的）\n`)

    if (allData.length === 0) {
      console.log('⚠️  数据表为空！请在 Supabase 后台添加数据。')
      return
    }

    // 2. 显示所有记录
    console.log('📋 所有记录：')
    console.log('─'.repeat(80))
    allData.forEach((item, index) => {
      console.log(`\n记录 ${index + 1}:`)
      console.log(`  ID: ${item.id}`)
      console.log(`  标题: ${item.title}`)
      console.log(`  is_active: ${item.is_active} ${item.is_active ? '✓' : '✗ (未启用，不会显示)'  }`)
      console.log(`  display_order: ${item.display_order}`)
      console.log(`  服务类型: ${item.service_type || '未设置'}`)
      console.log(`  地区: ${item.location || '未设置'}`)

      // 检查 screenshots 字段
      let screenshots = []
      if (typeof item.screenshots === 'string') {
        try {
          screenshots = JSON.parse(item.screenshots)
        } catch (e) {
          console.log(`  ❌ screenshots 格式错误: ${e.message}`)
        }
      } else if (Array.isArray(item.screenshots)) {
        screenshots = item.screenshots
      } else if (item.screenshots && typeof item.screenshots === 'object') {
        screenshots = [item.screenshots]
      }

      console.log(`  截图数量: ${screenshots.length}`)
      if (screenshots.length > 0) {
        screenshots.forEach((img, imgIndex) => {
          console.log(`    图片 ${imgIndex + 1}: ${img.url}`)
          console.log(`    alt: ${img.alt || '未设置'}`)
        })
      } else {
        console.log(`  ⚠️  没有截图数据！`)
      }
    })

    console.log('\n' + '─'.repeat(80))

    // 3. 查询启用的数据（与前端逻辑一致）
    const { data: activeData, error: activeError } = await supabase
      .from('case_studies')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (activeError) {
      console.error('\n❌ 查询启用数据失败:', activeError)
      return
    }

    console.log(`\n✅ 启用的记录数: ${activeData.length} 条`)

    if (activeData.length === 0) {
      console.log('\n⚠️  没有启用的案例！')
      console.log('   解决方法：在 Supabase 后台将 is_active 字段设置为 true')
    } else {
      console.log('\n✓ 前端会显示这些案例：')
      activeData.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.title}`)
      })
    }

    // 4. 检查截图URL格式
    console.log('\n🔍 检查截图URL格式：')
    console.log('─'.repeat(80))
    activeData.forEach((item, index) => {
      console.log(`\n案例 ${index + 1}: ${item.title}`)
      let screenshots = []
      if (typeof item.screenshots === 'string') {
        try {
          screenshots = JSON.parse(item.screenshots)
        } catch (e) {
          console.log(`  ❌ JSON解析失败: ${e.message}`)
        }
      } else if (Array.isArray(item.screenshots)) {
        screenshots = item.screenshots
      }

      if (screenshots.length === 0) {
        console.log('  ⚠️  没有截图！')
      } else {
        screenshots.forEach((img, imgIndex) => {
          const url = img.url || ''
          const isAbsolute = url.startsWith('http://') || url.startsWith('https://')
          const isRelative = url.startsWith('/')

          console.log(`  图片 ${imgIndex + 1}:`)
          console.log(`    URL: ${url}`)
          console.log(`    类型: ${isAbsolute ? '绝对路径 ✓' : isRelative ? '相对路径 ✓' : '⚠️  无效路径'}`)

          if (url.includes('supabase.co')) {
            // 检查是否是签名URL
            if (url.includes('?token=')) {
              console.log('    格式: Supabase 签名URL ✓')
              // 检查是否过期
              const match = url.match(/token=([^&]+)/)
              if (match) {
                try {
                  const tokenParts = match[1].split('.')
                  if (tokenParts.length === 3) {
                    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
                    const expDate = new Date(payload.exp * 1000)
                    const now = new Date()
                    if (expDate < now) {
                      console.log(`    ⚠️  签名已过期！过期时间: ${expDate.toLocaleString()}`)
                    } else {
                      console.log(`    有效期至: ${expDate.toLocaleString()} ✓`)
                    }
                  }
                } catch (e) {
                  console.log('    无法解析token有效期')
                }
              }
            } else if (url.includes('/public/')) {
              console.log('    格式: Supabase 公开URL ✓')
            }
          }
        })
      }
    })

    console.log('\n' + '='.repeat(80))
    console.log('✅ 诊断完成！')
    console.log('='.repeat(80))

  } catch (error) {
    console.error('\n❌ 发生异常:', error)
  }
}

testConnection()
