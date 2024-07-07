import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

async function getNearbyRestaurants(lat: number, lng: number, radius = 1000) {
  const url = `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=AIzaSyACpHAiT5WAIXMazTWGKXa8S936HAw1OEU`;
  const response = await fetch(url);
  // const data = await response.json();
  console.log("data", response);
  console.log(url);
  // return data;
  return {};
}

export const locationRouter = createTRPCRouter({
  saveLocation: publicProcedure
    .input(z.object({ latitude: z.number(), longitude: z.number() }))
    .mutation(async ({ ctx, input }) => {
      console.log("location", input);
      return getNearbyRestaurants(input.latitude, input.longitude);
    }),
});
