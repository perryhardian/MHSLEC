import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { CategoryKind, PrismaClient, TransactionType } from '@prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run the database seed.');
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

const defaultCategories = [
  {
    name: 'Uang Saku',
    type: TransactionType.INCOME,
    icon: 'wallet',
    color: '#2563EB',
  },
  {
    name: 'Beasiswa',
    type: TransactionType.INCOME,
    icon: 'graduation-cap',
    color: '#16A34A',
  },
  {
    name: 'Gaji Part-time',
    type: TransactionType.INCOME,
    icon: 'briefcase',
    color: '#0891B2',
  },
  {
    name: 'Hadiah',
    type: TransactionType.INCOME,
    icon: 'gift',
    color: '#9333EA',
  },
  {
    name: 'Kebutuhan Harian',
    type: TransactionType.EXPENSE,
    icon: 'calendar-days',
    color: '#DC2626',
  },
  {
    name: 'Kebutuhan Bulanan',
    type: TransactionType.EXPENSE,
    icon: 'calendar-range',
    color: '#EA580C',
  },
  {
    name: 'Belanja',
    type: TransactionType.EXPENSE,
    icon: 'shopping-bag',
    color: '#CA8A04',
  },
];

async function main() {
  for (const category of defaultCategories) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        userId: null,
        name: category.name,
        type: category.type,
      },
    });

    if (existingCategory) {
      await prisma.category.update({
        where: { id: existingCategory.id },
        data: {
          icon: category.icon,
          color: category.color,
          kind: CategoryKind.DEFAULT,
        },
      });

      continue;
    }

    await prisma.category.create({
      data: {
        ...category,
        kind: CategoryKind.DEFAULT,
      },
    });
  }

  console.log(`Seeded ${defaultCategories.length} default categories.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
