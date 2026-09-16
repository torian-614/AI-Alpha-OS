# AI Alpha OS Alpha 评分框架

状态：V1 设计框架，尚未实现或验证。依据 [MVP PRD](../product/MVP_PRD.md)，本阶段定义维度、输入和输出，不确定最终参数。

## 一、评分流程与职责

数据契约校验 → 按决策时点截取可用数据 → 计算特征 → 归一化 → 分项评分 → 风险闸门 → 总分与解释 → 决策记录。

框架仅产生研究评分和模拟信号依据，不执行订单。数据接口遵循 [DATA_CONTRACT.md](../data/DATA_CONTRACT.md)，成交和结果评价遵循 [BACKTEST_RULES.md](../backtest/BACKTEST_RULES.md)。

## 二、五个评分维度

| 维度 | 输入 | 候选评价特征 | 输出与解释 |
| --- | --- | --- | --- |
| 竞价强度 | auction_snapshot、此前完整 daily_bar、历史流通股本 | 竞价相对前收盘涨幅、匹配金额相对历史同阶段金额、虚拟买卖不平衡、快照间稳定性 | auction_score；记录快照类型、时间与相对基准，异常高开不自动视为更优 |
| 板块强度 | sector_membership、sector_snapshot | 板块收益相对市场、上涨成员占比、涨停成员占比、成交活跃度 | sector_score；说明分类版本、成员覆盖与板块归属 |
| 龙头强度 | 股票日线或当时已完成分钟线、板块快照 | 相对板块表现、成交活跃度、历史连板高度、强势持续性 | leader_score；“龙头”为当时规则评估结果，不用后来的涨幅定义历史龙头 |
| 情绪周期 | market_sentiment 的历史序列与当时快照 | 涨停数量变化、连板高度、炸板率变化、市场成交活跃度、修复持续性 | sentiment_score 与 cycle_stage；阶段阈值待回测确定 |
| 风险控制 | 数据质量、交易规则、流动性、波动、模拟账户与暴露 | 数据完整性、可交易性、集中度、流动性与历史波动 | risk_status、risk_penalty 与 reason_codes；硬性拒绝不允许被高分抵消 |

所有特征使用截至 signal_time 已可用的数据。滚动窗口长度、特征方向、归一化区间、分位数阈值、权重和惩罚系数均待定；没有配置不得运行评分或使用隐藏默认值。

跨证券比较必须固定当时的股票池与覆盖率。多板块归属的选择或聚合方式由 parameter_version 固定，不允许事后挑选表现最好的板块。

## 三、与 PRD 首批 Alpha 的对应关系

| PRD 项目 | 本框架承载方式 |
| --- | --- |
| 竞价强度 | 独立竞价维度 |
| 板块强度 | 独立板块维度 |
| 龙头强度 | 独立龙头维度 |
| 情绪修复 | 情绪周期维度下的状态转变与修复特征，不删除该需求 |
| 首板二进 | 独立 setup_type：first_to_second 的候选场景，结合竞价、板块、龙头和情绪维度评价 |

首板二进的候选身份可由上一完整交易日 consecutive_limit_up_days 为 1 且收盘涨停的历史记录识别；当日是否晋级是后续结果，不能提前作为输入。停牌、无涨停限制及历史不完整的样本按数据契约处理。场景身份不等于买入建议，筛选细节和触发阈值待评估确定。

## 四、归一化与总分

分项输出统一映射到 0–100 的展示尺度；这是接口尺度，不是对参数效果的结论。

对通过质量检查的四个收益相关维度，以非负权重加权，权重之和为 1：

S_raw = w_auction × S_auction + w_sector × S_sector + w_leader × S_leader + w_sentiment × S_sentiment

风险软惩罚 P_risk ≥ 0：

S_final = max(0, min(100, S_raw - P_risk))

风险硬闸门拒绝时，eligible = false，final_score = null，并写明原因。风险分数不能覆盖暂停交易、不可用数据或持仓可售限制。

以上为框架约束。权重、归一化函数、特征方向、参数搜索空间、分数阈值和风险惩罚公式均尚未确定。四项必需维度缺失时 score_status = insufficient_data，不填 0，也不临时重分配权重；可选特征关闭须有独立参数版本并披露覆盖变化。

## 五、风险控制层

- 硬闸门：关键数据无效、证券状态或规则未知、不可交易、现金不足、超出已冻结的账户暴露约束等，阻止对应模拟新开仓。
- 软惩罚：较低流动性、历史波动或板块集中度等，使用独立、可解释参数。
- 已持仓风险处置生成可追溯退出请求，由回测系统判断何时能够卖出；风险触发不保证即时成交。
- 风控阈值和仓位上限后续通过研究确定；实际交易制度约束不属于可优化参数。

## 六、评分输出与决策追踪

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| decision_id | string | 对应 PRD 的唯一信号标识；更新追加记录 |
| signal_time | timestamp | 带时区的决策时间 |
| security_id | string | 股票唯一身份，保留股票代码与市场 |
| setup_type | string | generic / first_to_second 等已登记候选场景 |
| input_refs | array<string> | 输入 record_id 或快照清单 |
| data_snapshot_version | string | 固定输入版本 |
| rule_version | string | 特征、触发逻辑及实现语义版本 |
| parameter_version | string | 本次冻结参数版本 |
| triggered_rules | array<string> | 触发规则标识与原因引用；无信号时可为空 |
| dimension_scores | object | auction、sector、leader、sentiment 四项 decimal? |
| raw_score | decimal? | 风险调整前总分 |
| risk_status | enum | pass / penalized / rejected / unknown |
| risk_penalty | decimal? | 风险软惩罚，未知不得当 0 |
| reason_codes | array<string> | 风控、缺失及筛选说明 |
| final_score | decimal? | 风险调整后总分，拒绝或输入不足时为空 |
| eligible | bool | 是否可继续模拟信号筛选，不等于订单已获成交 |
| score_status | enum | scored / insufficient_data / invalid_config |
| outcome_ref | string? | 后续模拟结果记录，初始为空并标记待评估 |

只要进入评分流程，即使被拒绝也保留评估记录；形成信号后，最终结果由决策记录追加，不能改写原始评分。未记录触发规则、数据或参数版本的结果不可用于正式比较。

## 七、参数未来通过回测优化

1. 先冻结特征定义、候选参数范围、评价口径与基准，再运行实验。
2. 按时间划分训练、验证和最终样本外区间，滚动窗口只能使用过去数据；处理持有期重叠，避免标签跨分区泄漏。
3. 归一化统计、阈值与权重仅在允许的训练数据上拟合，不能用全样本分布预处理。
4. 在训练与验证区间比较收益、最大回撤、胜率、样本量及成本敏感性，保留失败实验。
5. 最终样本外区间用于一次独立评价；查看结果后再调参，必须另设未使用的评价区间。
6. 记录参数版本、数据版本、实验标识及决策依据，经 Review 后才替换后续运行版本，不追溯重算旧信号。

不以最高回测收益单一选择参数，不宣称当前框架已产生有效 Alpha。龙虎榜可作为后续研究输入，当前不强制纳入评分。

[Alpha 索引](README.md) · [回测规则](../backtest/BACKTEST_RULES.md)
