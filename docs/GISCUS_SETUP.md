# Giscus 评论系统配置指南

本文档说明如何为 Zephyr RTOS 学习系统配置 Giscus 评论系统。

## 什么是 Giscus？

Giscus 是一个基于 GitHub Discussions 的评论系统，具有以下优势：

- ✅ 完全免费，无需额外服务器
- ✅ 基于 GitHub Discussions，数据存储在 GitHub
- ✅ 支持 Markdown 和代码高亮
- ✅ 支持表情反应和回复
- ✅ 开源且隐私友好

## 配置步骤

### 1. 启用 GitHub Discussions

1. 访问您的 GitHub 仓库
2. 进入 **Settings** → **General**
3. 向下滚动到 **Features** 部分
4. 勾选 **Discussions** 复选框

### 2. 安装 Giscus App

1. 访问 [Giscus App](https://github.com/apps/giscus)
2. 点击 **Install**
3. 选择要安装的仓库（可以选择所有仓库或特定仓库）
4. 授权 Giscus 访问您的仓库

### 3. 获取配置参数

1. 访问 [Giscus 配置页面](https://giscus.app/zh-CN)
2. 在 **仓库** 部分输入您的仓库地址：
   ```
   X-Gen-Lab/zephyr-learning-system
   ```
3. 等待验证通过（会显示绿色勾号）

4. 在 **Discussion 分类** 部分：
   - 选择一个分类（推荐使用 **General** 或创建专门的 **Comments** 分类）
   - 记录下分类名称

5. 在 **特性** 部分：
   - 勾选 **启用反应**
   - 选择 **评论框位置**（推荐：评论上方）

6. 在 **主题** 部分：
   - 选择 **preferred_color_scheme**（自动适配浅色/深色模式）

7. 向下滚动到 **启用 giscus** 部分，复制生成的配置参数：
   ```html
   <script src="https://giscus.app/client.js"
           data-repo="X-Gen-Lab/zephyr-learning-system"
           data-repo-id="R_kgDONWqGdg"
           data-category="General"
           data-category-id="DIC_kwDONWqGds4ClQVh"
           ...>
   </script>
   ```

### 4. 更新配置文件

打开 `docs/assets/javascripts/comments.js`，更新 `giscusConfig` 对象：

```javascript
const giscusConfig = {
  repo: 'X-Gen-Lab/zephyr-learning-system',  // 您的仓库地址
  repoId: 'R_kgDONWqGdg',                    // 从 Giscus 配置页面复制
  category: 'General',                        // 您选择的分类名称
  categoryId: 'DIC_kwDONWqGds4ClQVh',        // 从 Giscus 配置页面复制
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  theme: 'preferred_color_scheme',
  lang: 'zh-CN',
  loading: 'lazy'
};
```

**重要参数说明：**

- `repo`: 您的 GitHub 仓库地址（格式：`owner/repo`）
- `repoId`: 仓库的唯一 ID（从 Giscus 配置页面获取）
- `category`: Discussion 分类名称
- `categoryId`: 分类的唯一 ID（从 Giscus 配置页面获取）
- `mapping`: 页面与 Discussion 的映射方式
  - `pathname`: 使用页面路径（推荐）
  - `url`: 使用完整 URL
  - `title`: 使用页面标题
  - `og:title`: 使用 Open Graph 标题

### 5. 测试评论系统

1. 构建并运行本地服务器：
   ```bash
   mkdocs serve
   ```

2. 访问任意内容页面（非首页）

3. 滚动到页面底部，应该能看到 Giscus 评论框

4. 使用 GitHub 账号登录并发表测试评论

5. 检查 GitHub Discussions 中是否创建了对应的讨论

## 常见问题

### Q1: 评论框不显示

**可能原因：**
- GitHub Discussions 未启用
- Giscus App 未安装
- `repoId` 或 `categoryId` 配置错误
- 仓库是私有的（Giscus 只支持公开仓库）

**解决方法：**
1. 检查浏览器控制台是否有错误信息
2. 确认 GitHub Discussions 已启用
3. 重新访问 Giscus 配置页面验证参数
4. 确保仓库是公开的

### Q2: 评论框显示"未找到讨论"

**原因：** 这是正常的，表示该页面还没有评论。

**解决方法：** 发表第一条评论后，Giscus 会自动创建对应的 Discussion。

### Q3: 评论框主题不匹配

**原因：** 主题同步可能有延迟。

**解决方法：** 
- 刷新页面
- 检查 `theme` 配置是否为 `preferred_color_scheme`
- 手动切换网站主题测试

### Q4: 评论加载很慢

**原因：** Giscus 需要从 GitHub 加载数据。

**解决方法：**
- 使用 `loading: 'lazy'` 配置（已默认启用）
- 考虑使用 CDN 加速
- 检查网络连接

### Q5: 如何自定义评论框样式？

Giscus 支持通过 CSS 自定义样式。在 `docs/assets/stylesheets/extra.css` 中添加：

```css
/* 自定义 Giscus 样式 */
.giscus-frame {
  /* 您的自定义样式 */
}
```

### Q6: 如何禁用评论系统？

有两种方法：

**方法 1：移除 JavaScript 引用**

在 `mkdocs.yml` 中注释掉或删除：
```yaml
# - assets/javascripts/comments.js
```

**方法 2：修改配置**

在 `comments.js` 中，将 `loadGiscus()` 函数改为直接返回：
```javascript
function loadGiscus() {
  return; // 禁用评论系统
}
```

## 高级配置

### 自定义 Discussion 分类

建议创建专门的评论分类：

1. 访问仓库的 Discussions 页面
2. 点击 **Categories** → **New category**
3. 创建名为 **Comments** 的分类
4. 在 Giscus 配置中选择该分类

### 使用特定的 Discussion

如果想让多个页面共享同一个 Discussion：

```javascript
const giscusConfig = {
  // ...
  mapping: 'specific',
  term: 'Welcome to Discussions!', // Discussion 标题
  // ...
};
```

### 自定义反应表情

```javascript
const giscusConfig = {
  // ...
  reactionsEnabled: '1',
  // 可用的反应：👍 👎 😄 🎉 😕 ❤️ 🚀 👀
  // ...
};
```

## 数据管理

### 导出评论数据

所有评论数据存储在 GitHub Discussions 中，可以通过以下方式导出：

1. 使用 GitHub API
2. 使用 GitHub CLI
3. 手动复制 Discussions 内容

### 迁移评论

如果需要迁移到其他评论系统：

1. 导出 GitHub Discussions 数据
2. 转换为目标系统的格式
3. 导入到新系统

## 隐私和安全

### 数据存储

- 所有评论数据存储在 GitHub
- Giscus 不存储任何用户数据
- 遵循 GitHub 的隐私政策

### 用户认证

- 需要 GitHub 账号登录
- 使用 GitHub OAuth 认证
- 不需要额外的用户管理

### 内容审核

作为仓库管理员，您可以：

- 编辑或删除评论
- 锁定 Discussions
- 屏蔽用户
- 设置评论规则

## 相关资源

- [Giscus 官方网站](https://giscus.app/)
- [Giscus GitHub 仓库](https://github.com/giscus/giscus)
- [GitHub Discussions 文档](https://docs.github.com/en/discussions)
- [Giscus 配置生成器](https://giscus.app/zh-CN)

## 获取帮助

如果遇到问题：

1. 查看 [Giscus 文档](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md)
2. 在 [Giscus Discussions](https://github.com/giscus/giscus/discussions) 提问
3. 在本项目的 Issues 中报告问题

---

**注意**: 配置完成后，记得提交更改并重新构建网站：

```bash
git add docs/assets/javascripts/comments.js
git commit -m "update: configure Giscus comment system"
mkdocs build
```
