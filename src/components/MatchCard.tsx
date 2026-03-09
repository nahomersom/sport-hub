import { Link } from "react-router-dom";
import { matchDetailPath } from "../constants/routes";
import type { Match, MatchTeamTag } from "../types/api";
import redCardIcon from "../assets/icons/redCard.svg?url";

interface MatchCardProps {
  match: Match;
}

function TeamBadge({ src, alt }: { src?: string; alt: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="size-4 object-contain rounded-full bg-chip shrink-0"
      />
    );
  }
  return (
    <div
      className="size-4 rounded-full bg-chip flex items-center justify-center text-xs font-medium text-muted shrink-0"
      aria-hidden
    >
      {alt.slice(0, 2)}
    </div>
  );
}

function KebabIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="6" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="8" height="6" viewBox="0 0 8 6" fill="none" aria-hidden>
      <path d="M1 3l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TeamTags({ tags }: { tags?: MatchTeamTag[] }) {
  if (!tags?.length) return null;
  return (
    <span className="flex items-center gap-1 shrink-0">
      {tags.map((tag) => {
        if (tag === "red") {
          return (
            <img key={tag} src={redCardIcon} alt="Red card" className="size-3 object-contain" />
          );
        }
        if (tag === "agg" || tag === "pen") {
          return (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 rounded-[100px] px-1.5 py-0.5 text-[10px] font-medium uppercase text-accent bg-[#26273B]"
            >
              <CheckIcon className="text-accent" />
              {tag === "agg" ? "AGG" : "PEN"}
            </span>
          );
        }
        return null;
      })}
    </span>
  );
}

function formatMatchTime(match: Match): string {
  if (match.time) {
    const part = match.time.slice(0, 5);
    if (/^\d{2}:\d{2}$/.test(part)) return part;
    const parsed = new Date(`${match.date}T${match.time}`);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    }
  }
  const parsed = new Date(match.date);
  return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function MatchCard({ match }: MatchCardProps) {

  const isFinished = match.status === "FT";
  const notStarted = match.status === "NS";
  const isLive = match.status === "LIVE" || match.status === "HT";

  return (
    <Link
      to={matchDetailPath(match.id)}
      state={{ match }}
      className="relative py-2 flex overflow-hidden bg-card text-on-surface no-underline border-b border-b-border-subtle"
    >
      <div className="flex min-w-[56px] items-stretch shrink-0">
        {notStarted ? (
          <>
            <div className="w-1 shrink-0 bg-[#374551]" aria-hidden />
            <div className="flex flex-1 items-center justify-center">
              <span className="text-xs text-white tabular-nums">
                {formatMatchTime(match)}
              </span>
            </div>
          </>
        ) : (
          <>
            <div
              className={`w-1 shrink-0 ${
                isFinished ? "bg-card-red" : "bg-accent"
              }`}
              aria-hidden
            />
            <div className="relative flex flex-1 flex-col items-center justify-center py-0.5">
              {isLive && (
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-0 w-[8vw] max-w-[135px] bg-gradient-to-r from-accent/15 to-transparent"
                  aria-hidden
                />
              )}
              <span
                className={`relative z-10 text-[12px] uppercase tabular-nums ${
                  isFinished ? "text-status-finished" : "text-accent"
                }`}
              >
                {isFinished ? "FT" : match.statusLabel}
                {!isFinished && match.statusLabel !== "HT" && "\u2019"}
              </span>
              {!isFinished && (
                <div className="relative z-10 mt-1 h-[2px] w-4 overflow-hidden rounded-[100px] bg-border-subtle/30">
                  <div
                    className="absolute left-0 top-0 h-full w-1/2 rounded-[100px] bg-accent animate-border-slide"
                    aria-hidden
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center p-2 min-w-0 gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <TeamBadge src={match.homeBadge} alt={match.homeTeam} />
            <span className="text-xs truncate text-on-surface">
              {match.homeTeam}
            </span>
            <TeamTags tags={match.homeTags} />
          </div>
          
            <span className="text-xs font-semibold text-on-surface shrink-0 flex items-baseline gap-2">
              {match.aggregateHome != null && (
                <span className="text-[10px] font-normal text-[#6B7280]">[{match.aggregateHome}]</span>
              )}
              <span>{match.homeScore}</span>
            </span>
         
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <TeamBadge src={match.awayBadge} alt={match.awayTeam} />
            <span className="text-xs truncate text-on-surface">
              {match.awayTeam}
            </span>
            <TeamTags tags={match.awayTags} />
          </div>
    
            <span className="text-xs font-semibold text-on-surface shrink-0 flex items-baseline gap-2">
              {match.aggregateAway != null && (
                <span className="text-[10px] font-normal text-[#6B7280]">[{match.aggregateAway}]</span>
              )}
              <span>{match.awayScore}</span>
            </span>
      
        </div>
      </div>

      <div className="flex items-center pr-2 shrink-0">
        <button
          type="button"
          className="p-2 text-muted hover:text-on-surface transition-colors"
          aria-label="Match options"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // TODO: open menu
          }}
        >
          <KebabIcon className="size-4" />
        </button>
      </div>
    </Link>
  );
}
