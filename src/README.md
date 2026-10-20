# Source

Sprint 2.0 的可运行代码位于以下模块：

- `data/providers/`：AKShare 等供应商适配器。
- `data/collectors/`：后续批量采集流程的归档位置。
- `data/validators/`：进入存储和 Alpha 之前的数据质量闸门。
- `data/storage/`：SQLite 本地日线存储。
- `data/market_data_service.py`：Alpha 和 Decision 层使用的统一读取接口。
- `alpha/`：研究阶段因子和 Alpha 分数组合。

数据模块保持供应商字段隔离；策略层通过 `MarketDataService` 读取标准字段。

[架构说明](../docs/architecture/README.md)
