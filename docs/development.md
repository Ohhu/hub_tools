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
