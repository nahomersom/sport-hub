export const ROUTES = {
  HOME: "/",
  MATCH: "/match/:eventId",
} as const;

export function matchDetailPath(eventId: string): string {
  return `/match/${eventId}`;
}
