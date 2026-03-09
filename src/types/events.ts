export type TimelineEventType = "goal" | "yellow" | "red" | "substitution" | "corner" | "offthepost" | "heatpost" | "injury";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  side: "home" | "away";
  minute: string;
  label: string;
  subLabel?: string;
}
