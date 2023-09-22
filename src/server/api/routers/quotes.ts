import { User } from "@clerk/backend/dist/types/api";
import { auth, clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.firstName,
    profileImage: user.imageUrl,
  };
}

export const quotesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const quotes = await ctx.db.quotes.findMany({
      take: 100,
    });
    const users = (
      await clerkClient.users.getUserList({
        userId: quotes.map((quote) => quote.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

    console.log(users);

    return quotes.map((quote) => {
      const author = users.find((user) => user.id === quote.authorId);

      if (!author)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Author not found",
        });

      return {
        quote,
        author,
      };
    });
  }),
});
