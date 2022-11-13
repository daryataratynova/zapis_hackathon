import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const relationships = await ctx.prisma.relationship.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    const requests = await ctx.prisma.relationship.findMany({
      where: {
        friendId: ctx.session.user.id,
        status: 'PENDING',
      },
      include: {
        user: true,
      }
    })

    const users = await ctx.prisma.user.findMany({
      where: {
        id: {
          not: ctx.session.user.id,
        },
      },
    });

    return {
      users,
      relationships,
      requests,
    };
  }),
  addFriend: protectedProcedure.
    input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const relationship = await ctx.prisma.relationship.create({
        data: {
          userId: ctx.session.user.id,
          friendId: input.id,
        },
      });

      return relationship;
    }
    ),
  acceptFriend: protectedProcedure.
    input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const rel = await ctx.prisma.relationship.findFirst({
        where: {
          userId: input.id,
          friendId: ctx.session.user.id,
        },
      });

      if (!rel) {
        throw new Error('Relationship not found');
      }

      const count = await ctx.prisma.relationship.count({
        where: {
          userId: ctx.session.user.id,
          status: 'ACCEPTED',
        },
      });

      const countFriend = await ctx.prisma.relationship.count({
        where: {
          userId: rel.userId,
          status: 'ACCEPTED',
        },
      });

      if (count === 0) {
        await ctx.prisma.achievement.create({
          data: {
            userId: ctx.session.user.id,
            name: 'Первая подружка!',
          },
        });
      }

      if (countFriend === 0) {
        await ctx.prisma.achievement.create({
          data: {
            userId: rel.userId,
            name: 'Первая подружка!',
          },
        });
      }

      const relationship = await ctx.prisma.relationship.update({
        where: {
          id: rel.id,
        },
        data: {
          status: 'ACCEPTED',
        },
      });

      await ctx.prisma.relationship.create({
        data: {
          userId: ctx.session.user.id,
          friendId: relationship.userId,
          status: 'ACCEPTED',
        },
      });

      return relationship;
    }
    ),
  appointments: protectedProcedure.query(async ({ ctx }) => {
    const appointments = await ctx.prisma.appointment.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return appointments;
  }),
  appointment: protectedProcedure.
    mutation(async ({ ctx }) => {
      const count = await ctx.prisma.appointment.count({
        where: {
          userId: ctx.session.user.id,
        },
      });
      const appointment = await ctx.prisma.appointment.create({
        data: {
          userId: ctx.session.user.id,
          type: 'HAIR',
        },
      });

      if (count === 0) {
        await ctx.prisma.achievement.create({
          data: {
            userId: ctx.session.user.id,
            name: 'Первая запись!',
          },
        })
      }

      if (count === 2) {
        await ctx.prisma.achievement.create({
          data: {
            userId: ctx.session.user.id,
            name: '3 in a row!',
          },
        })
      }

      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          xp: {
            increment: 110,
          }
        }
      });

      return appointment;
    }),

  feed: protectedProcedure
    .query(async ({ ctx }) => {
      const friends = await ctx.prisma.relationship.findMany({
        where: {
          userId: ctx.session.user.id,
          status: 'ACCEPTED',
        },
      });
      const history = await ctx.prisma.appointment.findMany({
        where: {
          OR: [
            {
              userId: ctx.session.user.id,
            },
            {
              userId: {
                in: friends.map(f => f.friendId),
              }
            }
          ]
        },
        include: {
          user: true,
        },
        orderBy: {
          date: 'desc',
        },
      });
      return history;
    }),
  getModifications: protectedProcedure.query(async ({ ctx }) => {
    const modifications = await ctx.prisma.modification.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return modifications;
  }),
  setNails: protectedProcedure
    .input(z.object({
      id: z.string(),
      color: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.modification.deleteMany({
        where: {
          userId: ctx.session.user.id,
        }
      });
      const appointment = await ctx.prisma.appointment.update({
        where: {
          id: input.id,
        },
        data: {
          recieved: true,
        }
      });

      await ctx.prisma.modification.create({
        data: {
          userId: ctx.session.user.id,
          color: input.color,
        },
      });

      return appointment;
    }),

  getProfile: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const relationships = await ctx.prisma.relationship.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      const achievement = await ctx.prisma.achievement.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const modifications = await ctx.prisma.modification.findMany({
        where: {
          userId: user.id,
        },
      });

      return {
        user,
        modifications,
        relationships,
        achievement,
      };
    }),
  rating: protectedProcedure
    .query(async ({ ctx }) => {
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          xp: true,
        },
        orderBy: {
          xp: 'desc',
        },
      });

      return users;
    }),

  achievements: protectedProcedure
    .query(async ({ ctx }) => {
      const achievements = await ctx.prisma.achievement.findMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      return achievements;
    }),
});
