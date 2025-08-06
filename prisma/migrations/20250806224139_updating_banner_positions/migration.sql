/*
  Warnings:

  - The values [SIDEBAR,FOOTER] on the enum `BannerPos` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."BannerPos_new" AS ENUM ('HERO', 'PROMO');
ALTER TABLE "public"."Banner" ALTER COLUMN "position" DROP DEFAULT;
ALTER TABLE "public"."Banner" ALTER COLUMN "position" TYPE "public"."BannerPos_new" USING ("position"::text::"public"."BannerPos_new");
ALTER TYPE "public"."BannerPos" RENAME TO "BannerPos_old";
ALTER TYPE "public"."BannerPos_new" RENAME TO "BannerPos";
DROP TYPE "public"."BannerPos_old";
ALTER TABLE "public"."Banner" ALTER COLUMN "position" SET DEFAULT 'HERO';
COMMIT;
