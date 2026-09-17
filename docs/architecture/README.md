# 系统架构

状态：Sprint 1.9 已补充 Alpha Signal Engine 与决策接口，已有平台、数据库与核心量化设计；运行时架构与技术栈待定。本页不表示已有业务模块。

| 目录 | 职责 |
| --- | --- |
| [research/](../../research/README.md) | Alpha、因子、策略说明、实验与研究报告 |
| [arena/](../../arena/README.md) | Agent、档案、比较任务、排名与报告 |
| [backtest/](../../backtest/README.md) | 回测引擎设计、仿真假设、结果与报告 |
| [decision/](../../decision/README.md) | Alpha 生命周期决策及证据关联 |
| [src/](../../src/README.md) | 后续源码，目前仅保留说明 |
| [tests/](../../tests/README.md) | 后续测试，目前无测试套件 |
| [configs/](../../configs/README.md) | 后续可共享配置，目前无运行配置 |
| [scripts/](../../scripts/README.md) | 后续维护脚本，目前无可执行脚本 |
| [docs/](../README.md) | 需求、设计、规范与迭代记录 |

## 核心设计边界

| 规范 | 责任 | 下游 |
| --- | --- | --- |
| [数据平台架构](../data/DATA_PLATFORM_ARCHITECTURE.md) | 原始、标准化、派生与服务职责，七个业务层及三阶段来源治理 | 研究、模拟与未来实盘数据消费 |
| [数据库模型](../data/DATABASE_SCHEMA.md) | 核心表、身份、时点、关系及版本追踪 | 数据存储与决策审计设计 |
| [数据契约](../data/DATA_CONTRACT.md) | 统一身份、字段、单位、历史可用时间与质量 | Alpha 特征和回测输入 |
| [Alpha 评分](../alpha/ALPHA_SCORING.md) | 可解释评分、风险闸门、版本与决策记录 | 模拟信号与回测 |
| [Alpha Signal Engine](../alpha/ALPHA_SIGNAL_ENGINE_ARCHITECTURE.md) | 因子分类、配置评分与候选信号，AI仅辅助研究与解释 | Decision Engine |
| [Decision Engine](../decision/DECISION_ENGINE_ARCHITECTURE.md) | 市场状态、Alpha聚合、规则、风险与决策对象；AI只读解释 | 回测、模拟与结果追踪 |
| [回测规则](../backtest/BACKTEST_RULES.md) | 订单状态、成交近似、账本、成本与结果统计 | 决策反馈与研究优化 |

流程：时点数据 → 特征与评分 → 信号记录 → 模拟订单与成交 → 账户净值和结果 → 后续研究。结果不回写历史输入或评分；参数优化产生新版本，后续评估使用独立样本。

## 决策原则

仅为已明确的需求增加模块，避免预先铺设未经验证的服务和依赖。涉及语言、框架、持久化或部署的选择，先记录背景、备选方案与取舍，再更新当前架构说明。

## 待决策

语言与运行时、模块划分、依赖管理、测试工具和部署方式均待定。截至 Sprint 1.9，仅交付目录、需求和设计规范，不引入业务代码。

[架构决策记录](decisions/README.md) · [返回文档索引](../README.md)
