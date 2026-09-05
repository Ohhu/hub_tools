const assert = require("node:assert/strict");
const { loadHelpers } = require("./helpers/load-userscript");
const { FakeElement } = require("./helpers/fake-dom");

async function main() {
  const helpers = loadHelpers();

  assert.equal(helpers.requestUrl(new URL("https://hub.linux.do/admin/graphql")), "https://hub.linux.do/admin/graphql");
  assert.equal(helpers.requestBodyText("https://hub.linux.do/admin/graphql", { body: "MarketplaceModel" }), "MarketplaceModel");

  const body = JSON.stringify({ operationName: "MarketplaceModel", query: "query MarketplaceModel { marketplaceModel { modelID } }" });
  const request = new Request("https://hub.linux.do/admin/graphql", { method: "POST", body });
  assert.equal(helpers.requestBodyText(request), "");
  assert.equal(await helpers.readRequestBodyText(request), body);
  assert.equal(helpers.requestBodyText(request), body);

  assert.equal(helpers.formatMultiplier(1), "1.0");
  assert.equal(helpers.formatMultiplier(0.4), "0.4");
  assert.equal(helpers.formatMultiplier(0.05), "0.05");
  assert.equal(helpers.formatMultiplier(0.39999999999999997), "0.4");

  assert.equal(helpers.multiplierTone(0.4), "low");
  assert.equal(helpers.multiplierTone(1), "mid");
  assert.equal(helpers.multiplierTone(2), "mid");
  assert.equal(helpers.multiplierTone(2.4), "high");
  assert.equal(helpers.multiplierTone("0.05"), "low");
  assert.equal(helpers.multiplierTone(null), "mid");

  const channelCell = new FakeElement({ text: "  一个很长的渠道名称  " });
  helpers.constrainRequestLogChannelCell(channelCell);
  assert.equal(channelCell.classList.contains("linuxdo-hub-tool-request-channel-column"), true);
  assert.equal(channelCell.getAttribute("title"), "一个很长的渠道名称");

  // ===== 倍率列注入 / 清理回归（渠道被调用记录视图残留 bug）=====
  const MULTIPLIER_COLUMN = "linuxdo-hub-tool-multiplier-column";
  const CHANNEL_COLUMN = "linuxdo-hub-tool-request-channel-column";

  function buildRequestsTable(channelHeaderText = "渠道") {
    const state = helpers.__documentState;
    for (const child of [...state.documentElement.children]) child.remove();
    const main = new FakeElement({ props: { tagName: "MAIN" } });
    const table = new FakeElement({ props: { tagName: "TABLE" } });
    const thead = new FakeElement({ props: { tagName: "THEAD" } });
    const headerRow = new FakeElement({ props: { tagName: "TR" } });
    const tbody = new FakeElement({ props: { tagName: "TBODY" } });
    state.documentElement.append(main);
    state.main = main;
    main.append(table);
    table.append(thead);
    table.append(tbody);
    thead.append(headerRow);
    for (const text of ["#", "模型ID", channelHeaderText, "状态"]) {
      headerRow.append(new FakeElement({ text, props: { tagName: "TH" } }));
    }
    const rows = [];
    for (const [id, channel] of [["#101", "渠道A"], ["#102", "渠道B"], ["#999", "渠道C"]]) {
      const row = new FakeElement({ props: { tagName: "TR" } });
      for (const value of [id, "gpt-5.4", channel, "completed"]) {
        row.append(new FakeElement({ text: value, props: { tagName: "TD" } }));
      }
      tbody.append(row);
      rows.push(row);
    }
    return { table, headerRow, rows };
  }

  helpers.__location.pathname = "/project/requests";
  helpers.__location.search = "";

  // 无倍率数据：占位符 "-"，渠道列被约束（宽度 + title）
  {
    const { table, headerRow, rows } = buildRequestsTable();
    helpers.injectRequestLogMultiplierColumn();
    assert.equal(headerRow.children.length, 5);
    assert.equal(headerRow.children[3].textContent, "倍率");
    assert.equal(headerRow.children[2].nextElementSibling, headerRow.children[3]);
    for (const row of rows) {
      assert.equal(row.children.length, 5);
      assert.equal(row.children[3].textContent, "-");
      assert.equal(row.children[3].getAttribute("aria-label"), "渠道倍率未知");
      assert.equal(row.children[2].classList.contains(CHANNEL_COLUMN), true);
      assert.equal(row.children[2].getAttribute("title") != null, true);
    }
    assert.equal(table.querySelectorAll("." + MULTIPLIER_COLUMN).length, 4);
  }

  // 倍率数据到达后刷新内容并按区间着色（<1 绿 / >2 红），非 GID 行不缓存
  {
    const { table, rows } = buildRequestsTable();
    helpers.rememberRequestLogMultipliers({
      data: {
        requests: {
          edges: [
            { node: { id: "gid://axonhub/Request/101", usageLogs: { edges: [{ node: { costExplanation: { lines: [{ multiplier: 0.4 }] } } }] } } },
            { node: { id: "gid://axonhub/Request/102", usageLogs: { edges: [{ node: { costExplanation: { lines: [{ multiplier: 2.4 }] } } }] } } },
            { node: { id: "plain-id", usageLogs: { edges: [{ node: { costExplanation: { lines: [{ multiplier: 9 }] } } }] } } },
          ],
        },
      },
    });
    helpers.injectRequestLogMultiplierColumn();
    assert.equal(rows[0].children[3].textContent, "×0.4");
    assert.equal(rows[0].children[3].classList.contains(MULTIPLIER_COLUMN + "-low"), true);
    assert.equal(rows[1].children[3].textContent, "×2.4");
    assert.equal(rows[1].children[3].classList.contains(MULTIPLIER_COLUMN + "-high"), true);
    assert.equal(rows[2].children[3].textContent, "-");
    assert.equal(table.querySelectorAll("." + MULTIPLIER_COLUMN).length, 4);
  }

  // 幂等：重复注入不产生重复列；漂移的倍率列自动归位到渠道列之后
  {
    const { table, headerRow, rows } = buildRequestsTable();
    helpers.injectRequestLogMultiplierColumn();
    const driftedCell = rows[0].children[3];
    rows[0].append(driftedCell);
    const driftedHeader = headerRow.children[3];
    headerRow.append(driftedHeader);
    helpers.injectRequestLogMultiplierColumn();
    helpers.injectRequestLogMultiplierColumn();
    assert.equal(table.querySelectorAll("." + MULTIPLIER_COLUMN).length, 4);
    assert.equal(headerRow.children.length, 5);
    assert.equal(headerRow.children[3], driftedHeader);
    assert.equal(headerRow.children[2].nextElementSibling, driftedHeader);
    assert.equal(rows[0].children.length, 5);
    assert.equal(rows[0].children[3], driftedCell);
    assert.equal(rows[0].children[2].nextElementSibling, driftedCell);
  }

  // 切换到渠道被调用记录（provider）视图：残留倍率列被完整移除，表头与数据列重新对齐
  {
    const { table, headerRow, rows } = buildRequestsTable();
    helpers.injectRequestLogMultiplierColumn();
    helpers.__location.search = "?view=provider";
    helpers.injectRequestLogMultiplierColumn();
    assert.equal(table.querySelectorAll("." + MULTIPLIER_COLUMN).length, 0);
    assert.equal(headerRow.children.length, 4);
    for (const row of rows) {
      assert.equal(row.children.length, 4);
      assert.equal(row.children[2].classList.contains(CHANNEL_COLUMN), false);
    }
    assert.equal(headerRow.children.some((th) => th.classList.contains(CHANNEL_COLUMN)), false);
    assert.equal(rows[0].children[2].getAttribute("title"), null);
    helpers.__location.search = "";
  }

  // 全部调用记录（all）视图同样不注入
  {
    const { table } = buildRequestsTable();
    helpers.__location.search = "?view=all";
    helpers.injectRequestLogMultiplierColumn();
    assert.equal(table.querySelectorAll("." + MULTIPLIER_COLUMN).length, 0);
    helpers.__location.search = "";
  }

  // 英文界面：渠道列表头为 "Channel" 时同样可定位
  {
    const { headerRow, rows } = buildRequestsTable("Channel");
    helpers.injectRequestLogMultiplierColumn();
    assert.equal(headerRow.children.length, 5);
    assert.equal(rows.every((row) => row.children.length === 5), true);
  }

  // 非请求页路由：不做任何注入
  {
    const { table } = buildRequestsTable();
    helpers.__location.pathname = "/marketplace";
    helpers.injectRequestLogMultiplierColumn();
    assert.equal(table.querySelectorAll("." + MULTIPLIER_COLUMN).length, 0);
    helpers.__location.pathname = "/project/requests";
  }
  console.log("request utils helpers ok");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
