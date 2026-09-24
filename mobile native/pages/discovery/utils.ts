import type { Row } from '../../services/supabase';
import type { AlertItem, DiscoveryEvent } from './types';

export const CATEGORY_ICONS: Record<string, string> = {
  computer_science: 'code-tags',
  technology: 'cpu-64-bit',
  medicine: 'heart-pulse',
  engineering: 'cog',
  physics: 'atom',
  mathematics: 'sigma',
  biology: 'dna',
  chemistry: 'flask',
  agriculture: 'leaf',
  education: 'school',
  economics: 'chart-bar',
  social_sciences: 'account-group',
  arts: 'palette',
  law: 'scale-balance',
  literature: 'book-open',
  philosophy: 'brain',
  other: 'earth',
};

export function categoryIcon(category: string) {
  return CATEGORY_ICONS[category] ?? CATEGORY_ICONS.other ?? 'tag';
}

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  computer_science: ['#0D7E52', '#1FB69A'],
  technology: ['#1565C0', '#42A5F5'],
  medicine: ['#C62828', '#EF5350'],
  engineering: ['#EF6C00', '#FFA726'],
  physics: ['#4527A0', '#7E57C2'],
  mathematics: ['#00695C', '#26A69A'],
  biology: ['#2E7D32', '#66BB6A'],
  chemistry: ['#6A1B9A', '#AB47BC'],
  agriculture: ['#558B2F', '#9CCC65'],
  education: ['#0277BD', '#4FC3F7'],
  economics: ['#B7791F', '#FFD54F'],
  social_sciences: ['#AD1457', '#EC407A'],
  arts: ['#C2185B', '#F06292'],
  law: ['#37474F', '#78909C'],
  literature: ['#5D4037', '#A1887F'],
  philosophy: ['#283593', '#7986CB'],
  other: ['#0D7E52', '#1FB69A'],
};

export function categoryGradient(category: string): [string, string] {
  return CATEGORY_GRADIENTS[category] ?? CATEGORY_GRADIENTS.other!;
}

export function formatCategory(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatShortDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function statusOf(event: DiscoveryEvent) {
  if (event.is_completed) return { label: 'Ended', type: 'ended' as const };
  if (event.is_ongoing) return { label: 'Live', type: 'live' as const };
  return { label: 'Upcoming', type: 'upcoming' as const };
}

export function eventKey(event: DiscoveryEvent) {
  return event.id || event.org_slug;
}

export function toAlertItem(
  row: Row,
  orgSlug: string,
  orgName: string,
): AlertItem {
  const rawCreated = row['created_at'];
  const parsed =
    typeof rawCreated === 'number'
      ? rawCreated
      : Date.parse(String(rawCreated ?? ''));
  return {
    id: String(row['id'] ?? `${orgSlug}-${parsed || Math.random()}`),
    org_slug: orgSlug,
    org_name: orgName,
    title: String(row['title'] ?? 'Update'),
    body: String(row['content'] ?? row['message'] ?? ''),
    createdAt: Number.isNaN(parsed) ? 0 : parsed,
  };
}

export function toDiscoveryEvent(row: Row): DiscoveryEvent {
  return {
    id: String(row['id'] ?? ''),
    org_slug: String(row['org_slug'] ?? ''),
    org_name: String(row['org_name'] ?? ''),
    title: String(row['title'] ?? 'Untitled conference'),
    description: String(row['description'] ?? ''),
    category: String(row['category'] ?? 'other'),
    start_date: String(row['start_date'] ?? ''),
    end_date: String(row['end_date'] ?? ''),
    start_time: String(row['start_time'] ?? ''),
    location: String(row['location'] ?? ''),
    logo_url: String(row['logo_url'] ?? ''),
    pricing: String(row['pricing'] ?? ''),
    webapp_url: String(row['webapp_url'] ?? ''),
    official_website_url: String(row['official_website_url'] ?? ''),
    is_extra: row['is_extra'] === true,
    is_ongoing: row['is_ongoing'] === true,
    is_completed: row['is_completed'] === true,
  };
}
