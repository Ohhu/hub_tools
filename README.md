# LinuxDo Hub Tool

LinuxDo Hub Tool 是一个用于 [Hub](https://hub.linux.do/) 的 Tampermonkey / 油猴脚本。它提供密钥的渠道绑定快捷操作，并支持资源市场的免费渠道筛选与模型 ID 变体筛选（模型页默认只保留服务精确模型 id 的渠道）。

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
│   ├── api-keys.js                  # 密钥服务、配置绑定与弹窗 UI
│   └── bootstrap-and-test-exports.js # 启动逻辑与测试导出
├── scripts/
│   ├── build-userscript.js          # 从 src/ 生成最终 userscript
│   └── check-userscript.js          # 校验产物是否与 src/ 同步
├── tests/
│   ├── helpers/                     # fake DOM 与 userscript 加载夹具
│   ├── minimal-binder.test.js       # 最终 bundle smoke / 回归测试
│   ├── request-utils.test.js        # 请求工具行为测试
│   ├── profile-binding.test.js      # 密钥配置绑定纯函数测试
│   └── marketplace-pricing.test.js  # 市场价格 helper 行为测试
└── docs/                           # 文档，见 docs/README.md
    ├── 参考/                        # 接口参考、术语表
    ├── 指南/                        # 开发指南、待办事项
    ├── 设计/                        # 价格筛选等实现方案
    ├── 归档/                        # 已过期文档
    └── 抓包/                        # 原始请求样本（已脱敏）
```

## 快速开始

修改源码时优先编辑 `src/` 下的文件，不直接改根目录产物。

```bash
node scripts/build-userscript.js   # 构建产物
node scripts/check-userscript.js   # 校验产物与源码同步
node --test tests/*.test.js        # 运行测试
```

发布或安装时使用根目录的 `LinuxDo Hub Tool.user.js`，该文件由构建脚本生成。

完整的构建约定、源码层级、重构与迁移路线见[开发指南](docs/指南/开发指南.md)。
