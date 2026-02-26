# 图片资源管理指南

本文档说明如何在 Zephyr RTOS 学习系统中管理和优化图片资源。

## 目录结构

```
docs/assets/images/
├── architecture/      # 架构图
├── hardware/         # 硬件相关图片
├── logos/            # Logo 和品牌图片
├── screenshots/      # 截图
└── README.md         # 本文档
```

## 图片格式选择

### SVG（推荐用于图表和架构图）

**优点**：
- 矢量格式，无损缩放
- 文件体积小
- 支持 CSS 样式和动画
- 适合深色/浅色主题切换

**使用场景**：
- 架构图
- 流程图
- 系统框图
- Logo 和图标

**示例**：
```markdown
![Zephyr 架构图](../assets/images/architecture/zephyr-architecture-overview.svg)
```

### PNG（推荐用于截图和复杂图像）

**优点**：
- 支持透明背景
- 无损压缩
- 广泛支持

**使用场景**：
- 软件截图
- 包含文字的图片
- 需要透明背景的图片

**优化建议**：
- 使用 PNG-8 而非 PNG-24（如果颜色数量 < 256）
- 使用工具压缩：pngquant, optipng
- 目标大小：< 200KB

### JPEG（推荐用于照片）

**优点**：
- 文件体积小
- 适合照片和复杂图像

**使用场景**：
- 开发板照片
- 硬件实物照片
- 现场照片

**优化建议**：
- 质量设置：80-85%
- 使用渐进式 JPEG
- 目标大小：< 200KB

### WebP（现代浏览器推荐）

**优点**：
- 比 PNG/JPEG 体积小 25-35%
- 支持透明和动画
- 现代浏览器支持良好

**使用场景**：
- 所有类型的图片（作为备选格式）

**注意事项**：
- 提供 PNG/JPEG 作为后备格式
- 使用 `<picture>` 标签实现渐进增强

## 图片优化最佳实践

### 1. 尺寸优化

**原则**：图片尺寸应该与显示尺寸匹配

```markdown
<!-- 不推荐：使用 4K 图片显示为 800px -->
![大图](large-4k-image.png)

<!-- 推荐：使用适当尺寸的图片 -->
![优化图](optimized-800px-image.png)
```

**建议尺寸**：
- 全宽图片：1200px
- 内容区图片：800px
- 缩略图：400px
- 图标：64px

### 2. 懒加载

本系统自动为所有图片启用懒加载，无需手动配置。

**工作原理**：
- 图片在进入视口前不会加载
- 减少初始页面加载时间
- 节省带宽

**手动控制**（可选）：
```markdown
<!-- 禁用懒加载（首屏关键图片） -->
![关键图片](critical-image.png){: loading=eager }

<!-- 启用懒加载（默认行为） -->
![普通图片](normal-image.png){: loading=lazy }
```

### 3. 响应式图片

使用 Markdown 属性控制图片显示：

```markdown
<!-- 限制最大宽度 -->
![图片](image.png){: style="max-width: 600px" }

<!-- 居中显示 -->
![图片](image.png){: .center }

<!-- 添加阴影 -->
![图片](image.png){: .shadow }
```

### 4. 图片压缩

**在线工具**：
- [TinyPNG](https://tinypng.com/) - PNG/JPEG 压缩
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG 优化
- [Squoosh](https://squoosh.app/) - 多格式压缩

**命令行工具**：
```bash
# PNG 压缩
pngquant --quality=65-80 input.png -o output.png

# JPEG 压缩
jpegoptim --max=85 input.jpg

# SVG 优化
svgo input.svg -o output.svg

# WebP 转换
cwebp -q 80 input.png -o output.webp
```

### 5. 图片命名规范

**规则**：
- 使用小写字母
- 使用连字符分隔单词
- 使用描述性名称
- 包含尺寸信息（可选）

**示例**：
```
✅ 推荐：
- zephyr-architecture-overview.svg
- nrf52840-dk-board-800px.png
- led-circuit-diagram.svg

❌ 不推荐：
- IMG_1234.jpg
- 图片1.png
- Screenshot 2024-01-01.png
```

### 6. Alt 文本

**重要性**：
- 提高可访问性（屏幕阅读器）
- SEO 优化
- 图片加载失败时的后备文本

**最佳实践**：
```markdown
<!-- 描述性 alt 文本 -->
![Nordic nRF52840 DK 开发板正面照片，显示 USB 接口和 LED 灯](nrf52840-dk.png)

<!-- 装饰性图片使用空 alt -->
![](decorative-line.svg)

<!-- 图表需要详细描述 -->
![Zephyr RTOS 架构图，展示应用层、内核层、驱动层和硬件层的关系](architecture.svg)
```

## 图片添加流程

### 1. 准备图片

```bash
# 1. 优化图片
pngquant --quality=65-80 original.png -o optimized.png

# 2. 检查文件大小
ls -lh optimized.png
# 确保 < 200KB

# 3. 移动到正确目录
mv optimized.png docs/assets/images/hardware/
```

### 2. 在 Markdown 中引用

```markdown
# 硬件连接

下图展示了 LED 电路的连接方式：

![LED 电路连接图，显示 GPIO 引脚通过限流电阻连接到 LED](../assets/images/hardware/led-circuit.svg)

## 电路说明

- GPIO 引脚：P0.13
- 限流电阻：330Ω
- LED：红色，正向电压 2V
```

### 3. 验证显示

```bash
# 启动本地服务器
mkdocs serve

# 在浏览器中访问
# http://127.0.0.1:8000

# 检查：
# - 图片是否正确显示
# - 图片是否懒加载
# - 图片大小是否合适
```

## 性能监控

### 检查图片加载性能

1. 打开浏览器开发者工具（F12）
2. 切换到 Network 标签
3. 筛选 Img 类型
4. 刷新页面
5. 检查：
   - 图片加载时间
   - 图片文件大小
   - 是否启用懒加载

### 性能目标

- 单张图片 < 200KB
- 首屏图片加载时间 < 1s
- 懒加载覆盖率 > 90%
- 总图片大小 < 2MB（每页）

## 常见问题

### 图片不显示

**原因**：
- 路径错误
- 文件名大小写不匹配
- 文件不存在

**解决方案**：
```bash
# 检查文件是否存在
ls docs/assets/images/hardware/led-circuit.svg

# 检查路径是否正确（相对于当前 Markdown 文件）
# 从 docs/stage1-foundation/basic-examples.md 引用图片：
# ../assets/images/hardware/led-circuit.svg
```

### 图片太大

**解决方案**：
```bash
# 1. 检查原始尺寸
identify image.png
# Output: image.png PNG 4000x3000 ...

# 2. 调整尺寸
convert image.png -resize 1200x900 resized.png

# 3. 压缩
pngquant --quality=65-80 resized.png -o optimized.png
```

### SVG 不显示

**原因**：
- SVG 文件损坏
- SVG 包含外部引用
- 浏览器不支持某些 SVG 特性

**解决方案**：
```bash
# 优化 SVG
svgo input.svg -o output.svg

# 移除外部引用
# 使用文本编辑器打开 SVG，检查 <image> 标签
```

## 图片审查清单

在提交包含图片的内容前，请检查：

- [ ] 图片格式正确（SVG 用于图表，PNG/JPEG 用于照片）
- [ ] 图片已优化（< 200KB）
- [ ] 图片尺寸合适（不超过显示尺寸）
- [ ] 文件名符合命名规范
- [ ] Alt 文本描述清晰
- [ ] 图片路径正确
- [ ] 图片在本地预览中正确显示
- [ ] 图片启用懒加载（自动）
- [ ] 图片在深色/浅色主题下都清晰可见

## 工具推荐

### 图片编辑

- **GIMP**：免费的图片编辑软件
- **Inkscape**：免费的矢量图编辑软件
- **draw.io**：免费的在线图表工具

### 图片优化

- **ImageOptim**（macOS）：批量图片优化
- **FileOptimizer**（Windows）：多格式文件优化
- **Trimage**（Linux）：PNG/JPEG 优化

### 截图工具

- **Flameshot**（Linux）：功能强大的截图工具
- **Snipaste**（Windows/macOS）：截图 + 贴图工具
- **Ksnip**（跨平台）：截图和标注工具

## 参考资源

- [Web.dev - Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Google - Image Best Practices](https://developers.google.com/search/docs/appearance/google-images)
- [Material for MkDocs - Images](https://squidfunk.github.io/mkdocs-material/reference/images/)

## 更新日志

- 2024-02-26：创建图片管理指南
- 2024-02-26：添加懒加载和优化配置
