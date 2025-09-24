import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const priorityCategories = [
  {
    name: "career",
    title: "Career-related activities",
    description: "time at work, working at home, or starting a business",
  },
  {
    name: "creative",
    title: "Creative activities",
    description: "painting, writing, playing a musical instrument",
  },
  {
    name: "educational",
    title: "Educational activities",
    description:
      "time at school, studying, self-directed learning such as reading this book",
  },
  {
    name: "exercise",
    title: "Exercise and health activities",
    description: "working out, planning training, cooking healthy meals",
  },
  {
    name: "family",
    title: "Family activities",
    description: "playing with kids, family time",
  },
  {
    name: "financial",
    title: "Financial activities",
    description: "financial planning and investing",
  },
  {
    name: "giving-back",
    title: "Giving-back activities",
    description:
      "nonprofit and charity work, volunteer and stewardship activities",
  },
  {
    name: "home",
    title: "Home responsibilities",
    description: "cleaning, doing laundry, cooking, lawn and home care",
  },
  {
    name: "intimate",
    title: "Intimate time",
    description: "date nights and time alone with spouse or significant other",
  },
  {
    name: "entertainment",
    title: "Passive entertainment",
    description: "watching TV, video games, surfing the Net and social media",
  },
  {
    name: "recreational",
    title: "Recreational & adventure activities",
    description: "climbing, hiking, playing sports etc.",
  },
  {
    name: "relaxing",
    title: "Relaxing, comfort activities",
    description: "shopping, napping, just doing nothing",
  },
  {
    name: "social",
    title: "Social activities",
    description: "time with friends, partying, going to bars/happy hours",
  },
  {
    name: "soothing",
    title: "Soothing, calm-down activities",
    description: "snacking, smoking, drinking alcohol",
  },
  {
    name: "spiritual",
    title: "Spiritual activities",
    description: "praying, meditating, going to church",
  },
];

async function main() {
  console.log("🌱 Seeding priority categories...");

  for (const category of priorityCategories) {
    await prisma.priorityCategory.upsert({
      where: { name: category.name },
      update: category,
      create: category,
    });
  }

  console.log("✅ Priority categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
