const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'dev@example.com' },
    update: {},
    create: {
      email: 'dev@example.com',
      name: 'Dev User',
      password: 'password'
    }
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Seed: Welcome task',
        description: 'This is a seeded task',
        status: 'pending',
        priority: 'medium',
        course: 'General',
        assignedBy: 'System',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId: user.id,
      },
      {
        title: 'Seed: Second task',
        description: 'Another seeded task',
        status: 'in-progress',
        priority: 'high',
        course: 'General',
        assignedBy: 'System',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        userId: user.id,
      }
    ],
  });

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
