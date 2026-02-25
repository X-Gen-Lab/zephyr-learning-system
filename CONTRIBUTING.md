# 贡献指南 | Contributing Guide

欢迎来到 Zephyr RTOS 学习系统项目！我们热烈欢迎各种形式的贡献，无论是修复错误、改进文档、添加新内容，还是提出建议，都对项目有很大帮助。

Welcome to the Zephyr RTOS Learning System! We warmly welcome all forms of contributions, whether it's fixing bugs, improving documentation, adding new content, or making suggestions.

---

## 📋 目录 | Table of Contents

- [行为准则](#行为准则--code-of-conduct)
- [如何贡献](#如何贡献--how-to-contribute)
- [内容编写规范](#内容编写规范--content-writing-standards)
- [提交流程](#提交流程--submission-process)
- [代码审查标准](#代码审查标准--code-review-standards)
- [获取帮助](#获取帮助--getting-help)

---

## 行为准则 | Code of Conduct

### 我们的承诺

为了营造一个开放和友好的环境，我们作为贡献者和维护者承诺：无论年龄、体型、残疾、种族、性别认同和表达、经验水平、国籍、个人外貌、种族、宗教或性取向如何，参与我们的项目和社区的每个人都不会受到骚扰。

### 我们的标准

有助于创造积极环境的行为包括：

- ✅ 使用友好和包容的语言
- ✅ 尊重不同的观点和经验
- ✅ 优雅地接受建设性批评
- ✅ 关注对社区最有利的事情
- ✅ 对其他社区成员表现出同理心

不可接受的行为包括：

- ❌ 使用性化的语言或图像，以及不受欢迎的性关注或挑逗
- ❌ 恶意评论、侮辱性/贬损性评论以及人身或政治攻击
- ❌ 公开或私下骚扰
- ❌ 未经明确许可发布他人的私人信息
- ❌ 在专业环境中可能被合理认为不适当的其他行为

### 我们的责任

项目维护者有责任澄清可接受行为的标准，并对任何不可接受的行为采取适当和公平的纠正措施。

---

## 如何贡献 | How to Contribute

### 1. 报告问题 | Reporting Issues

如果你发现了错误、有改进建议或想要请求新功能：

**步骤**：

1. **搜索现有 Issue**：首先检查是否已有类似的 Issue
2. **创建新 Issue**：如果没有找到相关 Issue，创建一个新的
3. **提供详细信息**：
   - 清楚描述问题或建议
   - 如果是错误，提供复现步骤
   - 包含相关的截图或日志
   - 说明你的环境（操作系统、Python 版本等）
4. **添加标签**：选择合适的标签（bug、enhancement、documentation 等）

**Issue 模板示例**：

```markdown
**问题描述**
简短描述问题

**复现步骤**
1. 进入 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 看到错误

**预期行为**
描述你期望发生什么

**实际行为**
描述实际发生了什么

**截图**
如果适用，添加截图帮助解释问题

**环境**
- 操作系统: [例如 Windows 11]
- Python 版本: [例如 3.10.0]
- MkDocs 版本: [例如 1.5.0]

**附加信息**
添加任何其他相关信息
```

### 2. 贡献内容 | Contributing Content

#### 准备工作

**Fork 和克隆项目**：

```bash
# 1. Fork 项目到你的 GitHub 账户（在 GitHub 网页上点击 Fork 按钮）

# 2. 克隆你的 Fork 到本地
git clone https://github.com/YOUR_USERNAME/zephyr-learning-system.git
cd zephyr-learning-system

# 3. 添加上游仓库
git remote add upstream https://github.com/example/zephyr-learning-system.git

# 4. 创建新分支
git checkout -b feature/your-feature-name
# 或者修复 bug 时使用
git checkout -b fix/bug-description
```

**安装依赖**：

```bash
# 创建虚拟环境（推荐）
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

**验证安装**：

```bash
# 启动本地服务器
mkdocs serve

# 在浏览器中访问 http://127.0.0.1:8000
# 如果能看到网站，说明安装成功
```

#### 贡献类型

**A. 添加新知识模块**
适用于创建全新的知识内容模块。

**B. 改进现有内容**
适用于修正错误、补充信息、改进表达等。

**C. 添加代码示例**
适用于为现有模块添加实际代码示例。

**D. 修复错误**
适用于修复文档中的错误、失效链接等。

**E. 改进基础设施**
适用于改进构建脚本、测试、CI/CD 等。

---

## 内容编写规范 | Content Writing Standards

### 文件命名规范

**规则**：
- 使用小写字母
- 单词之间使用连字符（kebab-case）
- 使用描述性名称
- 文件扩展名为 `.md`

**示例**：

```
✅ 正确：task-scheduling.md
✅ 正确：memory-management.md
✅ 正确：west-tool-usage.md

❌ 错误：TaskScheduling.md
❌ 错误：task_scheduling.md
❌ 错误：ts.md
```

### 目录结构规范

新内容应放置在适当的目录中：

```
docs/
├── prerequisites/           # 前置必备知识
│   ├── c-language.md
│   ├── embedded-basics.md
│   ├── rtos-concepts.md
│   └── tools.md
├── stage1-foundation/       # 第一阶段：入门筑基期
├── stage2-intermediate/     # 第二阶段：进阶实战期
├── stage3-advanced/         # 第三阶段：高级深耕期
├── stage4-expert/           # 第四阶段：专业精通期
├── learning-principles/     # 通用学习黄金法则
└── assets/                  # 资源文件
    ├── images/              # 图片
    └── diagrams/            # 图表
```

### Markdown 格式规范

#### 标题层级

```markdown
# 一级标题（文件标题，每个文件只有一个）

## 二级标题（主要章节）

### 三级标题（子章节）

#### 四级标题（详细内容）
```

**规则**：
- 不要跳过标题层级
- 标题后空一行再开始内容
- 使用描述性标题，避免"简介"、"概述"等通用词

#### 代码块

**指定语言**：

````markdown
```c
// C 语言代码
#include <zephyr/kernel.h>

void main(void) {
    printk("Hello, Zephyr!\n");
}
```

```python
# Python 代码
def example():
    print("Hello, World!")
```

```bash
# Shell 脚本
west build -b nrf52840dk_nrf52840
```
````

**支持的语言标识**：
- `c` - C 语言
- `cpp` - C++
- `python` - Python
- `bash` - Shell 脚本
- `yaml` - YAML 配置
- `json` - JSON 数据
- `makefile` - Makefile
- `devicetree` - 设备树
- `kconfig` - Kconfig 配置

#### 强调和提示框

使用 MkDocs Material 的 admonition 扩展：

```markdown
!!! note "提示"
    这是一个提示信息

!!! tip "最佳实践"
    这是最佳实践建议

!!! warning "注意事项"
    这是需要注意的内容

!!! danger "严重错误"
    这是可能导致严重后果的错误

!!! example "实际应用示例"
    实际应用的例子

!!! info "Zephyr 开发注意事项"
    Zephyr 特定的考虑事项
```

#### 折叠内容

用于自测问题和答案：

```markdown
??? question "问题描述"
    问题的详细内容

??? success "答案"
    答案和解析
```

#### 链接

**内部链接**（使用相对路径）：

```markdown
[相关模块](../stage1-foundation/west-tool.md)
[返回首页](../index.md)
```

**外部链接**：

```markdown
[Zephyr 官网](https://www.zephyrproject.org/)
[Zephyr 文档](https://docs.zephyrproject.org/)
```

#### 图片

```markdown
![图片描述](../assets/images/diagram.png)
```

**图片要求**：
- 使用描述性的 alt 文本
- 图片存放在 `docs/assets/images/` 目录
- 使用相对路径引用
- 优先使用 Mermaid 图表（流程图、架构图）

#### 表格

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
| 数据4 | 数据5 | 数据6 |
```

### 内容结构规范

每个知识模块应包含以下结构：

1. **模块标题**
2. **学习目标**（3-5 个具体目标）
3. **前置知识**（2-4 个前置要求）
4. **内容**
   - 概念介绍
   - 详细说明
   - 代码示例（带注释和说明）
   - 最佳实践
   - 常见陷阱
5. **实践练习**（1-3 个练习）
6. **自测问题**（至少 3 个问题）
7. **相关资源**
8. **参考文献**

### 代码示例规范

#### 代码质量要求

**必须**：
- ✅ 代码必须是完整的、可编译的
- ✅ 添加详细的注释说明每个关键步骤
- ✅ 遵循 Zephyr 编码规范
- ✅ 包含错误处理代码
- ✅ 使用有意义的变量和函数名

**示例**：

```c
/**
 * @brief 初始化 I2C 外设
 * @param dev I2C 设备指针
 * @param config I2C 配置参数
 * @return 0 表示成功，负值表示错误码
 * 
 * @note 此函数必须在使用 I2C 通信前调用
 * @warning 确保设备树中已正确配置 I2C 节点
 */
int i2c_init(const struct device *dev, const struct i2c_config *config) {
    // 参数验证
    if (!device_is_ready(dev)) {
        return -ENODEV;  // 设备未就绪
    }

    // 配置 I2C 速度
    int ret = i2c_configure(dev, config->speed | I2C_MODE_CONTROLLER);
    if (ret < 0) {
        return ret;  // 配置失败
    }

    return 0;  // 成功
}
```

#### 代码说明要求

每个代码示例后必须包含：

1. **代码说明**：解释关键代码行的作用
2. **使用说明**：如何编译、运行和测试
3. **注意事项**：使用时需要注意的问题

**示例**：

```markdown
**代码说明**：
- **第 10-12 行**：参数验证，确保设备已就绪
- **第 15 行**：配置 I2C 速度和模式
- **第 20 行**：返回成功状态

**使用说明**：
1. 编译：`west build -b nrf52840dk_nrf52840`
2. 烧录：`west flash`
3. 需要的硬件：nRF52840 开发板

**注意事项**：
- 调用此函数前必须在设备树中配置 I2C 节点
- 确保 I2C 引脚已正确配置
- 建议添加超时机制防止死锁
```

### 语言和表达规范

#### 中英文混排

**规则**：
- 中英文之间添加一个空格
- 中文与数字之间添加一个空格
- 专业术语首次出现时提供英文原文

**示例**：

```markdown
✅ 正确：Zephyr RTOS 任务调度机制
✅ 正确：west 工具是 Zephyr 的核心工具
✅ 正确：采样率为 1000 Hz

❌ 错误：ZephyrRTOS任务调度机制
❌ 错误：west工具是Zephyr的核心工具
❌ 错误：采样率为1000Hz
```

#### 术语使用

**一致性**：
- 保持整个文档中术语使用的一致性
- 首次出现时提供解释

**示例**：

```markdown
Zephyr RTOS（Real-Time Operating System，实时操作系统）是一种...

在后续内容中，统一使用"Zephyr"或"Zephyr RTOS"。
```

#### 表达清晰度

**要求**：
- 使用简洁、清晰的语言
- 避免过于复杂的句子结构
- 使用主动语态
- 提供具体的例子

**示例**：

```markdown
✅ 正确：使用互斥锁保护共享资源，防止数据竞争。
❌ 错误：共享资源的保护可以通过互斥锁的使用来实现，从而避免可能发生的数据竞争情况。

✅ 正确：调用 k_thread_create() 创建新线程。
❌ 错误：新线程的创建是通过 k_thread_create() 函数来完成的。
```

---

## 提交流程 | Submission Process

### 本地开发和测试

#### 1. 本地预览

在提交前，务必在本地预览你的更改：

```bash
# 启动本地开发服务器
mkdocs serve

# 在浏览器中访问 http://127.0.0.1:8000
# 检查内容显示是否正确
```

**检查清单**：
- ✅ 页面能正常显示
- ✅ 代码高亮正确
- ✅ 链接可以点击
- ✅ 图片正常显示
- ✅ 格式符合预期

#### 2. 构建测试

在提交 PR 之前，建议在本地构建测试：

```bash
# 构建静态网站
mkdocs build

# 严格模式构建（将警告视为错误）
mkdocs build --strict
```

确保构建过程没有错误和警告。

### Git 提交规范

#### 提交信息格式

使用清晰、描述性的提交信息，遵循以下格式：

```
<类型>(<范围>): <简短描述>

<详细描述>（可选）

<相关 Issue>（可选）
```

**类型**：
- `feat`: 新功能或新内容
- `fix`: 修复错误
- `docs`: 文档更新
- `style`: 格式调整（不影响代码含义）
- `refactor`: 重构（既不是新功能也不是修复）
- `chore`: 构建过程或辅助工具的变动

**范围**（可选）：
- `prerequisites`: 前置知识相关
- `stage1`: 第一阶段相关
- `stage2`: 第二阶段相关
- `stage3`: 第三阶段相关
- `stage4`: 第四阶段相关
- `config`: 配置相关

**示例**：

```bash
# 好的提交信息
git commit -m "feat(stage1): 添加 west 工具使用章节"
git commit -m "fix(prerequisites): 修正 C 语言指针示例错误"
git commit -m "docs: 更新贡献指南"

# 带详细描述
git commit -m "feat(stage2): 添加设备树配置示例

- 添加 I2C 设备树配置示例
- 包含 GPIO 配置说明
- 添加 3 个自测问题

Closes #123"
```

#### 提交步骤

```bash
# 1. 查看更改
git status
git diff

# 2. 添加更改到暂存区
git add docs/stage1-foundation/west-tool.md
# 或添加所有更改
git add .

# 3. 提交更改
git commit -m "feat(stage1): 添加 west 工具章节"

# 4. 推送到你的 Fork
git push origin feature/your-feature-name
```

### 创建 Pull Request

#### 1. 在 GitHub 上创建 PR

1. 访问你的 Fork 仓库
2. 点击 "Pull Request" 按钮
3. 选择 base 分支（通常是 main）和 compare 分支（你的功能分支）
4. 填写 PR 标题和描述

#### 2. PR 标题格式

```
<类型>: <简短描述>
```

**示例**：

```
feat: 添加 west 工具使用章节
fix: 修正设备树配置示例错误
docs: 更新贡献指南
```

#### 3. PR 描述模板

```markdown
## 更改类型
- [ ] 新功能/新内容
- [ ] 错误修复
- [ ] 文档改进
- [ ] 代码重构
- [ ] 其他（请说明）

## 更改描述
简要描述你的更改内容和原因。

## 相关 Issue
Closes #123
Fixes #456

## 检查清单
- [ ] 已在本地预览更改
- [ ] 已运行构建测试
- [ ] 遵循了内容编写规范
- [ ] 更新了相关文档
- [ ] 提交信息清晰明确

## 截图（如适用）
添加截图帮助审查者理解更改。

## 附加信息
任何其他相关信息。
```

#### 4. 等待审查

- PR 创建后，维护者会进行审查
- 可能会收到反馈和修改建议
- 根据反馈进行修改并推送更新
- 所有讨论解决后，PR 将被合并

#### 5. 响应审查意见

```bash
# 根据反馈进行修改
# 编辑文件...

# 提交修改
git add .
git commit -m "fix: 根据审查意见修改内容"

# 推送更新
git push origin feature/your-feature-name
# PR 会自动更新
```

### 保持同步

定期同步上游仓库的更改：

```bash
# 获取上游更改
git fetch upstream

# 切换到主分支
git checkout main

# 合并上游更改
git merge upstream/main

# 推送到你的 Fork
git push origin main

# 更新功能分支（可选）
git checkout feature/your-feature-name
git rebase main
```

## 内容规范

### Markdown 格式

- 使用标准 Markdown 语法
- 标题层级从 `#` 开始，逐级递增
- 代码块必须指定语言标识符

```markdown
​```c
#include <zephyr/kernel.h>

void main(void) {
    printk("Hello, Zephyr!\n");
}
​```
```

### 文件组织

- 所有文档放在 `docs/` 目录下
- 图片存放在 `docs/assets/images/` 目录
- 图表使用 Mermaid 语法绘制
- 每个阶段的内容放在对应的 `stageX-xxx/` 目录

### 内容结构

每个学习章节应包含：

1. 标题和简介
2. 学习目标
3. 核心内容（理论 + 实践）
4. 代码示例
5. 实操任务
6. 常见问题
7. 参考资料

### 代码示例

- 所有代码示例必须经过验证，确保可以运行
- 提供完整的上下文和说明
- 注释使用中文
- 遵循 Zephyr 官方代码风格

### 图表和图片

- 优先使用 Mermaid 绘制流程图、架构图
- 图片使用 PNG 或 SVG 格式
- 图片文件名使用小写字母和连字符
- 为图片添加 alt 文本

### 术语和表达

- 技术术语首次出现时提供中英文对照
- 保持术语翻译的一致性
- 使用简洁、准确的表达
- 避免口语化和模糊的描述

## 本地开发

### 环境准备

1. 安装 Python 3.8+
2. 创建虚拟环境：

```bash
python -m venv venv
```

3. 激活虚拟环境：

```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. 安装依赖：

```bash
pip install -r requirements.txt
```

### 本地预览

启动开发服务器：

```bash
mkdocs serve
```

访问 http://127.0.0.1:8000 预览你的修改。开发服务器支持热重载，修改文件后会自动刷新页面。

### 构建测试

在提交 PR 之前，建议在本地构建测试：

```bash
# 构建静态网站
mkdocs build

# 严格模式构建（将警告视为错误）
mkdocs build --strict
```

确保构建过程没有错误和警告。

## Pull Request 指南

### PR 标题

使用清晰、描述性的标题：

- ✅ "添加线程同步机制章节"
- ✅ "修正设备树配置示例中的错误"
- ✅ "优化第一阶段学习路径的表达"
- ❌ "更新文档"
- ❌ "修复"

### PR 描述

在 PR 描述中说明：

1. 做了什么修改
2. 为什么要做这个修改
3. 如何验证修改是正确的
4. 相关的 Issue 编号（如果有）

### PR 检查清单

提交 PR 前，请确认：

- [ ] 代码示例已经过验证
- [ ] 本地构建没有错误和警告
- [ ] 遵循了内容规范
- [ ] 提交信息清晰明确
- [ ] PR 描述完整

### 代码审查

- 维护者会审查你的 PR
- 可能会提出修改建议
- 请及时响应反馈
- 修改后会重新审查

## 行为准则

### 我们的承诺

为了营造开放和友好的环境，我们承诺：

- 尊重不同的观点和经验
- 接受建设性的批评
- 关注对社区最有利的事情
- 对其他社区成员表示同理心

### 不可接受的行为

以下行为被视为不可接受：

- 使用性化的语言或图像
- 人身攻击或侮辱性评论
- 公开或私下的骚扰
- 未经许可发布他人的私人信息
- 其他不道德或不专业的行为

### 执行

如果你遇到不当行为，请通过 contact@example.com 联系项目维护者。所有投诉都会被审查和调查。

## 许可证

通过贡献内容，你同意你的贡献将采用 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh) 许可证发布。

## 获得帮助

如果你在贡献过程中遇到问题：

- 查看 [README.md](README.md) 了解项目基本信息
- 在 [GitHub Discussions](https://github.com/example/zephyr-learning-system/discussions) 提问
- 通过 [GitHub Issues](https://github.com/example/zephyr-learning-system/issues) 报告问题
- 发送邮件到 contact@example.com

## 致谢

感谢每一位贡献者！你的贡献让这个学习平台变得更好。

所有贡献者将被记录在项目的贡献者列表中。

---

再次感谢你的贡献！让我们一起让 Zephyr RTOS 学习变得更简单、更高效！🚀

---

## 代码审查标准 | Code Review Standards

### 审查重点

所有 Pull Request 都会经过代码审查，审查重点包括：

#### 1. 内容准确性
- ✅ 技术内容准确无误
- ✅ 符合 Zephyr RTOS 官方文档
- ✅ 引用的标准和文档正确
- ✅ 代码示例正确且可运行

#### 2. 内容完整性
- ✅ 包含所有必需的部分
- ✅ 至少 3 个自测问题
- ✅ 包含参考文献
- ✅ 代码示例有详细注释

#### 3. 格式规范
- ✅ Markdown 格式正确
- ✅ 代码块指定了语言
- ✅ 链接使用相对路径
- ✅ 图片路径正确

#### 4. 语言表达
- ✅ 语言清晰、简洁
- ✅ 中英文混排规范
- ✅ 术语使用一致
- ✅ 无拼写和语法错误

#### 5. 代码质量
- ✅ 代码完整、可编译
- ✅ 遵循 Zephyr 编码规范
- ✅ 包含错误处理
- ✅ 有详细注释

#### 6. 链接有效性
- ✅ 内部链接指向存在的文件
- ✅ 外部链接可访问
- ✅ 使用相对路径

### 审查流程

1. **自动检查**：CI/CD 自动运行构建测试
2. **人工审查**：维护者审查内容质量
3. **反馈**：提供具体的修改建议
4. **修改**：贡献者根据反馈修改
5. **批准**：所有问题解决后批准 PR
6. **合并**：合并到主分支

### 常见审查意见

| 问题 | 说明 | 解决方法 |
|------|------|----------|
| 缺少代码注释 | 代码示例没有足够的注释 | 添加详细的行内注释 |
| 自测问题不足 | 少于 3 个自测问题 | 添加更多问题 |
| 链接失效 | 内部链接指向不存在的文件 | 修正链接路径 |
| 术语不一致 | 同一概念使用不同术语 | 统一术语使用 |
| 代码无法运行 | 代码示例有错误 | 修正代码并测试 |

---

## 获取帮助 | Getting Help

### 文档资源

- **项目 README**: [README.md](README.md) - 项目概述和快速开始
- **MkDocs 文档**: [https://www.mkdocs.org/](https://www.mkdocs.org/)
- **Material 主题文档**: [https://squidfunk.github.io/mkdocs-material/](https://squidfunk.github.io/mkdocs-material/)
- **Zephyr 官方文档**: [https://docs.zephyrproject.org/](https://docs.zephyrproject.org/)

### 提问渠道

如果你在贡献过程中遇到问题：

1. **搜索现有 Issue**：问题可能已经被讨论过
2. **查看文档**：检查 README 和本贡献指南
3. **创建 Issue**：如果找不到答案，创建新 Issue 提问
4. **GitHub Discussions**：参与社区讨论
5. **联系维护者**：通过 Issue 或邮件联系

### 常见问题 FAQ

#### Q1: 我不熟悉 Git，如何开始？

**A**: 推荐以下资源学习 Git 基础：
- [Git 官方教程](https://git-scm.com/book/zh/v2)
- [GitHub 入门指南](https://docs.github.com/cn/get-started)
- 或者先从简单的文档修正开始，逐步学习

#### Q2: 我发现了错误但不知道如何修复，怎么办？

**A**: 请创建 Issue 报告错误，即使你不能修复它。报告问题也是重要的贡献！

#### Q3: 我想添加新内容，但不确定是否合适，怎么办？

**A**: 建议先创建 Issue 讨论你的想法，获得反馈后再开始编写。

#### Q4: 代码审查需要多长时间？

**A**: 通常在 1-3 个工作日内会有初步反馈。复杂的 PR 可能需要更长时间。

#### Q5: 我的 PR 被拒绝了，怎么办？

**A**: 不要气馁！查看拒绝原因，进行修改后可以重新提交。或者在 Issue 中讨论如何改进。

#### Q6: 如何成为项目维护者？

**A**: 持续贡献高质量内容，积极参与社区讨论。维护者会邀请活跃的贡献者加入维护团队。

#### Q7: 我可以使用 AI 工具（如 ChatGPT）帮助编写内容吗？

**A**: 可以使用 AI 工具辅助，但必须：
- 仔细审查和验证 AI 生成的内容
- 确保技术准确性
- 确保代码可以运行
- 最终内容由你负责

#### Q8: 如何处理版权和许可问题？

**A**: 
- 只提交你自己创作的内容或有权使用的内容
- 引用他人内容时注明出处
- 代码示例应使用项目许可证
- 不确定时请咨询维护者

#### Q9: 我想贡献但时间有限，有什么建议？

**A**: 小的贡献也很有价值！可以：
- 修正拼写错误
- 改进现有内容的表达
- 添加代码注释
- 报告问题
- 参与讨论

---

## 贡献者名单 | Contributors

感谢所有为本项目做出贡献的人！

<!-- 贡献者列表将自动生成 -->

### 如何出现在贡献者名单中

- 提交被合并的 Pull Request
- 报告有价值的 Issue
- 参与代码审查
- 改进文档
- 帮助其他贡献者

---

## 许可证 | License

通过贡献本项目，你同意你的贡献将按照 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.zh) 许可证进行许可。

---

## 致谢 | Acknowledgments

感谢你考虑为 Zephyr RTOS 学习系统做出贡献！你的努力将帮助更多开发者学习和掌握 Zephyr RTOS 的知识和技能。

---

## 附录：快速参考 | Quick Reference

### 常用命令

```bash
# 克隆和设置
git clone https://github.com/YOUR_USERNAME/zephyr-learning-system.git
cd zephyr-learning-system
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 创建分支
git checkout -b feature/your-feature-name

# 本地预览
mkdocs serve

# 构建测试
mkdocs build
mkdocs build --strict

# 提交
git add .
git commit -m "feat: 添加新模块"
git push origin feature/your-feature-name

# 同步上游
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### 文件路径快速参考

```
docs/
├── prerequisites/           # 前置必备知识
│   ├── c-language.md
│   ├── embedded-basics.md
│   ├── rtos-concepts.md
│   └── tools.md
├── stage1-foundation/       # 第一阶段：入门筑基期
├── stage2-intermediate/     # 第二阶段：进阶实战期
├── stage3-advanced/         # 第三阶段：高级深耕期
├── stage4-expert/           # 第四阶段：专业精通期
├── learning-principles/     # 通用学习黄金法则
└── assets/                  # 资源文件
    ├── images/              # 图片
    └── diagrams/            # 图表
```

### 提交信息模板

```
<类型>(<范围>): <简短描述>

类型：feat, fix, docs, style, refactor, chore
范围：prerequisites, stage1, stage2, stage3, stage4, config

示例：
feat(stage1): 添加 west 工具使用章节
fix(prerequisites): 修正 C 语言指针示例错误
docs: 更新贡献指南
```

---

**最后更新**: 2024-01-15  
**版本**: 1.0  
**维护者**: Zephyr Learning Team

---

<div align="center">
<p>感谢你的贡献！Together we make Zephyr learning easier. 🚀</p>
</div>
