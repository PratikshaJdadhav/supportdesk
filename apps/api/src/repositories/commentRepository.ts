import { PrismaClient } from "../../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../../config/env";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export const commentRepository = {
  create(data: {
    message: string;
    ticketId: number;
    userId: number;
  }) {
    return prisma.comment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  },

  findLatestByTicketId(ticketId: number) {
    return prisma.comment.findMany({
      where: { ticketId },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: { message: true },
    }).then((comments) => comments.reverse());
  },

  findByTicketId(ticketId: number) {
    return prisma.comment.findMany({
      where: { ticketId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },
};