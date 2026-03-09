import { useState, useMemo } from "react";
import { useFixtures } from "../hooks/useFixtures";
import { Navbar } from "../components/Navbar";
import { HeaderTabs } from "../components/HeaderTabs";
import { DateStrip } from "../components/DateStrip";
import { MatchCard } from "../components/MatchCard";
import type { TabId } from "../types/navigation";
import chevronRightIcon from "../assets/icons/chevronRight.svg?url";

export function Dashboard() {
  const { matches, loading, error, refetch } = useFixtures({ poll: true });
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const liveCount = useMemo(
    () => matches.filter((m) => m.status === "LIVE" || m.status === "HT").length,
    [matches]
  );

  const favoritesCount = 0;

  const filteredMatches = useMemo(() => {
    if (activeTab === "live") {
      return matches.filter((m) => m.status === "LIVE" || m.status === "HT");
    }
    if (activeTab === "favorites") {
      return []; 
    }
    return matches;
  }, [matches, activeTab]);

  const matchesByLeague = useMemo(() => {
    const map = new Map<string, typeof filteredMatches>();
    for (const m of filteredMatches) {
      const key = m.league ?? "Other";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(m);
    }
    return Array.from(map.entries());
  }, [filteredMatches]);

  return (
    <div className="flex flex-col min-h-screen bg-page">
      <Navbar />

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 md:px-5 py-4">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-[20px] font-semibold text-on-surface">Matches</h1>
        </div>

        <DateStrip />

        {/* Tabs: All, Live, Favorites */}
        <div className="py-4">
          <HeaderTabs
            active={activeTab}
            onSelect={setActiveTab}
            allCount={matches.length}
            liveCount={liveCount}
            favoritesCount={favoritesCount}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4  flex-1">
          {error && (
            <div
              className="rounded-md p-4 bg-status-finished/20 text-on-surface flex items-center justify-between gap-4"
              role="alert"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => void refetch()}
                className="rounded-md px-3 py-1.5 bg-card hover:bg-chip text-sm font-medium"
              >
                Retry
              </button>
            </div>
          )}

          {loading && matches.length === 0 ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-md bg-card animate-pulse"
                />
              ))}
            </div>
          ) : filteredMatches.length === 0 ? (
            <div className="rounded-md p-8 bg-card text-center text-muted">
              {activeTab === "live"
                ? "No live matches right now."
                : activeTab === "favorites"
                  ? "No favorites yet."
                  : "No fixtures to show."}
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {matchesByLeague.map(([leagueName, leagueMatches]) => (
                <section key={leagueName} className="bg-card rounded-md p-4">
                  <header className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-medium text-on-surface">{leagueName}</h2>
                    <button
                      type="button"
                      className=" text-muted hover:text-on-surface transition-colors"
                      aria-label={`View ${leagueName}`}
                    >
                      <img src={chevronRightIcon} alt="" className="" />
                    </button>
                  </header>
                  <div className="flex flex-col ">
                    {leagueMatches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
