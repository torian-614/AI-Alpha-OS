# Sprint 1.3 — Define Data Strategy and Research Protocol

## 目标

建立数据源管理规范和量化研究流程，使数据选择、质量、历史覆盖和策略准入有可审查依据。本次仅交付 Markdown 文档，不开发代码，不编写 Python，不接入数据或运行策略。

## 任务

- [x] 创建 [DATA_SOURCE_STRATEGY.md](../data/DATA_SOURCE_STRATEGY.md)，定义数据源选择原则。
- [x] 明确免费数据源评估标准、证据与用途限制。
- [x] 定义主数据源与备用数据源的资格、切换及恢复流程。
- [x] 定义质量检查、异常隔离、修订和历史覆盖要求。
- [x] 创建 [RESEARCH_PROTOCOL.md](../research/RESEARCH_PROTOCOL.md)，规定 Idea → Hypothesis → Data → Backtest → Out-of-Sample → Paper Trading → Approved / Rejected。
- [x] 明确策略进入系统前必须通过完整准入流程，记录阶段证据和最终审批。
- [x] 同步索引、项目状态、路线图和变更日志。

勾选仅表示文档交付，不表示已经选择供应商、运行质量检查、完成研究或批准策略。

## 验收标准

| 验收项 | 文档证据 |
| --- | --- |
| 数据源规范完整 | 五项指定主题均有独立说明，免费源评估以证据为准 |
| 主备机制可追溯 | 资格、切换、恢复、源版本和单源限制明确 |
| 数据质量可治理 | 定义检查、阈值预登记、隔离、修订及影响追踪 |
| 历史覆盖可核查 | 七类数据和支撑数据有覆盖要求，缺口不能被静默填补 |
| 研究流程完整 | 七个阶段及最终分支清楚，每阶段有产物和转换条件 |
| 准入条件严格 | 未完成验证不可 Approved；未执行阶段不得补记通过 |
| 独立验证明确 | 样本外不能重复调参，Paper Trading 不能以历史回放替代 |
| 文档一致且无代码 | 遵守现有数据契约、评分和回测规则；相对链接有效，变更均为 Markdown |

验证范围为文档内容、格式、链接与 Git 提交；不声称业务测试或研究验证已通过。

## 提交要求

全部本次修改提交一次 commit：

```text
docs:
define data strategy and research protocol
```

提交后核对文件列表、父提交、提交信息与 main 分支。下一步先登记研究假设和数据需求，再按统一样本评估候选数据源。

[返回 Sprint 索引](README.md) · [路线图](../../ROADMAP.md)
