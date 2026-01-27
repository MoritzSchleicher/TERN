import { BaseQuestionPool } from "@/data/base_questions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${BaseQuestionPool.length} questions...`);

  for (const q of BaseQuestionPool) {
    await prisma.question.upsert({
      where: { id: q.id },
      update: {}, 
      create: {
        id: q.id,
        question: q.question,
        answers: q.answers,
        correctIndex: q.correctIndex,
        category: q.category,
        fact: q.fact,
        lat: q.location.lat,
        lng: q.location.lng,
        country: q.location.country,
        createdBy: "system",
        status: "approved",
      },
    });
  }

  console.log("✅ Done seeding questions.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
