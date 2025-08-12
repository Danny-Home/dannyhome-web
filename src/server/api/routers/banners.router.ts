import { createBannerSchema, updateBannerSchema } from "@/lib/schemas/banner";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

import { TRPCError } from "@trpc/server";
import type { Base64FileInput, UploadedFileMeta } from "@/lib/schemas/storage";
import type { PrismaClient } from "@prisma/client";

export const bannersRouter = createTRPCRouter({

});
