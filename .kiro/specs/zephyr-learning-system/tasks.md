# Implementation Plan: Zephyr RTOS 学习系统

## Overview

本实施计划将 Zephyr RTOS 学习系统的设计转化为可执行的开发任务，致力于实现"成为全球最系统、最实用的 Zephyr RTOS 中文学习平台"的愿景。

### 愿景对齐

所有任务都围绕以下核心目标展开：

- **系统性**：构建完整的四阶段学习路径，从前置知识到专业精通，覆盖 Zephyr RTOS 的所有核心领域
- **实用性**：每个学习阶段都包含实操任务、代码示例和避坑指南，确保学习者能够将知识转化为实际开发能力
- **中文优化**：优化中文搜索、中文排版和中文技术术语表达，降低中文开发者的学习门槛
- **开发者能力体系**：从环境搭建到架构设计，从基础工具到社区贡献，构建完整的物联网操作系统开发能力

### 实施策略

系统基于 MkDocs 和 Material 主题构建，采用文档即代码的方法。实施将按照以下顺序进行：

1. **基础设施搭建**（任务 1-3）：项目初始化、配置和目录结构
2. **核心内容创建**（任务 4-10）：从首页到四阶段学习内容的系统化编写
3. **功能增强**（任务 11-15）：链接、搜索、导航、多媒体和版本控制
4. **质量保证**（任务 16-17）：构建部署和内容质量检查
5. **优化交付**（任务 18-21）：性能优化、用户体验和最终交付

## Tasks

- [x] 1. 项目初始化和基础配置
  - 创建项目目录结构
  - 初始化 Git 仓库
  - 配置 Python 虚拟环境
  - 安装 MkDocs 和必要的插件
  - 创建基础配置文件（mkdocs.yml、requirements.txt、.gitignore）
  - _Requirements: 6.1, 10.1, 10.2_

- [x] 2. 配置 MkDocs 和 Material 主题
  - [x] 2.1 编写 mkdocs.yml 配置文件
    - 定义站点基本信息（site_name、site_url、site_description、site_author）
    - 配置 Material 主题和特性（导航、搜索、代码复制等）
    - 配置配色方案（浅色和深色模式）
    - 配置字体和图标
    - _Requirements: 6.2, 6.3, 6.4, 11.3_

  - [x] 2.2 配置 Markdown 扩展
    - 配置代码高亮（pymdownx.highlight）
    - 配置 Mermaid 图表支持（pymdownx.superfences）
    - 配置 Admonitions 提示框
    - 配置内容标签页（pymdownx.tabbed）
    - _Requirements: 2.5, 2.6_

  - [x] 2.3 配置插件系统
    - 配置搜索插件（支持中文和英文）
    - 配置 Git 修订日期插件
    - 配置代码压缩插件
    - 配置 Mermaid 渲染插件
    - _Requirements: 4.4, 10.3, 11.1_

- [ ]* 2.4 编写属性测试：配置文件必需字段完整性
  - **Property 16: 配置文件必需字段完整性**
  - **Validates: Requirements 6.2, 6.3, 6.4, 6.5**

- [x] 3. 创建内容目录结构
  - [x] 3.1 创建学习路径目录
    - 创建 docs/ 根目录
    - 创建 prerequisites/ 前置知识目录
    - 创建 stage1-foundation/ 入门筑基期目录
    - 创建 stage2-intermediate/ 进阶实战期目录
    - 创建 stage3-advanced/ 高级深耕期目录
    - 创建 stage4-expert/ 专业精通期目录
    - 创建 learning-principles/ 学习法则目录
    - 创建 assets/ 静态资源目录（images、diagrams）
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7_

  - [x] 3.2 创建导航配置
    - 在 mkdocs.yml 中定义完整的导航结构
    - 为每个学习阶段定义子导航
    - 确保导航层级清晰且符合学习路径
    - _Requirements: 3.1, 3.2, 6.3_

- [ ]* 3.3 编写属性测试：内容目录结构一致性
  - **Property 2: 内容目录结构一致性**
  - **Validates: Requirements 1.2, 1.3**

- [x] 4. 创建首页和索引页面
  - [x] 4.1 编写首页内容（docs/index.md）
    - 展示系统愿景：成为全球最系统、最实用的 Zephyr RTOS 中文学习平台
    - 介绍学习系统的核心价值：系统性、实用性、中文优化
    - 展示四阶段学习路径的完整地图（使用 Mermaid 流程图）
    - 提供快速开始指南：如何选择学习起点、如何使用本平台
    - 展示学习成果：从入门到精通的能力提升路径
    - _Requirements: 5.1, 13.1_
    
    **详细实施步骤**:
    
    创建 `docs/index.md`，包含以下核心内容：
    
    1. **愿景展示**：使用 Admonition success 展示核心价值（系统性、实用性、中文优化、能力体系）
    2. **学习路径地图**：Mermaid graph LR 展示四阶段流程，使用不同颜色区分阶段
    3. **快速开始表格**：4行对比表（用户背景 | 建议起点 | 预计时间）
    4. **使用指南**：5步使用方法列表
    5. **学习成果**：使用 Material tabs（=== "能力层级"）展示四个层级的能力清单
    6. **行动号召**：使用 Material grid cards 展示四个阶段的入口链接（带图标）
    
    **验证清单**：Mermaid 图表渲染、内部链接有效、移动端友好

  - [x] 4.2 创建关于页面（docs/about.md）
    - 详细阐述愿景：打破技术学习壁垒，推动中国物联网技术发展
    - 说明五大使命：降低门槛、构建体系、强调实践、促进共享、保持时效
    - 阐述核心价值观：以学习者为中心、质量至上、开放协作、持续改进、实践驱动
    - 介绍平台的设计理念和技术架构
    - 说明如何参与贡献和社区建设
    - _Requirements: 13.2_
    
    **详细实施步骤**:
    
    创建 `docs/about.md`，包含以下核心内容：
    
    1. **愿景展示**：
       - 成为全球最系统、最实用的 Zephyr RTOS 中文学习平台
       - 打破技术学习壁垒，推动中国物联网技术发展
       - 说明为什么选择 Zephyr RTOS（5个核心优势）
    
    2. **五大使命**：
       - 降低学习门槛：中文优化、清晰导航、避坑指南
       - 构建完整知识体系：四阶段学习路径（使用 Mermaid graph TD 展示）
       - 强调实践导向：实操任务、代码示例、常见问题
       - 促进知识共享：GitHub 协作、社区贡献
       - 保持内容时效性：版本跟踪、定期更新、自动化测试
    
    3. **核心价值观**：
       - 使用 Admonition example 展示 5 个价值观（以学习者为中心、质量至上、开放协作、持续改进、实践驱动）
       - 每个价值观包含具体体现方式
    
    4. **平台设计理念**：
       - 文档即代码（Docs-as-Code）方法
       - 技术栈 Mermaid 图表（Markdown → MkDocs → 静态网站 → GitHub Pages）
       - 5 个设计原则（简单性、可维护性、可扩展性、用户友好、性能优化）
    
    5. **参与贡献**：
       - 贡献内容的 4 种方式
       - 6 步贡献流程
       - 报告问题的 3 种途径
       - 社区链接（GitHub、讨论区、邮件列表）
    
    6. **许可证和致谢**：
       - CC BY-SA 4.0 许可证说明
       - 感谢 Zephyr 社区和贡献者
    
    **验证清单**：Mermaid 图表渲染、Admonitions 显示、外部链接有效

  - [x] 4.3 为每个学习阶段创建索引页
    - 创建 prerequisites/index.md（前置必备知识）
    - 创建 stage1-foundation/index.md（入门筑基期）
    - 创建 stage2-intermediate/index.md（进阶实战期）
    - 创建 stage3-advanced/index.md（高级深耕期）
    - 创建 stage4-expert/index.md（专业精通期）
    - 创建 learning-principles/index.md（学习黄金法则）
    - 每个索引页都体现"循序渐进"和"实践导向"的学习理念
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 13.3, 13.4_
    
    **详细实施步骤**:
    
    为每个学习阶段创建索引页，包含以下核心内容：
    
    1. **前置必备知识索引页**（prerequisites/index.md）：
       - 学习目标：4 个核心能力（C 语言、嵌入式硬件、RTOS 概念、工具能力）
       - 学习内容表格：4 个主题 + 预计时间（总计 1-2 周）
       - 自我评估清单：7 项检查项
       - 使用 Admonition tip 提供学习建议
       - 下一步按钮链接到第一阶段
    
    2. **第一阶段索引页**（stage1-foundation/index.md）：
       - 核心目标：4 个能力目标
       - 学习内容表格：5 个主题（Zephyr 认知、环境搭建、west 工具、工程结构、基础例程）
       - 必做实操任务：4 个任务（环境验证、hello_world 定制、blinky 实验、多板适配）
       - 避坑指南：3 个常见问题 + 解决方案（Python 版本、网络代理、编译错误）
       - 学习进度检查：6 项能力清单
    
    3. **第二阶段索引页**（stage2-intermediate/index.md）：
       - 核心目标：4 个能力目标
       - 学习内容表格：4 个主题（内核机制、Kconfig/设备树、驱动开发、子系统）
       - 必做实操任务：3 个任务（多线程应用、自定义驱动、子系统集成）
       - 避坑指南：2 个常见问题（设备树配置、线程栈溢出）
    
    4. **第三阶段索引页**（stage3-advanced/index.md）：
       - 核心目标：高级能力（源码分析、BSP 移植、系统优化、安全特性）
       - 学习内容表格：4 个主题
       - 必做实操任务：高级项目任务
       - 避坑指南：高级问题解决
    
    5. **第四阶段索引页**（stage4-expert/index.md）：
       - 核心目标：专家级能力（架构设计、社区贡献、技术布道）
       - 学习内容表格：3 个主题
       - 实践项目：开源贡献、技术分享
    
    6. **学习黄金法则索引页**（learning-principles/index.md）：
       - 10 条学习法则
       - 每条法则包含原理和实践建议
    
    **验证清单**：所有索引页创建、表格显示、按钮链接有效、体现学习理念

- [ ]* 4.4 编写属性测试：愿景使命内容展示
  - **Property 32: 愿景使命内容展示**
  - **Validates: Requirements 13.1, 13.2**

- [ ]* 4.5 编写属性测试：学习理念体现一致性
  - **Property 33: 学习理念体现一致性**
  - **Validates: Requirements 13.3, 13.4**

- [x] 5. 编写前置必备知识内容（系统性基础）
  - [x] 5.1 创建 C 语言核心能力页面（prerequisites/c-language.md）
    - 包含 YAML Front Matter 元数据（难度：初级，预计时间：1-2 周）
    - C 语言核心语法回顾（指针、结构体、位操作）
    - 嵌入式 C 编程特点（volatile、const、static 的使用）
    - 使用代码块展示实际 Zephyr 代码示例
    - 提供自我评估测试题
    - _Requirements: 1.4, 5.1, 8.1_
    
    **详细实施步骤**:
    
    创建 `docs/prerequisites/c-language.md`，包含以下核心内容：
    
    1. **指针深入理解**：
       - 指针基础操作（声明、取地址、解引用）
       - 指针与数组的关系
       - 函数指针（Zephyr 回调函数示例）
       - 使用 Admonition warning 说明常见陷阱（野指针、悬空指针、指针越界）
    
    2. **结构体与联合体**：
       - 结构体定义和初始化（Zephyr 设备结构体示例）
       - 位域（硬件寄存器操作）
       - 结构体对齐和填充
    
    3. **位操作**：
       - 基本位操作（设置、清除、切换、检查位）
       - 多位操作（位段读写）
       - Zephyr 中的 BIT() 宏使用
    
    4. **嵌入式 C 特性**：
       - volatile 关键字（硬件寄存器、中断变量）
       - const 关键字（常量配置、只读数据）
       - static 关键字（文件作用域、函数内静态变量）
    
    5. **Zephyr 代码示例**：
       - 完整的设备驱动结构示例
       - 使用 Zephyr API 的实际代码
    
    6. **自我评估测试**：
       - 3-5 个测试题（指针、位操作等）
       - 使用 `<details>` 标签隐藏答案
    
    **验证清单**：代码高亮正确、Admonitions 显示、折叠内容可用

  - [x] 5.2 创建嵌入式硬件基础页面（prerequisites/embedded-basics.md）
    - ARM Cortex-M 架构基础（使用 Mermaid 架构图）
    - 内存映射和外设寄存器
    - 中断和异常处理机制
    - 包含硬件示意图和时序图
    - 常见开发板介绍（Nordic、STM32、ESP32 等）
    - _Requirements: 5.1, 9.1, 9.2_
    
    **详细实施步骤**:
    
    创建 `docs/prerequisites/embedded-basics.md`，包含以下核心内容：
    
    1. **ARM Cortex-M 架构**：
       - 架构概览（使用 Mermaid graph TB 展示 CPU、NVIC、MPU、FPU、Debug 接口）
       - 内存映射表格（地址范围、用途、大小）
       - Cortex-M 系列对比（M0/M3/M4/M7）
    
    2. **内存映射和外设寄存器**：
       - 内存映射原理
       - 寄存器访问方法（直接地址访问、结构体映射）
       - Zephyr 中的寄存器操作示例
    
    3. **中断和异常**：
       - 中断优先级配置（Zephyr IRQ_CONNECT 示例）
       - 中断处理流程（使用 Mermaid sequenceDiagram 展示）
       - NVIC 配置和管理
       - 中断嵌套和优先级抢占
    
    4. **常见开发板介绍**：
       - Nordic nRF52840 DK（BLE、Thread、Zigbee）
       - STM32 Nucleo（工业应用、丰富外设）
       - ESP32（Wi-Fi、低成本）
       - 使用表格对比开发板特性
    
    5. **实践建议**：
       - 如何选择开发板
       - 硬件调试技巧
    
    **验证清单**：Mermaid 图表渲染、表格显示、代码示例正确

  - [x] 5.3 创建 RTOS 基础概念页面（prerequisites/rtos-concepts.md）
    - RTOS 核心概念：任务、调度、同步、通信
    - 使用 Admonitions 提示框强调重点概念
    - Zephyr 与其他 RTOS 的对比（FreeRTOS、RT-Thread）
    - 包含概念图表和状态机图
    - 实时性和确定性的理解
    - _Requirements: 5.1_
    
    **详细实施步骤**:
    
    创建 `docs/prerequisites/rtos-concepts.md`，包含以下核心内容：
    
    1. **RTOS 概述**：
       - 使用 Admonition info 定义 RTOS
       - 为什么需要 RTOS（裸机开发的问题 vs RTOS 的优势）
    
    2. **RTOS 核心概念**：
       - 任务/线程：状态机图（使用 Mermaid stateDiagram-v2 展示 Ready/Running/Blocked 状态）
       - Zephyr 任务创建示例（K_THREAD_DEFINE）
       - 调度器：调度策略表格（抢占式、时间片轮转、协作式）
       - 使用 Admonition tip 说明 Zephyr 优先级规则
    
    3. **同步机制**：
       - 互斥锁（Mutex）代码示例
       - 信号量（Semaphore）生产者-消费者示例
       - 事件和条件变量
    
    4. **通信机制**：
       - 消息队列（K_MSGQ_DEFINE）
       - 管道和 FIFO
       - 共享内存
    
    5. **Zephyr vs 其他 RTOS**：
       - 功能对比表格（许可证、内核类型、设备树、Kconfig、学习曲线）
       - API 对比（使用 Material tabs 展示 Zephyr/FreeRTOS/RT-Thread 创建任务的代码）
    
    6. **实时性和确定性**：
       - 使用 Admonition note 区分硬实时和软实时
       - 影响实时性的因素（Mermaid graph LR 展示）
       - 优化建议列表
    
    **验证清单**：Admonitions 显示、状态机图渲染、代码标签页切换、对比表格清晰

  - [x] 5.4 创建基础工具能力页面（prerequisites/tools.md）
    - Git 版本控制基础
    - 命令行工具使用（Linux/Windows）
    - 包含命令行示例和实际操作截图
    - 调试工具介绍（GDB、J-Link、OpenOCD）
    - 包含工具安装说明（多平台支持）
    - _Requirements: 5.1_
    
    **详细实施步骤**:
    
    创建 `docs/prerequisites/tools.md`，包含以下核心内容：
    
    1. **Git 版本控制**：
       - Git 基础命令（clone、status、add、commit、push、pull）
       - 分支管理（checkout、branch、merge）
       - 使用 Admonition tip 提供 Git 最佳实践
    
    2. **命令行工具**：
       - Linux/macOS 命令（使用代码标签页展示）
       - Windows 命令（CMD/PowerShell）
       - 文件操作、文件查看、文本处理命令
    
    3. **调试工具**：
       - GDB 基本命令（break、run、step、print、backtrace）
       - GDB 配置文件（.gdbinit）
       - J-Link 调试器安装和使用（多平台标签页）
       - OpenOCD 配置和使用
    
    4. **串口工具**：
       - minicom（Linux）
       - PuTTY（Windows）
       - screen（macOS/Linux）
    
    5. **工具安装指南**：
       - 使用 Material tabs 展示 Ubuntu/Windows/macOS 的完整安装步骤
       - 包含 Zephyr SDK 安装
    
    6. **故障排除**：
       - 3-5 个常见问题和解决方案
       - 串口权限、GDB 连接、west 命令找不到等
    
    **验证清单**：命令示例正确、多平台标签页切换、故障排除实用

- [ ]* 5.5 编写属性测试：元数据解析正确性
  - **Property 3: 元数据解析正确性**
  - **Validates: Requirements 1.4**

- [ ]* 5.6 编写属性测试：代码语法高亮完整性
  - **Property 7: 代码语法高亮完整性**
  - **Validates: Requirements 2.5, 8.1, 8.2**

- [ ]* 5.7 编写属性测试：Mermaid 图表渲染正确性
  - **Property 8: Mermaid 图表渲染正确性**
  - **Validates: Requirements 2.6, 9.2, 9.3**

- [x] 6. 编写第一阶段内容（入门筑基期 - 实用导向）
  - [x] 6.1 创建 Zephyr 基础认知页面（stage1-foundation/introduction.md）
    - Zephyr 项目定位：Linux Foundation 物联网操作系统
    - 核心优势：模块化、可扩展、安全性、多架构支持
    - 适用场景：物联网设备、可穿戴设备、工业控制
    - 版本选择建议：LTS 版本 vs 最新版本
    - 与其他 RTOS 的对比分析
    - 成功案例和应用领域
    - _Requirements: 5.2, 5.6_
    
    **详细实施步骤**:
    
    创建 `docs/stage1-foundation/introduction.md`，包含以下核心内容：
    
    1. **Zephyr 项目定位**：
       - 使用 Admonition info 展示官方定义
       - 项目背景（创立时间、托管组织、许可证、支持公司、社区规模）
       - 设计理念（使用 Mermaid graph LR 展示模块化设计、可配置性、安全性、多架构支持）
    
    2. **核心优势**：
       - 模块化架构（组件化设计、最小系统资源需求）
       - 强大的配置系统（Kconfig + 设备树）
       - 安全性特性表格（安全启动、内存保护、加密库、安全通信、安全存储）
       - 多架构支持（ARM、x86、RISC-V、ARC、Xtensa、NIOS II）
    
    3. **适用场景**：
       - 物联网设备（使用 Admonition example 展示典型应用）
       - 可穿戴设备（应用示例和优势）
       - 工业控制（应用领域和优势）
    
    4. **版本选择建议**：
       - LTS 版本 vs 最新版本对比表格（发布周期、支持时长、适用场景）
       - 使用 Admonition tip 提供选择建议
       - 当前版本信息和切换命令
    
    5. **与其他 RTOS 对比**：
       - 功能对比矩阵表格（Zephyr、FreeRTOS、RT-Thread、Mbed OS）
       - 选择 Zephyr 的理由和考虑其他 RTOS 的情况
    
    6. **成功案例**：
       - 商业产品（使用 Admonition success 展示）
       - 开源项目列表
    
    7. **学习路线图**：
       - 使用 Mermaid graph TD 展示从基础认知到实际项目的学习路径
    
    **验证清单**：Mermaid 图表渲染、对比表格清晰、Admonitions 显示、内部链接有效

  - [x] 6.2 创建开发环境搭建页面（stage1-foundation/environment-setup.md）
    - 系统要求说明（Windows/Linux/macOS）
    - 详细安装步骤（分步骤截图说明）
    - West 工具安装和配置
    - SDK 和工具链安装
    - 环境验证方法（编译第一个示例）
    - 包含避坑指南（使用 Admonitions）
    - _Requirements: 5.2, 5.6_
    
    **详细实施步骤**:
    
    1. **系统要求**：硬件要求表格（CPU、内存、硬盘、开发板）、软件要求（Material tabs 展示 Linux/Windows/macOS 的不同要求）
    
    2. **安装步骤**：
       - 安装依赖工具（Material tabs 展示 Ubuntu/Windows/macOS 的完整命令）
       - 安装 west（pip 安装、验证、PATH 配置）
       - 初始化 Zephyr 工作区（创建目录、west init、west update、west zephyr-export）
       - Admonition warning 提示网络问题和国内镜像
       - 安装 Python 依赖
       - 安装 Zephyr SDK（Material tabs 展示多平台安装步骤）
    
    3. **环境验证**：编译 Hello World（命令和预期输出）、Admonition success 标记成功标志、编译真实硬件示例
    
    4. **避坑指南**：
       - 问题 1: Python 版本不兼容（Admonition danger 展示症状和解决方案）
       - 问题 2: west update 失败（3 种解决方案）
       - 问题 3: 编译错误 - 找不到工具链
       - 问题 4: 权限问题（Linux）
       - 问题 5: Windows 路径过长
    
    5. **环境配置脚本**：Material tabs 展示 Linux/macOS 和 Windows 的环境激活脚本、包含使用方法
    
    **验证清单**：多平台安装指南完整、代码标签页切换正常、避坑指南实用、环境脚本可用

  - [x] 6.3 创建 west 工具核心用法页面（stage1-foundation/west-tool.md）
    - West 工具架构和设计理念
    - 核心命令详解：init、update、build、flash、debug
    - 使用示例（实际命令和输出）
    - Manifest 文件解析
    - 多仓库管理
    - 常见问题解决和调试技巧
    - _Requirements: 5.2, 5.6_
    
    **详细实施步骤**:
    
    1. **west 工具概述**：Admonition info 介绍、设计理念 Mermaid graph TB（项目管理、构建系统、烧录调试）、核心特性列表
    
    2. **west 核心命令详解**：
       - init: 命令格式、常用示例、工作区结构、Admonition tip 最佳实践
       - update: 命令格式、常用示例、更新流程 Mermaid sequenceDiagram、Admonition warning 注意事项
       - build: 命令格式、常用示例、构建选项表格、构建输出结构
       - flash: 命令格式、常用示例、Flash Runner 表格、Admonition example 烧录示例
       - debug: 命令格式、常用示例、调试流程 Mermaid sequenceDiagram
       - 其他命令: attach、boards、config、topdir
    
    3. **Manifest 文件详解**：文件结构（west.yml 示例）、关键字段表格（remotes、projects、revision、path、import、self）、自定义 Manifest 示例
    
    4. **多仓库管理**：工作区布局、管理本地修改（west forall）、更新策略对比
    
    5. **常见问题和调试**：5 个问题（Admonition danger 展示症状和解决方案）- west 命令找不到、update 失败、构建失败、烧录失败、构建目录混淆
    
    6. **west 高级用法**：自定义命令（YAML 和 Python 示例）、配置技巧、与 Git 工作流集成
    
    **验证清单**：Mermaid 图表渲染、命令示例正确、表格显示、Admonitions 有效、代码高亮正确

  - [x] 6.4 创建工程结构与配置页面（stage1-foundation/project-structure.md）
    - Zephyr 项目目录结构详解
    - CMakeLists.txt 配置说明
    - prj.conf 配置文件详解
    - 包含配置文件示例（带注释）
    - Kconfig 基础入门
    - 如何添加源文件和库
    - _Requirements: 5.2, 5.6_
    
    **详细实施步骤**:
    
    1. **Zephyr 项目目录结构**：典型应用项目结构（目录树）、Zephyr 源码目录结构（目录树）、Admonition info 说明各目录作用
    
    2. **CMakeLists.txt 详解**：最小示例、完整示例（带注释）、CMake 常用命令表格（target_sources、target_include_directories、target_compile_options 等）、Admonition tip 最佳实践
    
    3. **prj.conf 配置文件**：基本配置示例（串口、日志、GPIO、线程栈）、完整配置示例（分类注释：基础系统、驱动、子系统、调试、优化）、配置选项说明（日志级别、优化级别）、Admonition warning 配置冲突
    
    4. **Kconfig 基础**：Mermaid graph LR 展示流程、Admonition info 说明作用、menuconfig 使用（命令和界面）、自定义 Kconfig（文件示例和代码使用）
    
    5. **添加源文件和库**：3 种添加方法（直接添加、使用变量、条件编译）、组织源文件（推荐目录结构和 CMakeLists.txt）、创建和使用库（静态库示例）、使用外部库（west.yml 和 CMakeLists.txt）
    
    6. **板级配置**：设备树 Overlay（.overlay 文件示例）、板级 Kconfig（.conf 文件示例）
    
    7. **实践示例**：完整项目示例（项目结构、CMakeLists.txt、prj.conf、构建命令）
    
    8. **常见问题**：3 个问题（Admonition danger）- 配置不生效、找不到头文件、链接错误
    
    **验证清单**：目录树清晰、代码示例完整、配置文件有注释、Mermaid 图表渲染、表格格式正确

  - [x] 6.5 创建基础例程实操页面（stage1-foundation/basic-examples.md）
    - hello_world 例程详解
      - 代码逐行分析
      - 编译和烧录步骤
      - 串口输出查看
    - blinky 例程详解
      - GPIO 控制原理
      - 设备树配置
      - 实际硬件连接
    - 实操任务说明（必做）：
      - 修改 hello_world 输出内容
      - 改变 blinky 闪烁频率
      - 在不同开发板上运行
    - 常见问题和解决方案
    - _Requirements: 5.2, 5.6_
    
    **详细实施步骤**:
    
    1. **hello_world 例程详解**：Admonition info 学习目标、代码逐行分析（main.c 源码 + 解析表格）、Admonition tip 对比 printk vs printf、CMakeLists.txt 和 prj.conf 说明、编译烧录步骤（QEMU 和真实硬件）、串口输出查看（Material tabs 展示 Linux/Windows/macOS）、Admonition success 成功标志
    
    2. **实操任务 1: 修改输出内容**：任务目标（输出名字和当前时间）、详细步骤、修改后代码示例（k_uptime_get、k_sleep、循环输出）、预期输出、知识点总结
    
    3. **blinky 例程详解**：Admonition info 学习目标、代码逐行分析（main.c 源码 + 解析表格）、设备树配置（Mermaid graph LR 展示流程）、nRF52840 DK 的 LED 定义（设备树示例 + 字段说明）、实际硬件连接（LED 连接表、电路原理图）、Admonition info 共阴极 vs 共阳极
    
    4. **实操任务 2: 改变闪烁频率**：任务目标、修改代码示例（1Hz 改为 2Hz）、添加第二个 LED（交替闪烁）、预期效果
    
    5. **实操任务 3: 多板适配**：任务目标、支持的开发板列表、设备树差异说明、编译和烧录命令
    
    6. **常见问题**：3-5 个问题（Admonition danger）- 串口无输出、LED 不闪烁、编译错误、烧录失败
    
    7. **学习总结**：完成本节后应掌握的能力清单、下一步学习建议
    
    **验证清单**：代码示例完整、硬件连接图清晰、实操任务可执行、常见问题实用

- [ ]* 6.6 编写属性测试：代码示例可编译性
  - **Property 9: 代码示例可编译性**
  - **Validates: Requirements 8.1, 8.2**

- [ ]* 6.7 编写属性测试：实操任务完整性
  - **Property 34: 实操任务完整性**
  - **Validates: Requirements 13.5**

- [x] 7. 编写第二阶段内容（进阶实战期 - 深度实践）
  - [x] 7.1 创建内核核心机制页面（stage2-intermediate/kernel-mechanisms.md）
    - 线程管理详解
      - 线程创建、调度、优先级
      - 线程栈管理和内存分配
      - 线程同步机制（互斥锁、信号量、事件）
    - 中断处理机制
      - 中断服务例程（ISR）
      - 中断优先级和嵌套
      - 中断与线程的交互
    - 同步与通信
      - 消息队列、管道、FIFO
      - 工作队列和定时器
    - 包含架构图和流程图（Mermaid）
    - 实际代码示例和最佳实践
    - 性能优化建议
    - _Requirements: 5.3, 5.6_
    
    **详细实施步骤**:
    
    创建 `docs/stage2-intermediate/kernel-mechanisms.md`，包含以下核心内容：
    
    1. **线程管理章节**：
       - 线程状态机图（Mermaid stateDiagram）
       - 线程创建 API：`k_thread_create()`, `K_THREAD_DEFINE()` 完整示例
       - 优先级配置：抢占式（0-14）vs 协作式（负数）
       - 线程栈：`K_THREAD_STACK_DEFINE()`, 栈大小计算方法
       - 实操示例：创建 3 个不同优先级线程的完整代码
    
    2. **同步机制章节**：
       - 互斥锁（Mutex）：`K_MUTEX_DEFINE()`, 死锁避免
       - 信号量（Semaphore）：`K_SEM_DEFINE()`, 生产者-消费者模式
       - 事件（Events）：`K_EVENT_DEFINE()`, 多事件等待
       - 对比表格：各同步机制的适用场景
       - 代码示例：每种机制的完整使用示例
    
    3. **中断处理章节**：
       - 中断架构图（Mermaid sequenceDiagram）
       - ISR 注册：`IRQ_CONNECT()`, `irq_enable()`
       - 中断优先级配置和嵌套规则
       - ISR 与线程交互：`k_sem_give()` 在 ISR 中的使用
       - 最佳实践：ISR 中应该和不应该做的事
    
    4. **通信机制章节**：
       - 消息队列：`K_MSGQ_DEFINE()`, 固定大小消息传递
       - 管道（Pipe）：`K_PIPE_DEFINE()`, 字节流传递
       - FIFO：`K_FIFO_DEFINE()`, 动态大小数据传递
       - 工作队列：`K_WORK_DEFINE()`, 延迟执行
       - 定时器：`K_TIMER_DEFINE()`, 周期性任务
       - 每种机制的完整代码示例和使用场景
    
    5. **性能优化章节**：
       - 线程栈大小优化（使用 `CONFIG_THREAD_STACK_INFO`）
       - 优先级分配策略
       - 减少上下文切换开销
       - 中断延迟优化技巧
    
    6. **实操任务**：
       - 任务 1：实现生产者-消费者模式（使用信号量和消息队列）
       - 任务 2：实现按钮中断处理（ISR + 工作队列）
       - 任务 3：多线程同步实验（互斥锁保护共享资源）
    
    **验证清单**：Mermaid 图表、代码可编译运行、包含性能分析工具使用说明

  - [x] 7.2 创建 Kconfig 和设备树页面（stage2-intermediate/kconfig-devicetree.md）
    - Kconfig 语法和使用
      - 配置选项定义
      - 依赖关系管理
      - menuconfig 使用
    - 设备树语法和使用
      - DTS 文件结构
      - 节点和属性定义
      - overlay 机制
    - 配置示例（实际项目配置）
    - 如何为新硬件编写设备树
    - 常见配置错误和调试方法
    - _Requirements: 5.3, 5.6_
    
    **详细实施步骤**:
    
    创建 `docs/stage2-intermediate/kconfig-devicetree.md`，包含以下核心内容：
    
    1. **Kconfig 深入章节**：
       - Kconfig 语法完整参考：bool, int, string, choice, menu
       - 依赖关系：depends on, select, imply 的区别和使用
       - 条件配置：if...endif, visible if
       - menuconfig 完整操作指南（导航、搜索、保存）
       - 自定义 Kconfig 文件示例（完整的应用配置）
       - 配置优先级：prj.conf < board.conf < overlay
    
    2. **设备树深入章节**：
       - DTS 语法详解：节点、属性、标签、引用
       - 设备树编译流程图（Mermaid）
       - 常用属性：compatible, reg, status, interrupts, clocks
       - 设备树宏：DT_ALIAS(), DT_NODELABEL(), DT_INST()
       - overlay 机制：板级 overlay、应用 overlay
       - 设备树绑定（bindings）：YAML 格式说明
    
    3. **实际配置示例章节**：
       - I2C 传感器设备树配置（完整示例）
       - SPI 外设设备树配置
       - GPIO 中断配置
       - 时钟树配置
       - 每个示例包含 DTS 和对应的 C 代码
    
    4. **为新硬件编写设备树章节**：
       - 步骤 1：分析硬件规格书
       - 步骤 2：创建 SoC 设备树
       - 步骤 3：创建板级设备树
       - 步骤 4：编写设备树绑定
       - 步骤 5：验证和测试
       - 完整示例：为自定义板子编写设备树
    
    5. **调试方法章节**：
       - 查看生成的设备树：`build/zephyr/zephyr.dts`
       - 使用 `west build -t menuconfig` 检查配置
       - 常见错误：节点未定义、属性类型错误、依赖缺失
       - 调试工具：devicetree.h 宏展开、编译器错误分析
    
    6. **实操任务**：
       - 任务 1：为 I2C 传感器编写完整的设备树配置
       - 任务 2：创建自定义 Kconfig 选项控制功能开关
       - 任务 3：使用 overlay 为不同板子适配同一应用
    
    **验证清单**：配置可生效、设备树可编译、包含完整的调试流程

  - [x] 7.3 创建驱动开发页面（stage2-intermediate/driver-development.md）
    - Zephyr 驱动模型介绍
      - 设备驱动架构
      - 驱动初始化流程
    - 常用外设 API
      - GPIO、UART、SPI、I2C
      - ADC、PWM、Timer
    - 驱动开发示例（完整代码）
      - 编写自定义 GPIO 驱动
      - 实现 I2C 传感器驱动
    - 驱动调试技巧
    - 实操任务：开发一个简单的外设驱动
    - _Requirements: 5.3, 5.6_
    
    **详细实施步骤**:
    
    创建 `docs/stage2-intermediate/driver-development.md`，包含以下核心内容：
    
    1. **驱动模型章节**：
       - Zephyr 驱动架构图（Mermaid）：应用层 -> API 层 -> 驱动层 -> 硬件层
       - 设备模型：device, device_config, device_data
       - 驱动 API：driver_api 结构体
       - 驱动初始化：DEVICE_DT_DEFINE(), 初始化优先级
       - 设备树绑定：驱动与硬件的关联
    
    2. **常用外设 API 章节**：
       - GPIO API：`gpio_pin_configure()`, `gpio_pin_set()`, `gpio_pin_interrupt_configure()`
       - UART API：`uart_configure()`, `uart_poll_in()`, `uart_poll_out()`, 中断模式
       - I2C API：`i2c_configure()`, `i2c_write()`, `i2c_read()`, `i2c_transfer()`
       - SPI API：`spi_transceive()`, `spi_release()`
       - ADC API：`adc_channel_setup()`, `adc_read()`
       - PWM API：`pwm_set_cycles()`, 占空比控制
       - 每个 API 包含完整使用示例和时序图
    
    3. **驱动开发实战章节**：
       - 示例 1：编写 LED 驱动（完整代码，包含设备树绑定）
       - 示例 2：编写 I2C 温湿度传感器驱动（SHT3x）
         - 驱动源码（driver.c）
         - 设备树绑定（yaml）
         - 设备树配置（dts）
         - 应用代码（main.c）
       - 示例 3：编写 SPI Flash 驱动
       - 每个示例包含完整的项目结构和构建说明
    
    4. **驱动调试章节**：
       - 使用 printk 调试
       - 使用日志系统（LOG_MODULE_REGISTER）
       - 使用 GDB 调试驱动
       - 常见问题：设备未就绪、I2C 通信失败、中断未触发
       - 调试工具：逻辑分析仪、示波器的使用
    
    5. **最佳实践章节**：
       - 驱动代码组织结构
       - 错误处理和返回值
       - 资源管理（内存、中断）
       - 性能优化（DMA、中断驱动）
       - 可移植性设计
    
    6. **实操任务**：
       - 任务 1：为 DHT11 温湿度传感器编写驱动
       - 任务 2：为 WS2812 LED 编写 SPI 驱动
       - 任务 3：为自定义外设编写驱动并集成到应用
    
    **验证清单**：驱动可编译、设备可识别、功能正常、包含完整测试代码

  - [x] 7.4 创建子系统使用页面（stage2-intermediate/subsystems.md）
    - 日志系统（Logging）
      - 日志级别和配置
      - 日志输出和格式化
      - 性能影响分析
    - Shell 控制台
      - Shell 命令注册
      - 自定义命令开发
      - 运行时调试
    - 存储子系统
      - Flash 存储管理
      - 文件系统（LittleFS、FAT）
      - NVS（非易失性存储）
    - 低功耗管理
      - 电源管理策略
      - 睡眠模式配置
      - 功耗优化技巧
    - 每个子系统都包含实际使用示例
    - _Requirements: 5.3, 5.6_
    
    **详细实施步骤**:
    
    创建 `docs/stage2-intermediate/subsystems.md`，包含以下核心内容：
    
    1. **日志系统章节**：
       - 日志架构图（Mermaid）：模块 -> 日志核心 -> 后端
       - 配置选项：CONFIG_LOG, CONFIG_LOG_DEFAULT_LEVEL, CONFIG_LOG_BACKEND_UART
       - 使用方法：LOG_MODULE_REGISTER(), LOG_INF(), LOG_ERR(), LOG_DBG()
       - 日志格式化：时间戳、模块名、颜色
       - 性能影响：同步 vs 异步日志、缓冲区大小
       - 完整示例：多模块日志系统配置
    
    2. **Shell 控制台章节**：
       - Shell 架构和命令树结构
       - 配置：CONFIG_SHELL, CONFIG_SHELL_BACKEND_SERIAL
       - 注册命令：SHELL_CMD_REGISTER(), SHELL_STATIC_SUBCMD_SET_CREATE()
       - 命令处理函数：参数解析、返回值
       - 内置命令：kernel, device, log 命令的使用
       - 完整示例：创建自定义 Shell 命令集（sensor 命令组）
       - 运行时调试技巧：查看线程、内存、设备状态
    
    3. **存储子系统章节**：
       - Flash 存储：Flash Map、Flash Area API
       - 文件系统对比表：LittleFS vs FAT（特性、性能、适用场景）
       - LittleFS 使用：挂载、读写文件、目录操作
       - NVS（非易失性存储）：键值对存储、配置参数保存
       - 完整示例 1：使用 LittleFS 存储日志文件
       - 完整示例 2：使用 NVS 保存应用配置
       - 存储性能优化：磨损均衡、缓存策略
    
    4. **低功耗管理章节**：
       - 电源管理架构图（Mermaid）
       - 睡眠模式：Active, Idle, Standby, Suspend
       - 配置：CONFIG_PM, CONFIG_PM_DEVICE
       - 设备电源管理：pm_device_action_run()
       - 唤醒源配置：GPIO 中断、定时器
       - 功耗测量方法和工具
       - 完整示例：实现周期性采集的低功耗应用
       - 优化技巧：外设关闭、时钟降频、DMA 使用
    
    5. **子系统集成章节**：
       - 多子系统协同工作示例
       - 配置文件模板（prj.conf）
       - 性能权衡：功能 vs 资源占用
       - 调试多子系统应用的方法
    
    6. **实操任务**：
       - 任务 1：集成日志和 Shell，实现运行时日志级别调整
       - 任务 2：使用 NVS 保存传感器校准参数
       - 任务 3：实现低功耗数据采集器（周期唤醒、采集、存储、休眠）
    
    **验证清单**：所有子系统可正常工作、包含性能测试数据、提供完整配置文件

- [x] 8. 编写第三阶段内容（高级深耕期 - 源码级理解）
  - [x] 8.1 创建内核源码分析页面（stage3-advanced/kernel-source.md）
    - 启动流程分析
      - 从复位向量到 main 函数
      - 内核初始化过程
      - 启动时序图（Mermaid）
    - 调度器实现
      - 调度算法源码解析
      - 上下文切换机制
      - 优先级队列实现
    - 内存管理实现
      - 堆管理器源码
      - 内存池实现
      - 内存保护机制
    - 源码阅读技巧和工具
    - 关键数据结构解析
    - _Requirements: 5.4, 5.6_
    
    **详细实施步骤**:
    
    创建 `docs/stage3-advanced/kernel-source.md`，包含以下核心内容：
    
    1. **启动流程章节**：
       - 完整启动时序图（Mermaid sequenceDiagram）：Reset -> __start -> z_cstart -> main
       - 汇编启动代码分析：arch/arm/core/cortex_m/reset.S
       - C 启动代码分析：kernel/init.c 中的 z_cstart()
       - 内核初始化阶段：PRE_KERNEL_1, PRE_KERNEL_2, POST_KERNEL, APPLICATION
       - 设备初始化顺序和优先级
       - 源码路径导航和关键函数调用链
    
    2. **调度器实现章节**：
       - 调度器核心数据结构：_kernel, _thread, _ready_q
       - 就绪队列实现：kernel/sched.c 中的优先级位图
       - 调度算法源码：z_reschedule() 函数详解
       - 上下文切换：arch/arm/core/swap.c 分析
       - 时间片轮转：CONFIG_TIMESLICING 实现
       - 源码追踪示例：从 k_sleep() 到调度器的完整路径
    
    3. **内存管理章节**：
       - 堆管理器：lib/heap/heap.c 源码分析
       - k_malloc/k_free 实现机制
       - 内存池：kernel/mempool.c 固定大小块分配
       - 栈管理：线程栈分配和保护
       - MPU/MMU 内存保护实现
       - 内存泄漏检测工具使用
    
    4. **源码阅读技巧章节**：
       - 使用 VS Code + C/C++ 扩展
       - 使用 cscope/ctags 索引
       - 使用 GDB 源码级调试
       - 理解 Zephyr 代码组织结构
       - 追踪宏展开：使用 gcc -E
       - 关键文件和目录导航
    
    5. **关键数据结构章节**：
       - struct k_thread：线程控制块详解
       - struct device：设备结构体
       - struct k_mutex, k_sem, k_msgq 等同步对象
       - 数据结构关系图（Mermaid）
    
    6. **实操任务**：
       - 任务 1：追踪一个系统调用的完整执行路径
       - 任务 2：分析调度器如何选择下一个线程
       - 任务 3：使用 GDB 观察上下文切换过程
    
    **验证清单**：包含源码文件路径、函数调用图、GDB 调试示例

  - [x] 8.2 创建 BSP 移植页面（stage3-advanced/bsp-porting.md）
    - BSP 移植完整流程
      - 移植前的准备工作
      - 硬件抽象层（HAL）适配
    - 设备树移植
      - 为新 SoC 编写设备树
      - 外设节点定义
      - 时钟和引脚配置
    - 驱动适配
      - 复用现有驱动
      - 开发新驱动
    - 启动代码适配
    - 实际移植案例（完整示例）
    - 移植验证和测试
    - 避坑指南：常见移植问题
    - _Requirements: 5.4, 5.6_
    
    **详细实施步骤**:
    
    创建 `docs/stage3-advanced/bsp-porting.md`，包含以下核心内容：
    
    1. **移植准备章节**：
       - 硬件需求分析：CPU 架构、内存、外设清单
       - 参考文档收集：芯片手册、参考设计
       - 选择参考板：找相似的已支持板子
       - 工具准备：调试器、烧录器
       - 移植流程图（Mermaid）
    
    2. **SoC 移植章节**：
       - 创建 SoC 目录结构：soc/arm/vendor/series/
       - 编写 SoC 设备树：soc.dtsi 文件
       - 配置 Kconfig.soc：定义 SoC 选项
       - 配置 CMakeLists.txt：添加源文件
       - 启动代码适配：linker.ld, reset vector
       - 时钟配置：PLL、分频器设置
       - 完整示例：移植 STM32G0 系列
    
    3. **板级移植章节**：
       - 创建板子目录：boards/arm/myboard/
       - 编写板级设备树：myboard.dts
       - 配置 Kconfig.board：定义板子选项
       - 配置 board.cmake：烧录和调试配置
       - 引脚映射：pinmux 配置
       - 外设使能：UART、GPIO、I2C 等
       - 完整示例：创建自定义 STM32 板子
    
    4. **驱动适配章节**：
       - 评估现有驱动：drivers/ 目录浏览
       - 复用驱动：通过设备树绑定
       - 适配驱动：修改寄存器地址、时钟
       - 开发新驱动：参考驱动模板
       - 驱动测试：编写测试程序
    
    5. **移植验证章节**：
       - 编译测试：west build -b myboard samples/hello_world
       - 烧录测试：west flash
       - 功能测试：GPIO、UART、定时器
       - 性能测试：中断延迟、上下文切换
       - 稳定性测试：长时间运行
    
    6. **常见问题章节**：
       - 启动失败：检查 linker script、复位向量
       - 串口无输出：检查时钟、引脚配置
       - 外设不工作：检查设备树、驱动绑定
       - 调试技巧：使用 JTAG、查看寄存器
    
    7. **实操任务**：
       - 任务 1：为 STM32F103 移植 Zephyr（完整流程）
       - 任务 2：为自定义板子编写设备树
       - 任务 3：适配一个新的外设驱动
    
    **验证清单**：包含完整的移植步骤、所有配置文件、测试结果

  - [x] 8.3 创建系统优化页面（stage3-advanced/optimization.md）
    - 系统裁剪
      - 功能模块裁剪策略
      - 减小代码体积
      - 减少内存占用
    - 性能优化
      - CPU 使用率优化
      - 中断延迟优化
      - 内存访问优化
    - 实时性优化
      - 响应时间分析
      - 优先级配置
      - 中断处理优化
    - 性能分析工具使用
    - 优化案例和效果对比
    - _Requirements: 5.4, 5.6_
    
    **详细实施步骤**:
    
    创建 `docs/stage3-advanced/optimization.md`，包含以下核心内容：
    
    1. **系统裁剪章节**：
       - 裁剪策略：从需求出发，只启用必要功能
       - Kconfig 裁剪：禁用未使用的子系统
       - 代码体积优化：CONFIG_SIZE_OPTIMIZATIONS, LTO
       - 内存优化：减小栈大小、使用内存池
       - 裁剪示例：从 100KB 优化到 20KB
       - 优化前后对比表
    
    2. **性能优化章节**：
       - CPU 使用率分析：CONFIG_THREAD_RUNTIME_STATS
       - 减少上下文切换：合并任务、使用工作队列
       - 中断延迟优化：ISR 精简、使用 DMA
       - 内存访问优化：缓存对齐、减少拷贝
       - 编译器优化：-O2, -O3, -Ofast
       - 性能测试工具：benchmark 程序
    
    3. **实时性优化章节**：
       - 实时性需求分析：最坏情况响应时间
       - 优先级分配：Rate Monotonic, Deadline Monotonic
       - 中断优先级配置：关键中断高优先级
       - 禁用抢占：关键代码段保护
       - 实时性测试：中断延迟测量、抖动分析
    
    4. **功耗优化章节**：
       - 功耗分析：测量工具和方法
       - 睡眠模式使用：Idle, Standby, Deep Sleep
       - 外设管理：不用时关闭
       - 时钟管理：动态调频
       - 功耗优化案例：从 10mA 到 10uA
    
    5. **性能分析工具章节**：
       - 内置工具：kernel stats, thread monitor
       - 外部工具：SystemView, Tracealyzer
       - 性能计数器：CPU cycles, cache miss
       - 内存分析：heap usage, stack usage
       - 工具使用示例和结果解读
    
    6. **优化案例章节**：
       - 案例 1：物联网传感器节点优化（功耗）
       - 案例 2：电机控制系统优化（实时性）
       - 案例 3：数据采集器优化（性能）
       - 每个案例包含：优化前后对比、具体措施、测试数据
    
    7. **实操任务**：
       - 任务 1：优化 hello_world，减小到最小体积
       - 任务 2：优化多线程应用，降低 CPU 使用率
       - 任务 3：优化低功耗应用，实现 < 100uA 平均功耗
    
    **验证清单**：包含测试数据、优化前后对比、性能分析报告

  - [x] 8.4 创建安全与合规页面（stage3-advanced/security.md）
    - 安全启动（Secure Boot）
      - 启动链信任
      - 固件签名和验证
      - 密钥管理
    - OTA 升级
      - 固件升级流程
      - A/B 分区方案
      - 升级失败回滚
    - 功能安全（Functional Safety）
      - 安全认证标准（IEC 61508）
      - 故障检测和处理
      - 安全相关配置
    - 安全最佳实践
    - 实际安全方案设计
    - _Requirements: 5.4, 5.6_
    
    **详细实施步骤**:
    
    1. **安全启动章节**：安全启动流程图（Mermaid：ROM -> Bootloader -> App）、MCUboot 集成（配置和使用）、固件签名（imgtool 签名）、密钥管理（公钥存储、私钥保护）、信任链建立（每级验证下一级）、完整示例（配置 MCUboot 安全启动）
    
    2. **OTA 升级章节**：OTA 架构图（Mermaid）、升级流程（下载 -> 验证 -> 安装 -> 重启）、A/B 分区方案（双镜像切换）、升级失败回滚（watchdog + 版本检查）、增量升级（差分包生成）、完整示例（实现 MQTT OTA 升级）
    
    3. **加密和认证章节**：TLS/DTLS 配置（mbedTLS 集成）、对称加密（AES 使用示例）、非对称加密（RSA/ECC 使用）、哈希算法（SHA256 完整性校验）、随机数生成（硬件 RNG）、安全存储（加密 Flash、安全元素）
    
    4. **功能安全章节**：IEC 61508 标准简介、安全完整性等级（SIL）、故障检测（watchdog、CRC、ECC）、故障处理（安全状态、故障记录）、安全相关配置（CONFIG_ASSERT、CONFIG_STACK_SENTINEL）、认证准备（文档、测试、审计）
    
    5. **安全最佳实践章节**：输入验证（防止缓冲区溢出）、权限最小化（最小权限原则）、安全编码（避免常见漏洞）、定期更新（修复安全漏洞）、安全审计（代码审查、渗透测试）
    
    6. **实操任务**：任务 1（配置 MCUboot 实现安全启动）、任务 2（实现固件 OTA 升级功能）、任务 3（集成 TLS 实现安全通信）
    
    **验证清单**：安全功能可工作、包含测试用例、提供安全配置清单
       - 安全相关配置：CONFIG_ASSERT, CONFIG_STACK_SENTINEL
       - 认证准备：文档、测试、审计
    
    5. **安全最佳实践章节**：
       - 输入验证：防止缓冲区溢出
       - 权限最小化：最小权限原则
       - 安全编码：避免常见漏洞
       - 定期更新：修复安全漏洞
       - 安全审计：代码审查、渗透测试
    
    6. **实操任务**：
       - 任务 1：配置 MCUboot 实现安全启动
       - 任务 2：实现固件 OTA 升级功能
       - 任务 3：集成 TLS 实现安全通信
    
    **验证清单**：安全功能可工作、包含测试用例、提供安全配置清单
      - 为新 SoC 编写设备树
      - 外设节点定义
      - 时钟和引脚配置
    - 驱动适配
      - 复用现有驱动
      - 开发新驱动
    - 启动代码适配
    - 实际移植案例（完整示例）
    - 移植验证和测试
    - 避坑指南：常见移植问题
    - _Requirements: 5.4, 5.6_

- [ ] 9. 编写第四阶段内容（专业精通期 - 能力体系构建）
  - [x] 9.1 创建架构设计页面（stage4-expert/architecture-design.md）
    - 行业解决方案设计
      - 智能家居系统架构
      - 工业物联网方案
      - 可穿戴设备架构
    - 高可靠系统设计
      - 冗余设计
      - 故障检测和恢复
      - 系统监控
    - 异构多核系统开发
      - 多核通信机制
      - 任务分配策略
      - 资源共享管理
    - 架构设计最佳实践
    - 实际项目案例分析
    - 架构评审要点
    - _Requirements: 5.5, 5.6_
    
    **详细实施步骤**:
    
    创建 `docs/stage4-expert/architecture-design.md`，包含以下核心内容：
    
    1. **智能家居系统架构章节**：
       - 系统架构图（Mermaid）：网关 + 传感器节点 + 云平台
       - 通信协议选择：Zigbee, Thread, BLE Mesh
       - 网关设计：协议转换、本地控制、云端同步
       - 传感器节点：低功耗设计、OTA 升级
       - 安全设计：设备认证、数据加密
       - 完整案例：基于 Zephyr 的智能家居网关
    
    2. **工业物联网方案章节**：
       - 工业 IoT 架构图（Mermaid）：边缘计算 + 云平台
       - 实时性要求：确定性调度、时间同步
       - 可靠性设计：冗余、故障转移
       - 数据采集：多传感器融合、高速采集
       - 边缘计算：本地分析、预测性维护
       - 完整案例：工业设备监控系统
    
    3. **可穿戴设备架构章节**：
       - 可穿戴设备架构图（Mermaid）
       - 超低功耗设计：动态功耗管理
       - 传感器融合：IMU、心率、GPS
       - 用户交互：触摸、语音、振动
       - 数据同步：BLE 与手机 App
       - 完整案例：智能手环系统设计
    
    4. **高可靠系统设计章节**：
       - 冗余设计：硬件冗余、软件冗余
       - 故障检测：watchdog、健康检查、异常监控
       - 故障恢复：自动重启、状态恢复、降级运行
       - 系统监控：日志记录、性能监控、远程诊断
       - 可靠性测试：压力测试、长时间运行
    
    5. **异构多核系统章节**：
       - 多核架构图（Mermaid）：Cortex-M + Cortex-A
       - 核间通信：共享内存、消息传递、RPMsg
       - 任务分配：实时任务 vs 非实时任务
       - 资源共享：互斥访问、DMA 协调
       - 完整案例：双核电机控制系统
    
    6. **架构设计最佳实践章节**：
       - 模块化设计：高内聚低耦合
       - 接口设计：清晰的 API 定义
       - 可扩展性：插件机制、配置化
       - 可测试性：单元测试、集成测试
       - 文档化：架构文档、接口文档
    
    7. **架构评审要点章节**：
       - 功能完整性：需求覆盖
       - 性能指标：响应时间、吞吐量
       - 可靠性：MTBF、故障恢复
       - 安全性：威胁模型、安全措施
       - 可维护性：代码质量、文档完整性
    
    8. **实操任务**：
       - 任务 1：设计一个智能家居网关系统架构
       - 任务 2：设计一个工业数据采集系统
       - 任务 3：进行架构评审并输出评审报告
    
    **验证清单**：包含完整架构图、设计文档、评审清单

  - [x] 9.2 创建社区贡献页面（stage4-expert/community-contribution.md）
    - Zephyr 社区介绍
      - 社区组织结构
      - 技术委员会和工作组
    - 贡献代码流程
      - GitHub 工作流程
      - 代码规范和风格
      - 提交 Pull Request
      - Code Review 流程
    - 社区参与方式
      - 邮件列表和论坛
      - 技术会议和活动
      - Bug 报告和功能建议
    - 技术工作组介绍
      - 如何加入工作组
      - 工作组职责
    - 成为 Maintainer 的路径
    - 实际贡献案例
    - _Requirements: 5.5, 5.6_
    
    **详细实施步骤**:
    
    创建 `docs/stage4-expert/community-contribution.md`，包含以下核心内容：
    
    1. **Zephyr 社区介绍章节**：
       - 社区组织结构图（Mermaid）
       - Linux Foundation 角色
       - 技术指导委员会（TSC）
       - 架构工作组（AWG）
       - 安全工作组、测试工作组等
       - 主要贡献公司和个人
    
    2. **贡献代码流程章节**：
       - GitHub 工作流程图（Mermaid）
       - Fork 仓库和创建分支
       - 代码规范：命名、格式、注释
       - Commit 消息规范：标题、正文、签名
       - 提交 PR：描述、测试、文档
       - Code Review：响应评审意见
       - 合并流程：CI 检查、Maintainer 批准
       - 完整示例：提交一个 Bug 修复
    
    3. **社区参与方式章节**：
       - 邮件列表：订阅、发帖、礼仪
       - GitHub Discussions：提问、讨论
       - Discord/Slack：实时交流
       - 技术会议：Zephyr Developer Summit
       - Bug 报告：如何写好 Bug 报告
       - 功能建议：RFC 流程
    
    4. **技术工作组章节**：
       - 工作组列表和职责
       - 如何加入工作组
       - 工作组会议和决策流程
       - 贡献机会：文档、测试、代码
    
    5. **成为 Maintainer 章节**：
       - Maintainer 职责和权限
       - 成为 Maintainer 的路径
       - 持续贡献和建立信任
       - Maintainer 最佳实践
    
    6. **贡献案例章节**：
       - 案例 1：修复一个 Bug
       - 案例 2：添加新的驱动
       - 案例 3：改进文档
       - 案例 4：参与 RFC 讨论
       - 每个案例包含完整流程和经验分享
    
    7. **实操任务**：
       - 任务 1：在 GitHub 上提交一个 Issue
       - 任务 2：修复一个 Good First Issue 并提交 PR
       - 任务 3：参与一次社区讨论或会议
    
    **验证清单**：包含社区链接、贡献指南、实际贡献示例

  - [x] 9.3 创建技术布道页面（stage4-expert/technical-evangelism.md）
    - 技术分享方法
      - 如何准备技术演讲
      - 博客写作技巧
      - 视频教程制作
    - 文档编写规范
      - 技术文档结构
      - 中文技术写作规范
      - 示例代码编写
    - 团队技术建设
      - 技术培训体系
      - 知识库建设
      - 技术氛围营造
    - 开源项目维护
      - 项目管理
      - 社区运营
    - 个人技术品牌建设
    - _Requirements: 5.5, 5.6_
    
    **详细实施步骤**:
    
    创建 `docs/stage4-expert/technical-evangelism.md`，包含以下核心内容：
    
    1. **技术演讲章节**：
       - 演讲准备：选题、大纲、PPT 设计
       - 演讲技巧：开场、节奏、互动
       - Demo 准备：确保可靠性
       - Q&A 处理：常见问题准备
       - 演讲工具：PPT、Keynote、Reveal.js
       - 完整示例：一次 Zephyr 技术分享的准备过程
    
    2. **博客写作章节**：
       - 选题策略：技术深度 vs 实用性
       - 文章结构：引言、正文、总结
       - 写作技巧：清晰、简洁、有例子
       - 代码示例：完整、可运行、有注释
       - SEO 优化：标题、关键词、链接
       - 发布平台：个人博客、掘金、CSDN
       - 完整示例：一篇 Zephyr 技术博客的写作过程
    
    3. **视频教程章节**：
       - 视频规划：系列规划、单集时长
       - 录制工具：OBS、Camtasia
       - 录制技巧：声音、画面、节奏
       - 后期制作：剪辑、字幕、封面
       - 发布平台：B站、YouTube
       - 完整示例：制作一个 Zephyr 入门视频
    
    4. **技术文档编写章节**：
       - 文档类型：教程、参考、指南
       - 文档结构：目录、章节、索引
       - 中文写作规范：标点、术语、排版
       - 示例代码规范：格式、注释、测试
       - 文档工具：MkDocs、Sphinx、GitBook
       - 完整示例：编写一份 Zephyr 驱动开发指南
    
    5. **团队技术建设章节**：
       - 技术培训体系：新人培训、进阶培训
       - 知识库建设：Wiki、文档库、代码库
       - 技术分享会：定期分享、主题讨论
       - Code Review 文化：规范、工具、流程
       - 技术氛围营造：鼓励学习、容忍失败
    
    6. **开源项目维护章节**：
       - 项目管理：版本规划、Issue 管理
       - 社区运营：用户支持、贡献者管理
       - 文档维护：保持更新、多语言
       - 持续集成：自动化测试、发布
       - 项目推广：社交媒体、技术会议
    
    7. **个人品牌建设章节**：
       - 技术博客：持续输出
       - 开源贡献：GitHub 活跃度
       - 社交媒体：Twitter、知乎、微信公众号
       - 技术会议：演讲、参与
       - 个人网站：作品集、简历
    
    8. **实操任务**：
       - 任务 1：撰写一篇 Zephyr 技术博客并发布
       - 任务 2：准备一次技术分享（PPT + Demo）
       - 任务 3：为团队建立一个技术知识库
    
    **验证清单**：包含实际作品、发布链接、反馈收集

- [ ] 10. 编写通用学习黄金法则内容（学习方法论）
  - [x] 10.1 创建学习方法页面（learning-principles/index.md）
    - 官方文档优先原则
      - 为什么要读官方文档
      - 如何高效阅读官方文档
      - 官方文档的结构和导航
    - 实操为王原则
      - 动手实践的重要性
      - 如何设计实操任务
      - 从示例到项目的进阶
    - 循序渐进原则
      - 学习路径规划
      - 避免跳跃式学习
      - 知识点的依赖关系
    - 看源码方法
      - 源码阅读工具和技巧
      - 如何追踪代码执行流程
      - 理解设计意图
    - 善用社区资源
      - 如何提问和搜索
      - 社区资源导航
      - 建立学习网络
    - 学习效率提升技巧
    - 常见学习误区
    - _Requirements: 5.7_
    
    **详细实施步骤**:
    
    创建 `docs/learning-principles/index.md`，包含以下核心内容：
    
    1. **官方文档优先原则章节**：
       - 为什么官方文档最权威：第一手信息、持续更新
       - Zephyr 官方文档结构：Getting Started、Kernel、Drivers、Subsystems
       - 高效阅读方法：目标导向、跳读、做笔记
       - 文档导航技巧：搜索、索引、交叉引用
       - 官方文档 vs 第三方教程：优缺点对比
       - 实践建议：遇到问题先查官方文档
    
    2. **实操为王原则章节**：
       - 学习金字塔：实践的记忆留存率最高
       - 动手实践的重要性：理论 vs 实践
       - 如何设计实操任务：从简单到复杂
       - 从示例到项目：hello_world -> blinky -> 实际项目
       - 调试即学习：通过解决问题深入理解
       - 实践建议：每学一个知识点就写代码验证
    
    3. **循序渐进原则章节**：
       - 学习路径规划：前置知识 -> 基础 -> 进阶 -> 高级
       - 知识依赖图（Mermaid）：展示知识点之间的依赖关系
       - 避免跳跃式学习：打好基础再进阶
       - 学习节奏：每天进步一点点
       - 复习和巩固：间隔重复
       - 实践建议：按照本平台的学习路径顺序学习
    
    4. **看源码方法章节**：
       - 为什么要看源码：理解实现、学习设计
       - 源码阅读工具：VS Code、cscope、ctags
       - 源码阅读技巧：从宏观到微观、从接口到实现
       - 追踪代码执行：使用 GDB、添加 printk
       - 理解设计意图：注释、提交历史、设计文档
       - 实践建议：从简单的函数开始，逐步深入
    
    5. **善用社区资源章节**：
       - 如何提问：描述清楚、提供上下文、展示尝试
       - 搜索技巧：Google、GitHub、Stack Overflow
       - 社区资源导航：
         - 官方：文档、邮件列表、GitHub
         - 第三方：博客、视频、论坛
       - 建立学习网络：加入社区、参与讨论
       - 实践建议：先搜索再提问，积极参与社区
    
    6. **学习效率提升章节**：
       - 时间管理：番茄工作法、时间块
       - 专注力：减少干扰、深度工作
       - 笔记方法：Markdown、思维导图
       - 知识管理：建立个人知识库
       - 学习工具：Anki、Notion、Obsidian
    
    7. **常见学习误区章节**：
       - 误区 1：只看不练（纸上谈兵）
       - 误区 2：跳跃式学习（基础不牢）
       - 误区 3：过度依赖教程（不看官方文档）
       - 误区 4：遇到问题就放弃（缺乏耐心）
       - 误区 5：孤军奋战（不利用社区）
       - 如何避免：具体建议和方法
    
    8. **学习路线图章节**：
       - 完整学习路线图（Mermaid）
       - 各阶段学习重点和时间安排
       - 学习检查点：如何评估学习效果
       - 学习资源推荐：书籍、课程、项目
    
    9. **实操任务**：
       - 任务 1：制定个人学习计划
       - 任务 2：建立个人技术笔记系统
       - 任务 3：在社区提一个高质量的问题
    
    **验证清单**：包含学习方法论、实践建议、资源链接

- [x] 11. 实现内部链接和交叉引用
  - [x] 11.1 在内容中添加内部链接
    - 在各阶段内容中添加相关主题的链接
    - 在前置知识中链接到对应的学习阶段
    - 确保所有链接使用相对路径
    - _Requirements: 1.5_

  - [x] 11.2 添加外部资源链接
    - 链接到 Zephyr 官方文档
    - 链接到相关教程和视频
    - 链接到 GitHub 仓库
    - _Requirements: 1.5_

- [ ]* 11.3 编写属性测试：内部链接解析有效性
  - **Property 4: 内部链接解析有效性**
  - **Validates: Requirements 1.5**

- [x] 12. 实现搜索功能
  - [x] 12.1 配置搜索插件
    - 启用中文分词
    - 配置搜索权重（标题优先于正文）
    - 启用搜索建议和高亮
    - _Requirements: 4.1, 4.2, 4.4, 4.5_

  - [x] 12.2 优化搜索索引
    - 配置预构建索引
    - 优化索引大小
    - 测试搜索性能
    - _Requirements: 4.1, 4.6_

- [ ]* 12.3 编写属性测试：搜索索引完整性
  - **Property 11: 搜索索引完整性**
  - **Validates: Requirements 4.1**

- [ ]* 12.4 编写属性测试：搜索功能准确性
  - **Property 12: 搜索功能准确性**
  - **Validates: Requirements 4.2**

- [ ]* 12.5 编写属性测试：多语言搜索支持
  - **Property 13: 多语言搜索支持**
  - **Validates: Requirements 4.4**

- [ ]* 12.6 编写属性测试：搜索结果相关性排序
  - **Property 14: 搜索结果相关性排序**
  - **Validates: Requirements 4.5**

- [x] 13. 实现导航功能
  - [x] 13.1 配置导航特性
    - 启用即时加载
    - 启用锚点跟踪
    - 启用返回顶部按钮
    - 配置导航展开行为
    - _Requirements: 3.1, 3.2, 3.4, 3.5, 3.6_

  - [x] 13.2 测试导航功能
    - 验证导航菜单结构
    - 验证面包屑导航
    - 验证上下页链接
    - 验证目录大纲
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

- [ ]* 13.3 编写属性测试：导航菜单结构一致性
  - **Property 6: 导航菜单结构一致性**
  - **Validates: Requirements 2.4, 3.2**

- [ ]* 13.4 编写属性测试：页面导航链接完整性
  - **Property 9: 页面导航链接完整性**
  - **Validates: Requirements 3.4**

- [ ]* 13.5 编写属性测试：面包屑导航路径正确性
  - **Property 10: 面包屑导航路径正确性**
  - **Validates: Requirements 3.5**

- [x] 14. 添加多媒体内容支持
  - [x] 14.1 添加图片资源
    - 在 assets/images/ 中添加示意图
    - 在内容中引用图片
    - 优化图片大小
    - _Requirements: 9.1_

  - [x] 14.2 添加 Mermaid 图表
    - 在内容中添加架构图
    - 添加流程图
    - 添加时序图
    - _Requirements: 9.2, 9.3_

  - [x] 14.3 添加视频嵌入（可选）
    - 嵌入教学视频链接
    - 配置视频播放器
    - _Requirements: 9.4_

- [ ]* 14.4 编写属性测试：图片嵌入正确性
  - **Property 23: 图片嵌入正确性**
  - **Validates: Requirements 9.1**

- [x] 15. 实现 Git 集成功能
  - [x] 15.1 配置 Git 修订日期插件
    - 显示最后更新时间
    - 配置时间格式
    - _Requirements: 10.3_

  - [x] 15.2 配置编辑链接
    - 设置 repo_url 和 edit_uri
    - 在页面底部显示"编辑此页"链接
    - _Requirements: 10.4_

- [ ]* 15.3 编写属性测试：页面元数据显示完整性
  - **Property 25: 页面元数据显示完整性**
  - **Validates: Requirements 10.3, 10.4**

- [x] 16. 实现构建和部署功能
  - [x] 16.1 创建构建脚本
    - 编写本地构建脚本
    - 编写部署脚本
    - 添加构建验证
    - _Requirements: 7.1, 7.2_

  - [x] 16.2 配置 GitHub Actions CI/CD
    - 创建 .github/workflows/build.yml
    - 配置自动构建和测试
    - 配置自动部署到 GitHub Pages
    - _Requirements: 7.5, 12.5_

  - [x] 16.3 编写部署文档
    - 创建 README.md
    - 说明本地开发流程
    - 说明部署流程
    - _Requirements: 7.6_

- [ ]* 16.4 编写属性测试：Markdown 到 HTML 转换完整性
  - **Property 5: Markdown 到 HTML 转换完整性**
  - **Validates: Requirements 2.2**

- [ ]* 16.5 编写属性测试：静态文件可移植性
  - **Property 20: 静态文件可移植性**
  - **Validates: Requirements 7.5**

- [-] 17. 实现内容质量检查工具
  - [ ] 17.1 配置链接检查
    - 安装 mkdocs-linkcheck 插件
    - 配置链接检查规则
    - 测试链接检查功能
    - _Requirements: 12.1, 12.2_

  - [ ] 17.2 配置拼写检查
    - 安装 codespell 工具
    - 配置拼写检查规则
    - 创建自定义词典
    - _Requirements: 12.3_

  - [ ] 17.3 创建格式检查脚本
    - 检查标题层级
    - 检查代码块语言标识
    - 检查列表格式
    - _Requirements: 12.4_

- [ ]* 17.4 编写属性测试：链接有效性检查
  - **Property 30: 链接有效性检查**
  - **Validates: Requirements 12.2**

- [ ]* 17.5 编写属性测试：格式一致性验证
  - **Property 31: 格式一致性验证**
  - **Validates: Requirements 12.4**

- [ ] 18. 性能优化
  - [x] 18.1 启用压缩优化
    - 配置 mkdocs-minify-plugin
    - 压缩 HTML、CSS、JavaScript
    - _Requirements: 11.1_

  - [x] 18.2 优化图片加载
    - 压缩图片文件
    - 配置图片懒加载（如果支持）
    - _Requirements: 9.5_

  - [x] 18.3 测试页面加载性能
    - 测量首次加载时间
    - 测量页面大小
    - 优化性能瓶颈
    - _Requirements: 11.1_

- [ ]* 18.4 编写属性测试：页面加载性能
  - **Property 26: 页面加载性能**
  - **Validates: Requirements 11.1**

- [ ] 19. 用户体验优化
  - [ ] 19.1 配置主题特性
    - 配置深色/浅色模式切换
    - 配置代码复制按钮
    - 配置打印样式
    - _Requirements: 11.3, 8.3, 11.6_

  - [ ] 19.2 测试用户体验
    - 测试导航流畅性
    - 测试搜索体验
    - 测试移动端适配
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ]* 19.3 编写属性测试：主题模式配置完整性
  - **Property 27: 主题模式配置完整性**
  - **Validates: Requirements 11.3**

- [ ]* 19.4 编写属性测试：页面目录大纲生成
  - **Property 28: 页面目录大纲生成**
  - **Validates: Requirements 11.4**

- [ ]* 19.5 编写属性测试：打印样式支持
  - **Property 29: 打印样式支持**
  - **Validates: Requirements 11.6**

- [ ] 20. 最终测试和验证
  - [ ] 20.1 运行完整的测试套件
    - 运行所有单元测试
    - 运行所有属性测试
    - 运行集成测试
    - _Requirements: All_

  - [ ] 20.2 执行端到端验证
    - 验证所有页面可访问
    - 验证所有链接有效
    - 验证搜索功能正常
    - 验证导航功能正常
    - _Requirements: All_

  - [ ] 20.3 性能和质量验证
    - 验证页面加载性能
    - 验证内容质量
    - 验证移动端体验
    - _Requirements: 11.1, 12.1, 12.2, 12.3, 12.4_

- [x] 21. 实现学习进度跟踪功能
  - [x] 21.1 开发进度跟踪 JavaScript 模块
    - 创建 progress-tracker.js 文件
    - 实现页面访问记录功能（使用 localStorage）
    - 实现进度数据结构（visitedPages、completedStages、lastVisit）
    - 实现进度计算逻辑（阶段完成百分比）
    - _Requirements: 14.1, 14.6_

  - [x] 21.2 实现进度显示功能
    - 在导航菜单中标记已访问页面（添加 ✓ 图标）
    - 在阶段索引页显示进度条和完成百分比
    - 在首页显示整体学习进度概览
    - 实现进度数据可视化（使用进度条或图表）
    - _Requirements: 14.2, 14.3, 14.4_

  - [x] 21.3 实现进度管理功能
    - 添加"重置进度"按钮和确认对话框
    - 实现进度导出功能（JSON 格式下载）
    - 实现进度导入功能（文件上传）
    - 添加阶段完成祝贺提示
    - _Requirements: 14.5, 14.7_

  - [x] 21.4 集成进度跟踪到主题
    - 在 mkdocs.yml 中配置自定义 JavaScript
    - 在页面模板中添加进度跟踪初始化代码
    - 添加进度显示相关的 CSS 样式
    - 测试进度跟踪功能在不同浏览器中的兼容性
    - _Requirements: 14.1, 14.2, 14.3_

- [ ]* 21.5 编写属性测试：学习进度记录准确性
  - **Property 34: 学习进度记录准确性**
  - **Validates: Requirements 14.1, 14.6**

- [ ]* 21.6 编写属性测试：进度显示一致性
  - **Property 35: 进度显示一致性**
  - **Validates: Requirements 14.2, 14.3**

- [ ] 22. 集成社区互动功能
  - [ ] 22.1 配置评论系统
    - 选择评论系统方案（Giscus 基于 GitHub Discussions 或 Utterances 基于 GitHub Issues）
    - 在 mkdocs.yml 中配置评论插件
    - 在页面模板中添加评论区
    - 配置评论主题和样式
    - _Requirements: 15.1_

  - [ ] 22.2 添加反馈功能
    - 在每个页面添加"报告问题"链接，指向 GitHub Issues
    - 配置 Issue 模板，包含页面信息和问题分类
    - 添加"内容有用"点赞按钮（使用 localStorage 记录）
    - 显示点赞统计（可选，需要后端支持）
    - _Requirements: 15.2, 15.4, 15.6_

  - [ ] 22.3 添加社区统计展示
    - 在首页显示 GitHub 仓库统计（Stars、Forks、Contributors）
    - 使用 GitHub API 获取贡献者信息
    - 显示最近更新时间和更新频率
    - 添加"加入我们"行动号召按钮
    - _Requirements: 15.5_

  - [ ] 22.4 配置页面访问统计（可选）
    - 选择统计方案（Google Analytics 或 Plausible 等隐私友好方案）
    - 配置统计代码
    - 在页面显示阅读次数（如果统计服务支持）
    - 确保符合隐私保护要求
    - _Requirements: 15.3_

- [ ]* 22.5 编写属性测试：社区互动功能可用性
  - **Property 36: 社区互动功能可用性**
  - **Validates: Requirements 15.1, 15.4**

- [ ] 23. 文档和交付
  - [ ] 23.1 完善项目文档
    - 更新 README.md，包含项目简介、快速开始和部署说明
    - 编写贡献指南（CONTRIBUTING.md），体现"开放协作"精神
    - 编写维护文档，说明内容更新和质量检查流程
    - 添加进度跟踪和社区互动功能的使用说明
    - _Requirements: 7.6, 13.5_

  - [ ] 23.2 准备发布
    - 创建初始版本标签
    - 部署到生产环境
    - 验证生产环境功能（包括进度跟踪和评论系统）
    - 进行最终的用户验收测试
    - _Requirements: 7.5_

## Notes

### 任务执行说明

- 任务标记 `*` 的为可选任务，可以跳过以加快 MVP 开发
- 每个任务都引用了具体的需求编号，确保可追溯性
- 属性测试任务标注了对应的设计文档属性编号
- 建议按顺序执行任务，确保依赖关系正确
- 在关键节点（任务 4、11、16、20、23）进行检查点验证

### 新增功能说明

**学习进度跟踪（任务 21）**：
- 优先级：中等（可作为 MVP 后的增强功能）
- 技术方案：纯客户端实现，使用 localStorage，无需服务器
- 用户价值：提升学习动力，帮助学习者了解学习进展
- 实现复杂度：中等，需要自定义 JavaScript 和 CSS

**社区互动功能（任务 22）**：
- 优先级：中等（评论系统）到低（访问统计）
- 技术方案：使用 GitHub Discussions/Issues 作为后端，保持静态站点特性
- 用户价值：促进学习者交流，收集内容反馈，建设社区
- 实现复杂度：低到中等，主要是集成第三方服务

### 系统性保证

为确保"最系统"的目标，所有内容创建任务都遵循以下原则：

1. **完整性**：覆盖从前置知识到专业精通的完整学习路径
2. **结构化**：每个阶段都包含核心目标、学习内容、实操任务、避坑指南
3. **连贯性**：前后章节有明确的依赖关系和知识递进
4. **深度**：不仅讲"是什么"，更讲"为什么"和"怎么做"

### 实用性保证

为确保"最实用"的目标，所有内容创建任务都强调：

1. **实操导向**：每个阶段都有必做实操任务和代码示例
2. **问题驱动**：包含避坑指南和常见问题解决方案
3. **案例丰富**：提供实际项目案例和最佳实践
4. **工具支持**：详细的工具使用说明和调试技巧

### 中文优化

为降低中文开发者的学习门槛：

1. **术语规范**：统一中文技术术语翻译
2. **表达清晰**：使用中文开发者熟悉的表达方式
3. **搜索优化**：配置中文分词，提升搜索准确性
4. **本地化**：考虑中国开发者的实际开发环境和工具链

### 质量标准

每个内容页面都应达到以下质量标准：

- 包含 YAML Front Matter 元数据（标题、标签、难度、预计时间）
- 使用 Markdown 扩展语法（代码高亮、Mermaid 图表、Admonitions）
- 提供实际可运行的代码示例
- 包含清晰的截图或图表说明
- 经过拼写检查和格式一致性检查
- 所有链接有效且指向正确位置
