# AI Alpha OS

Open Source AI Quant Trading Operating System

AI Alpha OS 旨在建设以长期稳定盈利为最高目标的开源 A股量化交易系统。当前处于 **Sprint 1.5 — Database Schema**，已定义 MVP 需求、核心设计、研究协议、平台架构与数据库逻辑模型，尚无可运行的交易系统。

## 当前范围

- 已建立项目目录和文档导航，并定义 [MVP 产品需求](docs/product/MVP_PRD.md)。
- 记录项目边界、协作规则、路线图和变更历史。
- 本次任务仅交付数据库模型设计文档；V1 计划建立数据、分析、信号、模拟交易、反馈与优化闭环，功能尚待实施。
- 编程语言、运行时、框架、依赖管理和部署方式尚未选定；当前无需安装依赖。

## 项目结构

```text
AI-Alpha-OS/
├── README.md
├── CODEX_RULES.md
├── ROADMAP.md
├── CHANGELOG.md
├── docs/
│   ├── README.md
│   ├── project/
│   ├── product/
│   ├── architecture/
│   │   └── decisions/
│   ├── research/
│   ├── ai/
│   ├── data/
│   ├── alpha/
│   ├── backtest/
│   ├── development/
│   └── sprints/
├── research/
│   ├── alpha/
│   ├── factors/
│   ├── strategies/
│   ├── experiments/
│   └── reports/
├── arena/
│   ├── agents/
│   ├── profiles/
│   ├── competitions/
│   ├── rankings/
│   └── reports/
├── backtest/
│   ├── engine/
│   ├── models/
│   ├── results/
│   └── reports/
├── decision/
├── src/
├── tests/
├── configs/
└── scripts/
```

各目录通过 README.md 记录用途并纳入 Git；目录存在不表示功能已经实现。

## 从这里开始

1. 阅读[文档索引](docs/README.md)和[产品范围](docs/product/README.md)。
2. 阅读[项目章程](docs/project/PROJECT_CHARTER.md)和[标准开发流程](docs/development/DEVELOPMENT_WORKFLOW.md)，查看 [Sprint 1.5 数据库模型](docs/data/DATABASE_SCHEMA.md)。
3. 贡献前阅读[开发与贡献规范](docs/development/README.md)及[CODEX 规则](CODEX_RULES.md)。
4. 在[路线图](ROADMAP.md)查看后续计划，在[变更日志](CHANGELOG.md)查看已记录的变化。

## 参与贡献

通过 Issue 描述问题、范围和验收标准，通过 Pull Request 提交可审查的变更。具体流程见[开发与贡献规范](docs/development/README.md)。

## 许可证状态

项目以开源为目标，目前尚未选择许可证，也未添加 LICENSE 文件。发布前需由维护者确认许可证并补齐授权信息；本 README 不构成开源许可授予。
