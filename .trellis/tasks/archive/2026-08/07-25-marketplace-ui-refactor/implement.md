# Implementation Plan

## 1. Baseline and regression fixtures

- [x] 保存当前 DOM 契约：新版筛选 grid、原生“添加到已有密钥”按钮、卡片和列表容器。
- [x] 扩展 fake DOM/helper，使测试覆盖新版按钮识别、重复入口选择、健康序列字段和价格字段结构。

## 2. Marketplace UI fixes

- [x] 扩展 API Key action 文案识别并统一重命名相关函数。
- [x] 让脚本 trigger 直接替换新版原生按钮，清理同渠道重复入口并绑定增强对话框。
- [x] 为渠道 trigger 提供脚本自有样式和钥匙图标，并移除“真伪核验”入口。
- [x] 把免费筛选改为筛选网格最后一个正式字段，移除绝对定位和矩形测量逻辑。
- [x] 增加六列桌面布局和窄屏自然换行样式。

## 3. Source structure cleanup

- [x] 合并 `cache-state.js` 到 `state.js`。
- [x] 将 marketplace 大文件中的函数按真实职责迁入五个实际模块。
- [x] 将 DOM 大文件中的调度、请求页、筛选和 select 模拟迁入实际模块。
- [x] 将 React 探测和 payload 提取迁入 channels 模块，合并渠道比较 helper。
- [x] 将 key picker 和编辑渠道列表/拖拽迁入实际 API Key 模块。
- [x] 删除纯注释占位文件并更新 `SOURCE_FILES`、README 和开发文档。

## 4. Build and automated validation

- [x] 重新生成 `LinuxDo Hub Tool.user.js`。
- [x] 运行 `node scripts/check-userscript.js`。
- [x] 运行 `node --test tests/*.test.js`。
- [x] 运行最终 userscript 和构建脚本语法检查。
- [x] 检查 git diff，确认没有覆盖任务外已有修改。

## 5. Browser validation

- [x] 在已加载的模型详情 provider 列表验证单一 API Key 入口、自有按钮样式和“真伪核验”清理。
- [x] 安装最新构建后验证模型详情筛选顺序为原生字段在前、价格字段最后。
- [x] 点击模型详情中的替换按钮，确认脚本增强对话框携带正确渠道信息。
- [x] 切换模型详情免费筛选并检查可见 provider 更新。
- [x] 检查 console 是否出现新增错误。
- [x] 服务恢复后补充渠道广场卡片/列表兼容性检查。

### Resolved regressions and optional follow-up

本轮已完成两项现场位置回归的复现、修复和浏览器验收：

- [x] 免费按钮位置不对：已增加 CSS `order` 末位兜底并保留 DOM `append`，Chrome 刷新最新构建后现场顺序稳定为「窗口 / 健康序列 / 排序 / 价格」。
- [ ] “更新 API 密钥”按钮视觉仍待最终确认：位置问题已经修复为操作组末尾；如还需调整钥匙图标、28px 高度或强调色，再统一更新：
  - `src/api-keys/dialog-ui.js` 中 `injectStyle()` 的 `.${CHANNEL_TRIGGER_CLASS}` 样式块；
  - `src/dom/mount-and-marketplace-ui.js` 中 `createTrigger()` 的 class 与图标；
  - `tests/minimal-binder.test.js` 中相关 `source.includes(...)` 断言。

### Validation evidence

- Chrome 现场确认原操作顺序为「查看定价 → 更新 API 密钥 → 提交举报」；本轮已将脚本入口稳定移动到操作组末尾，刷新最新构建后实测为「查看定价 → 提交举报 → 更新 API 密钥」，按钮同高同基线且无新增 console error。
- 本轮已为价格字段增加 CSS `order` 末位兜底，同时保留 DOM `append` 逻辑；Chrome 已登录页面与全量自动化验证均通过。
- 模型详情增强对话框实测携带渠道 `gid://axonhub/Channel/11230` 和名称“超稳的GPT-5.5-5.6”；免费筛选将当前 346 个 provider 收敛为 21 个，取消后恢复 346 个。
- 渠道广场卡片和列表视图均实测 20 个入口、0 个原生 API Key 按钮、0 个“真伪核验”按钮；所有脚本入口都位于操作组末尾。免费筛选会切换为“倍率从低到高”，取消后恢复“综合推荐”。
- 服务端故障前的模型详情页现场已确认：抽样的 20 个渠道项均只有一个脚本渠道入口，原生 API Key 操作入口为 0，“真伪核验”为 0；按钮使用脚本自有 class、钥匙图标和 28px 高度。
- 保留现场还暴露出模型详情页原生字段可能采用“健康序列 → 排序”的顺序，因此价格字段现已改为始终追加到筛选网格末尾，并增加幂等行为测试，不再假设健康序列一定是最后一个原生字段。
- 本轮渠道广场接口已恢复 HTTP 200，筛选网格、卡片视图和列表视图兼容性均已完成验证。

## Review gates

- 实现前：用户确认本 PRD、设计和计划可以进入执行阶段。
- 自动化后：如源码移动造成行为测试失败，先恢复等价函数顺序，再处理 UI 适配。
- 浏览器后：模型详情的筛选顺序、provider 入口、对话框和免费筛选均通过才视为主要功能完成；渠道广场兼容性在服务可用时补验。
