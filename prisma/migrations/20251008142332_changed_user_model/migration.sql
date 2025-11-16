/*
  Warnings:

  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Contributor` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId,projectId]` on the table `Contributor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profileId,projectId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profileId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Contributor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contributor" DROP CONSTRAINT "Contributor_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Contributor" DROP CONSTRAINT "Contributor_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Project" DROP CONSTRAINT "Project_userId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Contributor" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "userId",
ADD COLUMN     "profileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Contributor_profileId_projectId_key" ON "Contributor"("profileId", "projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_profileId_projectId_key" ON "Like"("profileId", "projectId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contributor" ADD CONSTRAINT "Contributor_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contributor" ADD CONSTRAINT "Contributor_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
