# 求职者上传系统 - 部署指南

## 📋 部署前检查清单

在部署到Netlify之前，请确保已完成以下步骤：

- [x] 在Supabase中执行了 `database-init.sql` 脚本
- [x] 在Supabase Storage中创建了 `job-seekers` bucket（私有）
- [x] 本地 `.env.local` 文件配置正确
- [ ] 代码已推送到GitHub仓库

## 🚀 Netlify部署步骤

### 1. 配置环境变量

登录Netlify Dashboard，进入项目设置：

1. 点击 **Site settings** → **Environment variables**
2. 添加以下环境变量：

```bash
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://tlxczsxuubwoeigyhmou.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseGN6c3h1dWJ3b2VpZ3lobW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMDY4MzksImV4cCI6MjA3NjU4MjgzOX0.7QiaZ7YA4QuHqUiXvcHsj_0UFi-47BICUd1EFqyRDL4

# Supabase Service Role Key (仅服务端使用)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseGN6c3h1dWJ3b2VpZ3lobW91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTAwNjgzOSwiZXhwIjoyMDc2NTgyODM5fQ.4sFEORgyTBR1LfVlEoebU5EnTKuOmZgjRiAnlSXWKfU

# 站点配置
NEXT_PUBLIC_SITE_URL=https://qhdgwjz.cn

# 企业微信Webhook
WECHAT_WORK_WEBHOOK_URL=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=e560bbc4-26cc-4ec9-a9d3-4b0802b033d6

# 管理员密码
NEXT_PUBLIC_ADMIN_PASSWORD=gwjz2025
```

### 2. 推送代码到GitHub

```bash
cd /c/Users/Administrator/Desktop/58/gangwan-jiazhen
git add .
git commit -m "添加求职者上传系统功能"
git push origin main
```

### 3. 触发部署

- Netlify会自动检测到GitHub的更新并开始部署
- 或者在Netlify Dashboard中手动触发部署：**Deploys** → **Trigger deploy** → **Deploy site**

### 4. 验证部署

部署完成后，访问以下页面验证功能：

1. **求职者列表页**: https://qhdgwjz.cn/qiuzhi
2. **求职者上传页**: https://qhdgwjz.cn/qiuzhi/upload
3. **管理员审核页**: https://qhdgwjz.cn/admin/review
4. **密钥生成页**: https://qhdgwjz.cn/admin/keys

## 🔑 首次使用流程

### 管理员操作

1. 访问 https://qhdgwjz.cn/admin/keys
2. 使用密码 `gwjz2025` 登录
3. 生成上传密钥（设置有效期和使用次数）
4. 将密钥发送给求职者

### 求职者操作

1. 访问 https://qhdgwjz.cn/qiuzhi/upload
2. 输入管理员提供的密钥
3. 填写个人信息并上传照片
4. 提交后等待审核

### 管理员审核

1. 访问 https://qhdgwjz.cn/admin/review
2. 使用密码 `gwjz2025` 登录
3. 查看待审核的求职者信息
4. 点击"通过"或"拒绝"按钮

## 📱 功能测试清单

部署后请测试以下功能：

- [ ] 密钥生成功能正常
- [ ] 密钥验证功能正常
- [ ] 求职者信息提交功能正常
- [ ] 图片上传功能正常
- [ ] 管理员审核功能正常
- [ ] 求职者列表展示正常
- [ ] 企业微信通知正常（如果配置了webhook）

## ⚠️ 安全注意事项

1. **Service Role Key安全**
   - 仅在Netlify环境变量中配置
   - 不要提交到Git仓库
   - 不要在前端代码中使用

2. **管理员密码**
   - 首次部署后建议修改默认密码
   - 在Netlify环境变量中修改 `NEXT_PUBLIC_ADMIN_PASSWORD`

3. **Storage Bucket**
   - 确保 `job-seekers` bucket设置为私有
   - 不要公开bucket访问权限

## 🔧 常见问题

### 问题1: API调用失败

**原因**: 环境变量未正确配置

**解决方案**:
1. 检查Netlify环境变量是否完整
2. 重新部署站点使环境变量生效

### 问题2: 图片无法显示

**原因**: Storage bucket权限配置问题

**解决方案**:
1. 确认bucket为私有访问
2. 检查RLS策略是否正确配置

### 问题3: 密钥验证失败

**原因**: 数据库函数未创建或Service Role Key错误

**解决方案**:
1. 确认已执行 `database-init.sql` 脚本
2. 检查 `SUPABASE_SERVICE_ROLE_KEY` 是否正确

## 📞 技术支持

如有问题，请参考：
- `PROJECT_WORK_LOG.md` - 工作日志
- `PROJECT_SUMMARY.md` - 项目总结
- `database-init.sql` - 数据库脚本

---

**部署完成后，请更新 PROJECT_WORK_LOG.md 记录部署时间和状态。**
