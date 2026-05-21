const CANCEL_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 hours
const NON_CANCELLABLE = ['shipped', 'delivered', 'cancelled'];

export const canCancelOrder = (order) => {
  if (!order || NON_CANCELLABLE.includes(order.status)) return false;
  const elapsed = Date.now() - new Date(order.createdAt).getTime();
  return elapsed < CANCEL_WINDOW_MS;
};

export const getCancelTimeRemaining = (order) => {
  if (!canCancelOrder(order)) return 0;
  const elapsed = Date.now() - new Date(order.createdAt).getTime();
  return Math.max(0, CANCEL_WINDOW_MS - elapsed);
};

export const enrichOrder = (order) => {
  const obj = order.toObject ? order.toObject() : { ...order };
  return {
    ...obj,
    cancelEligible: canCancelOrder(obj),
    cancelTimeRemainingMs: getCancelTimeRemaining(obj),
  };
};

export const ORDER_STATUSES = ['pending', 'processing', 'approved', 'shipped', 'delivered', 'cancelled'];
