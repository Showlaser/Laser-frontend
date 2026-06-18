// Minimal cookie helper that mirrors the small slice of the universal-cookie
// API this app relied on (new Cookies(); get/set/remove). Values are JSON
// serialized on set and parsed back on get, falling back to the raw string.

export type CookieSetOptions = {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  secure?: boolean;
  sameSite?: boolean | "lax" | "strict" | "none";
};

export default class Cookies {
  get<T = unknown>(name: string): T | undefined {
    const prefix = `${encodeURIComponent(name)}=`;
    const match = document.cookie.split("; ").find((row) => row.startsWith(prefix));
    if (match === undefined) {
      return undefined;
    }

    const raw = decodeURIComponent(match.slice(prefix.length));
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  set(name: string, value: unknown, options: CookieSetOptions = {}): void {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(serialized)}`;

    if (options.path !== undefined) {
      cookie += `; path=${options.path}`;
    }
    if (options.domain !== undefined) {
      cookie += `; domain=${options.domain}`;
    }
    if (options.maxAge !== undefined) {
      cookie += `; max-age=${options.maxAge}`;
    }
    if (options.expires !== undefined) {
      cookie += `; expires=${options.expires.toUTCString()}`;
    }
    if (options.secure) {
      cookie += "; secure";
    }
    if (options.sameSite !== undefined) {
      cookie += `; samesite=${options.sameSite === true ? "strict" : options.sameSite}`;
    }

    document.cookie = cookie;
  }

  remove(name: string, options: CookieSetOptions = {}): void {
    this.set(name, "", { ...options, maxAge: 0, expires: new Date(0) });
  }
}
