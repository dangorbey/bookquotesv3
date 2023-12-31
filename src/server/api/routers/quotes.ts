import type { User } from "@clerk/backend/dist/types/api";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

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

  getUserQuotes: privateProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId!;
    // console.log(`Getting quotes for user ID: ${userId}`);
    // console.log(ctx);

    const quotes = await ctx.db.quotes.findMany({
      where: {
        authorId: userId,
      },
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: quotes.map((quote) => quote.authorId),
        limit: 100,
      })
    ).map(filterUserForClient);

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

  create: privateProcedure
    .input(
      z.object({
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {

      const authorId = ctx.userId!;

      const post = await ctx.db.quotes.create({
        data: {
          authorId,
          content: input.content,
        },
      });

      return post;
    }),

  getById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      // Now use input.id instead of just input
      const quote = await ctx.db.quotes.findUnique({
        where: { id: parseInt(input.id) },
      });

      if (!quote) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quote not found",
        });
      }

      const user = await clerkClient.users.getUser(quote.authorId);
      const author = filterUserForClient(user);

      return {
        quote,
        author,
      };
    }),

  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
        highlightColor: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedQuote = await ctx.db.quotes.update({
        where: { id: parseInt(input.id) },
        data: {
          content: input.content,
          highlightColor: input.highlightColor,
        },
      });

      if (!updatedQuote) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update the quote",
        });
      }

      return updatedQuote;
    }),

  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      }))
    .mutation(async ({ ctx, input }) => {
      const quoteId = parseInt(input.id);
      const deletedQuote = await ctx.db.quotes.delete({
        where: { id: quoteId },
      });

      if (!deletedQuote) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete the quote",
        });
      }
      return deletedQuote;
    }),

});