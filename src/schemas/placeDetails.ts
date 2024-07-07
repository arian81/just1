import { z } from "zod";

const placeDetailsSchema = z.object({
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

export default placeDetailsSchema;
