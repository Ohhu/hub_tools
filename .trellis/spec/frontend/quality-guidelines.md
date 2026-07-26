# Quality Guidelines

> Code quality standards for frontend development.

---

## Overview

<!--
Document your project's quality standards here.

Questions to answer:
- What patterns are forbidden?
- What linting rules do you enforce?
- What are your testing requirements?
- What code review standards apply?
-->

(To be filled by the team)

---

## Forbidden Patterns

<!-- Patterns that should never be used and why -->

(To be filled by the team)

---

## Required Patterns

<!-- Patterns that must always be used -->

(To be filled by the team)

---

## Testing Requirements

<!-- What level of testing is expected -->

(To be filled by the team)

---

## Code Review Checklist

<!-- What reviewers should check -->

(To be filled by the team)

---

## React-Owned DOM Enhancement Contract

### Convention: Preserve Semantic and Visual Order Separately

Userscript controls mounted into React-owned containers must defend both the DOM order and the rendered CSS order.

**Why**: React may recreate native siblings after the userscript has appended or replaced a node. A helper can pass an isolated DOM-order test while the live page still renders the injected control before a later native control.

```javascript
// Correct: restore semantic DOM order whenever the mount pass runs.
function moveChannelTriggerToActionEnd(trigger) {
  const actionContainer = trigger?.parentElement;
  if (!actionContainer || actionContainer.lastElementChild === trigger) return;
  actionContainer.append(trigger);
}
```

```css
/* Correct: use CSS order as a visual fallback for a grid field that must stay last. */
#linuxdo-hub-tool-price-field {
  order: 2147483647;
}
```

Do not rely only on the node's initial insertion position. Mount logic must remain idempotent and restore the required order after React rebuilds the surrounding container.

### Required Regression Checks

- Unit test the reorder helper with the injected node initially between two native siblings.
- Call the helper twice and assert that the second call does not change the order.
- Build and load the final userscript bundle; source-module tests alone do not validate concatenation order.
- In a logged-in browser, inspect both DOM child order and `getBoundingClientRect()` coordinates.
- Exercise every supported representation of the same resource, such as marketplace card and table/list views.
- Refresh the page after installing the latest userscript and confirm that the live style element contains the expected fallback rule.

### Wrong vs Correct

```javascript
// Wrong: correct only until React appends another native action.
anchor.replaceWith(createTrigger(channel));

// Correct: replace the native action, then restore the injected action's contract.
const trigger = createTrigger(channel);
anchor.replaceWith(trigger);
moveChannelTriggerToActionEnd(trigger);
```
