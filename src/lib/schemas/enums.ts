import { Role, Currency, OrderStatus, PaymentStatus, DiscountType, PromoType, BannerPos, CartStatus, StockReason } from "@prisma/client";
import { z } from "zod";

export const RoleEnum = z.nativeEnum(Role);
export const CurrencyEnum = z.nativeEnum(Currency);
export const OrderStatusEnum = z.nativeEnum(OrderStatus);
export const PaymentStatusEnum = z.nativeEnum(PaymentStatus);
export const DiscountTypeEnum = z.nativeEnum(DiscountType);
export const PromoTypeEnum = z.nativeEnum(PromoType);
export const BannerPosEnum = z.nativeEnum(BannerPos);
export const CartStatusEnum = z.nativeEnum(CartStatus);
export const StockReasonEnum = z.nativeEnum(StockReason);
