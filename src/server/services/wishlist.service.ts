import { getRedisClient } from "@/server/redis";

const wishlistKey = (userId: string) => `wishlist:${userId}`;
const redis = getRedisClient();

const WISHLIST_TTL = 60 * 60 * 24 * 30;

export const WishlistService = {
  get: async (userId: string): Promise<string[]> => {
    const raw = await redis.get(wishlistKey(userId));
    return raw ? (JSON.parse(raw) as string[]) : [];
  },

  save: async (userId: string, list: string[]) => {
    await redis.setex(wishlistKey(userId), WISHLIST_TTL, JSON.stringify(list));
    return list;
  },

  add: async (userId: string, productId: string) => {
    const list = await WishlistService.get(userId);
    if (!list.includes(productId)) list.push(productId);
    return WishlistService.save(userId, list);
  },

  remove: async (userId: string, productId: string) => {
    const list = await WishlistService.get(userId);
    return WishlistService.save(
      userId,
      list.filter((id) => id !== productId),
    );
  },

  clear: async (userId: string) => redis.del(wishlistKey(userId)),
};
