# AI Alpha OS Documentation

文档采用 Markdown，按职责分类。以下页面是基础说明，未完成的设计必须明确标注为待定。

| 分类 | 入口 | 内容 |
| --- | --- | --- |
| 项目治理 | [项目章程](project/PROJECT_CHARTER.md) | 第一目标、透明原则和 Alpha 生命周期 |
| 工程流程 | [开发流程](development/DEVELOPMENT_WORKFLOW.md) | Idea → RFC → PRD → Architecture → Task → Codex → Review → Merge |
| 产品设计 | [产品范围](product/README.md) | 愿景、当前目标与范围边界 |
| MVP 需求 | [MVP PRD](product/MVP_PRD.md) | V1 范围、使用流程与验收标准 |
| 系统架构 | [架构说明](architecture/README.md) | 目录职责与待决策事项 |
| 架构决策 | [决策记录](architecture/decisions/README.md) | ADR 编号、状态与模板 |
| 量化研究 | [研究文档](research/README.md) | 后续研究记录的归档约定 |
| AI 设计 | [AI 文档](ai/README.md) | 后续设计记录的归档约定 |
| 数据规范 | [数据文档](data/README.md) | 数据规范的记录边界 |
| 开发规范 | [开发与贡献规范](development/README.md) | 命名、贡献流程与验证要求 |
| Sprint 记录 | [Sprint 索引](sprints/README.md) | 任务范围和验收清单 |

## 文档约定

- 普通文档使用小写 kebab-case 文件名；目录入口统一使用 README.md。指定产品需求文档使用 MVP_PRD.md。
- 指定治理文档保留 PROJECT_CHARTER.md 和 DEVELOPMENT_WORKFLOW.md 名称。
- 根目录约定文件使用 README.md、CODEX_RULES.md、ROADMAP.md、CHANGELOG.md。
- 使用仓库相对链接；新增文档时更新所属目录索引。
- 文档必须区分当前事实、提案与未来计划；代码和文档变化保持同步。
- 已采纳的跨模块决策使用 ADR 记录，避免把未确定的技术栈描述为已实现。

## 项目入口

[项目简介](../README.md) · [协作规则](../CODEX_RULES.md) · [路线图](../ROADMAP.md) · [变更日志](../CHANGELOG.md)
