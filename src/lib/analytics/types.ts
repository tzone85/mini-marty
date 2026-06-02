export type AnalyticsEvent =
  | "code_run"
  | "tutorial_complete"
  | "challenge_complete"
  | "block_program_saved"
  | "theme_toggle";

export type AnalyticsProps = Readonly<
  Record<string, string | number | boolean>
>;

export interface Analytics {
  track(event: AnalyticsEvent, props?: AnalyticsProps): void;
}
