import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const storefrontParams = {
  q: parseAsString,
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(24),
  category: parseAsArrayOf(parseAsString, ",").withDefault([]),
  min: parseAsInteger,
  max: parseAsInteger,
  stock: parseAsBoolean,
  sort: parseAsStringEnum(["newest", "priceAsc", "priceDesc", "rating"]).withDefault("newest"),
};

export const storefrontSearchParamsCache = createSearchParamsCache(storefrontParams);
export const storefrontSerialize = createSerializer(storefrontParams);
