# Sprint 2.0 MVP Guide

Sprint 2.0 首次提供可运行的研究阶段 A 股数据与 Alpha 评分闭环。当前实现只读取公开研究数据并输出可解释的研究分数，不包含交易策略、订单、账户或实盘执行。

## 安装

建议使用 Python 3.10 或更高版本，并在项目根目录建立虚拟环境：

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# macOS/Linux
source .venv/bin/activate
python -m pip install -r requirements.txt
```

AKShare 只在创建 `AKShareDataSource` 后按需导入，因此单元测试不需要访问网络；运行示例需要网络和 AKShare 可访问的数据源。

## 运行示例

在项目根目录执行：

```bash
python examples/run_alpha_mvp.py 000001 --start 20230101 --end 20241231
```

示例会获取平安银行的历史日线数据，经过统一字段转换和质量检查后写入 `work/market_data.sqlite`，再从 SQLite 读取并输出 `symbol/name/trade_date/open/high/low/close/volume/amount/pct_change/source` 以及三个因子和综合 Alpha 分数。

## 评分基线

- Trend Factor：最新收盘价相对 60 日均线，50 为中性。
- Momentum Factor：20 个交易日收益率，50 为中性。
- Volume Factor：最新成交量相对前 20 日平均成交量，量比 1.0 对应 50。
- 综合分默认权重为 Trend 40%、Momentum 35%、Volume 25%，最后限制在 0–100。

AKShare 的日线成交量单位是“手”，标准化层按 1 手 = 100 股转换为 `volume`；AKShare 的涨跌幅是百分比，标准化层转换为小数比例。原始供应商字段不会传入 Alpha 层。

### 网络故障处理

适配器会为 `query.sse.com.cn`、`www.sse.com.cn`、`www.szse.cn`、`www.bse.cn` 和 `push2his.eastmoney.com` 加入 `NO_PROXY`，因此不会使用失效的本地代理；请求失败时最多重试 5 次并逐步增加等待时间，历史行情请求单次超时为 15 秒。若仍失败，会抛出包含操作名称和尝试次数的 `DataSourceError`，不会把不完整数据送入校验或存储。

如果运行环境设置了不可用的 `HTTP_PROXY`、`HTTPS_PROXY` 或 `ALL_PROXY`，适配器只对 AKShare 目标域名绕过代理，不改变其他网络请求的代理设置。

窗口和权重是研究基线参数，不代表已验证的投资策略，也不产生 BUY/SELL 指令。数据不足时返回 `status=insufficient_data`，不会用默认值填充。

## 数据源扩展

Alpha 层只依赖 `DataSource` 接口。未来接入 TuShare 或其他供应商时，实现 `list_stocks()` 与 `get_daily_history()`，再将实现传给 `DataLoader` 即可；供应商字段在 loader 中统一成内部字段。

## 验证

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
```

测试覆盖数据源抽象、字段归一化、质量闸门、SQLite 幂等写入/读取、三个因子、分数边界、缺失数据和输入校验。联网示例不作为默认自动化测试的一部分。
