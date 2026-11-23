import { PrismaClient, Prisma } from "../../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../../config/env";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export const ticketRepository = {
  // Create Ticket
  create(data: Prisma.TicketUncheckedCreateInput) {
    return prisma.ticket.create({ data });
  },

async findAll(
  userId?: number,
  filters?: {
    page?: number;
    limit?: number;
    status?: Prisma.TicketWhereInput["status"];
    priority?: Prisma.TicketWhereInput["priority"];
    assigneeId?: number;
    search?: string;
    sortBy?: "createdAt" | "updatedAt" | "priority" | "status";
    sortOrder?: "asc" | "desc";
  }
) {
  const page = filters?.page ?? 1;
  const limit = filters?.limit ?? 10;

  const sortBy = filters?.sortBy ?? "createdAt";
  const sortOrder = filters?.sortOrder ?? "desc";

  const where: Prisma.TicketWhereInput = {
    ...(userId !== undefined ? { userId } : {}),
    ...(filters?.status ? { status: filters.status } : {}),
    ...(filters?.priority ? { priority: filters.priority } : {}),
    ...(filters?.assigneeId !== undefined
      ? { assigneeId: filters.assigneeId }
      : {}),
    ...(filters?.search
      ? {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            { description: { contains: filters.search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [tickets, total] = await Promise.all([
    prisma.ticket.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.ticket.count({ where }),
  ]);

  return {
    tickets,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
},
  
findById(id: number, userId?: number) {
  return prisma.ticket.findFirst({
    where: {
      id,
      ...(userId !== undefined ? { userId } : {}),
    },
  });
},
  async update(
  id: number,
  data: Prisma.TicketUncheckedUpdateInput,
  userId?: number
) {
  const where = {
    id,
    ...(userId !== undefined ? { userId } : {}),
  };

  const result = await prisma.ticket.updateMany({
    where,
    data,
  });

  if (result.count === 0) {
    return null;
  }

  return prisma.ticket.findFirst({ where });
},
async delete(id: number, userId?: number) {
  const where = {
    id,
    ...(userId !== undefined ? { userId } : {}),
  };

  const result = await prisma.ticket.deleteMany({
    where,
  });

  return result.count > 0;
},};
