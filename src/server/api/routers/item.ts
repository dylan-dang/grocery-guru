import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const itemRouter = createTRPCRouter({

  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1), price: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.item.create({
        data: {
          name: input.name,
          price: input.price
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.item.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
