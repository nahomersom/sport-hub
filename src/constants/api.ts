/** API base URL (e.g. https://www.thesportsdb.com/api/v1/json/3). Set VITE_API_BASE in .env */
const API_BASE =
  import.meta.env.VITE_API_BASE ?? "https://www.thesportsdb.com/api/v1/json/3";

export const API = {
  /** Upcoming/live events for a league (eventsnext.php) */
  EVENTS_NEXT: (leagueId: string) => `${API_BASE}/eventsnext.php?id=${leagueId}`,
  /** Next events for a league (eventsnextleague.php) */
  EVENTS_NEXT_LEAGUE: (leagueId: string) => `${API_BASE}/eventsnextleague.php?id=${leagueId}`,
  /** Single event details by event ID */
  LOOKUP_EVENT: (eventId: string) => `${API_BASE}/lookupevent.php?id=${eventId}`,
} as const;

/** League ID for fixtures (4328 = English League 1 per TheSportsDB) */
export const DEFAULT_LEAGUE_ID = "4328";
