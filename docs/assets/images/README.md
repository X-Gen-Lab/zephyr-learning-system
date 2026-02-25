# 图片资源目录

本目录存放 Zephyr RTOS 学习系统的图片资源。

## 目录结构

- `architecture/` - 架构图和系统设计图
- `hardware/` - 硬件相关图片（开发板、电路图等）
- `screenshots/` - 软件截图（IDE、工具界面等）
- `diagrams/` - 流程图、时序图等（如果不使用 Mermaid）
- `logos/` - Logo 和图标

## 图片规范

### 文件命名

- 使用小写字母和连字符
- 使用描述性名称
- 示例：`nrf52840-dk-board.jpg`, `zephyr-architecture.png`

### 文件格式

- 照片和复杂图像：JPEG（.jpg）
- 图表和截图：PNG（.png）
- 矢量图：SVG（.svg）优先

### 文件大小

- 单张图片应小于 200KB
- 使用图片压缩工具优化（如 TinyPNG、ImageOptim）
- 对于大图，提供缩略图版本

### 图片优化建议

1. 使用适当的分辨率（网页显示通常 72-96 DPI 即可）
2. 裁剪不必要的空白区域
3. 使用压缩工具减小文件大小
4. 考虑使用 WebP 格式（更好的压缩率）

## 在 Markdown 中引用图片

```markdown
# 相对路径引用
![图片描述](../assets/images/category/image-name.png)

# 带标题的图片
![图片描述](../assets/images/category/image-name.png "图片标题")

# 可点击的图片
[![图片描述](../assets/images/category/image-name.png)](链接地址)
```

## 图片来源说明

- 所有图片应确保有合法使用权限
- 第三方图片应注明来源和许可证
- 开发板照片优先使用官方图片或自行拍摄
- 架构图和流程图优先使用 Mermaid 代码生成

## 待添加的图片

### 高优先级

- [ ] Zephyr 架构总览图
- [ ] 常见开发板照片（nRF52840 DK、STM32 Nucleo、ESP32）
- [ ] 开发环境配置截图
- [ ] west 工具使用截图
- [ ] 调试界面截图

### 中优先级

- [ ] 硬件连接示意图
- [ ] LED 电路原理图
- [ ] 内存映射图
- [ ] 中断处理流程图（如果不用 Mermaid）

### 低优先级

- [ ] 社区活动照片
- [ ] 技术分享现场照片
- [ ] 项目案例展示图
