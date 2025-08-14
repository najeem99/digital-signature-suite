-- CreateEnum
CREATE TYPE "public"."PdfStatus" AS ENUM ('WAITING_FOR_SIGNER', 'WAITING_FOR_APPROVAL', 'REJECTED', 'ACCEPTED');

-- AlterTable
ALTER TABLE "public"."PdfFile" ADD COLUMN     "status" "public"."PdfStatus" NOT NULL DEFAULT 'WAITING_FOR_SIGNER';
