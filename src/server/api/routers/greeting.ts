import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const greetingRouter = createTRPCRouter({
  greeting: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        text: `Hello ${input.name ?? 'world'}!`
      };
    }),
});
