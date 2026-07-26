function normalizePriceFilter(value) {
  return value === "free" || value === "paid" ? value : "all";
}

function priceMatchesChannel(channel, mode) {
  const freeState = marketplaceChannelFreeState(channel);
  return priceStateMatches(freeState, mode);
}

function priceStateMatches(freeState, mode) {
  return mode === "free" ? freeState === true : freeState === false;
}

function marketplaceChannelFreeState(channel) {
  if (typeof channel?.priceSummary?.allFree === "boolean") return channel.priceSummary.allFree;
  return null;
}

function channelFreeStateForModelDetail(channel, modelID = "") {
  if (!Array.isArray(channel?.channelModelPrices)) return { free: true, reason: "missing_prices" };
  const prices = channel.channelModelPrices;
  if (prices.length === 0) return { free: true, reason: "empty_prices" };
  const normalizedModelID = normalizeModelID(modelID);
  if (!normalizedModelID) {
    return { free: prices.every((modelPrice) => modelPriceItemsFree(modelPrice?.price?.items)), reason: "all_models" };
  }
  const modelPrice = findModelPriceRow(prices, modelID);
  if (!modelPrice) return { free: true, reason: "implicit_missing_row" };
  return { free: modelPriceItemsFree(modelPrice?.price?.items), reason: "explicit_row" };
}

function modelPriceItemsFree(items) {
  if (!Array.isArray(items) || items.length === 0) return false;
  return items.every((item) => {
    const pricing = item?.pricing || {};
    return pricingFree(pricing)
      && (item?.promptWriteCacheVariants || []).every((variant) => pricingFree(variant?.pricing));
  });
}

function pricingFree(pricing) {
  if (!pricing) return false;
  if (pricing.mode === "flat_fee") return priceNumberFree(pricing.flatFee);
  if (pricing.mode === "usage_per_unit") return priceNumberFree(pricing.usagePerUnit);
  if (pricing.mode === "usage_tiered") {
    const tiers = pricing.usageTiered?.tiers || [];
    return tiers.length > 0 && tiers.every((tier) => priceNumberFree(tier?.pricePerUnit));
  }
  const values = [pricing.usagePerUnit, pricing.flatFee]
    .concat((pricing.usageTiered?.tiers || []).map((tier) => tier?.pricePerUnit))
    .map(parsePriceNumber)
    .filter((number) => number !== null);
  return values.length > 0 && values.every((number) => number <= 0);
}

function priceNumberFree(value) {
  const number = parsePriceNumber(value);
  return number !== null && number <= 0;
}

function parsePriceNumber(value) {
  const number = Number.parseFloat(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeModelID(modelID) {
  return String(modelID || "").trim().toLowerCase();
}

function matchedSupportedModels(channel, search) {
  const needle = normalizeModelID(search);
  if (!needle || !Array.isArray(channel?.supportedModels)) return [];
  return channel.supportedModels.filter((modelID) => normalizeModelID(modelID).includes(needle));
}

function modelFreeInPriceRows(modelID, prices) {
  const row = findModelPriceRow(prices, modelID);
  return row ? modelPriceItemsFree(row?.price?.items) : true;
}

function findModelPriceRow(prices, modelID) {
  const normalizedModelID = normalizeModelID(modelID);
  return (prices || []).find((price) => normalizeModelID(price?.modelID) === normalizedModelID) || null;
}
