function insertRequestTriggers() {
  if (!isRequestsConsumerRoute()) {
    document.querySelectorAll(`.${REQUEST_TRIGGER_CLASS}`).forEach((button) => button.remove?.());
    return;
  }
  const apiKeyButton = findRequestsApiKeyFilterButton();
  const host = apiKeyButton?.parentElement;
  if (!apiKeyButton || !host || host.querySelector?.(`.${REQUEST_TRIGGER_CLASS}`)) return;
  apiKeyButton.insertAdjacentElement("afterend", createRequestEditTrigger(apiKeyButton));
}

function isRequestsConsumerRoute() {
  if (!location.pathname.startsWith("/project/requests")) return false;
  const view = new URLSearchParams(location.search || "").get("view");
  return !view || view === "consumer";
}

function findRequestsApiKeyFilterButton() {
  return Array.from(document.querySelectorAll("main button"))
    .find((button) => cleanText(button.textContent) === REQUESTS_API_KEY_LABEL);
}

function createRequestEditTrigger(anchor) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "更新 API 密钥";
  button.className = anchor.className
    || "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border bg-background h-8 rounded-md px-3";
  button.classList.add(TRIGGER_CLASS, REQUEST_TRIGGER_CLASS);
  button.addEventListener("click", openRequestEditDialog);
  return button;
}
