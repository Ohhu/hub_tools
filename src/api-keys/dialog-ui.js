  function injectStyle() {
    if (document.getElementById(`${PANEL_ID}-style`)) return;
    const style = document.createElement("style"); style.id = `${PANEL_ID}-style`;
    style.textContent = `.${TRIGGER_CLASS}{margin-left:4px}
      .hkb-sort-anchor{position:relative}
      .hkb-price-filter-row{position:relative;overflow:visible}
      #${PRICE_FIELD_ID}{box-sizing:border-box;position:absolute;left:var(--hkb-price-left,calc(100% + 12px));top:var(--hkb-price-top,0px);z-index:1;display:flex;align-items:center;height:36px}
      #${PRICE_FIELD_ID} [data-role="price-filter"]{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:36px;min-height:36px;border:1px solid var(--input,hsl(20 5.9% 90%));border-radius:12px;background:color-mix(in oklab,var(--input,hsl(20 5.9% 90%)) 12%,transparent);color:var(--foreground,hsl(20 14.3% 4.1%));padding:8px 12px;font:inherit;font-size:14px;font-weight:400;line-height:20px;white-space:nowrap;cursor:pointer;box-shadow:0 1px 2px 0 rgb(0 0 0 / .05);transition:color .15s ease,background-color .15s ease,border-color .15s ease,box-shadow .15s ease}
      #${PRICE_FIELD_ID} [data-role="price-filter"]{pointer-events:auto}
      #${PRICE_FIELD_ID} [data-role="price-filter"]:hover{background:var(--accent,hsl(60 4.8% 95.9%));color:var(--accent-foreground,var(--foreground,hsl(20 14.3% 4.1%)))}
      #${PRICE_FIELD_ID} [data-role="price-filter"]:focus-visible{outline:none;border-color:var(--ring,var(--foreground,hsl(20 14.3% 4.1%)));box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,var(--foreground,hsl(20 14.3% 4.1%))) 24%,transparent)}
      #${PRICE_FIELD_ID} [data-role="price-filter"][aria-pressed="true"]{border-color:var(--primary,hsl(20 14.3% 4.1%));background:var(--primary,hsl(20 14.3% 4.1%));color:var(--primary-foreground,hsl(60 9.1% 97.8%))}
      html.dark #${PRICE_FIELD_ID} [data-role="price-filter"]{background:color-mix(in oklab,var(--input) 30%,transparent);box-shadow:0 1px 3px 0 rgb(0 0 0 / .3)}
      html.dark #${PRICE_FIELD_ID} [data-role="price-filter"]:hover{background:color-mix(in oklab,var(--accent) 70%,transparent)}
      html.dark #${PRICE_FIELD_ID} [data-role="price-filter"]:focus-visible{border-color:var(--ring);box-shadow:0 0 0 3px color-mix(in oklab,var(--ring) 35%,transparent)}
      html.dark #${PRICE_FIELD_ID} [data-role="price-filter"][aria-pressed="true"]{border-color:var(--primary);background:var(--primary);color:var(--primary-foreground)}
      [data-hub-tool-price-hidden="true"]{display:none!important}
      #${DIALOG_ID}{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgb(0 0 0 / .48);padding:16px;color:var(--foreground,#111827);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}#${DIALOG_ID}[hidden]{display:none}
      #${DIALOG_ID} .hkb-card{width:min(420px,100%);height:388px;box-sizing:border-box;background:var(--card,#fff);border:1px solid var(--border,rgba(229,231,235,.9));color:var(--card-foreground,var(--foreground,#111827));border-radius:14px;padding:24px;box-shadow:0 24px 60px -24px rgb(15 23 42 / .55),0 10px 24px -20px rgb(15 23 42 / .35)}
      #${DIALOG_ID} .hkb-switch{display:flex;gap:0;margin-bottom:22px}
      #${DIALOG_ID} .hkb-mode{min-height:auto;border:none;border-bottom:2px solid transparent;background:transparent;color:var(--muted-foreground,#9ca3af);font-size:15px;font-weight:650;padding:0 18px 11px;cursor:pointer;transition:color .15s,border-color .15s}#${DIALOG_ID} .hkb-mode:hover{color:var(--foreground,#4b5563)}#${DIALOG_ID} .hkb-mode[aria-selected="true"]{color:var(--foreground,#111827);border-bottom-color:var(--primary,var(--foreground,#111827))}
      #${DIALOG_ID} [data-view-panel]{height:100%;display:grid;grid-template-rows:auto 1fr auto}
      #${DIALOG_ID} [data-view-panel][hidden]{display:none}
      #${DIALOG_ID} .hkb-grid{display:grid;gap:16px;min-height:0;align-content:start}
      #${DIALOG_ID} .hkb-edit-body{display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:14px;min-height:0;padding-top:4px}
      #${DIALOG_ID} .hkb-edit-row{display:grid;grid-template-columns:72px minmax(0,1fr);align-items:center;gap:12px;min-height:0}
      #${DIALOG_ID} .hkb-edit-row .hkb-label{align-self:center}
      #${DIALOG_ID} .hkb-edit-row-list{align-items:start}
      #${DIALOG_ID} .hkb-edit-row-list .hkb-label{padding-top:10px}
      #${DIALOG_ID} [data-key-panel]{min-height:70px}
      #${DIALOG_ID} .hkb-field{display:grid;gap:6px}
      #${DIALOG_ID} .hkb-label{font-size:13px;font-weight:650;color:var(--foreground,#374151)}
      #${DIALOG_ID} .hkb-control{width:100%;min-height:40px;border:1px solid var(--border,#e5e7eb);border-radius:10px;background:color-mix(in oklab,var(--input,#e5e7eb) 18%,transparent);color:var(--foreground,#111827);font:inherit;font-size:14px;line-height:20px;padding:9px 12px;outline:none;transition:border-color .15s,box-shadow .15s,background .15s}
      #${DIALOG_ID} .hkb-control:focus,#${DIALOG_ID} .hkb-control[aria-expanded="true"]{background:var(--popover,var(--card,#fff));border-color:var(--ring,#9ca3af);box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,#111827) 18%,transparent)}
      #${DIALOG_ID} .hkb-channel-tag{display:flex;align-items:center;min-height:40px}
      #${DIALOG_ID} input[type="text"]{height:40px}
      #${DIALOG_ID} .hkb-copy-new{border-color:var(--border,#d1d5db);background:var(--card,#fff);color:var(--foreground,#374151);white-space:nowrap}#${DIALOG_ID} .hkb-copy-new:hover{background:var(--accent,#f3f4f6);color:var(--accent-foreground,var(--foreground,#374151))}
      #${DIALOG_ID} .hkb-select-row{display:flex;align-items:center;gap:8px}#${DIALOG_ID} .hkb-key-picker{position:relative;flex:1;min-width:0}#${DIALOG_ID} .hkb-key-trigger{display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left;cursor:pointer}#${DIALOG_ID} .hkb-key-trigger span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${DIALOG_ID} .hkb-key-trigger::after{content:"";width:8px;height:8px;border-right:1.5px solid var(--muted-foreground,#6b7280);border-bottom:1.5px solid var(--muted-foreground,#6b7280);transform:rotate(45deg) translateY(-2px);flex-shrink:0;transition:transform .15s}#${DIALOG_ID} .hkb-key-trigger[aria-expanded="true"]::after{transform:rotate(225deg) translateY(-1px)}
      #${DIALOG_ID} .hkb-key-menu{position:absolute;left:0;right:0;top:calc(100% + 6px);z-index:1;max-height:232px;overflow:auto;margin:0;padding:6px;list-style:none;background:var(--popover,var(--card,#fff));border:1px solid var(--border,#e5e7eb);border-radius:12px;box-shadow:0 18px 48px -24px rgb(15 23 42 / .55),0 8px 20px -18px rgb(15 23 42 / .45)}#${DIALOG_ID} .hkb-key-menu[hidden]{display:none}
      #${DIALOG_ID} .hkb-key-option{width:100%;min-height:38px;display:flex;align-items:center;gap:8px;border:none;border-radius:8px;background:transparent;color:var(--popover-foreground,var(--foreground,#111827));text-align:left;padding:8px 10px;font-size:14px;font-weight:500}#${DIALOG_ID} .hkb-key-option:hover,#${DIALOG_ID} .hkb-key-option[aria-selected="true"]{background:var(--accent,#f3f4f6);color:var(--accent-foreground,var(--foreground,#111827))}#${DIALOG_ID} .hkb-key-option[aria-selected="true"]::before{content:"✓";color:var(--primary,var(--foreground,#111827));font-weight:700}#${DIALOG_ID} .hkb-key-option:not([aria-selected="true"])::before{content:"";width:12px}#${DIALOG_ID} .hkb-key-option span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      #${DIALOG_ID} .hkb-icon-btn{height:32px;width:32px;min-height:32px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--muted-foreground,#64748b);padding:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;transition:color .15s,background .15s,box-shadow .15s}#${DIALOG_ID} .hkb-icon-btn:hover{color:var(--accent-foreground,var(--foreground,#0f172a));background:var(--accent,#f1f5f9)}#${DIALOG_ID} .hkb-icon-btn:focus-visible{outline:none;box-shadow:0 0 0 3px color-mix(in oklab,var(--ring,#0f172a) 20%,transparent)}#${DIALOG_ID} .hkb-icon-btn svg{width:16px;height:16px;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;fill:none;pointer-events:none}
      #${DIALOG_ID} .hkb-edit-title{display:flex;align-items:center;gap:6px;margin:-8px 0 4px -8px;font-size:15px;font-weight:650;color:var(--foreground,#111827)}
      #${DIALOG_ID} .hkb-back{height:28px;width:28px;min-height:28px}
      #${DIALOG_ID} .hkb-edit-list{height:100%;min-height:92px;overflow:auto;border:1px solid var(--border,#e5e7eb);border-radius:10px;background:color-mix(in oklab,var(--input,#e5e7eb) 14%,transparent);padding:4px;scrollbar-width:thin;scrollbar-color:transparent transparent;transition:scrollbar-color .15s;touch-action:none;user-select:none}#${DIALOG_ID} .hkb-edit-list:hover,#${DIALOG_ID} .hkb-edit-list:focus-within,#${DIALOG_ID} .hkb-edit-list.is-scrolling{scrollbar-color:var(--border,#cbd5e1) transparent}#${DIALOG_ID} .hkb-edit-list::-webkit-scrollbar{width:6px}#${DIALOG_ID} .hkb-edit-list::-webkit-scrollbar-thumb{background:transparent;border-radius:999px}#${DIALOG_ID} .hkb-edit-list:hover::-webkit-scrollbar-thumb,#${DIALOG_ID} .hkb-edit-list:focus-within::-webkit-scrollbar-thumb,#${DIALOG_ID} .hkb-edit-list.is-scrolling::-webkit-scrollbar-thumb{background:var(--border,#cbd5e1)}
      #${DIALOG_ID} .hkb-channel-list-stage{position:relative;min-height:36px}#${DIALOG_ID} .hkb-channel-slot{position:absolute;left:0;right:0;transition:top .12s ease}#${DIALOG_ID} .hkb-channel-placeholder{position:absolute;left:0;right:0;border:1px dashed var(--primary,var(--foreground,#111827));border-radius:8px;background:color-mix(in oklab,var(--primary,var(--foreground,#111827)) 8%,transparent)}#${DIALOG_ID} .hkb-channel-row{height:36px;box-sizing:border-box;display:flex;align-items:center;gap:6px;padding:4px 6px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--foreground,#111827);font-size:13px}#${DIALOG_ID} .hkb-channel-row:hover{background:var(--accent,#fff);color:var(--accent-foreground,var(--foreground,#111827))}#${DIALOG_ID} .hkb-channel-row.is-dragging{border-color:var(--primary,var(--foreground,#111827));background:var(--card,#fff);box-shadow:0 8px 18px -14px rgb(15 23 42 / .65);pointer-events:none}#${DIALOG_ID} .hkb-channel-index{width:22px;flex-shrink:0;color:var(--muted-foreground,#64748b);font-size:12px;font-variant-numeric:tabular-nums;text-align:center}#${DIALOG_ID} .hkb-drag-handle{width:22px;height:26px;min-height:26px;border:0;border-radius:8px;background:transparent;color:var(--muted-foreground,#64748b);padding:0;cursor:grab;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;font:inherit;line-height:1;letter-spacing:1px}#${DIALOG_ID} .hkb-drag-handle:active{cursor:grabbing}#${DIALOG_ID} .hkb-channel-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#${DIALOG_ID} .hkb-channel-actions{display:flex;align-items:center;gap:2px;flex-shrink:0}#${DIALOG_ID} .hkb-row-btn{width:26px;height:26px;min-height:26px;border-color:transparent}#${DIALOG_ID} .hkb-row-btn svg{width:14px;height:14px}#${DIALOG_ID} .hkb-remove{color:var(--muted-foreground,#6b7280)}#${DIALOG_ID} .hkb-remove:hover{color:var(--destructive,#dc2626)}
      #${DIALOG_ID} .hkb-empty{padding:14px 10px;color:var(--muted-foreground,#9ca3af);font-size:13px}
      #${DIALOG_ID} .hkb-actions{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:0;padding-top:16px;border-top:1px solid var(--border,#f3f4f6)}
      #${DIALOG_ID} .hkb-edit-actions{border-top:none;padding-top:18px}
      #${DIALOG_ID} [data-action="save-edit"]{position:relative}
      #${DIALOG_ID} [data-action="save-edit"][data-dirty="true"]::after{content:"";position:absolute;right:-3px;top:-3px;width:7px;height:7px;border-radius:999px;background:var(--primary,#111827);box-shadow:0 0 0 2px var(--card,#fff)}
      #${DIALOG_ID} .hkb-action-left,#${DIALOG_ID} .hkb-action-right{display:flex;align-items:center;gap:8px}
      #${DIALOG_ID} .hkb-status{color:var(--muted-foreground,#6b7280);font-size:12px;line-height:16px;flex:1;min-width:0;text-align:center}
      #${DIALOG_ID} button:not(.hkb-icon-btn){box-sizing:border-box;height:36px;min-height:36px;line-height:20px;border-radius:8px;border:1px solid transparent;padding:0 16px;font:inherit;font-size:14px;font-weight:500;cursor:pointer;transition:background .15s,opacity .15s}#${DIALOG_ID} button:disabled{cursor:not-allowed;opacity:.5}
      #${DIALOG_ID} .hkb-primary{border-color:var(--primary,#111827);background:var(--primary,#111827);color:var(--primary-foreground,#f9fafb)}#${DIALOG_ID} .hkb-primary:hover{background:color-mix(in oklab,var(--primary,#111827) 88%,white)}#${DIALOG_ID} .hkb-secondary{border-color:var(--border,#d1d5db);background:var(--secondary,#f3f4f6);color:var(--secondary-foreground,var(--foreground,#374151))}#${DIALOG_ID} .hkb-secondary:hover{background:var(--accent,#e5e7eb);color:var(--accent-foreground,var(--foreground,#374151))}#${DIALOG_ID} .hkb-ghost{border-color:transparent;background:transparent;color:var(--muted-foreground,#374151)}#${DIALOG_ID} .hkb-ghost:hover{background:var(--accent,#f9fafb);color:var(--accent-foreground,var(--foreground,#374151))}
      @media (max-width:360px){#${DIALOG_ID}{padding:8px}#${DIALOG_ID} .hkb-card{height:min(388px,calc(100vh - 16px));padding:16px}#${DIALOG_ID} .hkb-edit-row{grid-template-columns:1fr;gap:6px}#${DIALOG_ID} .hkb-edit-row-list .hkb-label{padding-top:0}#${DIALOG_ID} .hkb-actions{flex-wrap:wrap;align-items:flex-start}#${DIALOG_ID} .hkb-action-left,#${DIALOG_ID} .hkb-action-right{flex-wrap:wrap}#${DIALOG_ID} .hkb-status{flex-basis:100%;order:3}}
      html.dark #${DIALOG_ID}{background:rgb(0 0 0 / .56);color:var(--foreground)}
      html.dark #${DIALOG_ID} .hkb-card{box-shadow:0 24px 64px -24px rgb(0 0 0 / .85),0 12px 28px -20px rgb(0 0 0 / .75)}
      html.dark #${DIALOG_ID} .hkb-control{background:color-mix(in oklab,var(--input) 30%,transparent);border-color:var(--border);color:var(--foreground)}
      html.dark #${DIALOG_ID} .hkb-control::placeholder{color:var(--muted-foreground)}
      html.dark #${DIALOG_ID} .hkb-control:focus,html.dark #${DIALOG_ID} .hkb-control[aria-expanded="true"]{box-shadow:0 0 0 3px color-mix(in oklab,var(--ring) 35%,transparent)}
      html.dark #${DIALOG_ID} .hkb-key-menu{box-shadow:0 18px 48px -24px rgb(0 0 0 / .85),0 8px 20px -18px rgb(0 0 0 / .8)}
      html.dark #${DIALOG_ID} .hkb-edit-list{background:color-mix(in oklab,var(--input) 22%,transparent)}`;
    (document.head || document.documentElement).appendChild(style);
  }

  async function handlePanelClick(event) {
    const actionEl = event.target?.closest?.("[data-action]");
    const action = actionEl?.dataset?.action;
    if (!action && !event.target?.closest?.('[data-role="key-picker"]')) closeKeyMenu();
    if (!action) return;
    if (action === "set-key-mode") {
      setKeyMode(actionEl.dataset.mode || "update");
      return;
    }
    if (action === "toggle-key-menu") {
      toggleKeyMenu();
      return;
    }
    if (action === "select-key") {
      selectKey(actionEl.dataset.keyId || "");
      closeKeyMenu();
      if (currentViewPanel() === "edit") {
        openEditPanel().catch((error) => setEditStatus(error?.message || "绑定渠道加载失败"));
      }
      return;
    }
    if (action === "open-edit") {
      openEditPanel().catch((error) => setEditStatus(error?.message || "绑定渠道加载失败"));
      return;
    }
    if (action === "close-edit") {
      showMainPanel();
      return;
    }
    if (action === "edit-add-current") {
      addCurrentChannelToEditList();
      return;
    }
    if (action === "edit-remove-channel") {
      removeEditChannel(actionEl.dataset.channelId || "");
      return;
    }
    if (action === "edit-drag-channel") return;
    if (action === "edit-move-channel") {
      moveEditChannel(actionEl.dataset.channelId || "", actionEl.dataset.direction || "down");
      return;
    }
    if (!actionEl.closest?.('[data-role="key-picker"]')) closeKeyMenu();
    try {
      setBusy(true);
      if (action === "reload-keys") await loadKeys(true);
      else if (action === "append-bind") await updateExistingKeyBinding("append");
      else if (action === "replace-bind") await updateExistingKeyBinding("replace");
      else if (action === "save-edit") await saveEditBindings();
      else if (action === "create-bind") await createKeyAndBind();
      else if (action === "copy-created-key") await copyCreatedKey();
      else if (action === "copy-key") await copySelectedKey();
    } catch (error) { setStatus(error?.message || "操作失败"); } finally { setBusy(false); }
  }

  function openDialog() {
    ensureDialog(); document.getElementById(DIALOG_ID).hidden = false;
    const channel = { id: this?.dataset?.channelId || "", name: this?.dataset?.channelName || "" };
    setCurrentChannel(channel);
    setCreatedKeyValue("");
    setKeyMode("update");
    showMainPanel();
    loadKeys().catch((error) => setStatus(error?.message || "API Key 加载失败，请稍后刷新"));
  }

  function openRequestEditDialog() {
    ensureDialog(); document.getElementById(DIALOG_ID).hidden = false;
    setCurrentChannel({ id: "", name: "" }, { allowEmpty: true });
    setCreatedKeyValue("");
    setKeyMode("update");
    showMainPanel();
    loadKeys()
      .then(() => openEditPanel())
      .catch((error) => setStatus(error?.message || "API Key 加载失败，请稍后刷新"));
  }

  function closeDialog() {
    const dialog = document.getElementById(DIALOG_ID); if (dialog) dialog.hidden = true;
  }

  function ensureDialog() {
    if (document.getElementById(DIALOG_ID)) return;
    const dialog = document.createElement("div");
    dialog.id = DIALOG_ID; dialog.hidden = true;
    dialog.innerHTML = `<div class="hkb-card" role="dialog" aria-modal="true">
      <div class="hkb-main" data-view-panel="main">
        <div class="hkb-switch" role="tablist" aria-label="密钥操作">
          <button type="button" role="tab" class="hkb-mode" data-action="set-key-mode" data-mode="update" aria-selected="true">绑定渠道</button>
          <button type="button" role="tab" class="hkb-mode" data-action="set-key-mode" data-mode="create" aria-selected="false">新建密钥</button>
        </div>
        <div class="hkb-grid">
          <div class="hkb-field"><span class="hkb-label">当前渠道</span><div class="hkb-control hkb-channel-tag" data-role="channel-label"></div></div>
          <div data-key-panel="update" role="tabpanel">
            <div class="hkb-field"><span class="hkb-label">API Key</span><div class="hkb-select-row"><div class="hkb-key-picker" data-role="key-picker"><button type="button" class="hkb-control hkb-key-trigger" data-action="toggle-key-menu" data-role="key-trigger" aria-haspopup="listbox" aria-expanded="false"><span data-role="key-label">暂无 API Key</span></button><ul class="hkb-key-menu" data-role="key-menu" role="listbox" hidden></ul></div><button type="button" class="hkb-icon-btn" data-action="copy-key" title="复制密钥" aria-label="复制密钥"><svg viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button><button type="button" class="hkb-icon-btn" data-action="reload-keys" title="刷新" aria-label="刷新"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M3 21v-5h5"></path><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M16 8h5V3"></path></svg></button><button type="button" class="hkb-icon-btn" data-action="open-edit" title="编辑绑定渠道" aria-label="编辑绑定渠道"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg></button></div></div>
          </div>
          <div data-key-panel="create" role="tabpanel" hidden>
            <div class="hkb-field"><span class="hkb-label">Key 名称</span><input class="hkb-control" data-role="new-key-name" type="text" placeholder="输入 Key 名称"></div>
          </div>
        </div>
        <div class="hkb-actions"><div class="hkb-action-left"><button type="button" class="hkb-primary" data-action="append-bind" data-action-panel="update">追加绑定</button><button type="button" class="hkb-secondary" data-action="replace-bind" data-action-panel="update">替换绑定</button><button type="button" class="hkb-primary" data-action="create-bind" data-action-panel="create" hidden>新建并绑定</button><button type="button" class="hkb-secondary hkb-copy-new" data-action="copy-created-key" data-action-panel="create" data-role="copy-created-key" hidden>复制新密钥</button></div><div class="hkb-status" data-role="status"></div><div class="hkb-action-right"><button type="button" class="hkb-ghost" data-action="close">关闭</button></div></div>
      </div>
      <div class="hkb-main" data-view-panel="edit" hidden>
        <div class="hkb-edit-title"><button type="button" class="hkb-icon-btn hkb-back" data-action="close-edit" title="返回" aria-label="返回"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></button><span>编辑绑定渠道</span></div>
        <div class="hkb-edit-body">
          <div class="hkb-edit-row"><span class="hkb-label">API Key</span><div class="hkb-key-picker" data-role="edit-key-picker"><button type="button" class="hkb-control hkb-key-trigger" data-action="toggle-key-menu" data-role="edit-key-trigger" aria-haspopup="listbox" aria-expanded="false"><span data-role="edit-key-label">暂无 API Key</span></button><ul class="hkb-key-menu" data-role="edit-key-menu" role="listbox" hidden></ul></div></div>
          <div class="hkb-edit-row"><span class="hkb-label">当前渠道</span><div class="hkb-control hkb-channel-tag" data-role="edit-channel-label"></div></div>
          <div class="hkb-edit-row hkb-edit-row-list"><span class="hkb-label">绑定渠道</span><div class="hkb-edit-list" data-role="edit-channel-list" tabindex="0"></div></div>
        </div>
        <div class="hkb-actions hkb-edit-actions"><div class="hkb-action-left"><button type="button" class="hkb-secondary" data-action="edit-add-current">添加</button></div><div class="hkb-status" data-role="edit-status"></div><div class="hkb-action-right"><button type="button" class="hkb-primary" data-action="save-edit">保存</button><button type="button" class="hkb-ghost" data-action="close-edit">取消</button></div></div>
      </div>
    </div>`;
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog || event.target?.dataset?.action === "close") closeDialog();
      else handlePanelClick(event);
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeKeyMenu();
    });
    dialog.addEventListener("input", (event) => {
      if (event.target?.dataset?.role === "new-key-name") {
        setCreatedKeyValue("");
        setStatus("");
      }
    });
    dialog.addEventListener("pointerdown", handleEditChannelDragStart);
    dialog.addEventListener("pointermove", handleEditChannelDragMove);
    dialog.addEventListener("pointerup", handleEditChannelDragEnd);
    dialog.addEventListener("pointercancel", cancelEditChannelDrag);
    dialog.addEventListener("scroll", (event) => {
      if (event.target?.dataset?.role === "edit-channel-list") markScrolling(event.target);
    }, true);
    document.body.appendChild(dialog);
  }

  function setKeyMode(mode) {
    const dialog = document.getElementById(DIALOG_ID);
    if (!dialog) return;
    const selectedMode = mode === "create" ? "create" : "update";
    dialog.dataset.keyMode = selectedMode;
    dialog.querySelectorAll("[data-action='set-key-mode']").forEach((button) => {
      button.setAttribute("aria-selected", String(button.dataset.mode === selectedMode));
    });
    dialog.querySelectorAll("[data-key-panel]").forEach((el) => {
      el.hidden = el.dataset.keyPanel !== selectedMode;
    });
    closeKeyMenu();
    syncActionButtons();
    setStatus("");
  }
