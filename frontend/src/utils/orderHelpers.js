export const ORDER_STATUSES = ['pending', 'processing', 'approved', 'shipped', 'delivered', 'cancelled'];

export const STATUS_LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  approved: 'Approved',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const STATUS_STYLES = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  approved: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300',
  shipped: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
};

export const formatCancelCountdown = (ms) => {
  if (ms <= 0) return null;
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}m ${s}s`;
};
