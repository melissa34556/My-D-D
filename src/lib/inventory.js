export function normalizeInventory(items = []) {
  const source = Array.isArray(items) ? items : [];
  const normalized = source.map((item, index) => typeof item === "string"
    ? { id: "legacy-" + index, name: item, quantity: 1, weight: 0, cost: undefined, category: "Gear", containerId: "" }
    : { ...item, id: item?.id || "item-" + index, name: item?.name || "Unnamed item", quantity: Math.max(0, Number(item?.quantity ?? item?.qty ?? 1) || 0), weight: Math.max(0, Number(item?.weight) || 0), containerId: item?.containerId || "" });
  const byId = new Map(normalized.map(item => [item.id, item]));
  for (const item of normalized) {
    if (!item.containerId || item.containerId === item.id || !byId.get(item.containerId)?.isContainer) item.containerId = "";
  }
  // Break malformed legacy cycles deterministically instead of hiding the items.
  for (const item of normalized) {
    const seen = new Set([item.id]);
    let parent = item.containerId;
    while (parent) {
      if (seen.has(parent)) { item.containerId = ""; break; }
      seen.add(parent);
      parent = byId.get(parent)?.containerId || "";
    }
  }
  return normalized;
}

export function getInventoryDescendantIds(items, itemId) {
  const descendants = new Set();
  let frontier = [itemId];
  while (frontier.length) {
    const parent = frontier.shift();
    for (const item of items) {
      if (item.containerId === parent && !descendants.has(item.id)) {
        descendants.add(item.id);
        frontier.push(item.id);
      }
    }
  }
  return descendants;
}

export function canMoveInventoryItem(items, itemId, containerId = "") {
  const item = items.find(entry => entry.id === itemId);
  if (!item) return false;
  if (!containerId) return true;
  const target = items.find(entry => entry.id === containerId);
  if (!target?.isContainer || target.id === itemId) return false;
  return !getInventoryDescendantIds(items, itemId).has(containerId);
}

export function moveInventoryItem(items, itemId, containerId = "") {
  if (!canMoveInventoryItem(items, itemId, containerId)) return items;
  return items.map(item => item.id === itemId ? { ...item, containerId } : item);
}

export function removeInventoryItem(items, itemId) {
  const removed = items.find(item => item.id === itemId);
  if (!removed) return items;
  // Preserve contents when a container is deleted by moving direct contents to its parent.
  return items.filter(item => item.id !== itemId).map(item =>
    item.containerId === itemId ? { ...item, containerId: removed.containerId || "" } : item
  );
}

export function getInventoryContents(items, containerId) {
  return items.filter(item => item.containerId === containerId);
}

export function getInventoryItemCount(items) {
  return items.reduce((sum, item) => sum + Math.max(0, Number(item.quantity) || 0), 0);
}
