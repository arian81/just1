import { z } from "zod";

export const placeDetailsSchema = z.object({
  googleMapsUri: z.string().url(),
  displayName: z.object({
    text: z.string(),
  }),
  photos: z
    .array(
      z.object({
        name: z.string(),
      }),
    )
    .optional(),
});

export const placeTypes = z.object({
  includedTypes: z.array(z.string()),
});
