---
类型: 归档
状态: 有效
更新日期: 2026-07-26
---

# 抓包记录

浏览器 DevTools 抓包的**结构化记录**。每份记录包含抓取元数据（front matter）、请求（含 GraphQL query 与 variables）、响应节选和要点分析。

原始抓包副本已不再保留——超大响应（最大 11 MB）价值在结构不在数据量，且接口随时演化，需要新数据时应重新抓取。结构化的接口说明见[接口参考](../参考/接口参考.md)。

> 所有记录中的凭证（`authorization`、`cookie`、密钥、邮箱）均已脱敏。新增记录必须遵循同样格式：front matter 写明抓取日期/页面/原始体积，响应只保留代表性节选并标注截断位置。

## 记录清单

### 密钥页

| 记录 | 抓取日期 | 覆盖操作 |
| --- | --- | --- |
| [密钥-创建](密钥-创建.md) | 2026-05-08 | `CreateAPIKey` → `GetApiKeys` → `UpdateAPIKeyProfiles` → `Me` |
| [密钥-列表查询](密钥-列表查询.md) | 2026-05-09 | `GetApiKeys`（含完整响应结构） |
| [密钥-更新](密钥-更新.md) | 2026-05-09/10 | `UpdateAPIKey` → `GetApiKey` → `UpdateAPIKeyProfiles` |
| [密钥-可见渠道摘要](密钥-可见渠道摘要.md) | 2026-05-23 | `GetVisibleChannelSummarys`（编辑弹窗渠道列表） |
| [密钥页-DOM结构](密钥页-DOM结构.md) | 2026-05-09 | DOM 定位锚点与选择器约束 |

### 资源市场

| 记录 | 抓取日期 | 覆盖操作 |
| --- | --- | --- |
| [渠道广场-价格升序](渠道广场-价格升序.md) | 2026-05-10 | REST 列表 + `GetChannelProbeData` |
| [渠道广场-搜索](渠道广场-搜索.md) | 2026-05-10 | REST 搜索（佐证搜索结果不含价格明细） |
| [模型详情页](模型详情页.md) | 2026-05-10 | `MarketplaceModel` + `GetChannelModelProbeData`（佐证 pricing 字段缺失问题） |

## 外部参考

| 文件 | 内容 |
| --- | --- |
| `参考脚本-hub_pro-v3.js` | 第三方脚本 hub_pro v3.0.0 原文（lhish/hub_pro，MIT），保留原样 |
