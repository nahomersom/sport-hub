import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../api/clients";
import { ENDPOINTS } from "../api/endpoints";
import type { LookupEventResponse, MatchEvent } from "../types/api";
import { matchEventToMatch } from "../utils/normalize";
import type { Match } from "../types/api";

export interface UseMatchDetailsResult {
  match: Match | null;
  rawEvent: MatchEvent | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMatchDetails(eventId: string | undefined): UseMatchDetailsResult {
  const [match, setMatch] = useState<Match | null>(null);
  const [rawEvent, setRawEvent] = useState<MatchEvent | null>(null);
  const [loading, setLoading] = useState(!!eventId);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    if (!eventId) {
      setMatch(null);
      setRawEvent(null);
      setLoading(false);
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const data = await apiClient.get<LookupEventResponse>(ENDPOINTS.LOOKUP_EVENT(eventId));
      const events = data.events ?? [];
      const ev = events[0] ?? null;
      if (!ev) {
        setMatch(null);
        setRawEvent(null);
        return;
      }
      setRawEvent(ev);
      setMatch(matchEventToMatch(ev));
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load match";
      setError(message);
      setMatch(null);
      setRawEvent(null);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void fetchDetails();
  }, [fetchDetails]);

  return { match, rawEvent, loading, error, refetch: fetchDetails };
}
