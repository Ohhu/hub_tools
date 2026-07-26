# 开发说明

`LinuxDo Hub Tool.user.js` 是安装到 Tampermonkey / 油猴里的最终单文件产物。
日常开发请修改 `src/` 下的源码片段，然后重新生成 userscript：

```bash
node scripts/build-userscript.js
```

检查最终产物是否与 `src/` 源码同步：

```bash
node scripts/check-userscript.js
```

运行 helper 级回归测试：

```bash
node tests/minimal-binder.test.js
node tests/request-utils.test.js
node tests/profile-binding.test.js
node tests/marketplace-pricing.test.js
```

语法检查：

```bash
node --check "LinuxDo Hub Tool.user.js"
node --check scripts/build-userscript.js
node --check scripts/check-userscript.js
```

开发约定：

- 优先修改 `src/`，不要直接手改根目录产物。
- 修改后运行 `node scripts/build-userscript.js` 更新 `LinuxDo Hub Tool.user.js`。
- 提交前运行同步检查和测试，避免源码与产物不一致。
- `scripts/build-userscript.js` 中的 `SOURCE_FILES` 是零依赖构建的模块边界，新增源码片段必须按层级插入。

源码层级顺序：

1. `src/core/constants.js`、`src/core/state.js` 与 `src/core/request-utils.js`：基础常量、状态和请求工具。
2. `src/graphql/`：GraphQL 查询、统一请求 client 和 pricing query 改写。
3. `src/marketplace/`：资源市场价格、分页、缓存和 payload filter / augment 边界。
4. `src/core/fetch-patch.js`：全局请求拦截。
5. `src/channels/` 与 `src/core/channel-cache.js`：React/payload 渠道探测和渠道缓存。
6. `src/dom/`：选择器、路由挂载和页面 UI 集成。
7. `src/api-keys/`：API Key service、profile binding、弹窗和编辑列表。
8. `src/core/bootstrap-and-test-exports.js`：启动和测试导出，必须保持最后。

重构约定：

- 优先抽纯函数和测试，再移动 DOM / UI 逻辑。
- 不在同一轮同时改变行为和移动大段代码。
- 涉及 `window.fetch`、history patch、MutationObserver、React Fiber 探测时保持小步修改。

## 未来 ESM / esbuild 迁移路径

当前仍保持零依赖 userscript 拼接构建，`SOURCE_FILES` 的顺序就是运行时依赖顺序。迁移到 ESM / esbuild 前应先完成以下准备，避免一次性改变构建方式和运行行为：

1. 继续把大文件拆成稳定的小边界文件，并确保每次移动只改变文件位置，不改变行为。
2. 为新边界补充 helper 级测试或 bundle smoke 测试，先锁定现有全局函数行为。
3. 在源码中逐步形成清晰的依赖方向：基础 `core` -> `graphql` -> `marketplace` -> fetch patch -> `channels` / channel cache -> `dom` -> `api-keys` -> bootstrap。
4. 引入 ESM 时先保留现有 `scripts/build-userscript.js` 作为基准构建，再新增并行的 bundler 构建脚本。
5. bundler 输出必须继续包含 userscript metadata header，且生成的单文件应通过 `node --check`、现有测试和 bundle smoke 测试。
6. 在 bundler 输出与当前拼接输出的关键运行行为一致前，不替换发布产物构建路径。

建议的最小切换点：当主要源码边界都能用显式 import/export 表达，并且并行 bundler 输出通过完整测试后，再把发布构建从拼接脚本切到 esbuild。
