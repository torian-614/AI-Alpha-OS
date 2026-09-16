# AI Alpha OS 数据契约

版本：V1 设计稿。范围：Sprint 1.2；仅定义逻辑字段与语义，不绑定数据库、数据供应商或接口实现。

## 一、通用约定

- 字段使用 snake_case。string 保留股票代码前导零；int64 为整数；decimal 为十进制定点数，存储精度由后续实现确定且不得静默截断；bool 为布尔；date 使用 YYYY-MM-DD；timestamp 为带时区时间，业务统一 Asia/Shanghai。
- 价格单位为人民币元/股，金额为人民币元，成交量和股本为股；来源若使用手、万元等单位，入库前转换并保留来源说明。
- 比例统一为小数，0.05 表示 5%；收益率可以为负，计数和成交量不得为负。
- 默认字段必填，类型后带 ? 表示允许 null；null 表示未知、不可用或不适用，须在 quality_flags 中区分原因。零仅表示确认的零值，禁止以零填补缺失行情。
- 证券唯一键为 security_id，采用 exchange:stock_code；exchange 为 SSE、SZSE 或 BSE。枚举支持身份归档，不代表 V1 已实现所有市场规则。
- 原始价格采用不复权口径；特征计算若需复权，必须指定因子版本与截至时点，不能混用复权价格和实际成交价格。

### 所有数据集共用的元数据

| 字段名称 | 数据类型 | 用途 |
| --- | --- | --- |
| record_id | string | 一条不可变版本记录的唯一标识 |
| schema_version | string | 本契约版本，控制兼容性 |
| source | string | 原始提供方或派生任务标识 |
| source_record_id | string? | 来源记录标识；缺失时记录原因 |
| event_time | timestamp | 事件发生或统计区间结束时间 |
| available_at | timestamp | 该版本最早可被策略使用的时间 |
| ingested_at | timestamp | 本系统实际接收时间 |
| dataset_version | string | 不可变数据快照版本 |
| revision | int64 | 同一业务键的修订序号，从 1 开始 |
| quality_flags | array<string> | missing、stale、estimated_availability、invalid 等标记；空数组表示检查未发现问题 |
| lineage_refs | array<string> | 输入 record_id 或不可变清单引用；派生数据必有来源关联 |

业务键对应多个修订版本，唯一约束为业务键 + source + revision；record_id 全局唯一。每次运行固定 source 选择规则与 dataset_version，禁止多供应商记录直接相加。

历史回放只能选择 available_at 不晚于决策时间的版本；不能用后来修订的版本替换当时输入。历史回补的 ingested_at 可以晚于 available_at，但须有来源发布时间证据。模拟实时模式以 available_at 和 ingested_at 的较晚值作为可用时间。

若来源发布时间不可获得，使用可证明的首次接收时间或保守延迟，标记 estimated_availability；不得假定收盘数据在当日开盘已知。派生数据的 available_at 不早于全部输入可用时间及计算延迟。

## 二、股票基础数据

数据集：security_master。粒度：证券在一个有效区间内的属性版本。业务键：security_id + effective_from。

| 字段名称 | 数据类型 | 用途 |
| --- | --- | --- |
| security_id | string | 稳定证券身份 |
| stock_code | string | 原始股票代码 |
| exchange | enum | SSE / SZSE / BSE |
| stock_name | string | 该有效期内的简称，保留历史更名 |
| board | string | 所属市场板块，如主板、创业板、科创板或北交所 |
| list_date | date | 上市日期，控制历史可选范围 |
| delist_date | date? | 已知退市日期；未知或未退市为 null |
| listing_status | enum | listed / delisted；停牌在交易状态中记录 |
| risk_warning | enum | normal / ST / STAR_ST / other，按历史状态记录 |
| total_shares | int64? | 总股本，估值及规模研究使用 |
| float_shares | int64? | 无限售流通股本，换手率与规模归一化使用 |
| effective_from | timestamp | 属性业务生效时间 |
| effective_to | timestamp? | 属性失效时间，不包含端点；当前有效为 null |

有效区间采用左闭右开；相同来源、同一证券的有效区间不应重叠。历史股票池须保留退市股票，不能用当前成员反推历史。

## 三、日线行情数据

数据集：daily_bar。粒度：证券 × 交易日。业务键：security_id + trade_date。

| 字段名称 | 数据类型 | 用途 |
| --- | --- | --- |
| security_id | string | 关联股票基础数据 |
| trade_date | date | 所属交易日 |
| prev_close | decimal? | 当日官方参考前收盘价，用于涨跌幅；除权日不直接取上一根原始 close |
| open | decimal? | 当日首笔成交价 |
| high | decimal? | 当日最高成交价 |
| low | decimal? | 当日最低成交价 |
| close | decimal? | 当日收盘价或来源认可的日终估值价 |
| volume | int64 | 成交股数；确认无成交时为 0 |
| turnover | decimal | 成交金额 |
| turnover_rate | decimal? | volume / 当时有效 float_shares；分母缺失时为 null |
| trading_status | enum | normal / suspended / no_trade / delisted |
| limit_status | enum | bounded / unbounded / unknown |
| limit_up_price | decimal? | 当日实际适用涨停价 |
| limit_down_price | decimal? | 当日实际适用跌停价 |
| close_at_limit_up | bool? | 有涨停限制且 close 等于涨停价；不适用或无法确认时为 null |
| touched_limit_up | bool? | 有有效成交达到涨停价；由准确价格或事件数据确认 |
| consecutive_limit_up_days | int64? | 截至当日连续市场交易日收盘涨停次数，非涨停为 0；停牌或无适用涨停限制打断序列 |

无成交或停牌时 OHLC 按来源实况允许 null，不伪造 K 线；估值沿用价格必须在回测账本单独标记。价格范围检查 low ≤ open、close ≤ high，且 low ≤ high，仅对实际有效价格检查。限价是否适用由 limit_status 判断，不能由 null 推断“无涨跌停”。

## 四、分钟数据

数据集：minute_bar。粒度：证券 × 完整一分钟区间。业务键：security_id + bar_start + bar_end + session。

| 字段名称 | 数据类型 | 用途 |
| --- | --- | --- |
| security_id | string | 证券身份 |
| trade_date | date | 交易日 |
| bar_start | timestamp | 区间开始，包含端点 |
| bar_end | timestamp | 区间结束，不包含端点 |
| session | enum | continuous / opening_auction / closing_auction，防止重复混算 |
| open | decimal? | 区间首笔价格 |
| high | decimal? | 区间最高价格 |
| low | decimal? | 区间最低价格 |
| close | decimal? | 区间末笔价格 |
| volume | int64 | 区间成交股数 |
| turnover | decimal | 区间成交金额 |
| bar_status | enum | traded / no_trade / suspended |
| is_complete | bool | 是否已完成该区间；未完成数据不得作完整 bar 使用 |

来源若按右端点标记分钟，须显式转换边界并保留转换版本；交易时段以历史交易日历为准。竞价结果保存在竞价数据中，如另构造竞价 bar，必须去重，不能将它再次加入连续竞价成交量。

## 五、竞价数据

数据集：auction_snapshot。粒度：证券 × 交易日 × 竞价阶段 × 快照时间 × 快照类型。业务键由这些字段组成。

| 字段名称 | 数据类型 | 用途 |
| --- | --- | --- |
| security_id | string | 证券身份 |
| trade_date | date | 交易日 |
| auction_session | enum | opening / closing |
| snapshot_time | timestamp | 快照对应时间 |
| snapshot_type | enum | indicative / final |
| reference_price | decimal? | 来源披露的虚拟匹配价；final 时为最终竞价成交价 |
| matched_volume | int64? | indicative 为虚拟匹配量，final 为实际成交量 |
| matched_turnover | decimal? | 与 matched_volume 同口径的金额；派生值须记录 lineage |
| unmatched_buy_volume | int64? | 虚拟未匹配买量；供应商未披露不得填 0 |
| unmatched_sell_volume | int64? | 虚拟未匹配卖量；同上 |
| prev_close | decimal? | 当日官方参考前收盘价 |
| auction_return | decimal? | reference_price / prev_close - 1；分母无效则 null |

indicative 不等于真实成交。final 信息只有发布并可用之后才能参与评分，不能使用最终竞价结果生成信号后又声称已参与同一次竞价成交。仅有 final 数据时，V1 竞价信号在之后的连续竞价窗口模拟成交。

## 六、龙虎榜数据

数据集：dragon_tiger_seat。粒度：一次披露、一个上榜原因、一个交易方向、一个排名席位。业务键：disclosure_id + reason_code + side + rank。

| 字段名称 | 数据类型 | 用途 |
| --- | --- | --- |
| disclosure_id | string | 披露事件唯一标识 |
| security_id | string | 上榜证券 |
| period_start | date | 统计开始日 |
| period_end | date | 统计结束日，区分单日与多日榜 |
| published_at | timestamp | 来源披露时间，约束 available_at |
| reason_code | string | 上榜原因编码 |
| reason_text | string | 原始原因描述，便于审计 |
| side | enum | buy / sell 排名方向 |
| rank | int64 | 在该方向的披露排名 |
| seat_id | string? | 可稳定识别的席位标识 |
| seat_name | string | 披露席位名称 |
| buy_amount | decimal? | 披露的买入金额，未披露为 null |
| sell_amount | decimal? | 披露的卖出金额，未披露为 null |
| net_amount | decimal? | buy_amount - sell_amount；任一未知则 null |

同一席位可能同时出现在两个方向和多个上榜原因中，不得跨方向、原因或重叠统计期间直接加总。龙虎榜属于披露后可用信息，不用于此前信号。此数据类先建立标准，不强制成为 V1 评分依赖。

## 七、板块数据

### 板块成员

数据集：sector_membership。业务键：sector_id + security_id + effective_from + classification_version。

| 字段名称 | 数据类型 | 用途 |
| --- | --- | --- |
| sector_id | string | 含分类来源命名空间的板块标识 |
| sector_name | string | 对应版本的板块名称 |
| sector_type | enum | industry / concept |
| classification_version | string | 分类体系版本 |
| security_id | string | 成员证券 |
| effective_from | timestamp | 成员关系开始生效时间 |
| effective_to | timestamp? | 关系失效时间，不包含端点 |
| member_weight | decimal? | 指数权重；等权研究不强求供应商权重 |

### 板块统计

数据集：sector_snapshot。业务键：sector_id + snapshot_time + metric_version + universe_version。

| 字段名称 | 数据类型 | 用途 |
| --- | --- | --- |
| sector_id | string | 对应板块 |
| trade_date | date | 统计交易日 |
| snapshot_time | timestamp | 统计截止时点 |
| universe_version | string | 本次实际成员集合与纳入规则 |
| metric_version | string | 收益聚合、缺失处理等算法版本 |
| member_count | int64 | 时点有效成员总数 |
| valid_member_count | int64 | 本次可计算成员数，报告覆盖率 |
| return_rate | decimal? | 有效成员价格相对各自 prev_close 的等权平均；改变权重须新版本 |
| turnover | decimal? | 已确认成员成交金额合计；缺失成员须报告覆盖 |
| advancing_count | int64 | 有效成员中相对 prev_close 上涨的数量 |
| limit_up_count | int64? | 截止时点处于涨停价的有效成员数量 |
| leading_security_id | string? | 按冻结的龙头评价规则产生的候选；并非事后表现最优股票 |

历史分析使用当时可知且有效的成员关系，不使用今天的概念归属回填过去。leading_security_id 的生成版本和输入在 lineage_refs 中关联。

## 八、情绪数据

数据集：market_sentiment。粒度：股票池 × 截止时间 × 指标与周期分类版本。业务键：universe_version + snapshot_time + metric_version + cycle_model_version。

| 字段名称 | 数据类型 | 用途 |
| --- | --- | --- |
| trade_date | date | 交易日 |
| snapshot_time | timestamp | 统计截止时点 |
| universe_version | string | 股票池及排除规则的不可变版本 |
| metric_version | string | 聚合统计口径版本 |
| eligible_count | int64 | 纳入统计的证券数量 |
| valid_count | int64 | 数据有效的证券数量 |
| limit_up_count | int64? | 截止时点处于涨停价的数量；盘后即收盘涨停数 |
| touched_limit_up_count | int64? | 当日截至时点曾有成交触及涨停的证券数 |
| failed_limit_up_count | int64? | 曾触及涨停但截止时点未在涨停价的证券数 |
| failed_limit_up_rate | decimal? | failed_limit_up_count / touched_limit_up_count；分母为 0 则 null |
| max_consecutive_limit_up | int64? | 最近已完成交易日的最高连板高度，来源为日线序列 |
| market_turnover | decimal? | 纳入股票池截至时点成交金额合计 |
| cycle_stage | enum | unknown / contraction / repair / expansion / divergence |
| cycle_model_version | string | 情绪阶段划分规则与参数版本 |

无涨停限制的股票不进入涨停相关计数；股票池范围固定并报告缺失覆盖。若影响上述计数的关键数据不完整，相关计数与比率为 null，不把缺失当作“未涨停”。cycle_stage 阈值尚未确定，未配置时为 unknown，不按主观判断伪造标签。

## 九、回测支撑数据与质量闸门

以下为七类数据之外的必要配套语义，仍只定义文档。

| 数据集 / 业务键 | 字段名称与数据类型 | 用途 |
| --- | --- | --- |
| trading_calendar / exchange + trade_date | exchange: enum；trade_date: date；is_open: bool；sessions: array<object>，每项包含 session: string、start_at: timestamp、end_at: timestamp | 区分自然日、交易日和可撮合窗口 |
| trading_rule / market_rule_id + effective_from | market_rule_id: string；exchange: enum；board: string；effective_from: date；effective_to: date?；price_tick: decimal；min_buy_qty: int64；buy_qty_step: int64；odd_lot_sell_policy: string；sell_lock_trading_days: int64；source_url: string | 保存历史适用的最小报价、申报数量与持仓可售限制；具体值依规则核验 |
| corporate_action / action_id | action_id: string；security_id: string；action_type: enum；ex_date: date；pay_date: date?；cash_per_share: decimal?；share_ratio: decimal?；published_at: timestamp | 分红、送转等权益变动；action_type 为 dividend / split / rights / other；未支持类型阻断相关持仓区间 |
| adjustment_factor / security_id + trade_date + factor_version | security_id: string；trade_date: date；factor_version: string；factor: decimal；anchor_date: date | 可追溯的特征复权；锚点和计算所需信息不得晚于信号时点 |

配套数据同样继承通用元数据。交易状态发生盘中变化时需更细粒度事件记录；仅有日线状态不足以认证盘中交易可执行性。

质量检查包含业务键唯一性、引用完整性、有效期不重叠、时间顺序、量价单位与价格边界、来源覆盖及版本锁定。关键输入缺失或不可信时停止该证券评分或成交模拟并记录原因，不能静默补值。

存储技术、供应商、数值精度、交易规则适用范围和具体参数由后续 Task 确认。本契约不提供接口代码，也不代表已接入数据。

[数据索引](README.md) · [Alpha 评分](../alpha/ALPHA_SCORING.md) · [回测规则](../backtest/BACKTEST_RULES.md)
