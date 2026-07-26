function openSelectLikeUser(trigger) {
  dispatchPointerEvent(trigger, "pointerdown", 1);
}

function selectOptionLikeUser(option) {
  dispatchPointerEvent(option, "pointermove", 1);
  dispatchMouseEvent(option, "mousemove", 1);
  dispatchPointerEvent(option, "pointerup", 0);
  dispatchMouseEvent(option, "mouseup", 0);
  dispatchMouseEvent(option, "click", 0);
}

function dispatchPointerEvent(element, type, buttons) {
  const init = mouseEventInit(element, buttons);
  const event = typeof PointerEvent === "function"
    ? new PointerEvent(type, { ...init, pointerId: 1, pointerType: "mouse", isPrimary: true })
    : new MouseEvent(type, init);
  element.dispatchEvent(event);
}

function dispatchMouseEvent(element, type, buttons) {
  element.dispatchEvent(new MouseEvent(type, mouseEventInit(element, buttons)));
}

function mouseEventInit(element, buttons) {
  const rect = element.getBoundingClientRect?.();
  const clientX = rect ? rect.left + rect.width / 2 : 0;
  const clientY = rect ? rect.top + rect.height / 2 : 0;
  return {
    bubbles: true,
    cancelable: true,
    composed: true,
    button: 0,
    buttons,
    clientX,
    clientY,
  };
}
