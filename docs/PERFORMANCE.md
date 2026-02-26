# 性能测试与优化指南

本文档记录了 Zephyr RTOS 学习系统的性能测试结果和优化建议。

## 性能要求

根据需求文档（NFR 4），系统应满足以下性能指标：

- **首页首次加载时间（FCP）**: < 1.5 秒
- **内容页面首次加载时间**: < 2 秒
- **单个 HTML 页面大小**: < 200KB（压缩后）
- **Gzip 压缩率**: > 70%
- **Lighthouse 性能评分**: > 90 分

## 性能测试工具

项目提供了两个性能测试脚本：

### 1. 页面大小和压缩率测试

```bash
python scripts/test-performance.py
```

**测试内容**：
- 所有 HTML 页面的原始大小和压缩后大小
- Gzip 压缩率
- 静态资源（CSS、JavaScript、图片、字体）统计
- 超标页面识别
- 优化建议生成

**输出**：
- 控制台彩色报告
- `performance-report.json` 详细报告文件

### 2. 页面加载时间测试

```bash
python scripts/measure-load-time.py
```

**测试内容**：
- 首页和关键内容页面的 FCP（First Contentful Paint）时间
- LCP（Largest Contentful Paint）时间
- 资源加载时间分析
- 性能瓶颈识别

**测试条件**：
- 带宽: 10 Mbps（典型家庭宽带）
- 延迟: 50ms（每个资源请求）
- 并发连接: 6（浏览器默认）

**输出**：
- 控制台彩色报告
- `load-time-report.json` 详细报告文件

## 当前性能状态

### 测试结果摘要（2026-02-26）

#### 页面大小测试
- ✅ **总页面数**: 31 个
- ✅ **最大页面**: 66.58 KB（压缩后）
- ✅ **首页大小**: 10.28 KB（压缩后）
- ✅ **所有页面**: 均小于 200KB 限制

#### 压缩率测试
- ✅ **平均压缩率**: 81.1%
- ✅ **最小压缩率**: 73.3%
- ✅ **最大压缩率**: 88.9%
- ✅ **符合要求**: > 70%

#### 静态资源统计
- **CSS 文件**: 2 个，148.92 KB（压缩后 24.04 KB，压缩率 83.9%）
- **JavaScript 文件**: 36 个，1.01 MB（压缩后 273.73 KB，压缩率 73.6%）
- **图片文件**: 5 个，14.17 KB
- **字体文件**: 0 个

#### 加载时间测试
- ✅ **首页 FCP**: 317 ms < 1.5s
- ✅ **内容页面 FCP**: 平均 417 ms，最大 739 ms < 2s
- ✅ **所有测试页面**: 均符合性能要求

### 性能评级

| 指标 | 要求 | 实际值 | 状态 |
|------|------|--------|------|
| 首页 FCP | < 1.5s | 317 ms | ✅ 优秀 |
| 内容页 FCP | < 2s | 平均 417 ms | ✅ 优秀 |
| 页面大小 | < 200KB | 最大 66.58 KB | ✅ 优秀 |
| 压缩率 | > 70% | 平均 81.1% | ✅ 优秀 |

## 性能优化建议

### 已实施的优化

1. **图片优化**
   - ✅ 使用 SVG 格式的矢量图（架构图、硬件图）
   - ✅ 图片大小控制在合理范围（最大 14.17 KB）
   - ✅ 实施了图片优化脚本（`scripts/optimize-images.py`）

2. **代码压缩**
   - ✅ MkDocs 自动压缩 HTML、CSS、JavaScript
   - ✅ 启用 Gzip 压缩（压缩率 > 80%）

3. **资源优化**
   - ✅ 使用 Material for MkDocs 主题（高度优化）
   - ✅ 最小化 CSS 和 JavaScript 文件数量
   - ✅ 代码高亮使用 Pygments（服务器端渲染）

### 进一步优化建议

#### 1. JavaScript 优化（优先级：中）

**问题**: JavaScript 文件数量较多（36 个）

**建议**:
- 考虑合并非关键 JavaScript 文件
- 使用代码分割（Code Splitting）
- 延迟加载非关键脚本（使用 `defer` 或 `async` 属性）
- 评估是否所有 JavaScript 都是必需的

**实施方法**:
```yaml
# mkdocs.yml
extra_javascript:
  - javascripts/bundle.min.js  # 合并后的文件
```

#### 2. CDN 加速（优先级：中）

**问题**: 静态资源从同一服务器加载

**建议**:
- 使用 CDN 加速静态资源（CSS、JavaScript、字体）
- 特别是 Material for MkDocs 的资源可以使用公共 CDN

**实施方法**:
```yaml
# mkdocs.yml
theme:
  name: material
  custom_dir: overrides
extra_css:
  - https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css
```

#### 3. 资源预加载（优先级：低）

**问题**: 关键资源可以更早加载

**建议**:
- 使用 `<link rel="preload">` 预加载关键 CSS 和字体
- 使用 `<link rel="prefetch">` 预取下一页面资源

**实施方法**:
```html
<!-- 在 HTML head 中添加 -->
<link rel="preload" href="assets/stylesheets/main.css" as="style">
<link rel="preload" href="assets/fonts/roboto.woff2" as="font" crossorigin>
```

#### 4. Service Worker 缓存（优先级：低）

**问题**: 重复访问时仍需下载资源

**建议**:
- 实现 Service Worker 缓存策略
- 离线访问支持

**实施方法**:
```javascript
// sw.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/',
        '/assets/stylesheets/main.css',
        '/assets/javascripts/bundle.js'
      ]);
    })
  );
});
```

#### 5. HTTP/2 服务器推送（优先级：低）

**问题**: 资源加载需要多次往返

**建议**:
- 配置服务器使用 HTTP/2
- 启用服务器推送关键资源

**实施方法**（Nginx）:
```nginx
location / {
    http2_push /assets/stylesheets/main.css;
    http2_push /assets/javascripts/bundle.js;
}
```

## 性能监控

### 持续集成中的性能测试

建议在 CI/CD 流程中添加性能测试：

```yaml
# .github/workflows/performance.yml
name: Performance Test

on: [push, pull_request]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.10'
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Build site
        run: mkdocs build
      
      - name: Run performance tests
        run: |
          python scripts/test-performance.py
          python scripts/measure-load-time.py
      
      - name: Upload performance reports
        uses: actions/upload-artifact@v2
        with:
          name: performance-reports
          path: |
            performance-report.json
            load-time-report.json
```

### 真实用户监控（RUM）

对于生产环境，建议集成真实用户监控工具：

1. **Google Analytics 4** - 免费，提供基本性能指标
2. **Plausible Analytics** - 隐私友好的替代方案
3. **Web Vitals** - Google 的 Web 性能指标库

**实施示例**（Web Vitals）:
```javascript
// extra.js
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric);
  // 发送到分析服务
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 性能基准

### 目标性能指标

| 指标 | 目标值 | 当前值 | 状态 |
|------|--------|--------|------|
| FCP (First Contentful Paint) | < 1.5s | 0.3s | ✅ |
| LCP (Largest Contentful Paint) | < 2.5s | 0.7s | ✅ |
| FID (First Input Delay) | < 100ms | N/A | - |
| CLS (Cumulative Layout Shift) | < 0.1 | N/A | - |
| TTI (Time to Interactive) | < 3.5s | ~1s | ✅ |
| Total Blocking Time | < 300ms | ~100ms | ✅ |

### Lighthouse 评分目标

- **Performance**: > 90
- **Accessibility**: > 90
- **Best Practices**: > 90
- **SEO**: > 90

## 性能测试最佳实践

1. **定期测试**: 每次重大更新后运行性能测试
2. **多环境测试**: 在不同网络条件下测试（3G、4G、WiFi）
3. **真实设备测试**: 在移动设备上测试性能
4. **性能预算**: 设置性能预算，超出时发出警告
5. **持续监控**: 在生产环境中持续监控性能指标

## 故障排查

### 页面加载慢

1. 检查页面大小：`python scripts/test-performance.py`
2. 检查资源数量：查看 HTML 中的 `<link>` 和 `<script>` 标签
3. 检查图片大小：使用 `scripts/optimize-images.py` 优化
4. 检查网络条件：使用浏览器开发者工具的 Network 面板

### 压缩率低

1. 检查文件内容：是否包含大量不可压缩内容（如 base64 图片）
2. 检查服务器配置：确保启用 Gzip/Brotli 压缩
3. 优化内容：移除不必要的空白和注释

### JavaScript 执行慢

1. 使用浏览器性能分析工具（Performance tab）
2. 检查是否有阻塞渲染的脚本
3. 考虑使用 Web Workers 处理耗时任务
4. 优化 JavaScript 代码逻辑

## 参考资源

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [MkDocs Performance](https://www.mkdocs.org/user-guide/configuration/#performance)
- [Material for MkDocs Optimization](https://squidfunk.github.io/mkdocs-material/setup/setting-up-navigation/#instant-loading)

## 更新日志

- **2026-02-26**: 初始性能测试，所有指标均符合要求
  - 首页 FCP: 317 ms
  - 平均页面大小: 28.6 KB（压缩后）
  - 平均压缩率: 81.1%
  - JavaScript 文件数量: 36 个（建议优化）
