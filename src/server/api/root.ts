import { exampleRouter } from "~/server/api/routers/example";
import { createTRPCRouter } from "~/server/api/trpc";

import { initTRPC } from "@trpc/server";
import { greetingRouter } from "./routers/greeting";

const t = initTRPC.create();
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  greeting: greetingRouter
});


// export type definition of API
export type AppRouter = typeof appRouter;