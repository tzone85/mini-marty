export interface Flags {
  readonly analyticsEnabled: boolean;
  readonly sentryEnabled: boolean;
}

export function readFlags(
  env: NodeJS.ProcessEnv | Record<string, string | undefined>,
): Flags {
  return {
    analyticsEnabled: env.NEXT_PUBLIC_ANALYTICS === "vercel",
    sentryEnabled: Boolean(env.NEXT_PUBLIC_SENTRY_DSN),
  };
}
