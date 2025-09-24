/*
  Warnings:

  - You are about to drop the column `category` on the `user_priorities` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `user_priorities` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "priority_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_priorities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_priorities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_priorities_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "priority_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_priorities" ("createdAt", "id", "rank", "userId") SELECT "createdAt", "id", "rank", "userId" FROM "user_priorities";
DROP TABLE "user_priorities";
ALTER TABLE "new_user_priorities" RENAME TO "user_priorities";
CREATE UNIQUE INDEX "user_priorities_userId_categoryId_key" ON "user_priorities"("userId", "categoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "priority_categories_name_key" ON "priority_categories"("name");
