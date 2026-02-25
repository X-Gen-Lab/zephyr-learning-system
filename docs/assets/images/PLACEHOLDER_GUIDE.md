# 图片占位符指南

本文档列出了学习系统中需要添加的图片及其规格要求。

## 图片清单

### 1. 架构图 (architecture/)

#### zephyr-architecture-overview.png
- **用途**: 首页和介绍页面展示 Zephyr 整体架构
- **内容**: 应用层、API 层、内核层、驱动层、硬件层的分层架构
- **尺寸**: 800x600px
- **格式**: PNG
- **引用位置**: 
  - `docs/index.md`
  - `docs/stage1-foundation/introduction.md`

#### kernel-architecture.png
- **用途**: 内核机制页面展示内核架构
- **内容**: 调度器、内存管理、中断处理、同步机制等模块
- **尺寸**: 800x600px
- **格式**: PNG
- **引用位置**: `docs/stage2-intermediate/kernel-mechanisms.md`

#### driver-model.png
- **用途**: 驱动开发页面展示驱动模型
- **内容**: 设备模型、驱动 API、设备树绑定关系
- **尺寸**: 800x600px
- **格式**: PNG
- **引用位置**: `docs/stage2-intermediate/driver-development.md`

### 2. 硬件图片 (hardware/)

#### nrf52840-dk.jpg
- **用途**: 展示 Nordic nRF52840 DK 开发板
- **内容**: 开发板正面照片，标注主要组件
- **尺寸**: 800x600px
- **格式**: JPEG
- **来源**: Nordic 官网或自行拍摄
- **引用位置**: 
  - `docs/prerequisites/embedded-basics.md`
  - `docs/stage1-foundation/basic-examples.md`

#### stm32-nucleo.jpg
- **用途**: 展示 STM32 Nucleo 开发板
- **内容**: 开发板正面照片
- **尺寸**: 800x600px
- **格式**: JPEG
- **来源**: ST 官网或自行拍摄
- **引用位置**: `docs/prerequisites/embedded-basics.md`

#### esp32-devkit.jpg
- **用途**: 展示 ESP32 开发板
- **内容**: 开发板正面照片
- **尺寸**: 800x600px
- **格式**: JPEG
- **来源**: Espressif 官网或自行拍摄
- **引用位置**: `docs/prerequisites/embedded-basics.md`

#### led-circuit.png
- **用途**: LED 电路原理图
- **内容**: LED、限流电阻、GPIO 连接示意图
- **尺寸**: 600x400px
- **格式**: PNG
- **引用位置**: `docs/stage1-foundation/basic-examples.md`

#### cortex-m-memory-map.png
- **用途**: ARM Cortex-M 内存映射图
- **内容**: Flash、SRAM、外设、系统区域的地址分布
- **尺寸**: 600x800px
- **格式**: PNG
- **引用位置**: `docs/prerequisites/embedded-basics.md`

### 3. 截图 (screenshots/)

#### vscode-zephyr-setup.png
- **用途**: VS Code 开发环境配置截图
- **内容**: VS Code 界面，显示 Zephyr 项目结构和扩展
- **尺寸**: 1200x800px
- **格式**: PNG
- **引用位置**: `docs/stage1-foundation/environment-setup.md`

#### west-build-output.png
- **用途**: west build 命令输出截图
- **内容**: 终端显示 west build 的完整输出
- **尺寸**: 1000x600px
- **格式**: PNG
- **引用位置**: `docs/stage1-foundation/west-tool.md`

#### serial-output-hello-world.png
- **用途**: Hello World 串口输出截图
- **内容**: 串口终端显示 "Hello World" 输出
- **尺寸**: 800x400px
- **格式**: PNG
- **引用位置**: `docs/stage1-foundation/basic-examples.md`

#### menuconfig-interface.png
- **用途**: menuconfig 配置界面截图
- **内容**: Kconfig menuconfig 的 TUI 界面
- **尺寸**: 1000x700px
- **格式**: PNG
- **引用位置**: `docs/stage2-intermediate/kconfig-devicetree.md`

#### gdb-debugging.png
- **用途**: GDB 调试界面截图
- **内容**: GDB 调试会话，显示断点、变量、调用栈
- **尺寸**: 1200x800px
- **格式**: PNG
- **引用位置**: `docs/stage3-advanced/kernel-source.md`

### 4. Logo 和图标 (logos/)

#### zephyr-logo.svg
- **用途**: Zephyr 官方 Logo
- **内容**: Zephyr Project 官方 Logo
- **格式**: SVG（矢量图）
- **来源**: Zephyr 官网
- **引用位置**: 
  - `docs/index.md`
  - `mkdocs.yml` (favicon)

#### linux-foundation-logo.png
- **用途**: Linux Foundation Logo
- **内容**: Linux Foundation 官方 Logo
- **格式**: PNG
- **来源**: Linux Foundation 官网
- **引用位置**: `docs/about.md`

## 临时占位符方案

在获取实际图片之前，可以使用以下方案：

### 方案 1: 使用占位符服务

```markdown
![开发板照片](https://via.placeholder.com/800x600.png?text=nRF52840+DK)
```

### 方案 2: 使用 Mermaid 图表代替

对于架构图、流程图等，优先使用 Mermaid 代码生成，无需图片文件。

### 方案 3: 使用文字说明

在图片准备好之前，使用详细的文字描述代替。

## 图片获取建议

1. **官方资源**: 优先从官方网站下载（Zephyr、Nordic、ST、Espressif）
2. **开源图库**: Unsplash、Pexels（注意许可证）
3. **自行创建**: 使用 draw.io、Figma、Inkscape 创建架构图
4. **自行拍摄**: 如果有开发板，自行拍摄高质量照片
5. **社区贡献**: 从社区获取或请求贡献

## 图片优化工具

- **在线工具**: TinyPNG, Squoosh
- **命令行工具**: ImageMagick, OptiPNG
- **图形软件**: GIMP, Photoshop

## 版权和许可

- 确保所有图片有合法使用权限
- 标注图片来源和许可证信息
- 优先使用 CC0、CC BY 或官方提供的图片
- 自行创建的图片使用与项目相同的许可证（CC BY-SA 4.0）
