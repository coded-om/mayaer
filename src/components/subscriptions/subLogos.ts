// Map of subscription name (lowercase) → imported logo asset
import Netflix   from "@/assets/sub logos/netflex.png";
import Spotify   from "@/assets/sub logos/Spotify_logo_without_text.svg.png";
import YouTube   from "@/assets/sub logos/Youtube_logo.png";
import ICloud    from "@/assets/sub logos/ICloud_logo.svg.png";
import Microsoft from "@/assets/sub logos/microsoft-office-logo-2019-present.png";
import Amazon    from "@/assets/sub logos/Amazon_Prime_Logo.svg.png";

export const SUB_LOGOS: Record<string, string> = {
  netflix:       Netflix,
  spotify:       Spotify,
  youtube:       YouTube,
  "youtube premium": YouTube,
  icloud:        ICloud,
  "microsoft 365": Microsoft,
  "microsoft":   Microsoft,
  "amazon prime": Amazon,
  amazon:        Amazon,
};

/** Returns the logo URL for a service name, or null if none available. */
export function getSubLogo(name: string): string | null {
  return SUB_LOGOS[name.toLowerCase()] ?? null;
}
