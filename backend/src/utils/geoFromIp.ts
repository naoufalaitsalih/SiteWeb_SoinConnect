type GeoResult = {
  country?: string;
  city?: string;
};

/**
 * Localisation approximative via IP (sans GPS).
 * Retourne null si la base GeoIP locale n'est pas disponible.
 */
export function getGeoFromIp(ip?: string): GeoResult {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.")) {
    return {};
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const geoip = require("geoip-lite") as {
      lookup: (addr: string) => {
        country?: string;
        city?: string;
      } | null;
    };

    const lookup = geoip.lookup(ip);
    if (!lookup) return {};

    return {
      country: lookup.country || undefined,
      city: lookup.city || undefined,
    };
  } catch {
    return {};
  }
}
