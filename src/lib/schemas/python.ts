import { z } from "zod";

export const PythonStateSchema = z.object({
  version: z.literal(1),
  source: z.string(),
});
export type PythonState = z.infer<typeof PythonStateSchema>;
