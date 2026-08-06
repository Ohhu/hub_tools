# Technical Design

## Current failure mode

资源市场不同页面使用不同的筛选字段和排列顺序。渠道广场包含搜索、渠道 ID、标签、排序和健康序列；模型详情页还可能包含窗口、健康序列和排序。旧脚本把免费按钮绑定到固定锚点或绝对位置，因此会覆盖字段，或在 React 调整顺序后落到排序前面。

站点同时新增“添加到已有密钥”按钮。脚本当前只把“创建 API 密钥”识别为可替换入口，因此它无法替换新按钮，随后又根据渠道卡片数据追加“更新 API 密钥”，形成两个近似入口。

## UI adaptation

### Price filter

- 把脚本字段作为普通 grid child 追加到当前筛选网格末尾，不再依赖原生字段的固定顺序，也不使用 absolute position、运行时矩形测量或 CSS 自定义坐标。
- 字段采用与站点一致的 `space-y-1` 容器、上方小号“价格”标签和 32px 紧凑胶囊按钮，避免空白列中的全宽按钮过于突兀。
- 在当前支持的市场筛选 grid 上增加脚本标记类，模型详情和渠道广场共用同一“追加到末尾”规则。
- 在 `min-width: 1280px` 覆盖为六列；更小宽度继续使用站点原有一列/两列规则。
- 离开支持的市场页面或节点被 React 重建时清理脚本标记，重新挂载保持幂等。

### API key action replacement

- 将按钮识别从“创建 API 密钥”扩展为通用 API Key action，支持“创建 API 密钥”“添加到已有密钥”及英文文本。
- 忽略已经带脚本 trigger class 的按钮，避免重复替换。
- 不复用原生按钮 class；统一使用脚本自有渠道按钮 class、钥匙图标及明暗主题样式，确保卡片和列表中的入口一致。
- 继续通过现有 React/payload/DOM 渠道识别获取渠道信息；只有取得渠道 ID 才替换。
- React 重渲染恢复原生按钮后，MutationObserver 会再次执行同一幂等替换。
- 同一挂载周期清理市场 provider/渠道项中的“真伪核验”按钮；React 重建后由 MutationObserver 再次清理。

## Source boundaries

继续使用一个 IIFE 内按顺序拼接的零依赖构建，不在本次引入 ESM。结构调整以“移动现有函数声明、不改业务算法”为主，降低重构风险。

### State

- `core/state.js`：合并 `cache-state.js` 中的 Map/WeakMap 声明。

### Marketplace

- `price-predicates.js`：价格规范化和免费判定纯函数。
- `model-price-cache.js`：模型价格缓存及隐式免费上下文。
- `channel-scan.js`：市场分页扫描和补充请求。
- `payload-filter.js`：按价格过滤 marketplace payload。
- `payload-augment.js`：补充模型 provider 价格 payload。
- `pricing.js`：保留 marketplace 路由/model ID、请求 URL 和渠道 ID 等共享协调 helper。

### DOM

- `route-watcher.js`：路由变化后的调度。
- `panel-mount.js`：统一挂载协调。
- `request-triggers.js`：请求页入口。
- `marketplace-filter-ui.js`：筛选字段发现、创建、状态同步和可见项过滤。
- `select-like-user.js`：Radix select 的指针/鼠标事件模拟。
- `mount-and-marketplace-ui.js`：仅保留渠道操作按钮发现、渠道卡片/列表行识别和 trigger 创建。

### Channels

- `react-channel-probe.js`：React props/fiber 渠道探测。
- `payload-channel-extract.js`：网络 payload 渠道提取。
- `core/channel-cache.js`：缓存读写和模型 provider 价格状态；吸收 `channel-normalize.js` 的比较 helper。

### API Keys

- 保留高度耦合的 `dialog-ui.js`，删除没有实际实现的 style/template/events 占位文件。
- `key-picker-ui.js`：迁移密钥选择器渲染和同步逻辑。
- `edit-channel-list.js`：迁移编辑列表、排序和拖拽；不再保留单独的空 drag 模块。
- `operations.js`：保留绑定、新建、保存和通用状态操作。

## Compatibility and rollback

- 构建后仍是单一 `.user.js`，Tampermonkey 安装和 `document-start` fetch patch 时序不变。
- 源码移动使用函数声明，保持同一 IIFE 共享作用域；构建清单显式维护依赖顺序。
- 自动化测试继续从最终 bundle 加载，能够覆盖拼接顺序和初始化错误。
- 若浏览器验证发现站点 DOM 识别回归，可单独回退 DOM 模块移动，而不影响 marketplace payload 和 API Key 数据层。
