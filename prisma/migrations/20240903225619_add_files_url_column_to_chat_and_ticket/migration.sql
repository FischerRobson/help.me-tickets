-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "filesURL" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "filesURL" TEXT[] DEFAULT ARRAY[]::TEXT[];
