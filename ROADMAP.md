# Roadmap

路线图用于区分当前交付与后续提案，不构成发布时间承诺。更新日期：2026-09-17。

## Sprint 0 — Foundation

### Day 1 — Foundation Setup

- [x] 建立项目目录结构与目录职责说明。
- [x] 更新 README 和项目导航。
- [x] 建立产品、架构、研究、AI、数据、开发及 Sprint 文档体系。
- [x] 创建 CODEX_RULES.md。
- [x] 创建 ROADMAP.md。
- [x] 创建 CHANGELOG.md。

范围与验收见 [Day 1 记录](docs/sprints/sprint-0-day-1.md)。本里程碑仅覆盖目录与文档，不代表业务系统可运行。

### Sprint 0.2 — Engineering Framework

- [x] 建立 research 及 alpha、factors、strategies、experiments、reports 子目录。
- [x] 建立 arena 及 agents、profiles、competitions、rankings、reports 子目录。
- [x] 建立 backtest 及 engine、models、results、reports 子目录。
- [x] 建立 decision 与 docs/project，各新增目录均提供 README.md。
- [x] 创建项目章程，明确第一目标、非黑箱、开源透明及 Alpha 生命周期原则。
- [x] 创建 Idea → RFC → PRD → Architecture → Task → Codex → Review → Merge 开发流程。

详见 [Sprint 0.2 记录](docs/sprints/sprint-0-2.md)。本次仅交付工程结构和文档。

## Sprint 1 — MVP Definition

### Sprint 1.1 — Define MVP Product Requirement

- [x] 创建 [MVP_PRD.md](docs/product/MVP_PRD.md)，定义 A股量化系统第一阶段目标。
- [x] 明确市场分析、Alpha 评分、回测与决策记录范围。
- [x] 记录 V1 排除项、每日使用流程及五项验收标准。
- [x] 区分未来扩展与当前需求。

本里程碑仅交付需求文档，MVP 功能开发与验收尚未完成。详见 [Sprint 1.1 记录](docs/sprints/sprint-1-1.md)。

### Sprint 1.2 — Design Core Quant Architecture

- [x] 定义七类核心数据的字段、类型、用途及历史可用性。
- [x] 建立 Alpha 五维评分与风险框架，最终参数保留待回测优化。
- [x] 定义回测买卖、成交、费用、滑点与收益统计规则。
- [x] 完成 [Sprint 1.2 设计记录](docs/sprints/sprint-1-2.md) 和文档导航。

以上为文档交付，不代表数据、评分或回测能力已实现。

### Sprint 1.3 — Define Data Strategy and Research Protocol

- [x] 定义数据源选择和免费源评估规范。
- [x] 定义主备数据源、质量检查及历史覆盖要求。
- [x] 定义完整 Alpha 研究流程与策略准入条件。
- [x] 明确样本外独立性、Paper Trading 和批准边界。
- [x] 完成 [Sprint 1.3 记录](docs/sprints/sprint-1-3.md) 与文档导航。

仅交付规范，未评估供应商、执行研究或批准策略。

### Sprint 1.4 — Design A Share Quant Data Platform Architecture

- [x] 创建 [DATA_PLATFORM_ARCHITECTURE.md](docs/data/DATA_PLATFORM_ARCHITECTURE.md)，定义稳定、透明、可扩展和支持开源的平台目标。
- [x] 定义七个业务数据层的字段、用途、更新频率和质量要求。
- [x] 设计免费研究、半自动和未来实盘三阶段数据源战略。
- [x] 定义主备校验、质量、版本、异常报警及防止未来函数的时点约束。
- [x] 建立不同 Alpha 的数据依赖映射。

仅交付逻辑架构；没有数据接入、实时服务或实盘执行实现，未来升级需另行授权。

### Sprint 1.5 — Design AI Alpha OS Database Schema

- [x] 创建 [DATABASE_SCHEMA.md](docs/data/DATABASE_SCHEMA.md)，定义十张核心表及全部指定字段。
- [x] 定义类型、业务粒度、主键、关联与时点约束。
- [x] 定义 data_version、来源、更新时间、质量评分和不可变输入快照。
- [x] 预留 Level2、资金流、AI Agent 与 Arena 扩展。

本次仅交付数据库逻辑设计，不建表、不开发代码或迁移脚本。

### Sprint 1.6 — Design Alpha Data Mapping Architecture

- [x] 创建 [ALPHA_DATA_MAPPING.md](docs/alpha/ALPHA_DATA_MAPPING.md)，定义 Alpha 标准结构及五个核心模型。
- [x] 对应数据输入、因子逻辑、评分、信号与四项绩效验证指标。
- [x] 定义无循环计算依赖与待补数据库契约，区分股票、板块和市场输出。
- [x] 定义完整生命周期及 Production 前的研究批准、工程与部署边界。
- [x] 预留 AI、多因子、机器学习、Arena 和自动淘汰扩展。

本次仅交付映射文档，不实现 Alpha、不修改数据库或授予实盘权限。

### 下一阶段候选事项 — 待确认

- [ ] 补齐指数、跌停计数、板块视图及 alpha_signal 跨对象输出契约。
- [ ] 登记研究假设、股票池、评价门槛、时间分区与数据需求。
- [ ] 确认七层数据的 V1 必需范围，以及实时、梯队和新闻新增字段的契约版本。
- [ ] 按数据源策略评估主备候选，建立历史覆盖和质量报告。
- [ ] 冻结评分参数候选范围、成本条件与研究准入评价方案。
- [ ] 审查数据库逻辑模型与契约映射，通过 ADR 确认存储技术、精度、分区及约束方案。
- [ ] 明确模块边界，通过 ADR 确认技术栈与依赖管理方式。
- [ ] 由维护者选择许可证并补齐 LICENSE。
- [ ] 定义开发环境、格式检查和测试约定。
- [ ] 在工具链确定后建立最小 CI 文档与检查流程。

以上事项需拆分为独立任务后实施，不属于已交付的目录、工程文档与产品需求定义范围。

## 后续里程碑 — 未排期

V1 功能范围与验收方向已在 MVP PRD 中定义，详细设计、实施顺序和交付日期待定。AI 分析助手、飞书推送、盘中监控、虚拟游资竞技场和自动执行模块属于未来扩展，不纳入 V1。
