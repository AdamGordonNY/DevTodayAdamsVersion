/*
  Warnings:

  - You are about to drop the column `authorId` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the `_GroupAdmins` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdBy` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_authorId_fkey";

-- DropForeignKey
ALTER TABLE "_GroupAdmins" DROP CONSTRAINT "_GroupAdmins_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupAdmins" DROP CONSTRAINT "_GroupAdmins_B_fkey";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "authorId",
ADD COLUMN     "createdBy" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Meetup" ALTER COLUMN "endTime" SET DEFAULT NOW() + interval '1 hour';

-- DropTable
DROP TABLE "_GroupAdmins";

-- CreateTable
CREATE TABLE "GroupUser" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupUser_groupId_userId_key" ON "GroupUser"("groupId", "userId");

-- AddForeignKey
ALTER TABLE "GroupUser" ADD CONSTRAINT "GroupUser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupUser" ADD CONSTRAINT "GroupUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
