export const THEME_COLOR = '#0D7E52';

export const GREY_400 = '#BDBDBD';
export const GREY_500 = '#9E9E9E';
export const GREY_600 = '#757575';
export const GREY_700 = '#616161';
export const GREY_800 = '#424242';
export const MUTED = '#6B7280';
export const BODY_DARK = '#212121';
export const TAB_UNSELECTED = '#9CA3AF';
export const TITLE_DARK = '#1F2937';
export const DIVIDER = '#E5E7EB';
export const LIVE_RED = '#F44336';
export const STAR_AMBER = '#FFC107';
export const SUCCESS_GREEN = '#4CAF50';
export const ANSWER_GREEN_DARK = '#2E7D32';
export const ANSWER_GREEN = '#388E3C';
export const MALE_BLUE = '#2196F3';
export const FEMALE_PINK = '#FF69B4';
export const WARNING_ORANGE = '#FF9800';
export const ERROR_RED = '#DC2626';
export const INBOX_BG = '#F7F6FF';

export function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

export function timeAgo(timestamp: number, now = Date.now()) {
  const diff = Math.max(0, now - timestamp);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function formatClock(timestamp: number) {
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter((part) => part.length > 0);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0].slice(0, 1) + parts[1].slice(0, 1)).toUpperCase();
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatDayLabel(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  return `${MONTHS[month - 1]} ${day}`;
}

export function toIsoDate(date: Date) {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
