# Zephyr RTOS 学习系统

结构化的 Zephyr RTOS 学习知识库，覆盖从入门到专业的全阶段学习路径。

## 项目简介

本项目采用文档即代码（Docs-as-Code）方法，使用 MkDocs 和 Material 主题构建静态知识库网站。

## 学习路径

- **前置必备知识**: C 语言、嵌入式硬件基础、RTOS 概念、基础工具
- **第一阶段 - 入门筑基期**: 环境搭建、基础工具和核心概念
- **第二阶段 - 进阶实战期**: 内核机制、驱动开发和子系统使用
- **第三阶段 - 高级深耕期**: 源码分析、BSP 移植和系统优化
- **第四阶段 - 专业精通期**: 架构设计、社区贡献和技术布道

## 本地开发

### 环境要求

- Python 3.8+
- pip

### 安装依赖

```bash
# 创建虚拟环境（推荐）
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

### 本地预览

```bash
# 启动开发服务器（支持热重载）
mkdocs serve

# 访问 http://127.0.0.1:8000
```

### 构建网站

```bash
# 构建静态网站到 site/ 目录
mkdocs build

# 严格模式构建（将警告视为错误）
mkdocs build --strict
```

## 部署

### GitHub Pages

```bash
# 自动构建并部署到 GitHub Pages
mkdocs gh-deploy
```

### 其他平台

生成的 `site/` 目录包含纯静态文件，可以部署到任何静态网站托管服务：

- Netlify
- Vercel
- AWS S3
- Azure Static Web Apps

## 贡献指南

欢迎贡献内容和改进建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-content`)
3. 提交更改 (`git commit -m 'Add some amazing content'`)
4. 推送到分支 (`git push origin feature/amazing-content`)
5. 创建 Pull Request

## 内容规范

- 使用 Markdown 格式编写内容
- 代码块必须指定语言标识
- 图片存放在 `docs/assets/images/` 目录
- 使用 Mermaid 绘制图表
- 每个页面包含 YAML Front Matter 元数据

## 许可证

MIT License

## 联系方式

- GitHub Issues: [提交问题](https://github.com/example/zephyr-learning-system/issues)
- Email: contact@example.com
