import { categoryRouter } from "@/server/api/routers/categories.router";
import { postRouter } from "@/server/api/routers/post";
import { productsRouter } from "@/server/api/routers/products.router";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { bannersRouter } from "./routers/banners.router";
import { collectionsRouter } from "./routers/collections.router";
import { ordersRouter } from "./routers/orders.router";
import { cartRouter } from "./routers/cart.router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  products: productsRouter,
  categories: categoryRouter,
  banner: bannersRouter,
  collections: collectionsRouter,
  orders: ordersRouter,
  cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
