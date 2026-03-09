import type { TimelineEvent, TimelineEventType } from "../types/events";
import goalIcon from "../assets/icons/goal.svg?url";
import yellowcardIcon from "../assets/icons/yellowcard.svg?url";
import bigRedCardIcon from "../assets/icons/bigRedCard.svg?url";
import substitueIcon from "../assets/icons/substitue.svg?url";
import cornerIcon from "../assets/icons/corner.svg?url";
import offthepostIcon from "../assets/icons/offthepost.svg?url";
import injuredIcon from "../assets/icons/injured.svg?url";

export interface EventsTimelineProps {
  events: TimelineEvent[];
  homeTeam: string;
  awayTeam: string;
  matchScore?: string | null;
  halftimeScore?: string | null;
  matchDate?: string | null;
  matchTime?: string | null;
}

const APOSTROPHE = "\u2019";

const EVENT_ICON_SIZE = 14;

function EventIcon({ type }: { type: TimelineEventType }) {
  if (type === "goal") {
    return (
      <img src={goalIcon} alt="" width={EVENT_ICON_SIZE} height={EVENT_ICON_SIZE} className="shrink-0 object-contain" aria-hidden />
    );
  }
  if (type === "yellow") {
    return (
      <img src={yellowcardIcon} alt="" width={EVENT_ICON_SIZE} height={EVENT_ICON_SIZE} className="shrink-0 object-contain" aria-hidden />
    );
  }
  if (type === "red") {
    return (
      <img src={bigRedCardIcon} alt="" width={EVENT_ICON_SIZE} height={EVENT_ICON_SIZE} className="shrink-0 object-contain" aria-hidden />
    );
  }
  if (type === "substitution") {
    return (
      <img src={substitueIcon} alt="" width={EVENT_ICON_SIZE} height={EVENT_ICON_SIZE} className="shrink-0 object-contain" aria-hidden />
    );
  }
  if (type === "corner") {
    return (
      <img src={cornerIcon} alt="" width={EVENT_ICON_SIZE} height={EVENT_ICON_SIZE} className="shrink-0 object-contain" aria-hidden />
    );
  }
  if (type === "offthepost" || type === "heatpost") {
    return (
      <img src={offthepostIcon} alt="" width={EVENT_ICON_SIZE} height={EVENT_ICON_SIZE} className="shrink-0 object-contain" aria-hidden />
    );
  }
  if (type === "injury") {
    return (
      <img src={injuredIcon} alt="" width={EVENT_ICON_SIZE} height={EVENT_ICON_SIZE} className="shrink-0 object-contain" aria-hidden />
    );
  }
  return (
    <span className="w-3 h-3 rounded-sm bg-muted shrink-0" aria-hidden />
  );
}

/** Connector line between time pill and icon  */
function TimeIconLine() {
  return <div className="w-4 h-px bg-[#374551] shrink-0" aria-hidden />;
}



/** Single event row: time pill always in fixed center column; label + connector + icon on left (home) or right (away) */
function EventRow({
  ev,
  homeTeam: _homeTeam,
  awayTeam: _awayTeam,
}: {
  ev: TimelineEvent;
  homeTeam: string;
  awayTeam: string;
}) {
  const isGoal = ev.type === "goal";
  const isHome = ev.side === "home";
  const timePill = (
    <span
      className={`text-[11px] tabular-nums px-2.5 py-1 rounded-full shrink-0 ${
        isGoal ? "bg-accent text-on-accent" : "bg-[#26273B] text-on-surface border border-border-subtle"
      }`}
    >
      {ev.minute}{APOSTROPHE}
    </span>
  );
  const icon = <EventIcon type={ev.type} />;
  const labelBlock = (
    <div className="min-w-0 text-left">
      <p className="text-xs  text-on-surface truncate">{ev.label}</p>
      {(ev.subLabel || ev.type === "red" || ev.type === "injury") && (
        <p className="text-xs text-[#6B7280]">
          {ev.type === "red" ? (ev.subLabel || "Sent Off") : ev.type === "injury" ? (ev.subLabel || "Injured") : "\u00A0" + ev.subLabel}
        </p>
      )}
    </div>
  );

  const centerColumn = (
    <div className="flex items-center justify-center shrink-0 w-[48px]">
      {timePill}
    </div>
  );

  const leftContent = isHome ? (
    <div className="flex items-center justify-end gap-2 min-w-0 flex-1 ">
      {labelBlock}
      {icon}
      <TimeIconLine />
    </div>
  ) : (
    <div className="flex-1 min-w-0" />
  );

  const rightContent = !isHome ? (
    <div className="flex items-center justify-start gap-2 min-w-0 flex-1 ">
      <TimeIconLine />
      {icon}
      {labelBlock}
    </div>
  ) : (
    <div className="flex-1 min-w-0" />
  );

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-0 py-2 ">
      {leftContent}
      {centerColumn}
      {rightContent}
    </div>
  );
}

function formatKickOffTime(dateStr?: string | null, timeStr?: string | null): string | null {
  if (timeStr) {
    const trimmed = timeStr.trim();
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(trimmed)) {
      const [h, m] = trimmed.split(":").map(Number);
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }
    const d = new Date("1970-01-01T" + trimmed + "Z");
    if (!Number.isNaN(d.getTime())) return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
    return trimmed.slice(0, 5);
  }
  if (dateStr) {
    const d = new Date(dateStr + "Z");
    return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  return null;
}

export function EventsTimeline({
  events,
  homeTeam,
  awayTeam,
  matchScore,
  halftimeScore,
  matchDate,
  matchTime,
}: EventsTimelineProps) {
  const kickOffStr = formatKickOffTime(matchDate, matchTime);
  const hasMarkers = matchScore != null || halftimeScore != null || kickOffStr != null;

  function MarkerRow({ label, value }: { label: React.ReactNode; value?: React.ReactNode }) {
    return (
      <div className="flex items-center gap-[10px] py-2">
        <div className="flex-1 h-px bg-border-subtle" aria-hidden />
        <div className="flex items-center gap-[10px] shrink-0">
          <span className="text-xs font-medium text-muted">{label}</span>
          {value != null && value !== "" && <span className="text-xs font-medium text-muted">{value}</span>}
        </div>
        <div className="flex-1 h-px bg-border-subtle" aria-hidden />
      </div>
    );
  }

  return (
    <div className="rounded-md bg-card overflow-hidden p-4 flex flex-col gap-4">
        <h2 className="text-sm font-medium text-on-surface">Events</h2>
      <div>
        {/* Fulltime marker at top */}
        {hasMarkers && matchScore != null && (
          <MarkerRow label="Fulltime" value={matchScore} />
        )}

        {/* Second half events (minute > 45) */}
        {events
          .filter((ev) => (parseInt(ev.minute, 10) || 0) > 45)
          .map((ev) => (
            <EventRow key={ev.id} ev={ev} homeTeam={homeTeam} awayTeam={awayTeam} />
          ))}

        {/* Halftime marker */}
        {hasMarkers && (matchScore != null || halftimeScore != null) && (
          <MarkerRow label={`Halftime ${APOSTROPHE} `} value={halftimeScore ?? undefined} />
        )}

        {/* First half events (minute <= 45) */}
        {events
          .filter((ev) => (parseInt(ev.minute, 10) || 0) <= 45)
          .map((ev) => (
            <EventRow key={ev.id} ev={ev} homeTeam={homeTeam} awayTeam={awayTeam} />
          ))}

        {/* Empty state when no events at all */}
        {events.length === 0 && !hasMarkers && (
          <div className="p-6 text-center text-muted text-sm">
            No event data available for this match.
          </div>
        )}

        {/* Kick Off marker at bottom */}
        {hasMarkers && kickOffStr != null && (
          <MarkerRow label="Kick Off" value={`- ${kickOffStr}`} />
        )}
      </div>
    </div>
  );
}
