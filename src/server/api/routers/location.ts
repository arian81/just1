import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// export const locationRouter = createTRPCRouter({
//   saveLocation: publicProcedure
//     .input(z.object({ latitude: z.number(), longitude: z.number() }))
//     .mutation(async ({ ctx, input }) => {
//       console.log("location", input);
//       return getNearbyRestaurants(input.latitude, input.longitude);
//     }),
// });
