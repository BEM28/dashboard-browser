export type Bookmark = {
  id: string;
  name: string;
  url: string;
};

export const BOOKMARKS_KEY = "bev:bookmarks";
export const MAX_BOOKMARKS = 16;

// Shown until the user edits their bookmarks in Settings.
export const defaultBookmarks: Bookmark[] = [
  { id: "gmail", name: "Gmail", url: "https://mail.google.com/mail" },
  { id: "youtube", name: "YouTube", url: "https://www.youtube.com" },
  { id: "github", name: "GitHub", url: "https://github.com" },
  { id: "drive", name: "Drive", url: "https://drive.google.com/drive" },
  { id: "claude", name: "Claude", url: "https://claude.ai" },
  { id: "notion", name: "Notion", url: "https://www.notion.so" },
  { id: "figma", name: "Figma", url: "https://www.figma.com" },
  { id: "maps", name: "Maps", url: "https://maps.google.com" },
];

/**
 * Turns user input ("github.com", "https://github.com/x") into an http(s) URL,
 * or null when it isn't a usable web address. Anything else (javascript:, data:,
 * bare words) is rejected because these values end up in an href.
 */
export function normalizeUrl(raw: string): string | null {
  const value = raw.trim();
  if (!value || /\s/.test(value)) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
    return url.href;
  } catch {
    return null;
  }
}

/** Fallback label when a bookmark is saved without a name. */
export function labelFromUrl(url: string) {
  const host = new URL(url).hostname.replace(/^www\./, "");
  return host.charAt(0).toUpperCase() + host.slice(1);
}
