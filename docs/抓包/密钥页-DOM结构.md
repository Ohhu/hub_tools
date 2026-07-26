---
类型: 抓包
状态: 有效
更新日期: 2026-07-26
抓取日期: 2026-05-09
抓取页面: https://hub.linux.do/project/api-keys
原始体积: 约 430 KB（完整 DOM 快照，本文仅摘录脚本关心的结构）
---

# 密钥页 DOM 结构

密钥页的 DOM 快照摘要。页面是 React 应用（shadcn/ui 风格），大量使用 `data-slot` 属性（快照中约 690 处），无稳定的语义化 `id` / `class`。

## 脚本关心的结构

### 「创建 API 密钥」按钮

页面中出现约 20 处（列表行内 + 弹窗），无独立标识，只能靠文本 + `data-slot="button"` 定位：

```html
<button data-slot="button"
        class="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all ...">
  创建 API 密钥
</button>
```

脚本的替换策略：按钮文本匹配后，把渠道 ID 和名称写入 `dataset`（见[价格筛选设计](../设计/价格筛选.md)第 5 节）。

### 定位约束

- `class` 全部是 Tailwind 原子类，随构建变化，**不可作为选择器**。
- 可依赖的锚点：`data-slot` 属性值（`button` / `table` 等组件语义）、按钮文本、`aria-*` 属性（`aria-haspopup` 等）。
- 弹窗为 `dialog` 角色节点（快照中 3 处），按需通过 `role` 定位。

## 保留说明

原始 430 KB 快照已删除；如需重新分析 DOM，直接在浏览器中打开密钥页抓取最新快照即可——旧快照对 React 应用无长期参考价值。
