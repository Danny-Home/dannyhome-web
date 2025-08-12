/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PrismaClient } from "@prisma/client";

type Fn<A = any, R = any> = (args?: A) => Promise<R>;
type FindManyArgs<T> = T extends { findMany: (args?: infer A) => any } ? A : never;
type Items<T> = T extends { findMany: Fn<infer A, infer R> } ? Awaited<R> : never;

export type PaginationInput<TDelegate> =
  Omit<FindManyArgs<TDelegate>, "skip" | "take"> & {
    page?: number;
    perPage?: number;
    showAll?: boolean;
  };

export async function maybePaginate<TDelegate extends { findMany: Fn; count: Fn }>(
  _prisma: PrismaClient,
  entity: TDelegate,
  args: PaginationInput<TDelegate> = {} as PaginationInput<TDelegate>,
): Promise<{
  items: Items<TDelegate>;
  total: number;
  page: number;
  perPage: number;
  showAll: boolean;
}> {
  const page = Number.isFinite(args.page) && (args.page!) > 0 ? Math.floor(args.page!) : 1;
  const perPage =
    Number.isFinite(args.perPage) && (args.perPage!) > 0 ? Math.floor(args.perPage!) : 20;
  const showAll = !!args.showAll;

  const { showAll: _sa, page: _p, perPage: _pp, ...rest } = args;

  const [items, total] = await Promise.all([
    entity.findMany(showAll ? rest : { ...rest, skip: (page - 1) * perPage, take: perPage }),
    entity.count({ where: (rest as any)?.where }),
  ]);

  return { items: items as Items<TDelegate>, total, page, perPage, showAll };
}

/*
Usage:
const { items: products, total, page, perPage } = await maybePaginate(
  prisma,
  prisma.product,
  { page, perPage, showAll, where, orderBy, include }
);
*/
