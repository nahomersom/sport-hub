import { useState, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useMatchDetails } from "../hooks/useMatchDetails";
import type { Match } from "../types/api";
import { Navbar } from "../components/Navbar";
import { MatchHeader } from "../components/MatchHeader";
import { EventsTimeline } from "../components/EventsTimeline";
import type { TimelineEvent } from "../types/events";
import type { MatchEvent } from "../types/api";

const MATCH_DETAIL_TABS = [
  { id: "details" as const, label: "Details" },
  { id: "odds" as const, label: "Odds" },
  { id: "lineups" as const, label: "Lineups" },
  { id: "events" as const, label: "Events" },
  { id: "stats" as const, label: "Stats" },
  { id: "standings" as const, label: "Standings" },
] as const;

type MatchDetailTabId = (typeof MATCH_DETAIL_TABS)[number]["id"];

function buildTimelineFromEvent(ev: MatchEvent | null): TimelineEvent[] {
  if (!ev) return [];

  const list: TimelineEvent[] = [];
  let id = 0;

  const homeGoals = (ev.strHomeGoalDetails ?? "").split(";").filter(Boolean);
  const awayGoals = (ev.strAwayGoalDetails ?? "").split(";").filter(Boolean);
  homeGoals.forEach((g) => {
    const [min, name] = g.split("'");
    list.push({
      id: `goal-h-${id++}`,
      type: "goal",
      side: "home",
      minute: min?.trim() ?? "",
      label: name?.trim() ?? "Goal",
    });
  });
  awayGoals.forEach((g) => {
    const [min, name] = g.split("'");
    list.push({
      id: `goal-a-${id++}`,
      type: "goal",
      side: "away",
      minute: min?.trim() ?? "",
      label: name?.trim() ?? "Goal",
    });
  });

  const homeYellows = (ev.strHomeYellowCards ?? "").split(";").filter(Boolean);
  const awayYellows = (ev.strAwayYellowCards ?? "").split(";").filter(Boolean);
  [...homeYellows, ...awayYellows].forEach((y, i) => {
    const [min, name] = y.split("'");
    list.push({
      id: `yellow-${id++}`,
      type: "yellow",
      side: i < homeYellows.length ? "home" : "away",
      minute: min?.trim() ?? "",
      label: name?.trim() ?? "Yellow card",
    });
  });

  // Red cards
  const homeReds = (ev.strHomeRedCards ?? "").split(";").filter(Boolean);
  const awayReds = (ev.strAwayRedCards ?? "").split(";").filter(Boolean);
  [...homeReds, ...awayReds].forEach((r, i) => {
    const [min, name] = r.split("'");
    list.push({
      id: `red-${id++}`,
      type: "red",
      side: i < homeReds.length ? "home" : "away",
      minute: min?.trim() ?? "",
      label: name?.trim() ?? "Red card",
    });
  });

  // Sort by minute
  list.sort((a, b) => {
    const ma = parseInt(a.minute, 10) || 0;
    const mb = parseInt(b.minute, 10) || 0;
    return ma - mb;
  });

  return list;
}

/** Dummy timeline events matching the attached design (API may not provide); Fulltime 2-1, Halftime 1-0, Kick Off 13:00 */
function getDummyTimelineEvents(_homeTeam: string, _awayTeam: string): TimelineEvent[] {
  return [
    { id: "d-89", type: "substitution", side: "home", minute: "89", label: "Gyokores", subLabel: "Odegard" },
    { id: "d-88", type: "goal", side: "away", minute: "88", label: "Ekitike", subLabel: "Sallah" },
    { id: "d-78", type: "yellow", side: "home", minute: "78", label: "Saliba" },
    { id: "d-74", type: "corner", side: "home", minute: "74", label: "3rd corner" },
    { id: "d-67h", type: "substitution", side: "home", minute: "67", label: "Rice", subLabel: "Zubemendi" },
    { id: "d-67a", type: "substitution", side: "away", minute: "67", label: "Frimpong", subLabel: "Robertson" },
    { id: "d-66", type: "red", side: "away", minute: "66", label: "Van Dijk", subLabel: "Sent Off" },
    { id: "d-55", type: "goal", side: "home", minute: "55", label: "Saka" },
    { id: "d-52", type: "corner", side: "home", minute: "52", label: "5th corner" },
    { id: "d-48", type: "corner", side: "away", minute: "48", label: "3rd Corner" },
    { id: "d-45+2", type: "corner", side: "home", minute: "45+2", label: "2nd corner" },
    { id: "d-45", type: "substitution", side: "away", minute: "45", label: "Jones", subLabel: "Mcalister" },
    { id: "d-44y", type: "yellow", side: "home", minute: "44", label: "Gabriel" },
    { id: "d-44i", type: "injury", side: "away", minute: "44", label: "Jones", subLabel: "Injured" },
    { id: "d-36", type: "corner", side: "home", minute: "36", label: "1st corner" },
    { id: "d-34", type: "yellow", side: "away", minute: "34", label: "Konate" },
    { id: "d-25", type: "offthepost", side: "home", minute: "25", label: "Gyokores" },
    { id: "d-16", type: "corner", side: "away", minute: "16", label: "2nd Corner" },
    { id: "d-12", type: "goal", side: "home", minute: "12", label: "Gyokores", subLabel: "Odegard" },
    { id: "d-3", type: "corner", side: "away", minute: "3", label: "1st Corner" },
  ];
}

export function MatchDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();
  const stateMatch = (location.state as { match?: Match } | null)?.match;
  const { match: apiMatch, rawEvent, loading, error, refetch } = useMatchDetails(eventId);

  const match = useMemo((): Match | null => {
    if (apiMatch) {
      return {
        ...apiMatch,
        homeBadge: apiMatch.homeBadge ?? stateMatch?.homeBadge,
        awayBadge: apiMatch.awayBadge ?? stateMatch?.awayBadge,
        league: apiMatch.league ?? stateMatch?.league,
      };
    }
    return stateMatch ?? null;
  }, [apiMatch, stateMatch]);

  const [activeTab, setActiveTab] = useState<MatchDetailTabId>("events");

  const apiEvents = buildTimelineFromEvent(rawEvent);
  const timelineEvents =
    apiEvents.length > 0
      ? apiEvents
      : match
        ? getDummyTimelineEvents(match.homeTeam, match.awayTeam)
        : [];

  const cardCounts = {
    homeYellow: timelineEvents.filter((e) => e.side === "home" && e.type === "yellow").length,
    homeRed: timelineEvents.filter((e) => e.side === "home" && e.type === "red").length,
    awayYellow: timelineEvents.filter((e) => e.side === "away" && e.type === "yellow").length,
    awayRed: timelineEvents.filter((e) => e.side === "away" && e.type === "red").length,
  };

  if (loading && !match) {
    return (
      <div className="flex flex-col min-h-screen bg-page">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="rounded-md p-6 bg-card text-muted">
            Loading match…
          </div>
        </main>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="flex flex-col min-h-screen bg-page">
        <Navbar />
        <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-4">
          <div
            className="rounded-md p-6 bg-status-finished/20 text-on-surface flex flex-col gap-4"
            role="alert"
          >
            <p>{error ?? "Match not found."}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="self-start rounded-md px-4 py-2 bg-card hover:bg-chip font-medium"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-page">
      <Navbar />
      <main className="flex-1 flex flex-col max-w-[707px] mx-auto w-full px-4 py-4">
        <div className="rounded-t-md bg-card overflow-hidden pt-2 flex flex-col gap-[23.5px] border-b border-[#292B41]">
          <MatchHeader match={match} showBack cardCounts={cardCounts} embedInCard />

          <div
            className="min-w-0 overflow-x-auto overflow-y-hidden scrollbar-thin"
            role="tablist"
          >
            <div className="flex items-center justify-start gap-4 min-w-max pl-4 pr-4 md:pl-0 md:pr-0">
              {MATCH_DETAIL_TABS.map(({ id, label }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(id)}
                    className={`
                      shrink-0 py-2 text-sm font-medium min-w-[62px]
                      border-b-2 transition-colors cursor-pointer
                      ${isActive
                        ? "text-white border-b-4 border-b-accent"
                        : "text-[#D1D5DB] border-transparent hover:text-on-surface"}
                    `}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab panels */}
        <div className="mt-4 flex flex-col gap-4">
          {(activeTab === "details" || activeTab === "events") && (
            <div
              role="tabpanel"
              aria-labelledby={activeTab === "details" ? "tab-details" : "tab-events"}
            >
              <EventsTimeline
                events={timelineEvents}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                matchScore={match.homeScore != null && match.awayScore != null ? `${match.homeScore}-${match.awayScore}` : null}
                halftimeScore="1-0"
                matchDate={match.date}
                matchTime={match.time}
              />
            </div>
          )}
          {activeTab === "odds" && (
            <div
              role="tabpanel"
              aria-labelledby="tab-odds"
              className="rounded-md bg-card p-6 text-center text-muted text-sm"
            >
              Odds will appear here when available.
            </div>
          )}
          {activeTab === "stats" && (
            <div
              role="tabpanel"
              aria-labelledby="tab-stats"
              className="rounded-md bg-card p-6 text-center text-muted text-sm"
            >
              Match statistics will appear here when available.
            </div>
          )}
          {activeTab === "lineups" && (
            <div
              role="tabpanel"
              aria-labelledby="tab-lineups"
              className="rounded-md bg-card p-6 text-center text-muted text-sm"
            >
              Lineups will appear here when available.
            </div>
          )}
          {activeTab === "standings" && (
            <div
              role="tabpanel"
              aria-labelledby="tab-standings"
              className="rounded-md bg-card p-6 text-center text-muted text-sm"
            >
              Standings will appear here when available.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
