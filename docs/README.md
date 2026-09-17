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
| 量化研究 | [研究协议](research/RESEARCH_PROTOCOL.md) | 假设、回测、样本外、前向模拟与策略准入 |
| AI 设计 | [AI 文档](ai/README.md) | 后续设计记录的归档约定 |
| 数据规范 | [数据契约](data/DATA_CONTRACT.md) | 七类核心数据、字段、单位与时点语义 |
| 数据平台 | [平台架构](data/DATA_PLATFORM_ARCHITECTURE.md) | 七层数据、三阶段演进与时点质量治理 |
| 数据库模型 | [数据库 Schema](data/DATABASE_SCHEMA.md) | 十张核心表、关系、版本与扩展 |
| 数据源管理 | [数据源策略](data/DATA_SOURCE_STRATEGY.md) | 来源评估、主备、质量与历史覆盖 |
| Alpha 框架 | [评分框架](alpha/ALPHA_SCORING.md) | 五个维度、风险闸门与参数优化 |
| Alpha 映射 | [数据映射架构](alpha/ALPHA_DATA_MAPPING.md) | 五个核心 Alpha 的输入、输出、验证与准入 |
| Alpha 公式 | [公式规范](alpha/ALPHA_FORMULA_SPEC.md) | 0–100分、暂定权重、综合评分与优化 |
| Alpha信号引擎 | [Signal Engine架构](alpha/ALPHA_SIGNAL_ENGINE_ARCHITECTURE.md) | 分类因子、配置评分、候选信号与决策接口 |
| 决策引擎 | [Decision Engine架构](decision/DECISION_ENGINE_ARCHITECTURE.md) | Rule First、规则与风险、Decision Object |
| 回测设计 | [回测规则](backtest/BACKTEST_RULES.md) | 交易模拟、费用与统计口径 |
| 开发规范 | [开发与贡献规范](development/README.md) | 命名、贡献流程与验证要求 |
| Sprint 记录 | [Sprint 索引](sprints/README.md) | 任务范围和验收清单 |

## 文档约定

- 普通文档使用小写 kebab-case 文件名；目录入口统一使用 README.md。指定产品需求文档使用 MVP_PRD.md。
- 指定核心设计文档使用 DATA_CONTRACT.md、ALPHA_SCORING.md、ALPHA_DATA_MAPPING.md、ALPHA_FORMULA_SPEC.md、BACKTEST_RULES.md。
- 指定数据平台与数据库文档使用 DATA_PLATFORM_ARCHITECTURE.md、DATABASE_SCHEMA.md。
- 指定数据源与研究规范使用 DATA_SOURCE_STRATEGY.md、RESEARCH_PROTOCOL.md。
- 指定Alpha信号引擎文档使用 ALPHA_SIGNAL_ENGINE_ARCHITECTURE.md。
- 指定决策引擎文档使用 DECISION_ENGINE_ARCHITECTURE.md。
- 指定治理文档保留 PROJECT_CHARTER.md 和 DEVELOPMENT_WORKFLOW.md 名称。
- 根目录约定文件使用 README.md、CODEX_RULES.md、ROADMAP.md、CHANGELOG.md。
- 使用仓库相对链接；新增文档时更新所属目录索引。
- 文档必须区分当前事实、提案与未来计划；代码和文档变化保持同步。
- 已采纳的跨模块决策使用 ADR 记录，避免把未确定的技术栈描述为已实现。

## 项目入口

[项目简介](../README.md) · [协作规则](../CODEX_RULES.md) · [路线图](../ROADMAP.md) · [变更日志](../CHANGELOG.md)
