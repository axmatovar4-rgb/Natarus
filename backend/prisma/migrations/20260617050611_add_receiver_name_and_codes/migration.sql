-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_receiverId_fkey";

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "accessPassword" TEXT,
ADD COLUMN     "applicationCode" TEXT,
ADD COLUMN     "receiverName" TEXT,
ALTER COLUMN "receiverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
