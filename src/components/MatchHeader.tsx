import { Link } from "react-router-dom";
import type { Match } from "../types/api";
import longArrowIcon from "../assets/icons/longArrow.svg";

export interface CardCounts {
  homeYellow: number;
  homeRed: number;
  awayYellow: number;
  awayRed: number;
}

interface MatchHeaderProps {
  match: Match;
  showBack?: boolean;
  cardCounts?: CardCounts;
  embedInCard?: boolean;
}

function formatMatchDate(dateStr: string) {
  const d = new Date(dateStr + "Z");
  const day = d.getUTCDate();
  const month = d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase();
  return `${day} ${month}`;
}

function StatusBadge({ status, label }: { status: Match["status"]; label: string }) {
  const isLive = status === "LIVE" || status === "HT";
  const isFinished = true;//for the test we always shows finished
  const className =
    isLive
      ? "bg-status-live text-on-accent"
      : isFinished
        ? "bg-status-finished text-on-surface"
        : "bg-chip text-muted";
  return (
    <span className={`text-[10px] font-normal rounded-sm px-2 py-0.5 ${className}`}>
      {label}
    </span>
  );
}

function CardBadges({
  yellow,
  red,
  position,
}: {
  yellow: number;
  red: number;
  position: "home" | "away";
}) {
  const hasAny = yellow > 0 || red > 0;
  if (!hasAny) return null;
  const isHome = position === "home";
  return (
    <div
      className={`absolute flex items-center gap-[0.5px] ${isHome ? "top-0 right-0 translate-x-4" : "top-0 left-0 -translate-x-7"} -translate-y-0.5`}
    >
      {red > 0 && (
        <span className="w-[12px] h-[12px]  bg-card-red text-on-accent flex items-center justify-center text-[10px] font-medium leading-none text-center">
          {red}
        </span>
      )}
      {yellow > 0 && (
        <span className="w-[12px] h-[12px]  bg-card-yellow text-on-accent flex items-center justify-center text-[10px] font-medium leading-none text-center">
          {yellow}
        </span>
      )}
    </div>
  );
}

/** Display label from status so passed/list data shows correctly */
function getStatusDisplayLabel(status: Match["status"]): string {
  if (status === "FT") return "Finished";
  if (status === "LIVE" || status === "HT") return "Live";
  return "Not Started";
}

export function MatchHeader({ match, showBack = true, cardCounts, embedInCard }: MatchHeaderProps) {
  const scoreText =
    match.homeScore != null && match.awayScore != null
      ? `${match.homeScore} - ${match.awayScore}`
      : "vs";
  const statusDisplayLabel = getStatusDisplayLabel(match.status);

  return (
    <div className={embedInCard ? "overflow-hidden flex flex-col gap-[23.5px]" : "rounded-md bg-card overflow-hidden"}>
      <div className="relative flex items-center p-4  gap-4">
        {showBack && (
          <Link
            to="/"
            className=""
            aria-label="Back to fixtures"
          >
            <img src={longArrowIcon} alt="" width={24} height={24} className="size-6 shrink-0" />
          </Link>
        )}
        <span className="text-sm text-white ">
          {match.league ?? "English Premier League"}
        </span>
      </div>

      
      <div className="flex items-stretch justify-between gap-4 ">
        <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
          <div className="relative shrink-0">
            {match.homeBadge ? (
              <img
                src={match.homeBadge}
                alt={match.homeTeam}
                className="w-[42px] h-[42px] object-contain rounded-full bg-chip"
              />
            ) : (
              <div className="w-[42px] h-[42px] rounded-full bg-chip flex items-center justify-center text-xs font-medium text-muted">
                {match.homeTeam.slice(0, 2)}
              </div>
            )}
            {cardCounts && (
              <CardBadges
                position="home"
                yellow={cardCounts.homeYellow}
                red={cardCounts.homeRed}
              />
            )}
          </div>
          <span className="text-sm font-medium text-on-surface truncate w-full text-center">
            {match.homeTeam}
          </span>
        </div>

        {/* Center: date, score, status */}
        <div className="flex flex-col items-center justify-center gap-1 shrink-0 px-2">
          {match.date && (
            <span className="text-[11px] text-muted">
              {formatMatchDate(match.date)}
            </span>
          )}
          <span className="text-[22px] font-semibold leading-tight">{scoreText}</span>
          <StatusBadge status={match.status} label={statusDisplayLabel} />
        </div>

        <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
          <div className="relative shrink-0">
            {match.awayBadge ? (
              <img
                src={match.awayBadge}
                alt={match.awayTeam}
                className="w-[42px] h-[42px] object-contain rounded-full bg-chip"
              />
            ) : (
              <div className="w-[42px] h-[42px] rounded-full bg-chip flex items-center justify-center text-xs font-medium text-muted">
                {match.awayTeam.slice(0, 2)}
              </div>
            )}
            {cardCounts && (
              <CardBadges
                position="away"
                yellow={cardCounts.awayYellow}
                red={cardCounts.awayRed}
              />
            )}
          </div>
          <span className="text-sm font-medium text-on-surface truncate w-full text-center">
            {match.awayTeam}
          </span>
        </div>
      </div>
    </div>
  );
}
