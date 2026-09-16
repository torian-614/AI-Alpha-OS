# 开发与贡献规范

## 当前环境

截至 Sprint 0.2，仓库只有 Markdown 文档和目录说明，阅读仓库无需安装依赖。语言、包管理器、构建、测试和 CI 工具尚未选定，因此当前没有安装、启动或业务测试命令。

## 贡献流程

阶段定义和交付条件见 [Development Workflow](DEVELOPMENT_WORKFLOW.md)：Idea → RFC → PRD → Architecture → Task → Codex → Review → Merge。

1. 通过 Issue 或明确的维护者任务描述问题、范围和验收标准。
2. 阅读 [CODEX_RULES.md](../../CODEX_RULES.md) 与相关设计；检查 Git 状态，保留他人修改。
3. 创建范围明确的工作分支，保持修改聚焦。
4. 更新实现对应的文档与 [CHANGELOG.md](../../CHANGELOG.md)；当前阶段仅接受本次任务授权的基础目录与文档工作。
5. 检查文件差异、链接与内容一致性；后续代码任务执行相应测试。
6. 提交 Pull Request，说明变更原因、最终行为、验证结果与未决事项，由维护者审查。

## 命名与格式

- 目录及普通文档采用小写 kebab-case，目录入口使用 README.md。
- 根目录约定文档及指定治理文档 PROJECT_CHARTER.md、DEVELOPMENT_WORKFLOW.md 使用大写名称；ADR 采用四位编号前缀。
- 文本采用 UTF-8、LF 换行，文件末尾保留换行，避免尾随空格。
- 使用相对链接；新增文档同步更新索引。
- 常规提交信息采用 Conventional Commits 风格，例如 docs: clarify project scope；具体任务有指定信息时遵从任务要求。

## 文档检查

- 所有本地链接和目录引用可解析。
- 已实现、规划中与待定事项标注准确。
- README、路线图和 Sprint 验收状态一致。
- 变更不包含凭据、数据文件或无关生成物。
- 不将尚未建立的测试套件描述为测试通过。

## 协作约定

讨论聚焦问题和可验证的事实，尊重贡献者。发现疑似凭据或敏感信息时，不在公开 Issue 或评论中复制其内容。

[返回文档索引](../README.md)
