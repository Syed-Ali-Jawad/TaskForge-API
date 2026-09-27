/*
  Warnings:

  - A unique constraint covering the columns `[name,ownerId]` on the table `workspaces` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "workspaces_id_name_key";

-- AlterTable
ALTER TABLE "workspaces" ADD COLUMN     "ownerId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_name_ownerId_key" ON "workspaces"("name", "ownerId");

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
