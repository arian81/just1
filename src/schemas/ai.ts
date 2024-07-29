import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "system", "assistant"]), // TODO: make this whatever it needs to be
  content: z.string(),
});

const messageListSchema = z.array(messageSchema);

export const reqBodySchema = z.object({
  messages: messageListSchema,
  location: z.object({ latitude: z.number(), longitude: z.number() }),
});

export const suggestionsSchema = z.object({
  places: z.array(z.object({ name: z.string(), id: z.string() })),
});

export const responseListSchema = z.array(
  z.object({
    name: z.string(),
    url: z.string().url(),
    photo: z.string().url(),
  }),
);

export const responseSchema = z.object({ suggestions: responseListSchema });
