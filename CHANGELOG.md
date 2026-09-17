# Changelog

记录面向贡献者的重要变化。采用 Keep a Changelog 风格；正式版本发布前，变化记入 Unreleased，不为基础目录初始化虚构版本号。

## [Unreleased]

### Added

- Sprint 1.8：新增 DECISION_ENGINE_ARCHITECTURE.md 和决策设计索引，定义四个核心模块、Decision Object与Rule First边界。
- 明确A股场景、风险红线、追加结果、幂等消费、执行复检和AI只读解释要求。

- 2026-09-17，Sprint 1.7：新增 ALPHA_FORMULA_SPEC.md，定义五个 Alpha 的因子公式、暂定权重、统一分数范围及综合排序。
- 定义边界处理、风险事件闸门、参数优化方法、验证与生命周期要求。

- 2026-09-17，Sprint 1.6：新增 ALPHA_DATA_MAPPING.md，定义 Alpha001–Alpha005 字段映射、因子逻辑、评分输出与四项验证指标。
- 定义无循环依赖、跨对象输出扩展、生命周期与未来 Alpha 能力边界。

- Sprint 1.5：新增 DATABASE_SCHEMA.md，设计十张核心数据表及指定字段、类型、键和关系。
- 定义数据版本注册、时点追踪、模拟成交账本和 Level2、资金流、Agent、Arena 扩展边界。

- Sprint 1.4：新增 DATA_PLATFORM_ARCHITECTURE.md，定义七层 A股数据平台、批流职责、三阶段数据源战略、主备校验和时点质量治理。
- 定义实时、梯队和新闻舆情逻辑扩展，明确 Alpha 数据依赖与未来实盘升级边界。

- Sprint 1.3：新增 DATA_SOURCE_STRATEGY.md，定义来源选择、免费源评估、主备治理、质量与历史覆盖要求。
- 新增 RESEARCH_PROTOCOL.md，定义七阶段研究流程、独立验证、前向模拟及策略准入要求。
- 新增 Sprint 1.3 目标、任务与文档验收记录。

- Sprint 1.2：新增 DATA_CONTRACT.md，定义七类数据、时点可用性、质量和版本规则。
- 新增 ALPHA_SCORING.md，定义五维框架、PRD 场景映射与参数回测优化流程。
- 新增 BACKTEST_RULES.md，定义买卖、成交模拟、费用、滑点、账本和统计口径。
- 新增 Alpha 与回测设计目录索引及 Sprint 1.2 交付记录。

- Sprint 1.1：新增 docs/product/MVP_PRD.md，定义 A股量化系统 MVP 的目标、四类核心功能、排除项、使用流程、验收标准与未来扩展。
- 新增 Sprint 1.1 需求文档交付记录，明确功能尚未实施与验收。

- Sprint 0.2：新增 research、arena、backtest、decision 及子目录 README，明确工程职责与归档边界。
- 新增 docs/project/PROJECT_CHARTER.md，记录长期稳定盈利目标、非黑箱、开源透明和 Alpha 生命周期管理。
- 新增 docs/development/DEVELOPMENT_WORKFLOW.md，定义从 Idea 到 Merge 的八阶段流程。
- 新增 Sprint 0.2 交付与验证要求记录。

- 2026-09-16：Sprint 0 Day 1 Foundation Setup。
- 项目源码、测试、配置与维护脚本目录说明。
- 产品、架构、ADR、研究、AI、数据、开发及 Sprint 文档体系。
- CODEX_RULES.md 协作规则与 ROADMAP.md 路线图。

### Changed

- Sprint 1.8：同步项目、架构与文档入口、研究决策目录说明及路线图；无代码实现。

- Sprint 1.7：同步 Alpha 和文档索引、项目状态及路线图；无代码实现和实际回测。

- Sprint 1.6：同步 Alpha 索引、项目与文档导航及路线图；全部变更为文档。

- Sprint 1.5：同步数据与架构入口、项目和文档导航及路线图；未创建数据库或编写代码。

- Sprint 1.4：同步项目状态、数据和架构入口、文档索引及路线图；本次仅交付架构文档。

- Sprint 1.3：同步数据与研究索引、文档导航、项目阶段和路线图；未增加代码或批准策略。

- Sprint 1.2：同步项目和文档导航、架构说明、数据索引及路线图；本次仅为设计文档交付。

- Sprint 1.1：同步产品范围、项目和文档导航及路线图，区分 PRD 交付与 MVP 实现。

- Sprint 0.2：同步项目与文档导航、开发规范、架构说明、CODEX 规则和路线图，明确本阶段只有目录与文档。

- 扩展项目 README，说明当前状态、目录结构、贡献入口和许可证待定状态。
- 将 docs/README.md 从分类提纲完善为可导航的文档索引。
