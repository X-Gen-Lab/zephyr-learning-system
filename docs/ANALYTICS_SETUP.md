# 页面访问统计配置指南

本文档说明如何为 Zephyr RTOS 学习系统配置页面访问统计功能。

## 支持的统计方案

### 1. Google Analytics (GA4)

Google Analytics 是最流行的网站分析工具，提供详细的访问统计和用户行为分析。

**配置步骤**:

1. 访问 [Google Analytics](https://analytics.google.com/) 并创建账号
2. 创建新的 GA4 属性
3. 获取测量 ID（格式：G-XXXXXXXXXX）
4. 在 `mkdocs.yml` 中配置：

```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX  # 替换为您的测量 ID
```

**隐私考虑**:
- Google Analytics 会收集用户数据
- 需要在网站上显示隐私政策
- 建议启用 IP 匿名化

### 2. Plausible Analytics（推荐）

Plausible 是一个隐私友好的开源分析工具，不使用 Cookie，符合 GDPR 要求。

**配置步骤**:

1. 访问 [Plausible](https://plausible.io/) 并创建账号
2. 添加您的网站域名
3. 获取跟踪脚本
4. 创建自定义 JavaScript 文件 `docs/assets/javascripts/analytics.js`：

```javascript
// Plausible Analytics
(function() {
  var script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = 'your-domain.com';  // 替换为您的域名
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
})();
```

5. 在 `mkdocs.yml` 中引入：

```yaml
extra_javascript:
  - assets/javascripts/analytics.js
```

**优势**:
- 不使用 Cookie
- 符合 GDPR、CCPA 等隐私法规
- 轻量级，不影响页面加载速度
- 开源，可自托管

### 3. Umami Analytics

Umami 是另一个开源的隐私友好分析工具，可以自托管。

**配置步骤**:

1. 部署 Umami 实例（可使用 Vercel、Railway 等平台）
2. 创建网站并获取跟踪代码
3. 创建 `docs/assets/javascripts/analytics.js`：

```javascript
// Umami Analytics
(function() {
  var script = document.createElement('script');
  script.async = true;
  script.dataset.websiteId = 'your-website-id';  // 替换为您的网站 ID
  script.src = 'https://your-umami-instance.com/script.js';
  document.head.appendChild(script);
})();
```

4. 在 `mkdocs.yml` 中引入

**优势**:
- 完全自托管，数据完全掌控
- 不使用 Cookie
- 简单易用的界面

### 4. 简单计数器（无第三方服务）

如果不想使用第三方服务，可以实现一个简单的本地计数器（仅统计页面浏览次数）。

创建 `docs/assets/javascripts/simple-counter.js`：

```javascript
/**
 * 简单的页面浏览计数器
 * 使用 localStorage 存储，仅供参考
 */

function trackPageView() {
  const storageKey = 'zephyr-page-views';
  const pageId = window.location.pathname;
  
  try {
    // 获取现有数据
    const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
    
    // 增加计数
    data[pageId] = (data[pageId] || 0) + 1;
    
    // 保存数据
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    // 显示计数（可选）
    console.log(`Page views: ${data[pageId]}`);
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
}

// 页面加载时记录
trackPageView();
```

**注意**: 这种方法仅在本地浏览器记录，不能跨设备或用户统计。

## 隐私保护最佳实践

无论选择哪种统计方案，都应该遵循以下隐私保护原则：

### 1. 隐私政策

创建 `docs/privacy.md` 文件，说明：
- 收集哪些数据
- 数据如何使用
- 数据保存多久
- 用户如何选择退出

### 2. Cookie 提示（如果使用 Cookie）

如果使用 Google Analytics 等需要 Cookie 的服务，应该显示 Cookie 同意提示。

创建 `docs/assets/javascripts/cookie-consent.js`：

```javascript
/**
 * Cookie 同意提示
 */

function showCookieConsent() {
  // 检查是否已同意
  if (localStorage.getItem('cookie-consent') === 'accepted') {
    return;
  }
  
  // 创建提示框
  const banner = document.createElement('div');
  banner.className = 'cookie-consent-banner';
  banner.innerHTML = `
    <div class="cookie-consent-content">
      <p>
        本网站使用 Cookie 来改善用户体验和分析网站流量。
        继续使用本网站即表示您同意我们使用 Cookie。
        <a href="/privacy/">了解更多</a>
      </p>
      <button id="accept-cookies">接受</button>
      <button id="decline-cookies">拒绝</button>
    </div>
  `;
  
  document.body.appendChild(banner);
  
  // 接受按钮
  document.getElementById('accept-cookies').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    banner.remove();
    // 加载分析脚本
    loadAnalytics();
  });
  
  // 拒绝按钮
  document.getElementById('decline-cookies').addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'declined');
    banner.remove();
  });
}

// 页面加载时显示
showCookieConsent();
```

添加对应的 CSS 样式到 `docs/assets/stylesheets/extra.css`：

```css
.cookie-consent-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--md-default-bg-color);
  border-top: 2px solid var(--md-primary-fg-color);
  padding: 20px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  z-index: 9999;
}

.cookie-consent-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.cookie-consent-content p {
  flex: 1;
  margin: 0;
}

.cookie-consent-content button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

#accept-cookies {
  background: var(--md-primary-fg-color);
  color: white;
}

#decline-cookies {
  background: var(--md-default-fg-color--lightest);
  color: var(--md-default-fg-color);
}
```

### 3. Do Not Track 支持

尊重用户的 Do Not Track (DNT) 设置：

```javascript
// 检查 DNT 设置
function shouldTrack() {
  // 检查 DNT 标志
  if (navigator.doNotTrack === '1' || 
      window.doNotTrack === '1' || 
      navigator.msDoNotTrack === '1') {
    return false;
  }
  
  // 检查用户是否拒绝了 Cookie
  if (localStorage.getItem('cookie-consent') === 'declined') {
    return false;
  }
  
  return true;
}

// 只在允许的情况下加载分析
if (shouldTrack()) {
  loadAnalytics();
}
```

## 推荐配置

对于 Zephyr RTOS 学习系统，我们推荐使用 **Plausible Analytics**：

1. **隐私友好**: 不使用 Cookie，符合 GDPR
2. **轻量级**: 不影响页面加载速度
3. **简单易用**: 清晰的统计界面
4. **开源**: 可以自托管

## 当前配置

当前 `mkdocs.yml` 中的配置为占位符：

```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

**请根据实际需求替换为真实的配置。**

## 测试统计功能

配置完成后，可以通过以下方式测试：

1. 构建并运行本地服务器：
   ```bash
   mkdocs serve
   ```

2. 访问网站并浏览几个页面

3. 检查浏览器控制台是否有错误

4. 登录分析平台查看是否收到数据

## 相关资源

- [Google Analytics 文档](https://support.google.com/analytics)
- [Plausible 文档](https://plausible.io/docs)
- [Umami 文档](https://umami.is/docs)
- [GDPR 合规指南](https://gdpr.eu/)
- [Material for MkDocs Analytics](https://squidfunk.github.io/mkdocs-material/setup/setting-up-site-analytics/)
