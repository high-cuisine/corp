import { AchievementType, PrismaClient } from '@prisma/client';

const ACHIEVEMENTS = [
  { id: 1, title: 'Первый уровень', description: 'Пройди 1 уровень', type: AchievementType.LEVEL_REACHED, targetValue: 1, sortOrder: 10 },
  { id: 2, title: 'Десять уровней', description: 'Пройди 10 уровней', type: AchievementType.LEVEL_REACHED, targetValue: 10, sortOrder: 20 },
  { id: 3, title: 'Двадцать уровней', description: 'Пройди 20 уровней', type: AchievementType.LEVEL_REACHED, targetValue: 20, sortOrder: 30 },
];

export async function seedAchievements(prisma: PrismaClient) {
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { id: a.id },
      create: a,
      update: { title: a.title, description: a.description, type: a.type, targetValue: a.targetValue, sortOrder: a.sortOrder },
    });
  }
}
