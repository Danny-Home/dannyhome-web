import { buildCrudService } from "@/server/services/base.service";
import type { CartItem } from "prisma/interfaces";

export const CartItemService = buildCrudService<CartItem>("cartItem");
