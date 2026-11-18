import { z } from "zod";

export const RELATIONS = ["self", "spouse", "child", "parent", "sibling", "friend", "client", "other"] as const;

export const birthProfileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  gender: z.enum(["male", "female", "other"]).nullable(),
  relation: z.enum(RELATIONS),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  birth_time: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/)
    .nullable(),
  time_known: z.boolean(),
  place_name: z.string().trim().min(1).max(200),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1).max(64),
  utc_offset_minutes: z.number().int().min(-840).max(840),
  notes: z.string().max(2000).nullable(),
});
export type BirthProfileForm = z.infer<typeof birthProfileSchema>;
