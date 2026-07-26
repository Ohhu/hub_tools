# LinuxDo Hub Tool

LinuxDo Hub Tool 是一个用于 LinuxDo Hub 的 Tampermonkey / 油猴脚本。它提供 API Key 渠道绑定快捷操作，并支持资源市场免费渠道筛选。

仓库中的源码已经拆分到 `src/`，根目录的 `LinuxDo Hub Tool.user.js` 是生成后的最终油猴单文件产物。

## 目录结构

```text
.
├── LinuxDo Hub Tool.user.js        # 最终油猴脚本产物
├── src/                            # 开发源码片段
│   ├── userscript-header.js         # 油猴 metadata 头
│   ├── base.js                      # 常量、全局状态、请求体/URL 工具
│   ├── graphql.js                   # GraphQL 查询、client 与 pricing query 改写
│   ├── marketplace-pricing.js       # 市场价格判断、免费谓词与价格缓存
│   ├── marketplace-payload.js       # 市场 payload 过滤、分页扫描与隐式免费行
│   ├── fetch-patch.js               # 全局 fetch 拦截与响应包装
│   ├── channel-cache.js             # 渠道缓存、payload 渠道提取与 React 探测
│   ├── page-integration.js          # 页面挂载、选择器、市场 UI 与请求页入口
│   ├── api-keys.js                  # API Key 服务、profile 绑定与弹窗 UI
│   └── bootstrap-and-test-exports.js # 启动逻辑与测试导出
├── scripts/
│   ├── build-userscript.js          # 从 src/ 生成最终 userscript
│   └── check-userscript.js          # 校验产物是否与 src/ 同步
├── tests/
│   ├── helpers/                     # fake DOM 与 userscript 加载夹具
│   ├── minimal-binder.test.js       # 最终 bundle smoke / 回归测试
│   ├── request-utils.test.js        # 请求工具行为测试
│   ├── profile-binding.test.js      # API Key profile 绑定纯函数测试
│   └── marketplace-pricing.test.js  # 市场价格 helper 行为测试
└── docs/
    └── development.md               # 开发说明
```

## 开发流程

修改源码时优先编辑 `src/` 下的文件，不直接改根目录产物。

生成最终油猴脚本：

```bash
node scripts/build-userscript.js
```

检查根目录产物是否与 `src/` 同步：

```bash
node scripts/check-userscript.js
```

运行测试：

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

## 源码拼接顺序

项目保持零依赖 userscript 构建方式，源码顺序由 `scripts/build-userscript.js` 中的 `SOURCE_FILES` 定义。顺序本身就是模块边界：

1. `base.js` 常量、全局状态和请求工具
2. `graphql.js` 查询、client 与 pricing query 改写
3. `marketplace-pricing.js` 与 `marketplace-payload.js` 价格判断、缓存、扫描和 payload 转换
4. `fetch-patch.js` 全局请求拦截
5. `channel-cache.js` 渠道缓存、payload 提取与 React 探测
6. `page-integration.js` 选择器、挂载和页面集成
7. `api-keys.js` API Key service、profile binding 与弹窗 UI
8. `bootstrap-and-test-exports.js` 启动和测试导出，必须保持最后

新增源码时应放入对应功能域文件，并确认重新构建后的 `LinuxDo Hub Tool.user.js` 与源码同步。

## 发布产物

发布或安装时使用根目录的 `LinuxDo Hub Tool.user.js`。这个文件应由构建脚本生成，提交前建议运行同步检查和测试。

## 未来构建迁移

项目目前继续使用零依赖拼接构建，便于直接生成 Tampermonkey / 油猴可安装的单文件脚本。后续如迁移到 ESM / esbuild，应先保留现有 `scripts/build-userscript.js` 作为基准构建，再新增并行 bundler 输出，并确保 userscript metadata、`node --check`、现有测试和 bundle smoke 测试全部通过后再切换发布路径。
