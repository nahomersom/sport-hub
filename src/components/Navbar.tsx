import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { NAV_ITEMS } from "../constants/navigation";
import logoIcon from "../assets/images/stat-score-logo.png";
import englishIcon from "../assets/icons/english.svg";
import menuIcon from "../assets/icons/menuIcon.svg";
import footballIcon from "../assets/icons/football.svg";
import worldIcon from "../assets/icons/world.svg";
import premierLeagueIcon from "../assets/icons/premierLeague.svg";
import chevronDownIcon from "../assets/icons/chevronDown.svg";

export function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === ROUTES.HOME;
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full shrink-0 bg-primary">
      <nav className="flex flex-col max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between gap-2 md:gap-4 px-4 h-[60px]">
          <NavLink
            to={ROUTES.HOME}
            className="shrink-0 flex items-center font-poppins"
            aria-label="StatsKore home"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src={logoIcon} alt="StatsKore" className="h-[26.1px] w-[82.1px] md:h-auto md:w-auto" />
          </NavLink>

          <div className="hidden md:flex items-center gap-1 md:gap-4 overflow-x-auto scrollbar-thin py-2 flex-1 min-w-0 justify-center md:justify-start md:pl-6">
            {NAV_ITEMS.map(({ label, to }) => {
              const active = isHome && label === "Matches";
              return (
                <NavLink
                  key={label}
                  to={to}
                  className={() =>
                    `font-poppins shrink-0 px-2 py-2 text-sm md:text-lg transition-colors whitespace-nowrap border-b-2 ${
                      active ? "text-accent border-accent" : "text-white border-transparent hover:border-accent"
                    }`
                  }
                >
                  {label}
                </NavLink>
              );
            })}
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <button
              type="button"
              className="size-6 md:size-10 rounded-full bg-chip flex items-center justify-center text-on-surface transition-colors"
              aria-label="Language or region"
            >
              <img src={worldIcon} alt="" className="size-4 md:size-5" />
            </button>
            <button
              type="button"
              className="size-6 md:size-10 rounded-full bg-chip flex items-center justify-center text-on-surface transition-colors"
              aria-label="Sport"
            >
              <img src={footballIcon} alt="" className="size-4 md:size-5" />
            </button>

            <button
              type="button"
              className="flex items-center justify-center md:justify-normal gap-2 size-6 rounded-full md:size-auto md:rounded-pill md:px-4 md:py-2 bg-chip hover:bg-card hover:border-[0.3px] hover:border-white transition-colors text-label font-poppins"
            >
              <img
                src={premierLeagueIcon}
                alt=""
                className="size-4 md:size-5 rounded-full object-cover"
              />
              <span className="hidden md:block">Premier League</span>
              <img src={chevronDownIcon} alt="" width={8} height={5} className="shrink-0 hidden md:block" />
            </button>

            <button
              type="button"
              className="flex items-center gap-2 rounded-pill px-3 py-2 bg-chip hover:bg-card hover:border-[0.3px] hover:border-white transition-colors text-label font-poppins"
            >
              <span>2024/25</span>
              <img src={chevronDownIcon} alt="" width={8} height={5} className="shrink-0" />
            </button>

            <button
              type="button"
              className="md:hidden size-8 "
              aria-label={isMobileMenuOpen ? "Close menu" : "Menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              <img src={menuIcon} alt="" className="size-8" />
            </button>
            <button
              type="button"
              className="hidden md:flex size-10 rounded-full bg-chip items-center justify-center text-on-surface transition-colors"
              aria-label="Language or region"
            >
              <img src={englishIcon} alt="" className="size-5" />
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden flex flex-col border-t border-white/20 bg-primary px-4 py-3">
            {NAV_ITEMS.map(({ label, to }) => {
              const active = isHome && label === "Matches";
              return (
                <NavLink
                  key={label}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-poppins block py-3 text-white border-b-2 border-transparent ${
                    active ? "text-accent border-accent" : "hover:text-accent"
                  }`}
                >
                  {label}
                </NavLink>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
}
