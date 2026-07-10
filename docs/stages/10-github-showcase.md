# 阶段 10：GitHub 项目展示文档

这篇文档解决的问题：记录如何把项目 README、架构图和文档导航整理成适合公开 GitHub、博客和面试讲解的展示层。

## 本步骤目标

本阶段不新增业务 API，不修改 JSBridge 协议，不改 runtime 代码，只整理项目展示材料：

- 根 `README.md`
- docs 首页
- 项目介绍
- Roadmap
- runtime 架构
- JSBridge 架构
- HAR 模块设计
- Debug 指南
- Mermaid 架构图

## 为什么要做展示层

代码能跑只是第一步。一个适合作为代表项目的仓库，还需要让读者快速看懂：

- 这个项目解决什么问题。
- 当前已经完成哪些能力。
- 还没有实现哪些能力。
- 架构为什么这样拆。
- 如何运行 Demo。
- 面试时可以讲哪些设计点。

## 修改文件

```text
README.md
docs/README.md
docs/overview/project-introduction.md
docs/overview/roadmap.md
docs/architecture/runtime-architecture.md
docs/architecture/jsbridge-architecture.md
docs/architecture/har-module-design.md
docs/debug/debug-guide.md
docs/stages/10-github-showcase.md
docs/assets/architecture-overview.md
docs/assets/screenshots/.gitkeep
```

## README 结构

README 当前包含：

- 项目标题和一句话介绍。
- 合规边界。
- 当前能力。
- Mermaid 架构图。
- 核心调用链。
- Quick Start。
- 项目目录。
- 文档导航。
- 截图占位。
- Roadmap。
- Highlights。

## 文档风格

所有文档保持公开项目口径：

- 通俗易懂。
- 不写内部信息。
- 不夸大生产能力。
- 不把未实现能力写成已完成。
- 统一描述为受小程序运行时架构启发的 HarmonyOS Web 容器与 JSBridge 框架。

## 验收标准

- README 可以作为 GitHub 项目首页。
- docs 首页可以作为阅读导航。
- runtime 和 JSBridge 架构文档包含 Mermaid 图和设计理由。
- Roadmap 与当前真实状态一致。
- 没有不适合公开的表述。

## 下一步

下一步可以继续补充 Storage API / Network API，或者先补真实截图和博客文章。
