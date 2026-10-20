# AI Alpha OS

Open Source AI Quant Trading Operating System

AI Alpha OS 旨在建设以长期稳定盈利为目标的开源 A股量化交易系统。Sprint 1.9 定义了数据、Alpha 评分、信号引擎及 Rule First 决策层架构。当前进入 **Sprint 2.0 Phase 2 — Alpha Decision Pipeline**，已具备研究阶段的数据标准化、质量检查、SQLite 存储回读、Alpha 评分和确定性研究决策链路；尚无可运行的实盘交易系统。

## 在线演示

网页演示已发布，可访问[在线演示](https://torian-614.github.io/AI-Alpha-OS/)或[查看源码](https://github.com/torian-614/AI-Alpha-OS)。

该演示仅使用合成数据，用于展示研究流程；不连接实时行情或证券账户，不执行交易。

## 当前范围

- 已建立项目目录和文档导航，并定义 [MVP 产品需求](docs/product/MVP_PRD.md)。
- 记录项目边界、协作规则、路线图和变更历史。
- Sprint 2.0 只进行研究和模拟，不连接证券账户、不自动下单，也不提供实盘资金管理。
- AKShare 是当前研究数据源；数据经统一 OHLCV Schema 和质量闸门后进入 SQLite，再由 `MarketDataService` 提供给 Alpha 层。
- [Sprint 1.9 Alpha Signal Engine 架构](docs/alpha/ALPHA_SIGNAL_ENGINE_ARCHITECTURE.md)记录了信号和决策接口的设计边界。
- Phase 2 通过 `python -m src.pipeline.run_daily` 生成 AlphaResult、RiskResult、REJECT/WATCH/CANDIDATE 和可回读的 Decision Record。

`mootdx` 是可选行情适配器，不参与基础安装、AKShare 主流程或 Tencent fallback。需要使用该适配器时，再执行 `python -m pip install -r requirements-optional.txt`。

可用 `python -m src.data.diagnostics --environment-only` 检查 Python、pytest、mootdx 和 DuckDB 的本地可用状态。

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
│   ├── decision/
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
│   ├── data/
│   │   ├── providers/
│   │   ├── collectors/
│   │   ├── validators/
│   │   └── storage/
│   └── alpha/
├── tests/
├── configs/
└── scripts/
```

各目录通过 README.md 记录用途并纳入 Git；目录存在不表示功能已经实现。

## 从这里开始

1. 阅读[文档索引](docs/README.md)和[产品范围](docs/product/README.md)。
2. 阅读[项目章程](docs/project/PROJECT_CHARTER.md)、[标准开发流程](docs/development/DEVELOPMENT_WORKFLOW.md)和 [Sprint 1.9 Alpha Signal Engine 架构](docs/alpha/ALPHA_SIGNAL_ENGINE_ARCHITECTURE.md)。
3. 查看 [Sprint 2.0 MVP 指南](docs/sprint2/SPRINT2_MVP_GUIDE.md)。
4. 贡献前阅读[开发与贡献规范](docs/development/README.md)及[CODEX 规则](CODEX_RULES.md)。
5. 在[路线图](ROADMAP.md)查看后续计划，在[变更日志](CHANGELOG.md)查看已记录的变化。

## 参与贡献

通过 Issue 描述问题、范围和验收标准，通过 Pull Request 提交可审查的变更。具体流程见[开发与贡献规范](docs/development/README.md)。

## 网页演示开发

网页演示位于 `web-demo/`，是无后端、无运行时依赖的静态页面。在仓库根目录生成确定性 fixtures 后，进入该目录运行测试或启动本地预览：

```powershell
python scripts/export_web_demo_fixtures.py --output web-demo/src/demo-data.js
Set-Location web-demo
npm test
python -m http.server 4173
```

详细的数据边界、验证方法和本地预览说明见 [`web-demo/README.md`](web-demo/README.md)。

## 许可证状态

项目以开源为目标，目前尚未选择许可证，也未添加 LICENSE 文件。发布前需由维护者确认许可证并补齐授权信息；本 README 不构成开源许可授予。

