/* eslint-disable @typescript-eslint/no-unsafe-return */

import type { paginationInput } from "@/lib/schemas/common";
import { db } from "@/server/db";
import type { PrismaClient } from "@prisma/client";
import type z from "zod";

export type PrismaModel = {
  [K in keyof PrismaClient]: PrismaClient[K] extends (...args: any) => any ? never : K;
}[keyof PrismaClient];

interface CrudDelegate<CreateInput, TReturn> {
  create(args: { data: CreateInput }): Promise<TReturn>;
  findMany(args: any): Promise<TReturn[]>;
  findUnique(args: { where: { id: string } }): Promise<TReturn>;
  update(args: { where: { id: string }; data: Partial<CreateInput> }): Promise<TReturn>;
  delete(args: { where: { id: string } }): Promise<TReturn>;
}

export const buildCrudService = <CreateInput>(model: PrismaModel) => {
  const m = db[model] as unknown as CrudDelegate<CreateInput, Partial<CreateInput>>;

  return {
    create: (data: CreateInput) => m.create({ data }),

    list: (args: z.infer<typeof paginationInput> = { page: 1, perPage: 20 }) => {
      const { page, perPage } = args;
      return m.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
      });
    },

    byId: (id: string) => m.findUnique({ where: { id } }),

    update: (id: string, data: Partial<CreateInput>) => m.update({ where: { id }, data }),

    delete: (id: string) => m.delete({ where: { id } }),
  } as const;
};
