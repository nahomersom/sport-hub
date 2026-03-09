/** Event from eventsnext.php / eventsnextleague.php */
export interface FixtureEvent {
  idEvent: string;
  strEvent: string;
  dateEvent: string;
  strTime?: string;
  strThumb?: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strProgress?: string | null;
  strStatus?: string | null;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  strLeague?: string | null;
}

/** Response from eventsnext.php */
export interface EventsNextResponse {
  events: FixtureEvent[] | null;
}

export interface MatchEvent extends FixtureEvent {
  strLeague?: string;
  strSeason?: string;
  strVenue?: string;
  strResult?: string;
  strFilename?: string;
  [key: string]: string | null | undefined;
}

/** Response from lookupevent.php */
export interface LookupEventResponse {
  events: MatchEvent[] | null;
}

/**badges for match card (e.g. AGG, PEN, red card) api not providing this info */
export type MatchTeamTag = "agg" | "pen" | "red";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "NS" | "LIVE" | "HT" | "FT";
  statusLabel: string;
  date: string;
  time?: string;
  homeBadge?: string;
  awayBadge?: string;
  league?: string;
  aggregateHome?: number;
  aggregateAway?: number;
  homeTags?: MatchTeamTag[];
  awayTags?: MatchTeamTag[];
}
