export type DiscoveryEvent = {
  id: string;
  org_slug: string;
  org_name: string;
  title: string;
  description: string;
  category: string;
  start_date: string;
  end_date: string;
  start_time: string;
  location: string;
  logo_url: string;
  pricing: string;
  webapp_url: string;
  official_website_url: string;
  is_extra: boolean;
  is_ongoing: boolean;
  is_completed: boolean;
};

export type AlertItem = {
  id: string;
  org_slug: string;
  org_name: string;
  title: string;
  body: string;
  createdAt: number;
};

export type EnteredConference = {
  org_slug: string;
  title: string;
  org_name: string;
  enteredAt: number;
};

export type DiscoverySettings = {
  notifications: boolean;
  reminders: boolean;
};

export const DEFAULT_SETTINGS: DiscoverySettings = {
  notifications: true,
  reminders: true,
};
