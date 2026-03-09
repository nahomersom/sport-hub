import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../api/clients";
import { ENDPOINTS } from "../api/endpoints";
import { DEFAULT_LEAGUE_ID } from "../constants/leagues";
import type { EventsNextResponse } from "../types/api";
import { fixtureToMatch } from "../utils/normalize";
import type { Match } from "../types/api";
import arsenalLogo from "../assets/icons/england_arsenal.football-logos.cc.svg?url";
import bayerLeverkusenLogo from "../assets/icons/germany_bayer-leverkusen.football-logos.cc.svg?url";
import realMadridLogo from "../assets/icons/spain_real-madrid.football-logos.cc.svg?url";
import manCityLogo from "../assets/icons/england_manchester-city.football-logos.cc.svg?url";

const POLL_INTERVAL_MS = 18_000;

const UEFA_CHAMPIONS_LEAGUE = "UEFA Champions League";

/** Mock matches for testing LIVE / HT UI with AGG, PEN, red card, aggregate (appended below real data) */
const MOCK_LIVE_MATCHES: Match[] = [
  {
    id: "mock-live-uefa-1",
    homeTeam: "Arsenal",
    awayTeam: "Bayer Leverkusen",
    homeScore: 2,
    awayScore: 1,
    status: "LIVE",
    statusLabel: "65",
    date: new Date().toISOString().slice(0, 10),
    time: "21:00",
    homeBadge: arsenalLogo,
    awayBadge: bayerLeverkusenLogo,
    league: UEFA_CHAMPIONS_LEAGUE,
    aggregateHome: 2,
    aggregateAway: 0,
    homeTags: ["agg"],
    awayTags: [],
  },
  {
    id: "mock-ht-uefa-2",
    homeTeam: "Real Madrid",
    awayTeam: "Manchester City",
    homeScore: 1,
    awayScore: 1,
    status: "HT",
    statusLabel: "HT",
    date: new Date().toISOString().slice(0, 10),
    time: "20:00",
    homeBadge: realMadridLogo,
    awayBadge: manCityLogo,
    league: UEFA_CHAMPIONS_LEAGUE,
    aggregateHome: 3,
    aggregateAway: 1,
    homeTags: ["red"],
    awayTags: ["pen"],
  },
];

export interface UseFixturesResult {
  matches: Match[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useFixtures(options?: { poll?: boolean }): UseFixturesResult {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFixtures = useCallback(async () => {
    try {
      setError(null);
      const data = await apiClient.get<EventsNextResponse>(
        ENDPOINTS.EVENTS_NEXT_LEAGUE(DEFAULT_LEAGUE_ID)
      );
      const list = data.events ?? [];
      const fromApi = list.map(fixtureToMatch);
      setMatches([...fromApi, ...MOCK_LIVE_MATCHES]);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load fixtures";
      setError(message);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchFixtures();
  }, [fetchFixtures]);

  useEffect(() => {
    if (options?.poll !== true) return;
    const id = setInterval(fetchFixtures, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [options?.poll, fetchFixtures]);

  return { matches, loading, error, refetch: fetchFixtures };
}
