# Roadmap

路线图用于区分当前交付与后续提案，不构成发布时间承诺。更新日期：2026-09-16。

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

### 下一阶段候选事项 — 待确认

- [ ] 基于 MVP PRD 明确数据范围、指标评分口径、模拟条件及历史有效性验收方法。
- [ ] 明确模块边界，通过 ADR 确认技术栈与依赖管理方式。
- [ ] 由维护者选择许可证并补齐 LICENSE。
- [ ] 定义开发环境、格式检查和测试约定。
- [ ] 在工具链确定后建立最小 CI 文档与检查流程。

以上事项需拆分为独立任务后实施，不属于已交付的目录、工程文档与产品需求定义范围。

## 后续里程碑 — 未排期

V1 功能范围与验收方向已在 MVP PRD 中定义，详细设计、实施顺序和交付日期待定。AI 分析助手、飞书推送、盘中监控、虚拟游资竞技场和自动执行模块属于未来扩展，不纳入 V1。
