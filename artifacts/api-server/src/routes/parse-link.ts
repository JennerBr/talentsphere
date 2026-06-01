export type PlatformKey =
  | "linkedin"
  | "github"
  | "teams"
  | "slack"
  | "webex"
  | "discord"
  | "spotify"
  | "youtube"
  | "x"
  | "telegram"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "generic";

interface ParsedLink {
  platform: PlatformKey;
  handle: string | null;
}

export const CANONICAL_PLATFORMS: PlatformKey[] = [
  "linkedin",
  "github",
  "discord",
  "spotify",
  "youtube",
  "telegram",
  "instagram",
  "x",
  "facebook",
  "tiktok",
];

export function parseLink(rawUrl: string): ParsedLink {
  let url: URL;
  try {
    const normalised = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
    url = new URL(normalised);
  } catch {
    return { platform: "generic", handle: rawUrl };
  }

  const host = url.hostname.replace(/^www\./, "");
  const pathParts = url.pathname.split("/").filter(Boolean);

  if (host === "linkedin.com" || host.endsWith(".linkedin.com")) {
    const inIdx = pathParts.indexOf("in");
    const handle = inIdx >= 0 ? (pathParts[inIdx + 1] ?? null) : (pathParts[0] ?? null);
    return { platform: "linkedin", handle };
  }

  if (host === "github.com") {
    return { platform: "github", handle: pathParts[0] ?? null };
  }

  if (host === "teams.microsoft.com") {
    return { platform: "teams", handle: pathParts[0] ?? null };
  }

  if (host === "slack.com" || host.endsWith(".slack.com")) {
    return { platform: "slack", handle: pathParts[0] ?? null };
  }

  if (host === "webex.com" || host.endsWith(".webex.com")) {
    return { platform: "webex", handle: pathParts[0] ?? null };
  }

  if (host === "discord.gg" || host === "discord.com") {
    return { platform: "discord", handle: pathParts[0] ?? null };
  }

  if (host === "open.spotify.com" || host === "spotify.com") {
    const typeIdx = pathParts.findIndex((p) => ["user", "artist", "show"].includes(p));
    const handle = typeIdx >= 0 ? (pathParts[typeIdx + 1] ?? null) : (pathParts[pathParts.length - 1] ?? null);
    return { platform: "spotify", handle };
  }

  if (host === "youtube.com" || host === "youtu.be") {
    const channelIdx = pathParts.findIndex((p) => p === "channel" || p === "c" || p === "user" || p.startsWith("@"));
    if (channelIdx >= 0) {
      const segment = pathParts[channelIdx];
      const handle = segment?.startsWith("@") ? segment : (pathParts[channelIdx + 1] ?? null);
      return { platform: "youtube", handle };
    }
    return { platform: "youtube", handle: pathParts[0] ?? null };
  }

  if (host === "x.com" || host === "twitter.com") {
    return { platform: "x", handle: pathParts[0] ?? null };
  }

  if (host === "t.me" || host === "telegram.me" || host === "telegram.org") {
    return { platform: "telegram", handle: pathParts[0] ?? null };
  }

  if (host === "instagram.com") {
    return { platform: "instagram", handle: pathParts[0] ?? null };
  }

  if (host === "facebook.com" || host === "fb.com") {
    return { platform: "facebook", handle: pathParts[0] ?? null };
  }

  if (host === "tiktok.com") {
    const seg = pathParts[0];
    const handle = seg?.startsWith("@") ? seg : (seg ? `@${seg}` : null);
    return { platform: "tiktok", handle };
  }

  return { platform: "generic", handle: host };
}
