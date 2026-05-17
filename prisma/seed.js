const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Database...");

  // 1. Seed Root Admin
  const defaultUsername = "admin";
  const defaultPassword = "admin123"; // bcrypt-hashed below for maximum security

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: defaultUsername },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const newAdmin = await prisma.admin.create({
      data: {
        username: defaultUsername,
        password: hashedPassword,
      },
    });
    console.log(`✓ Admin user created with username: "${newAdmin.username}" and password: "${defaultPassword}"`);
  } else {
    console.log(`✓ Admin user "${defaultUsername}" already exists.`);
  }

  // 2. Optional: Seed some sample internships to showcase on the home page if db is empty
  const internshipCount = await prisma.internship.count();
  if (internshipCount === 0) {
    console.log("Seeding mock placement/internship opportunities...");
    await prisma.internship.createMany({
      data: [
        {
          companyName: "Google LLC",
          title: "Site Reliability Intern",
          type: "Internship",
          location: "Mountain View, CA",
          eligibility: "CSE / IT branch, CGPA > 8.00",
          description: "Join Google's reliability engineering team. Responsibilities include building scalable automation, monitoring core microservices in Go/Python, and maintaining zero-downtime distributed systems.",
          lastDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        },
        {
          companyName: "Stripe",
          title: "Associate Frontend Developer",
          type: "Placement",
          location: "New York, NY",
          eligibility: "Open to CSE/EE/ECE branch students",
          description: "Develop premium transactional web dashboards using React, Next.js, and TypeScript. Build responsive UIs and coordinate directly with product management designers.",
          lastDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        },
        {
          companyName: "Meta Platforms",
          title: "Product Engineering Intern",
          type: "Internship",
          location: "Menlo Park, CA (Hybrid)",
          eligibility: "CSE/IT, CGPA > 8.50, graduation year 2026",
          description: "Build user-facing features on core social products. Experience with modern Javascript systems, React, CSS styling, and graph APIs is highly desired.",
          lastDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        },
      ],
    });
    console.log("✓ Mock opportunities seeded successfully.");
  }

  console.log("Database Seeding Completed.");
}

main()
  .catch((e) => {
    console.error("Error during database seed execution:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
