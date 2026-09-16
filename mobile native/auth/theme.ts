export const DEFAULT_THEME_COLOR = '#0D7E52';

export function withAlpha(hex: string, alpha: string) {
  return `${hex}${alpha}`;
}

export function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}
