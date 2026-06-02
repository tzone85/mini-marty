import { z } from "zod";

export const BlocksStateSchema = z.object({
  version: z.literal(1),
  xml: z.string(),
});
export type BlocksState = z.infer<typeof BlocksStateSchema>;
