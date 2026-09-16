# AI Alpha OS

Open Source AI Quant Trading Operating System

AI Alpha OS 旨在建设开源的 AI 量化交易操作系统。当前处于 **Sprint 0.2 — Engineering Framework**，仅建立项目结构与文档基础，尚无可运行的交易系统。

## 当前范围

- 建立清晰的项目目录和文档导航。
- 记录项目边界、协作规则、路线图和变更历史。
- 本阶段不开发交易策略、AI 模型或行情接口。
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
2. 阅读[项目章程](docs/project/PROJECT_CHARTER.md)和[标准开发流程](docs/development/DEVELOPMENT_WORKFLOW.md)，查看 [Sprint 0.2 记录](docs/sprints/sprint-0-2.md)。
3. 贡献前阅读[开发与贡献规范](docs/development/README.md)及[CODEX 规则](CODEX_RULES.md)。
4. 在[路线图](ROADMAP.md)查看后续计划，在[变更日志](CHANGELOG.md)查看已记录的变化。

## 参与贡献

通过 Issue 描述问题、范围和验收标准，通过 Pull Request 提交可审查的变更。具体流程见[开发与贡献规范](docs/development/README.md)。

## 许可证状态

项目以开源为目标，目前尚未选择许可证，也未添加 LICENSE 文件。发布前需由维护者确认许可证并补齐授权信息；本 README 不构成开源许可授予。
