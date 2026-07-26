function ensurePanel() {
  injectStyle();
  replaceApiKeyActionButtons();
  removeMarketplaceVerificationButtons();
  insertRequestTriggers();
  insertPriceFilter();
  applyVisiblePriceFilter();
}
