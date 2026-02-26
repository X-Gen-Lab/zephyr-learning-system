# Git Commit 规范

本项目采用规范化的 commit 信息格式，以保持提交历史清晰易读。

## Commit 信息格式

```
<类型>: <简短描述>

[可选的详细说明]

[可选的关联 Issue]
```

### 类型说明

| 类型 | 说明 | 示例 |
|------|------|------|
| `add` | 添加新内容 | `add: add Zephyr thread management chapter` |
| `fix` | 修复问题 | `fix: fix broken links in environment setup docs` |
| `update` | 更新现有内容 | `update: update device tree configuration examples` |
| `docs` | 文档改进 | `docs: improve contributing guidelines` |
| `refactor` | 代码重构 | `refactor: refactor build scripts` |
| `style` | 格式调整 | `style: unify markdown formatting` |
| `chore` | 构建/工具变动 | `chore: update dependencies` |
| `feat` | 新功能 | `feat: add image optimization feature` |

## 编写规范

### 基本要求

1. **使用英文**: 提交信息使用英文描述
2. **简洁明了**: 第一行不超过 50 字符
3. **描述清晰**: 说明做了什么，而不是为什么做
4. **类型明确**: 必须使用规定的类型前缀

### 格式要求

```
类型: 描述
^    ^
|    |
|    +-> 简短描述，首字母无需大写，结尾无句号
|
+-------> 类型: add, fix, update, docs, refactor, style, chore, feat
```

### 示例

#### 好的提交信息 ✅

```
add: add Zephyr kernel scheduler explanation
```

```
fix: fix syntax error in device tree example
```

```
update: update GPIO driver development tutorial

- Add error handling examples
- Update API usage instructions
- Add FAQ section
```

```
docs: improve quick start guide

Add detailed installation steps for Windows
Related to Issue #123
```

#### 不好的提交信息 ❌

```
update docs
```
> 缺少冒号，描述不够具体

```
fix bug
```
> 描述不清晰，没有说明修复了什么

```
add: add some content about Zephyr RTOS thread management including thread creation, scheduling, synchronization and other detailed explanations
```
> 描述过长，应该简化

## 详细说明（可选）

如果需要提供更多上下文，可以在空一行后添加详细说明：

```
update: optimize image loading performance

- Enable lazy loading for images
- Add WebP format support
- Compress existing image assets
- Update image optimization scripts

These improvements reduce page load time by ~40%
```

## 关联 Issue

如果提交与某个 Issue 相关，可以在提交信息中引用：

```
fix: fix Chinese word segmentation in search

Closes #42
```

常用关键词：
- `Closes #123` - 关闭 Issue
- `Fixes #123` - 修复 Issue
- `Related to #123` - 相关 Issue

## 配置 Commit 模板

### 全局配置

```bash
git config --global commit.template .gitmessage
```

### 项目配置

```bash
git config commit.template .gitmessage
```

配置后，每次 `git commit` 会自动加载模板。

## 提交前检查

在提交前，请确认：

- [ ] 提交信息格式正确
- [ ] 类型选择准确
- [ ] 描述清晰简洁
- [ ] 使用中文描述
- [ ] 相关文件已添加
- [ ] 代码/内容已测试

## 多次提交

如果一次性修改了多个不相关的内容，应该分多次提交：

```bash
# 分别提交不同类型的修改
git add docs/stage1-foundation/environment-setup.md
git commit -m "update: update environment setup guide"

git add docs/stage2-intermediate/driver-development.md
git commit -m "add: add driver development examples"
```

## 修改提交信息

### 修改最后一次提交

```bash
git commit --amend
```

### 修改历史提交

```bash
git rebase -i HEAD~3  # 修改最近 3 次提交
```

## 常见场景

### 添加新章节

```
add: add Zephyr device tree basics chapter
```

### 修复错误

```
fix: fix compilation error in code example
```

### 更新内容

```
update: update Kconfig configuration guide
```

### 改进文档

```
docs: improve formatting guidelines in contributing guide
```

### 格式调整

```
style: unify code block language identifiers
```

### 重构代码

```
refactor: refactor deployment scripts for better maintainability
```

### 依赖更新

```
chore: update MkDocs Material theme to 9.5.0
```

### 新功能

```
feat: add automatic image optimization
```

## 团队协作

### Pull Request 标题

PR 标题应遵循相同的格式：

```
add: add Bluetooth development guide
```

### 分支命名

建议使用描述性的分支名：

```
feature/bluetooth-guide
fix/broken-links
docs/improve-readme
```

## 工具支持

### Commitizen

可以使用 Commitizen 工具辅助生成规范的提交信息：

```bash
# 安装
npm install -g commitizen cz-conventional-changelog

# 使用
git cz
```

### Git Hooks

可以配置 Git Hooks 自动检查提交信息格式：

```bash
# .git/hooks/commit-msg
#!/bin/sh
commit_msg=$(cat "$1")
pattern="^(add|fix|update|docs|refactor|style|chore|feat): .+"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
    echo "错误: 提交信息格式不正确"
    echo "格式: <类型>: <描述>"
    echo "类型: add, fix, update, docs, refactor, style, chore, feat"
    exit 1
fi
```

## 参考资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)

---

遵循这些规范，让我们的提交历史更加清晰易读！
