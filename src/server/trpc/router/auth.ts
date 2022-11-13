import { router, protectedProcedure } from "../trpc";

export const authRouter = router({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }),
});
