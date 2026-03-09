import type { TabId } from "../types/navigation";
import { HEADER_TABS } from "../constants/navigation";
import liveIcon from "../assets/icons/live.svg";
import heartIcon from "../assets/icons/heart.svg";

interface HeaderTabsProps {
  active: TabId;
  onSelect: (id: TabId) => void;
  allCount?: number;
  liveCount?: number;
  favoritesCount?: number;
}

export function HeaderTabs({
  active,
  onSelect,
  allCount = 0,
  liveCount = 0,
  favoritesCount = 0,
}: HeaderTabsProps) {
  const getCount = (id: TabId) => {
    switch (id) {
      case "all":
        return allCount;
      case "live":
        return liveCount;
      case "favorites":
        return favoritesCount;
    }
  };

  return (
    <div className="w-full min-w-0 overflow-x-auto overflow-y-hidden scrollbar-thin md:overflow-visible">
      <div className="flex items-center gap-2 sm:gap-4 w-max min-w-full pl-6 pr-6 md:pl-0 md:pr-0 sm:flex-wrap">
      {HEADER_TABS.map(({ id, label }) => {
        const isActive = active === id;
        const count = getCount(id);
        const showLiveIcon = id === "live";
        const showHeartIcon = id === "favorites";

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className={`
              group flex-initial shrink-0
              rounded-md px-3 py-2 text-sm font-medium flex items-center justify-center gap-2
              transition-colors border-2 border-transparent
              ${isActive
                ? "bg-accent hover:bg-accent"
                : "bg-card hover:bg-[#1D1E2B] text-muted"}
            `}
          >
            {showLiveIcon && (
              <img src={liveIcon} alt="" className="shrink-0" />
            )}
            {showHeartIcon && (
              <img src={heartIcon} alt="" className="shrink-0" />
            )}
            <span
              className={`transition-colors ${
                isActive ? "text-card" : "text-muted group-hover:text-[#C2EE31]"
              }`}
            >
              {label}
            </span>
            <span
              className={`
                text-xs font-semibold rounded-full size-[22px] flex items-center justify-center transition-colors
                ${isActive
                  ? "bg-on-accent text-accent"
                  : "bg-page group-hover:text-[#C2EE31]"}
              `}
            >
              {count}
            </span>
          </button>
        );
      })}
      </div>
    </div>
  );
}
