---
inclusion: always
---

# Git Commit 标准

本项目要求所有 commit 信息遵循统一的格式规范。

## Commit 格式

```
<类型>: <简短描述>
```

## 类型列表

- `add`: 添加新内容
- `fix`: 修复问题
- `update`: 更新内容
- `docs`: 文档改进
- `refactor`: 代码重构
- `style`: 格式调整
- `chore`: 构建/工具变动
- `feat`: 新功能

## 示例

```
add: add Zephyr thread management chapter
fix: fix broken links in environment setup docs
update: update device tree configuration examples
docs: improve contributing guidelines
```

## 要求

1. 使用英文描述
2. 第一行不超过 50 字符
3. 描述清晰，说明做了什么
4. 必须使用规定的类型前缀

详细规范请参考: `.github/COMMIT_CONVENTION.md`
