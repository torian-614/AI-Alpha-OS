# AI Alpha OS Alpha Signal Engine 架构

任务：Sprint 1.9 — Design Alpha Signal Engine Architecture。状态：仅架构设计，尚未实现。本次不创建 Python 文件，不接入数据、不运行模型、不执行交易。

## 一、系统位置与职责

```text
Data Layer
    ↓
Feature Engine
    ↓
Alpha Signal Engine
    ↓
Decision Engine
    ↓
Backtest Engine
```

Data Layer 提供有来源、时间及版本的数据；Feature Engine 计算可复用原始特征；Alpha Signal Engine 将特征转为可解释的评分、候选及排名；Decision Engine 根据规则、市场状态和风险作最终决策；Backtest Engine 按历史顺序模拟决策结果。Paper Trading 可作为另一个下游消费者，实盘仍需独立授权。

**Alpha Engine负责发现机会，Decision Engine负责最终决策。** Alpha 信号是机会证据，不是 BUY/SELL 指令，不包含账户操作权限。

回测时由历史时钟驱动相同的上游数据和评分流程，不能直接使用今天重算且包含未来信息的信号；回测结果只进入独立研究反馈，不能修改本次已封存的评分。

## 二、核心处理架构

| 模块 | 输入 | 输出与责任 |
| --- | --- | --- |
| Factor Registry | 因子定义、分类、输入字段与版本 | 注册依赖、方向、窗口、单位、缺失策略及用途 |
| Feature Intake | Feature Engine 时点快照 | 校验数据覆盖、特征版本、available_at 与输入清单 |
| Factor Evaluation | 已登记特征与冻结规则 | 单因子值、归一化分数、证据及质量状态 |
| Configured Scoring | 分类与因子权重、启用配置 | 分类得分、Alpha Score及逐项贡献，不内置权重 |
| Signal Generator | 评分、候选规则和股票池 | 标准 Alpha Signal Object、候选集合、排名与拒绝记录 |
| Signal Publisher | 已持久化信号批次 | 幂等发布、过期控制、完整性与消费状态 |
| AI Analysis Sidecar | 只读信号与获准证据 | 解释、异常提示和研究评分建议，不写入正式分数 |

候选发现只做数据资格、研究范围和评分筛选。账户预算、可售持仓、入场/退出规则、风险红线和交易动作由 Decision Engine处理，不在 Alpha 层另造一套执行逻辑。

特征和因子使用无环依赖图；依赖缺失或尚未完成时输出 insufficient_data，不能用尚未生成的下游结果反哺当前因子。

## 三、Alpha Signal 分类体系

这些分类是研究能力目录，不代表本阶段已实现全部因子。每个因子固定一个主分类，允许多标签检索，但聚合时只计一次权重。

| 分类 | 包含因子 | 输入与评价方向 | 质量与时点边界 |
| --- | --- | --- | --- |
| Trend Alpha（趋势因子） | 均线结构、趋势强度、突破状态、价格位置 | 已完成日线/分钟特征、历史高低点、均线与相对位置；按冻结规则形成趋势分 | 窗口只含已知数据，突破基准不得包含未来最高价 |
| Momentum Alpha（动量因子） | 短中期涨幅、强势持续性、龙头延续性 | 历史收益序列、相对强弱、过去已确认龙头身份 | 不用后续涨幅倒推龙头，短中期窗口需明确 |
| Capital Flow Alpha（资金因子） | 成交额变化、成交量异常、大资金行为、主力资金流向 | 量额异常及获授权的逐笔/资金分类特征 | “主力”与“大资金”须定义分类方法；估计流向不是账户资金事实，无数据不能推断 |
| Sentiment Alpha（情绪因子） | 涨停数量、连板高度、炸板率、情绪周期、市场热度 | 冻结股票池的市场广度、梯队、量额或事件热度 | 区分日终与盘中、统计分母与覆盖；热度定义版本化，不重复转载放大 |
| Event Alpha（事件因子） | 新闻、公告、热点主题、行业事件 | 发布后可用事件、实体与主题关联、规则分类 | 记录发布时间、修订、来源、去重和标签完成时间；不能回填后生成标签 |

资金分类、事件分类和热度若缺少合格输入，相关因子不具备可用能力。目录中存在名称不代表可直接启用。

### 与 Alpha001–Alpha005 的关系

现有 Alpha ID 是场景模型，以上五类是因子分类，二者不是一一替换关系：

- Alpha001 竞价模型可组合资金、动量和情绪证据。
- Alpha002 主要使用情绪分类及市场趋势上下文。
- Alpha003 可组合趋势、动量、资金与情绪。
- Alpha004 是板块对象模型，可使用趋势、资金和情绪特征。
- Alpha005 仍是风险输出，高分高风险，不作为正向机会分类重复加分。

现有 [公式规范](ALPHA_FORMULA_SPEC.md) 的 profile 与本分类加权 profile 分别版本化。每次运行明确采用哪个 scoring_profile；不能同时叠加两套总分或两次扣除同一风险。新增分类不取消现有研究准入要求。

## 四、配置化 Alpha Score 模型

### 两级聚合

所有因子先按配置的方向和归一化方法转换为0–100分。将原始负向量转换为低机会分，不让其权重偷偷变负。

CategoryScore_c = Σ(w_cj × FactorScore_cj)

Alpha Score = W_T × TrendScore + W_M × MomentumScore + W_C × CapitalFlowScore + W_S × SentimentScore + W_E × EventScore

每个已启用分类内 w_cj≥0且总和为1；已启用分类间 W_c≥0且总和为1，因此有效 Alpha Score 为0–100。示例中的连接符表示组成关系，不把动量、资金、情绪及事件分一律当作负项。

**评分必须配置化，禁止硬编码。** 本规范不指定默认数值；缺少配置时 invalid_config，不用隐含等权兜底。规则公式的实现可固定，但窗口、边界、权重、分类启用和候选门槛来自版本化配置。

| 配置项 | 必需内容 |
| --- | --- |
| scoring_profile_id / version | 配置身份、有效期、允许模式与审查引用 |
| factor_definitions | factor_id、版本、主分类、输入字段、单位、窗口、方向与归一化 |
| category_weights | 五类启用状态及权重，禁用分类权重为0 |
| factor_weights | 每类内部权重与因子启用清单 |
| eligibility_policy | 股票池、最低覆盖、时点新鲜度及可用性约束 |
| candidate_policy | 分数门槛、候选数量、排序和并列处理 |
| confidence_policy | 置信/证据充分性计算方法与必要门槛 |
| missing_policy | 必需输入失败处理，明确禁用与临时缺失的区别 |
| evidence_policy | 输入清单、贡献、解释和审计保存要求 |

预先禁用 Event 类别可使用经审查的其他分类权重；运行中 Event 数据中断不等于预先禁用，不能临时重分配。启用类别的必需因子缺失时不发布可用总分，保留部分观测用于诊断。

confidence 不自动乘入 score；如需将质量纳入筛选，必须通过独立配置规则并保留版本。相同0–100尺度不表示跨profile可直接比较，也不表示盈利概率。

### 配置治理

配置先在隔离研究模式验证，经回测、样本外和前向模拟审查后才能进入相应允许模式。单批次固定配置，热更新只影响明确的新批次，不改写历史结果；不从新闻或AI输出动态加载规则。

记录因子相关性和重复暴露，防止量额变化既计分类分又在场景总分中重复计权。最终规则和权重须遵循 [研究协议](../research/RESEARCH_PROTOCOL.md)，本次未选择获验证的参数。

## 五、Alpha Signal Object 标准结构

### 粒度

采用同一公共结构，signal_level区分 factor、category、aggregate。每一层是独立不可变信号，child_signal_ids 保存构成关系，避免把一只股票的多个因子压成一个无从解释的value。

factor_type 在factor/category层为五类枚举；aggregate层为 composite。只对同一配置、对象类型和时点的aggregate信号作最终候选排序。

| 字段 | 类型 | 含义与约束 |
| --- | --- | --- |
| signal_id | string | 不可变信号身份，同一计算请求重试保持一致 |
| stock_code | string? | 股票信号必填并保留前导零；市场/板块上下文可空 |
| timestamp | timestamp | 信号实际生成时间，不是行情事件时间 |
| factor_type | enum | trend / momentum / capital_flow / sentiment / event / composite |
| factor_name | string | 注册因子、分类或组合名称，不充当版本ID |
| value | decimal? | factor层为原始因子值；category/aggregate层为聚合后、展示舍入前的分数 |
| weight | decimal | 对直接父聚合的配置权重；顶层aggregate为1，不代表仓位 |
| score | decimal? | 当前节点归一化或聚合后的0–100分，不含父权重乘积 |
| source | array<string> | 原始来源/派生任务标识，由血缘清单解析，不仅写“AI” |
| confidence | decimal? | 0–1证据充分性或经验证的置信度，须有方法版本；未知为null，不当盈利概率 |
| explanation | object | 确定性特征说明、规则引用、贡献和输入证据；AI附加解释单独引用 |
| signal_level | enum | factor / category / aggregate |
| subject_type / subject_id | enum / string | stock / sector / market 与稳定身份 |
| stock_id | string? | 股票信号必填，不能仅以stock_code跨市场关联 |
| data_cutoff_time | timestamp | 本次允许读取输入的截止时间 |
| available_at / expires_at | timestamp / timestamp | 信号完成可用时间与失效边界；available_at≥timestamp |
| input_data_version / input_refs | string / array<string> | 不可变跨表输入清单及具体证据 |
| scoring_profile_id / config_version | string / string | 评分配置身份与版本 |
| factor_version / feature_version | string? / string? | factor层必填；聚合层由子节点引用 |
| child_signal_ids | array<string> | 分类/组合的构成信号，无子项时为空 |
| contribution | decimal? | weight×score的贡献；score为空时为null |
| confidence_method_version | string? | confidence有值时必填 |
| status / reason_codes | enum / array<string> | valid / insufficient_data / invalid_config / expired及原因 |
| batch_id / ranking_batch_id / rank | string / string? / int64? | 批次、可比排名集合与名次，非排名节点后两项为空 |
| ai_annotation_ref | string? | 只读AI说明或异常分析引用 |
| schema_version / data_version | string / string | 信号契约及输出批次版本，与输入版本分开 |

有效输入上score=0是正常低分，不能当作缺失；无效状态score和contribution为空。不发布缺少必要字段的valid信号。quantity、side、entry_rule、exit_rule、订单价格不属于本对象。

原始value的单位、score方向及归一化记录在因子注册中；用于解释的文本不能被消费者解析为执行字段。AI不可直接写weight、score、confidence或rank。

股票、板块和市场共用逻辑信号对象，但 [DATABASE_SCHEMA.md](../data/DATABASE_SCHEMA.md) 当前alpha_signal表仍需补齐跨对象与因子层级契约，不以虚假股票代码适配旧约束。

## 六、与 Decision Engine 的接口

### 发布与接收

定义逻辑消息 AlphaSignalBatch，不绑定HTTP、消息队列或语言。批次至少包含batch_id、模式、生成时间、输入截止时点、schema_version、config_version、冻结股票池、完整性摘要、信号清单、候选排名与诊断记录。

1. Alpha Engine持久化不可变信号和清单后发布批次。持久化失败不发布“成功”通知。
2. Decision Engine按schema与配置兼容性、模式准入、对象关系、完整性和新鲜度校验。重复batch_id和signal_id幂等接收。
3. 决策时要求信号已available_at≤决策的data_cutoff_time；信号本身的输入cutoff也不能晚于该时点，并核验允许的滞后范围。
4. schema不兼容、批次缺页、未通过配置或过期信号拒绝消费，记录原因；不能只接到高分部分便宣布完整候选池。
5. 数据修订或重评生成新批次并关联旧批次，不能覆盖已用于历史决策的信号。
6. 消费接收确认只代表已接收，不代表决定交易或已成交。outcome由Decision/执行结果追加产生。

### 机会评分与最终决策边界

| Alpha Signal Engine | Decision Engine |
| --- | --- |
| 因子证据、分类评分、股票候选与排名 | 市场姿态、规则选择、账户与持仓上下文 |
| 固定股票池的数据资格与研究候选筛选 | 入场/退出规则、风险红线、预算和模式权限 |
| 标准化signal_id和输入版本 | 独立decision_id及input_refs中的signal_id引用 |
| 诊断缺失与配置错误 | WATCH/HOLD/ENTER/EXIT等确定性意图及其风险判定 |
| 解释机会与来源 | 决定是否行动，后续消费者独立执行复检 |

Decision Engine 的 Alpha Signal Aggregation仍负责跨模型、市场和账户场景的决策级组合；不得再次无说明地重复本引擎已聚合的分类权重。接口通过score_semantics与profile元数据明确是场景分、分类分还是候选总分，消费哪个层级由决策配置锁定。

本引擎不依赖尚未生成的下游decision_id。若现有alpha_signal存储要求decision_record_id，使用评分阶段审计记录，或在后续契约中分离机会信号存储；不能制造与最终决策的循环外键。

已有 [Decision Engine架构](../decision/DECISION_ENGINE_ARCHITECTURE.md) 的风险闸门、执行复检和outcome机制继续有效。

## 七、Rule First 与AI辅助边界

AI不能直接输出可执行的“买入XX股票”指令，也不能调用订单工具或设置动作字段。任何此类自然语言不能进入执行消费接口。

允许AI：

- 解释信号：概括已有规则贡献，引用已封存的数据与评分。
- 发现异常：提示数据冲突、突变或研究疑点，形成待核查记录。
- 辅助评分：在隔离研究中提出因子、权重或归一化建议，由规则评审、回测及版本批准后才能进入正式配置；AI不直接改写运行期分数。

如未来引入模型提取事件特征，必须作为独立受版本管理的Feature Engine能力，经数据时点和研究验证后由确定性规则评分；本阶段不启用该能力。

AI输出与规则冲突时标记explanation_conflict，保留规则结果；若确有底层数据问题，由质量检查规则阻断，不能让AI自行捏造替代数据。AI超时不改变原始分数与候选排序。

网页、新闻、公告中的指令性文本属于不可信内容，仅作研究数据，不得变更评分配置。运行期AI旁路只读，与Decision Engine“AI无权修改分数”的原则一致。

## 八、未来代码规划

以下为未来计划，不是已创建目录或文件。本次仅记录职责，禁止据此声称引擎已实现。

```text
src/alpha/
├── alpha_engine.py
├── signal_generator.py
├── factor_model.py
└── scoring.py
```

| 计划文件 | 职责 |
| --- | --- |
| alpha_engine.py | 编排版本化输入、依赖顺序、批次处理与发布，不内置交易规则 |
| signal_generator.py | 生成标准信号、候选批次、幂等身份和排名，保存无效原因 |
| factor_model.py | 定义因子注册、分类、输入契约、输出对象和校验边界 |
| scoring.py | 实现受配置驱动的归一化、分类聚合、贡献计算与分数校验，不硬编码权重 |

Feature Engine实现、配置存储、消息方式及数据库迁移另立任务。文件名体现未来Python规划，不代表本次选定完整技术栈或获准实施。

## 九、验收场景与后续工作

后续实现至少验证：

- 五类分类及子因子注册完整，重复标签不重复计权。
- 权重未配置、为负或合计不满足约束时拒绝运行。
- 因子输入不足与预先禁用类别行为区分，不静默重分配。
- 输入使用未来信息、事件标签迟到或信号过期时无法被Decision消费。
- 相同输入和配置得到相同评分与稳定排序；重复投递不重复处理。
- 市场/板块信号不伪装成股票，因子分与组合分语义不混用。
- AI解释失败、建议买卖或要求改权重时不影响正式结果。
- 不发布含订单指令字段的Alpha信号。
- 数据修订生成新版本，旧决策仍能重建当时依据。

本次仅进行文档内容、链接和提交范围检查，不声称业务验收或回测已通过。下一步优先审查因子与信号契约、配置schema、批次接口和V1启用范围，再建立独立实现任务。

[Alpha索引](README.md) · [数据映射](ALPHA_DATA_MAPPING.md) · [公式规范](ALPHA_FORMULA_SPEC.md) · [研究协议](../research/RESEARCH_PROTOCOL.md)
