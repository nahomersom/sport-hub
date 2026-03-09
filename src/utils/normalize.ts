import type { FixtureEvent, MatchEvent } from "../types/api";
import type { Match } from "../types/api";

function parseStatus(progress: string | null | undefined, status: string | null | undefined): Match["status"] {
  const s = (progress ?? status ?? "").toUpperCase();
  if (s === "FT" || s === "FULL TIME" || s === "FINISHED" || s.includes("FINISHED")) return "FT";
  if (s === "HT" || s.includes("HALF")) return "HT";
  if (s === "1H" || s === "2H" || (s && s !== "NS" && s !== "NOT STARTED")) return "LIVE";
  return "NS";
}

function statusLabel(progress: string | null | undefined, status: string | null | undefined): string {
  const s = (progress ?? status ?? "").trim();
  const upper = s.toUpperCase();
  if (upper === "FT" || s === "Full Time" || s === "Finished" || upper.includes("FINISHED")) return "FT";
  if (upper === "HT") return "HT";
  if (upper === "1H") return "1st Half";
  if (upper === "2H") return "2nd Half";
  if (s && upper !== "NS" && upper !== "NOT STARTED") return s;
  return "Not Started";
}

export function fixtureToMatch(ev: FixtureEvent): Match {
  const status = parseStatus(ev.strProgress, ev.strStatus);
  return {
    id: ev.idEvent,
    homeTeam: ev.strHomeTeam,
    awayTeam: ev.strAwayTeam,
    homeScore: ev.intHomeScore != null && ev.intHomeScore !== "" ? parseInt(String(ev.intHomeScore), 10) : null,
    awayScore: ev.intAwayScore != null && ev.intAwayScore !== "" ? parseInt(String(ev.intAwayScore), 10) : null,
    status,
    statusLabel: statusLabel(ev.strProgress, ev.strStatus),
    date: ev.dateEvent,
    time: ev.strTime ?? undefined,
    homeBadge: ev.strHomeTeamBadge,
    awayBadge: ev.strAwayTeamBadge,
    league: ev.strLeague ?? undefined,
  };
}

export function matchEventToMatch(ev: MatchEvent): Match {
  const m = fixtureToMatch(ev);
  m.league = ev.strLeague ?? undefined;
  return m;
}
