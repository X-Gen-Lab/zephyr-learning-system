# Google Analytics 配置指南

本文档说明如何为 Zephyr RTOS 学习系统配置 Google Analytics 访问统计。

## 为什么需要 Google Analytics？

Google Analytics 可以帮助你：

- 📊 了解网站访问量和用户行为
- 🌍 查看访客的地理位置分布
- 📱 分析访问设备类型（桌面/移动）
- 📈 追踪页面浏览量和热门内容
- ⏱️ 了解用户停留时间和跳出率

## 配置步骤

### 步骤 1：创建 Google Analytics 账号

1. **访问 Google Analytics**
   - 打开 https://analytics.google.com/
   - 使用你的 Google 账号登录
   - 如果没有账号，需要先注册一个 Google 账号

2. **创建账号**（首次使用）
   - 点击"开始衡量"或"管理" → "创建账号"
   - 输入账号名称：`Zephyr Learning System`（或你喜欢的名称）
   - 配置账号数据共享设置（建议保持默认勾选）
   - 点击"下一步"

### 步骤 2：创建媒体资源（Property）

1. **填写媒体资源信息**
   - 媒体资源名称：`Zephyr Learning System`
   - 报告时区：选择 `(GMT+08:00) 中国时间 - 北京`
   - 货币：选择 `人民币 (CNY)` 或 `美元 (USD)`
   - 点击"下一步"

2. **填写业务信息**
   - 行业类别：选择"教育"
   - 业务规模：选择合适的选项（如"小型 - 1 到 10 名员工"）
   - 使用 Google Analytics 的目的：
     - ✅ 衡量网站流量
     - ✅ 了解客户行为
     - ✅ 获取客户洞察
   - 点击"创建"

3. **接受服务条款**
   - 选择国家/地区：中国
   - 阅读《Google Analytics 服务条款》
   - 勾选"我接受 Google Analytics 服务条款"
   - 勾选"我接受数据处理修正条款"
   - 点击"我接受"

### 步骤 3：设置数据流（Data Stream）

1. **选择平台**
   - 在"选择平台以开始收集数据"页面
   - 点击"网站"（Web）图标

2. **配置数据流**
   - 网站网址：`https://x-gen-lab.github.io`
   - 数据流名称：`Zephyr Learning System - GitHub Pages`
   - 点击"创建数据流"

3. **获取 Measurement ID**
   - 创建完成后，会显示"网站数据流详情"页面
   - 在页面顶部可以看到 **衡量 ID**（Measurement ID）
   - 格式类似：`G-XXXXXXXXXX`（G- 开头，后面跟 10 位字符）
   - **复制这个 ID**，稍后会用到

### 步骤 4：更新 mkdocs.yml 配置

1. **打开配置文件**
   - 编辑项目根目录下的 `mkdocs.yml` 文件

2. **找到 extra 部分**
   ```yaml
   # Extra Configuration
   extra:
     social:
       - icon: fontawesome/brands/github
         link: https://github.com/X-Gen-Lab/zephyr-learning-system
     # analytics:
     #   provider: google
     #   property: G-XXXXXXXXXX
   ```

3. **取消注释并更新 ID**
   ```yaml
   # Extra Configuration
   extra:
     social:
       - icon: fontawesome/brands/github
         link: https://github.com/X-Gen-Lab/zephyr-learning-system
     analytics:
       provider: google
       property: G-YOUR-ACTUAL-ID  # 替换为你的真实 Measurement ID
   ```

   例如，如果你的 Measurement ID 是 `G-ABC123XYZ9`，则配置为：
   ```yaml
     analytics:
       provider: google
       property: G-ABC123XYZ9
   ```

### 步骤 5：构建并部署

1. **本地测试**
   ```bash
   mkdocs serve
   ```
   访问 http://localhost:8000，打开浏览器开发者工具，检查是否有 Google Analytics 请求

2. **提交更改**
   ```bash
   git add mkdocs.yml
   git commit -m "chore: add Google Analytics tracking"
   git push
   ```

3. **等待部署**
   - GitHub Actions 会自动构建并部署网站
   - 通常需要 2-5 分钟

### 步骤 6：验证配置

1. **实时报告验证**
   - 访问你的网站：https://x-gen-lab.github.io/zephyr-learning-system/
   - 在 Google Analytics 中，进入"报告" → "实时"
   - 应该能看到当前的活跃用户（你自己）

2. **检查浏览器控制台**
   - 打开浏览器开发者工具（F12）
   - 切换到"网络"（Network）标签
   - 刷新页面
   - 应该能看到对 `www.googletagmanager.com` 的请求

## 常见问题

### Q1: 看不到数据怎么办？

**可能原因：**
- 配置刚生效，需要等待 24-48 小时才能看到完整报告
- 浏览器安装了广告拦截器（如 AdBlock、uBlock Origin）
- 浏览器启用了隐私保护功能

**解决方法：**
- 查看"实时"报告，可以立即看到当前访问
- 暂时禁用广告拦截器测试
- 使用无痕模式或其他浏览器测试

### Q2: 显示 ERR_BLOCKED_BY_CLIENT 错误

这是正常的！这个错误表示：
- 用户的浏览器拦截了 Google Analytics（隐私保护）
- 对网站功能没有影响
- 只是无法统计该用户的访问数据

**不需要修复**，这是用户的选择。

### Q3: 如何查看统计数据？

1. 访问 https://analytics.google.com/
2. 选择你的媒体资源
3. 查看不同的报告：
   - **实时**：当前活跃用户
   - **生命周期** → **获客**：用户来源
   - **生命周期** → **互动**：页面浏览量
   - **用户**：用户属性和技术信息

### Q4: 数据多久更新一次？

- **实时报告**：几乎即时（延迟 < 1 分钟）
- **标准报告**：24-48 小时
- **完整数据处理**：可能需要 24-48 小时

### Q5: 如何保护用户隐私？

Google Analytics 已经默认遵守隐私法规：

1. **IP 匿名化**：自动启用
2. **Cookie 同意**：Material for MkDocs 主题会自动处理
3. **数据保留**：可以在设置中调整（默认 14 个月）

如果需要更严格的隐私保护，可以考虑：
- 使用 Plausible Analytics（开源替代方案）
- 使用 Matomo（自托管）
- 完全不使用统计工具

### Q6: 如何禁用 Google Analytics？

如果不想使用统计功能，只需注释掉配置：

```yaml
# Extra Configuration
extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/X-Gen-Lab/zephyr-learning-system
  # analytics:
  #   provider: google
  #   property: G-XXXXXXXXXX
```

## 高级配置

### 自定义事件追踪

如果想追踪特定的用户行为（如按钮点击、下载等），可以添加自定义 JavaScript：

```javascript
// 追踪下载事件
document.querySelectorAll('a[download]').forEach(link => {
  link.addEventListener('click', () => {
    gtag('event', 'download', {
      'event_category': 'engagement',
      'event_label': link.href
    });
  });
});
```

### 设置转化目标

在 Google Analytics 中：
1. 进入"管理" → "事件"
2. 点击"创建事件"
3. 定义你的转化目标（如完成某个学习阶段）

### 配置受众群体

1. 进入"管理" → "受众群体定义"
2. 创建自定义受众群体
3. 用于分析特定用户群的行为

## 替代方案

如果不想使用 Google Analytics，可以考虑：

### 1. Plausible Analytics
- 开源、注重隐私
- 无需 Cookie 同意
- 轻量级（< 1KB）
- 付费服务：$9/月起

### 2. Matomo（原 Piwik）
- 开源、可自托管
- 完全控制数据
- 功能丰富
- 免费（自托管）或付费（云服务）

### 3. Simple Analytics
- 注重隐私
- 简洁的界面
- 符合 GDPR
- 付费服务：$19/月起

### 4. GoatCounter
- 开源、免费
- 注重隐私
- 轻量级
- 适合个人项目

## 相关资源

- [Google Analytics 官方文档](https://support.google.com/analytics/)
- [Material for MkDocs Analytics 配置](https://squidfunk.github.io/mkdocs-material/setup/setting-up-site-analytics/)
- [GDPR 合规指南](https://support.google.com/analytics/answer/9019185)
- [Google Analytics 学院](https://analytics.google.com/analytics/academy/)

## 获取帮助

如果遇到问题：

1. 查看 [Google Analytics 帮助中心](https://support.google.com/analytics/)
2. 在本项目的 [GitHub Discussions](https://github.com/X-Gen-Lab/zephyr-learning-system/discussions) 提问
3. 在本项目的 [Issues](https://github.com/X-Gen-Lab/zephyr-learning-system/issues) 报告问题

---

**注意**: 配置完成后，记得提交更改并推送到 GitHub：

```bash
git add mkdocs.yml
git commit -m "chore: add Google Analytics tracking"
git push
```
