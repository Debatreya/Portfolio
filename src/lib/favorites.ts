export type FavoriteItemType = "project" | "til";

export interface FavoriteTarget {
  id: string;
  type: FavoriteItemType;
  title?: string;
  pageUrl?: string;
  category?: string;
  tags?: string[];
}

export interface FavoriteEventPayload {
  eventId: string;
  action: "like" | "unlike";
  itemId: string;
  itemType: FavoriteItemType;
  title?: string;
  pageUrl: string;
  referrer?: string;
  userAgent?: string;
  language?: string;
  timezone?: string;
  screenSize?: string;
  colorScheme?: "light" | "dark" | "system";
  path?: string;
  search?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  visitorId: string;
  likedAt: string;
}

const FAVORITES_STORAGE_KEY = "portfolio:favorites:v1";
const VISITOR_STORAGE_KEY = "portfolio:visitor-id:v1";

function isBrowser() {
  return typeof window !== "undefined";
}

function safeParseJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function loadFavorites(): Record<string, boolean> {
  if (!isBrowser()) return {};

  return safeParseJson<Record<string, boolean>>(
    window.localStorage.getItem(FAVORITES_STORAGE_KEY),
    {},
  );
}

export function saveFavorites(favorites: Record<string, boolean>) {
  if (!isBrowser()) return;

  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

export function isFavorite(itemId: string) {
  return Boolean(loadFavorites()[itemId]);
}

export function setFavorite(itemId: string, value: boolean) {
  const favorites = loadFavorites();

  if (value) {
    favorites[itemId] = true;
  } else {
    delete favorites[itemId];
  }

  saveFavorites(favorites);
  return favorites;
}

export function getVisitorId() {
  if (!isBrowser()) return "server";

  const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY);
  if (existing) return existing;

  const nextId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `visitor_${Math.random().toString(36).slice(2)}_${Date.now()}`;

  window.localStorage.setItem(VISITOR_STORAGE_KEY, nextId);
  return nextId;
}

export function getColorSchemePreference() {
  if (!isBrowser()) return "system";

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "system";
}

export function getScreenSize() {
  if (!isBrowser()) return undefined;
  return `${window.innerWidth}x${window.innerHeight}`;
}

export function buildFavoriteEvent(
  target: FavoriteTarget,
  action: "like" | "unlike",
): FavoriteEventPayload {
  if (!isBrowser()) {
    return {
      eventId: `server_${target.id}_${action}`,
      action,
      itemId: target.id,
      itemType: target.type,
      pageUrl: target.pageUrl || "",
      visitorId: "server",
      likedAt: new Date().toISOString(),
    };
  }

  const url = new URL(target.pageUrl || window.location.href, window.location.origin);
  const params = url.searchParams;

  return {
    eventId:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `event_${target.id}_${Date.now()}`,
    action,
    itemId: target.id,
    itemType: target.type,
    title: target.title,
    pageUrl: url.toString(),
    referrer: document.referrer || undefined,
    userAgent: navigator.userAgent,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenSize: getScreenSize(),
    colorScheme: getColorSchemePreference(),
    path: url.pathname,
    search: url.search,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    visitorId: getVisitorId(),
    likedAt: new Date().toISOString(),
  };
}

export async function sendFavoriteEvent(payload: FavoriteEventPayload) {
  const endpoint = process.env.NEXT_PUBLIC_FAVORITE_WEBHOOK_URL;
  if (!endpoint) return false;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch {
    return false;
  }
}
