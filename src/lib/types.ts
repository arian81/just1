import { z } from "zod";
import { responseListSchema, responseSchema } from "../schemas/ai";

export type ResponseList = z.infer<typeof responseListSchema>;
export type Response = z.infer<typeof responseSchema>;

export interface Location {
  latitude: number;
  longitude: number;
}
