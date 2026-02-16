import { PrismaClient } from '@prisma/client';
import { seedAchievements } from './seeds/achievement.seed';

const prisma = new PrismaClient();

async function main() {
  await seedAchievements(prisma);
}

main()
  .then(() => {
    console.log('Seed completed');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
