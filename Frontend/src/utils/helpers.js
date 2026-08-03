export const cn = (...classes) => classes.filter(Boolean).join(' ');

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const getInitials = (name = '') => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

export const truncate = (str, n = 50) => {
  if (!str) return '';
  return str.length > n ? str.slice(0, n) + '...' : str;
};
