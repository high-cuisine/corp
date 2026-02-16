-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('LEVEL_REACHED', 'FRIENDS_INVITED', 'COINS_EARNED', 'GAMES_PLAYED', 'CUSTOM');

-- AlterTable: add columns with defaults so existing rows are valid
ALTER TABLE "Achievement"
  ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "targetValue" INTEGER,
  ADD COLUMN "title" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "type" "AchievementType" NOT NULL DEFAULT 'CUSTOM';

-- Backfill existing rows (id 1,2,3 from seed)
UPDATE "Achievement"
SET
  "title" = CASE "id"
    WHEN 1 THEN 'Первый уровень'
    WHEN 2 THEN 'Десять уровней'
    WHEN 3 THEN 'Двадцать уровней'
    ELSE "title"
  END,
  "type" = 'LEVEL_REACHED'::"AchievementType",
  "targetValue" = CASE "id"
    WHEN 1 THEN 1
    WHEN 2 THEN 10
    WHEN 3 THEN 20
    ELSE "targetValue"
  END
WHERE "id" IN (1, 2, 3);

-- Remove defaults so new rows must provide title and type
ALTER TABLE "Achievement" ALTER COLUMN "title" DROP DEFAULT;
ALTER TABLE "Achievement" ALTER COLUMN "type" DROP DEFAULT;
