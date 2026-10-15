/**
 * Open social / payment links in the native app when installed,
 * otherwise fall back to the browser.
 */

function ensureHttps(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function normalizePlatformId(platformId: string) {
  const id = platformId.trim().toLowerCase();
  if (id === "twitter") return "x";
  return id;
}

function pathSegments(url: URL) {
  return url.pathname.split("/").filter(Boolean);
}

function stripAt(value: string) {
  return value.replace(/^@/, "");
}

/** Extract a profile handle / id from a known social URL. */
export function extractSocialHandle(platformId: string, url: string): string | null {
  const platform = normalizePlatformId(platformId);
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Bare handle (no scheme / domain)
  if (!/^https?:\/\//i.test(trimmed) && !trimmed.includes(".")) {
    if (platform === "whatsapp") {
      const digits = trimmed.replace(/\D/g, "");
      return digits || null;
    }
    return stripAt(trimmed) || null;
  }

  try {
    const parsed = new URL(ensureHttps(trimmed));
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const segments = pathSegments(parsed);

    switch (platform) {
      case "instagram":
        return segments[0] && !["p", "reel", "stories", "explore"].includes(segments[0])
          ? stripAt(segments[0])
          : null;
      case "x":
      case "twitter":
        return segments[0] && !["i", "intent", "share", "home"].includes(segments[0])
          ? stripAt(segments[0])
          : null;
      case "github":
        return segments[0] && !["settings", "notifications", "explore"].includes(segments[0])
          ? stripAt(segments[0])
          : null;
      case "linkedin":
        if (segments[0] === "in" && segments[1]) return stripAt(segments[1]);
        if (segments[0] === "company" && segments[1]) return stripAt(segments[1]);
        return segments[0] ? stripAt(segments[0]) : null;
      case "facebook":
        if (parsed.searchParams.get("id")) return parsed.searchParams.get("id");
        return segments[0] && !["profile.php", "pages", "groups"].includes(segments[0])
          ? stripAt(segments[0])
          : null;
      case "tiktok":
        return segments[0] ? stripAt(segments[0]) : null;
      case "youtube": {
        const at = segments.find((s) => s.startsWith("@"));
        if (at) return stripAt(at);
        if (segments[0] === "channel" && segments[1]) return segments[1];
        if (segments[0] === "c" && segments[1]) return segments[1];
        if (segments[0] === "user" && segments[1]) return segments[1];
        return segments[0] ? stripAt(segments[0]) : null;
      }
      case "whatsapp": {
        if (host === "wa.me" || host === "api.whatsapp.com") {
          const digits = (segments[0] || parsed.searchParams.get("phone") || "").replace(/\D/g, "");
          return digits || null;
        }
        return null;
      }
      case "telegram":
        if (host === "t.me" || host.endsWith("telegram.me")) {
          return segments[0] ? stripAt(segments[0]) : null;
        }
        return null;
      case "snapchat":
        if (segments[0] === "add" && segments[1]) return stripAt(segments[1]);
        return segments[0] ? stripAt(segments[0]) : null;
      case "threads":
        return segments[0] ? stripAt(segments[0]) : null;
      case "spotify":
        if (segments[0] === "user" && segments[1]) return segments[1];
        return null;
      case "twitch":
        return segments[0] ? stripAt(segments[0]) : null;
      case "reddit":
        if ((segments[0] === "user" || segments[0] === "u") && segments[1]) return segments[1];
        return null;
      case "pinterest":
        return segments[0] ? stripAt(segments[0]) : null;
      case "medium":
        return segments[0] ? stripAt(segments[0]) : null;
      case "behance":
        return segments[0] ? stripAt(segments[0]) : null;
      case "dribbble":
        return segments[0] ? stripAt(segments[0]) : null;
      default:
        return null;
    }
  } catch {
    return null;
  }
}

/** Native app URL for a social profile, or null if we only have the web link. */
export function getSocialAppUrl(platformId: string, webUrl: string): string | null {
  const platform = normalizePlatformId(platformId);
  const handle = extractSocialHandle(platform, webUrl);
  const web = ensureHttps(webUrl);

  switch (platform) {
    case "instagram":
      return handle ? `instagram://user?username=${encodeURIComponent(handle)}` : null;
    case "x":
    case "twitter":
      return handle
        ? `twitter://user?screen_name=${encodeURIComponent(handle)}`
        : null;
    case "linkedin":
      return handle
        ? `linkedin://in/${encodeURIComponent(handle)}`
        : `linkedin://profile?url=${encodeURIComponent(web)}`;
    case "facebook":
      return handle
        ? `fb://profile?id=${encodeURIComponent(handle)}`
        : `fb://facewebmodal/f?href=${encodeURIComponent(web)}`;
    case "whatsapp":
      return handle ? `whatsapp://send?phone=${encodeURIComponent(handle)}` : "whatsapp://";
    case "telegram":
      return handle ? `tg://resolve?domain=${encodeURIComponent(handle)}` : null;
    case "tiktok":
      return handle
        ? `snssdk1233://user/profile/${encodeURIComponent(handle)}`
        : null;
    case "youtube":
      return handle
        ? `vnd.youtube://www.youtube.com/@${encodeURIComponent(handle)}`
        : `vnd.youtube://${encodeURIComponent(web.replace(/^https?:\/\//, ""))}`;
    case "snapchat":
      return handle ? `snapchat://add/${encodeURIComponent(handle)}` : null;
    case "spotify":
      return handle ? `spotify:user:${encodeURIComponent(handle)}` : null;
    case "twitch":
      return handle ? `twitch://stream/${encodeURIComponent(handle)}` : null;
    case "github":
      // GitHub mobile app has limited deep links; open web URL in app via https intent on Android
      return null;
    case "threads":
      return handle ? `barcelona://user?username=${encodeURIComponent(handle)}` : null;
    case "discord":
      return web.includes("discord.gg/") || web.includes("discord.com/invite/")
        ? web.replace(/^https?:\/\//, "discord://")
        : null;
    default:
      return null;
  }
}

/** App URL for payment providers (PayPal, etc.), or null. */
export function getPaymentAppUrl(webUrl: string): string | null {
  const web = ensureHttps(webUrl);
  try {
    const parsed = new URL(web);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "paypal.me" || host.endsWith("paypal.com")) {
      const path = parsed.pathname.replace(/^\//, "");
      return path ? `paypal://paypal.me/${path}` : "paypal://";
    }

    if (host.includes("stripe.com") || host.includes("buy.stripe.com")) {
      return null; // Stripe Checkout is browser-only
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Try opening a native app URL; if the app is not installed, open the web URL in the browser.
 */
export function openAppOrBrowser(appUrl: string | null | undefined, webUrl: string) {
  const web = ensureHttps(webUrl);
  if (!web) return;

  if (!appUrl) {
    window.open(web, "_blank", "noopener,noreferrer");
    return;
  }

  const startedAt = Date.now();
  let settled = false;

  const settle = () => {
    settled = true;
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onHide);
    window.removeEventListener("blur", onHide);
  };

  const onHide = () => {
    // App took focus — do not open the browser
    settle();
  };

  const onVisibility = () => {
    if (document.hidden) onHide();
  };

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onHide);
  window.addEventListener("blur", onHide);

  // Attempt to open the native app
  window.location.href = appUrl;

  window.setTimeout(() => {
    if (settled) return;
    settle();

    // Still on this page shortly after — app likely missing
    if (Date.now() - startedAt < 2500 && !document.hidden) {
      window.open(web, "_blank", "noopener,noreferrer");
    }
  }, 1400);
}

export function openSocialLink(platformId: string, url: string) {
  const web = ensureHttps(url);
  const app = getSocialAppUrl(platformId, web);
  openAppOrBrowser(app, web);
}

export function openPaymentUrl(url: string) {
  const web = ensureHttps(url);
  const app = getPaymentAppUrl(web);
  openAppOrBrowser(app, web);
}
