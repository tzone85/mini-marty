export interface Flags {
  readonly analyticsEnabled: boolean;
  readonly sentryEnabled: boolean;
  readonly pwaEnabled: boolean;
}

export function readFlags(
  env: NodeJS.ProcessEnv | Record<string, string | undefined>,
): Flags {
  return {
    analyticsEnabled: env.NEXT_PUBLIC_ANALYTICS === "vercel",
    sentryEnabled: Boolean(env.NEXT_PUBLIC_SENTRY_DSN),
    pwaEnabled: env.NEXT_PUBLIC_PWA === "1",
  };
}
