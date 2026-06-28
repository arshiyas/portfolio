import { STORAGE_KEY } from "./types";

/** Remove any data saved by older versions. This app keeps state in memory only. */
export function clearLegacyStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}
