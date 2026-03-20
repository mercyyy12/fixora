/**
 * Format a date as "X ago" (e.g. "3 hours ago")
 */
export const formatDistanceToNow = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // seconds

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
};

/**
 * Truncate text to maxLength characters
 */
export const truncate = (str, maxLength = 100) => {
  if (!str) return '';
  return str.length > maxLength ? str.slice(0, maxLength) + '…' : str;
};

/**
 * Get initials from a full name
 */
export const getInitials = (name = '') => {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('');
};

/**
 * Status → label + color mapping
 */
export const getStatusClass = (status) => {
  const map = {
    Open: 'status-open',
    Assigned: 'status-assigned',
    'In Progress': 'status-in-progress',
    Completed: 'status-completed',
    Cancelled: 'status-cancelled',
  };
  return map[status] || 'badge bg-gray-100 text-ink-2';
};
