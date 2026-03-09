import { useMemo, useState, useRef, useEffect } from "react";
import calendarIcon from "../assets/icons/calendar.svg";
import mobileCalendarIcon from "../assets/icons/mobileCalendar.svg";
import chevronLeftIcon from "../assets/icons/chevronLeft.svg";
import chevronRightIcon from "../assets/icons/chevronRight.svg";

function formatDayShort(date: Date) {
  return date.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
}

function formatDateShort(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }).toUpperCase();
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const MOBILE_DAYS = 7; // days before and after today to show

export function DateStrip() {
  const [viewDate, setViewDate] = useState(() => new Date());
  const mobileStripRef = useRef<HTMLDivElement>(null);
  const todayButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const strip = mobileStripRef.current;
    const todayBtn = todayButtonRef.current;
    if (!strip || !todayBtn) return;

    const centerToday = () => {
      const left = todayBtn.offsetLeft - strip.offsetWidth / 2 + todayBtn.offsetWidth / 2;
      strip.scrollLeft = Math.max(0, left);
    };

    // Run after layout so Today is visible and centered
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        centerToday();
      });
    });
    const timeoutId = window.setTimeout(centerToday, 150);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  const mobileDates = useMemo(() => {
    const list: Date[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = -MOBILE_DAYS; i <= MOBILE_DAYS; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      list.push(d);
    }
    return list;
  }, []);

  const goPrevious = () => {
    setViewDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() - 1);
      return next;
    });
  };

  const goNext = () => {
    setViewDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      return next;
    });
  };

  const goToToday = () => {
    setViewDate(new Date());
  };

  return (
    <>
      <div className="relative flex md:hidden w-full py-3">
        {/* Left edge fade overlay - 20% of viewport */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[20vw] max-w-[80px] bg-gradient-to-r from-page to-transparent pointer-events-none z-10"
          aria-hidden
        />
        {/* Right edge fade overlay - 20% of viewport */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[20vw] max-w-[80px] bg-gradient-to-l from-page to-transparent pointer-events-none z-10"
          aria-hidden
        />
        <div className="flex items-center flex-1 min-w-0">
          <div
            ref={mobileStripRef}
            className="flex items-center overflow-x-auto scrollbar-thin gap-3 flex-1 min-w-0"
          >
            <div className="flex items-center gap-3 min-w-max pl-1 pr-1">
              {mobileDates.map((d) => {
                const isToday = isSameDay(d, new Date());
                const isActive = isToday;

                return (
                  <button
                    key={d.toISOString()}
                    ref={isToday ? todayButtonRef : undefined}
                    type="button"
                    onClick={() => setViewDate(new Date(d))}
                    aria-current={isSameDay(d, viewDate) ? "date" : undefined}
                    className={`
                      shrink-0 flex flex-col items-center gap-0.5 py-2 px-3 rounded-sm text-xs
                      transition-all duration-200
                      ${isActive
                        ? "bg-[#222334] text-[#05D28B] shadow-sm"
                        : "text-muted"}
                    `}
                  >
                    <span className="text-xs font-medium">
                      {isToday ? "Today" : formatDayShort(d)}
                    </span>
                    <span className="text-xs font-medium">
                      {formatDateShort(d)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div
            className="shrink-0 w-10 h-10 p-2 gap-[10px] rounded-full bg-chip flex items-center justify-center ml-1 z-20 opacity-100"
            aria-hidden
          >
            <img
              src={mobileCalendarIcon}
              alt=""
              width={20}
              height={22}
              className="shrink-0"
            />
          </div>
        </div>
      </div>

      <div className="hidden md:flex items-center justify-between w-full rounded-md bg-card py-3 px-4 text-muted">
        <button
          type="button"
          onClick={goPrevious}
          className="flex items-center justify-center p-1 rounded hover:bg-chip hover:text-on-surface transition-colors"
          aria-label="Previous date"
        >
          <img src={chevronLeftIcon} alt="" width={24} height={24} className="size-6 shrink-0" />
        </button>

        <button
          type="button"
          onClick={goToToday}
          className="flex items-center justify-center gap-[10px] py-1 px-2 rounded hover:bg-chip hover:text-on-surface transition-colors"
          aria-label="Go to today"
        >
          <img
            src={calendarIcon}
            alt=""
            width={20}
            height={22}
            className="shrink-0"
          />
          <span className="text-sm font-semibold text-inherit">Today</span>
        </button>

        <button
          type="button"
          onClick={goNext}
          className="flex items-center justify-center p-1 rounded hover:bg-chip hover:text-on-surface transition-colors"
          aria-label="Next date"
        >
          <img src={chevronRightIcon} alt="" width={24} height={24} className="size-6 shrink-0" />
        </button>
      </div>
    </>
  );
}
