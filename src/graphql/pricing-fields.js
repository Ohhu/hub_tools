async function withMarketplaceModelPricingFields(input, init) {
  const bodyText = await readRequestBodyText(input, init);
  if (!isMarketplaceModelRequestBody(bodyText)) return { input, init };
  let body;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return { input, init };
  }
  const query = ensurePricingFields(body.query);
  if (query === body.query) return { input, init };
  const nextInit = {
    ...init,
    body: JSON.stringify({ ...body, query }),
  };
  return { input, init: nextInit };
}

function isMarketplaceModelRequestBody(bodyText) {
  const text = String(bodyText || "");
  return text.includes("MarketplaceModel") || text.includes("marketplaceModel");
}

function ensurePricingFields(query) {
  if (!query) return query;
  const text = String(query);
  let output = "", cursor = 0, changed = false;
  const pricingStartRe = /pricing\s*\{/g;
  for (let match; (match = pricingStartRe.exec(text));) {
    const openIndex = text.indexOf("{", match.index);
    const closeIndex = findMatchingBrace(text, openIndex);
    if (openIndex < 0 || closeIndex < 0) break;
    const block = text.slice(match.index, closeIndex + 1);
    const inner = text.slice(openIndex + 1, closeIndex);
    output += text.slice(cursor, match.index);
    if (!/\busagePerUnit\b/.test(inner)) {
      output += block;
    } else {
      const additions = [
        HAS_MODE_RE.test(inner) ? "" : "\n          mode",
        HAS_FLAT_FEE_RE.test(inner) ? "" : "\n          flatFee",
      ].join("");
      output += `${text.slice(match.index, openIndex + 1)}${additions}${inner}}`;
      changed = changed || Boolean(additions);
    }
    cursor = closeIndex + 1;
    pricingStartRe.lastIndex = closeIndex + 1;
  }
  output += text.slice(cursor);
  return changed ? output : query;
}

function findMatchingBrace(text, openIndex) {
  if (openIndex < 0 || text[openIndex] !== "{") return -1;
  let depth = 0;
  for (let index = openIndex; index < text.length; index += 1) {
    if (text[index] === "{") depth += 1;
    else if (text[index] === "}") {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  return -1;
}
