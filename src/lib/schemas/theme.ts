import { z } from "zod";

export const ThemeSchema = z.union([z.literal("light"), z.literal("dark")]);
export type Theme = z.infer<typeof ThemeSchema>;
