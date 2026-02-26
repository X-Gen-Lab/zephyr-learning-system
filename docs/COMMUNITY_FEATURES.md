# 社区互动功能说明

本文档说明 Zephyr RTOS 学习系统中集成的社区互动功能。

## 功能概览

系统集成了以下社区互动功能：

1. **评论系统** - 基于 GitHub Discussions 的评论功能
2. **反馈系统** - 问题报告、改进建议和内容点赞
3. **社区统计** - GitHub 仓库统计和贡献者展示
4. **访问统计** - 隐私友好的页面访问统计（可选）

## 1. 评论系统

### 技术方案

使用 [Giscus](https://giscus.app/) 集成 GitHub Discussions 作为评论系统。

### 特点

- ✅ 基于 GitHub Discussions，无需额外数据库
- ✅ 支持 Markdown 格式和代码高亮
- ✅ 自动同步网站主题（深色/浅色模式）
- ✅ 支持评论、回复和表情反应
- ✅ 需要 GitHub 账号登录

### 配置

评论系统配置位于 `docs/assets/javascripts/comments.js`：

```javascript
const giscusConfig = {
  repo: 'X-Gen-Lab/zephyr-learning-system',
  repoId: 'R_kgDONWqGdg',
  category: 'General',
  categoryId: 'DIC_kwDONWqGds4ClQVh',
  mapping: 'pathname',
  // ... 其他配置
};
```

**重要提示**: 
- `repoId` 和 `categoryId` 需要从 [Giscus 配置页面](https://giscus.app/zh-CN) 获取
- 详细配置步骤请参考 [GISCUS_SETUP.md](GISCUS_SETUP.md)
- 如果配置不正确，评论框将无法正常显示

### 显示位置

- 评论区显示在所有内容页面的底部
- 首页和索引页不显示评论区

### 自定义

如需修改评论系统配置：

1. 访问 [Giscus 配置页面](https://giscus.app/zh-CN)
2. 输入仓库信息并选择配置选项
3. 复制生成的配置参数
4. 更新 `comments.js` 中的 `giscusConfig` 对象

## 2. 反馈系统

### 功能组件

#### 2.1 内容点赞

- 用户可以为有帮助的页面点赞
- 点赞数据存储在浏览器 localStorage
- 支持取消点赞
- 显示当前页面的点赞总数

#### 2.2 问题报告

- 点击"报告问题"按钮跳转到 GitHub Issues
- 自动填充页面信息（标题、URL、浏览器等）
- 使用预定义的 Issue 模板
- 自动添加 `feedback` 和 `bug` 标签

#### 2.3 改进建议

- 点击"建议改进"按钮跳转到 GitHub Issues
- 自动填充页面信息
- 使用改进建议的 Issue 模板
- 自动添加 `feedback` 和 `enhancement` 标签

### 配置

反馈系统配置位于 `docs/assets/javascripts/feedback.js`：

```javascript
const feedbackConfig = {
  repo: 'X-Gen-Lab/zephyr-learning-system',
  issueLabels: ['feedback', 'user-report'],
  storageKey: 'zephyr-learning-likes'
};
```

### 显示位置

- 反馈容器显示在评论区之前
- 首页和索引页不显示反馈容器

### 数据存储

点赞数据存储格式：

```json
{
  "likes": {
    "page-id-1": 15,
    "page-id-2": 23
  },
  "userLikes": ["page-id-1", "page-id-3"]
}
```

## 3. 社区统计

### 功能特点

- 📊 显示 GitHub 仓库统计（Stars、Forks、贡献者数、Open Issues）
- 👥 展示贡献者头像和贡献次数
- 📅 显示项目最后更新时间
- 🚀 提供"加入我们"行动号召

### 数据来源

使用 GitHub REST API v3 获取数据：

- 仓库统计：`GET /repos/{owner}/{repo}`
- 贡献者列表：`GET /repos/{owner}/{repo}/contributors`

### 缓存策略

- 数据缓存在 localStorage
- 缓存有效期：1 小时
- 超过有效期自动重新获取

### 配置

社区统计配置位于 `docs/assets/javascripts/community-stats.js`：

```javascript
const communityConfig = {
  repo: 'X-Gen-Lab/zephyr-learning-system',
  apiBase: 'https://api.github.com',
  cacheKey: 'zephyr-community-stats',
  cacheDuration: 3600000 // 1 hour
};
```

### 显示位置

- 仅在首页显示
- 位于主内容区域的末尾

### API 限制

GitHub API 对未认证请求有速率限制：

- 每小时 60 次请求
- 建议使用缓存减少 API 调用

如需提高限制，可以配置 GitHub Personal Access Token（不推荐在客户端使用）。

## 4. 访问统计

### 支持的方案

系统支持多种统计方案：

1. **Google Analytics** - 功能强大，但涉及隐私问题
2. **Plausible Analytics** - 隐私友好，推荐使用
3. **Umami Analytics** - 开源，可自托管
4. **本地统计** - 仅在浏览器本地记录

### 当前配置

默认使用本地统计，不依赖第三方服务。

### 本地统计功能

- 记录页面浏览次数
- 存储在 localStorage
- 不跨设备或用户
- 可导出统计数据

### 调试命令

在浏览器控制台中使用：

```javascript
// 查看统计数据
analyticsHelper.displayStats();

// 获取统计对象
const stats = analyticsHelper.getStats();

// 导出统计数据
analyticsHelper.exportStats();

// 清除统计数据
analyticsHelper.clearStats();

// 检查是否允许跟踪
analyticsHelper.shouldTrack();
```

### 配置外部统计

详细配置说明请参考 [ANALYTICS_SETUP.md](ANALYTICS_SETUP.md)。

## 隐私保护

### 数据收集原则

1. **最小化收集** - 只收集必要的数据
2. **本地优先** - 优先使用本地存储
3. **用户控制** - 用户可以选择退出
4. **透明公开** - 明确告知数据用途

### Do Not Track 支持

系统尊重浏览器的 Do Not Track (DNT) 设置：

- 如果启用 DNT，不加载外部分析脚本
- 仍然记录本地统计（仅本地，不上传）

### 数据存储

所有客户端数据存储在 localStorage：

- `zephyr-learning-likes` - 点赞数据
- `zephyr-community-stats` - 社区统计缓存
- `zephyr-page-views` - 本地访问统计
- `analytics-consent` - 统计同意状态

用户可以随时清除浏览器数据来删除这些信息。

## 样式定制

所有社区功能的样式定义在 `docs/assets/stylesheets/extra.css` 中：

- 评论系统样式：`#comments-container`
- 反馈系统样式：`.feedback-container`
- 社区统计样式：`.community-stats`
- 通知样式：`.progress-notification`

### 自定义样式示例

```css
/* 自定义评论区标题颜色 */
.comments-header h2 {
  color: #your-color;
}

/* 自定义点赞按钮样式 */
.like-button {
  background: #your-color;
}

/* 自定义统计卡片样式 */
.stat-card {
  background: #your-color;
}
```

## 响应式设计

所有社区功能都支持响应式设计：

- 桌面端：完整功能和布局
- 平板端：自适应布局
- 移动端：优化的触摸交互

## 浏览器兼容性

支持的浏览器：

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## 故障排除

### 评论系统不显示

**症状**: 页面底部只显示"正在加载评论系统..."，评论框不出现

**可能原因**:
1. GitHub Discussions 未启用
2. Giscus App 未安装
3. `repoId` 或 `categoryId` 配置错误
4. 仓库是私有的（Giscus 只支持公开仓库）
5. 网络连接问题

**解决方法**:
1. 检查浏览器控制台是否有错误信息
2. 确认 GitHub Discussions 已启用
3. 访问 [Giscus 配置页面](https://giscus.app/zh-CN) 重新获取正确的配置参数
4. 确保仓库是公开的
5. 参考 [GISCUS_SETUP.md](GISCUS_SETUP.md) 完整配置指南
6. 确认页面不是首页或索引页

### 社区统计加载失败

1. 检查网络连接
2. 检查 GitHub API 是否可访问
3. 检查是否超过 API 速率限制
4. 清除 localStorage 缓存后重试

### 点赞数据丢失

点赞数据存储在 localStorage，以下情况会导致数据丢失：

- 清除浏览器数据
- 使用隐私/无痕模式
- 更换浏览器或设备

建议定期导出数据备份。

## 未来改进

计划中的功能改进：

- [ ] 支持评论通知
- [ ] 支持点赞数据同步（需要后端）
- [ ] 支持更多统计图表
- [ ] 支持社区活动时间线
- [ ] 支持用户贡献排行榜

## 相关资源

- [Giscus 文档](https://giscus.app/)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

## 贡献

欢迎为社区功能贡献代码或提出改进建议！

请通过以下方式参与：

1. 提交 Issue 报告问题或建议
2. 提交 Pull Request 贡献代码
3. 在 Discussions 中参与讨论

---

**注意**: 本文档描述的功能需要正确配置 GitHub 仓库信息才能正常工作。请确保更新所有配置文件中的仓库地址和 ID。
