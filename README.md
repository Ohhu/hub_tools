# LinuxDo Hub Tool

LinuxDo Hub Tool 是一个用于 LinuxDo Hub 的 Tampermonkey / 油猴脚本。它提供 API Key 渠道绑定快捷操作，并支持资源市场免费渠道筛选。

仓库中的源码已经拆分到 `src/`，根目录的 `LinuxDo Hub Tool.user.js` 是生成后的最终油猴单文件产物。

## 目录结构

```text
.
├── LinuxDo Hub Tool.user.js        # 最终油猴脚本产物
├── src/                            # 开发源码片段
│   ├── userscript-header.js         # 油猴 metadata 头
│   ├── core/                        # 状态、请求拦截、缓存、启动逻辑
│   ├── marketplace/                 # 资源市场价格与筛选逻辑
│   ├── dom/                         # 页面挂载与市场 UI
│   └── api-keys/                    # API Key 弹窗与绑定操作
├── scripts/
│   ├── build-userscript.js          # 从 src/ 生成最终 userscript
│   └── check-userscript.js          # 校验产物是否与 src/ 同步
├── tests/
│   └── minimal-binder.test.js       # helper 级回归测试
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
```

语法检查：

```bash
node --check "LinuxDo Hub Tool.user.js"
node --check scripts/build-userscript.js
node --check scripts/check-userscript.js
```

## 发布产物

发布或安装时使用根目录的 `LinuxDo Hub Tool.user.js`。这个文件应由构建脚本生成，提交前建议运行同步检查和测试。
