import { ROUTES } from "./routes";

export const NAV_ITEMS = [
  { label: "Live", to: ROUTES.HOME },
  { label: "Matches", to: ROUTES.HOME },
  { label: "Standings", to: ROUTES.HOME },
  { label: "Teams", to: ROUTES.HOME },
  { label: "Comparison", to: ROUTES.HOME },
  { label: "Statistics", to: ROUTES.HOME },
  { label: "Venues", to: ROUTES.HOME },
] as const;

export const HEADER_TABS = [
  { id: "all" as const, label: "All" },
  { id: "live" as const, label: "Live" },
  { id: "favorites" as const, label: "Favorites" },
] as const;
