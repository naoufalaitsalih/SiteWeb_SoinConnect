import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_REQUESTS = [
  {
    fullName: "Fatima Benali",
    phone: "+212612345678",
    email: "fatima.benali@gmail.com",
    address: "12 Rue Hassan II, Maarif, Casablanca",
    careType: "Soins infirmiers",
    description:
      "Pansement quotidien suite à une intervention chirurgicale. Mobilité réduite.",
    requestedDate: new Date("2026-06-24"),
    requestedTime: "09:00",
    isUrgent: true,
    status: "pending",
    adminNotes: "Patient recommandée par Dr. Amrani.",
  },
  {
    fullName: "Mohamed Alaoui",
    phone: "+212698765432",
    email: "m.alaoui@outlook.ma",
    address: "45 Bd Zerktouni, Guéliz, Marrakech",
    careType: "Kinésithérapie",
    description: "Rééducation du genou droit post-ligamentoplastie.",
    requestedDate: new Date("2026-06-23"),
    requestedTime: "14:30",
    isUrgent: false,
    status: "in_progress",
    adminNotes: "Kiné affecté : M. Berrada.",
  },
  {
    fullName: "Aicha Tazi",
    phone: "+212655443322",
    email: "aicha.tazi@yahoo.fr",
    address: "8 Av. des FAR, Agdal, Rabat",
    careType: "Aide à domicile",
    description: "Accompagnement quotidien pour personne âgée.",
    requestedDate: new Date("2026-06-25"),
    requestedTime: "08:00",
    isUrgent: false,
    status: "pending",
    adminNotes: null,
  },
  {
    fullName: "Youssef Idrissi",
    phone: "+212611223344",
    email: "youssef.idrissi@gmail.com",
    address: "3 Rue Ibn Battouta, Médina, Fès",
    careType: "Pansements",
    description: "Changement de pansement 2 fois par semaine.",
    requestedDate: new Date("2026-06-22"),
    requestedTime: "11:00",
    isUrgent: false,
    status: "cancelled",
    adminNotes: "Zone non couverte temporairement.",
  },
  {
    fullName: "Khadija Mansouri",
    phone: "+212677889900",
    email: "khadija.mansouri@hotmail.com",
    address: "27 Lot Al Amal, Charf, Tanger",
    careType: "Soins palliatifs",
    description: "Accompagnement et soins de confort pour patient en fin de vie.",
    requestedDate: new Date("2026-06-26"),
    requestedTime: "07:00",
    isUrgent: true,
    status: "pending",
    adminNotes: "Priorité haute — famille très demandeuse.",
  },
  {
    fullName: "Hassan El Fassi",
    phone: "+212633445566",
    email: "h.fassi@pro.ma",
    address: "156 Bd Anfa, Racine, Casablanca",
    careType: "Suivi post-opératoire",
    description: "Surveillance post-appendicectomie.",
    requestedDate: new Date("2026-06-27"),
    requestedTime: "10:00",
    isUrgent: true,
    status: "in_progress",
    adminNotes: "Infirmier affecté pour 5 jours.",
  },
  {
    fullName: "Nadia Bennani",
    phone: "+212622334455",
    email: "nadia.b@live.ma",
    address: "22 Rue Oued Fès, Hay Riad, Rabat",
    careType: "Prélèvements sanguins",
    description: "Prélèvement sanguin à domicile pour bilan thyroïdien.",
    requestedDate: new Date("2026-06-28"),
    requestedTime: "07:30",
    isUrgent: false,
    status: "pending",
    adminNotes: null,
  },
  {
    fullName: "Rachid Ouali",
    phone: "+212667788990",
    email: "r.ouali@gmail.com",
    address: "9 Rue de la Liberté, Tanger Médina, Tanger",
    careType: "Soins diabète",
    description: "Injection d'insuline et contrôle glycémique quotidien.",
    requestedDate: new Date("2026-06-29"),
    requestedTime: "08:30",
    isUrgent: false,
    status: "pending",
    adminNotes: "Vérifier disponibilité infirmier spécialisé.",
  },
  {
    fullName: "Samira Cherkaoui",
    phone: "+212644556677",
    email: "samira.c@icloud.com",
    address: "78 Av. Mohammed VI, Marrakech",
    careType: "Soins infirmiers",
    description: "Perfusion IV à domicile sur prescription médicale.",
    requestedDate: new Date("2026-06-30"),
    requestedTime: "15:00",
    isUrgent: true,
    status: "cancelled",
    adminNotes: "Ordonnance expirée.",
  },
] as const;

async function main() {
  const email = "admin@soinsconnect.ma";
  const plainPassword =
    process.env.SEED_ADMIN_PASSWORD?.trim() || "Admin@2026";
  const password = await bcrypt.hash(plainPassword, 12);

  await prisma.admin.upsert({
    where: { email },
    update: {
      role: "super_admin",
      isActive: true,
    },
    create: {
      firstName: "Admin",
      lastName: "SoinsConnect",
      email,
      password,
      role: "super_admin",
      isActive: true,
    },
  });

  console.log(`Admin seed OK: ${email}`);
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.warn(
      "[seed] SEED_ADMIN_PASSWORD non défini — mot de passe par défaut utilisé uniquement en dev"
    );
  }

  const requestCount = await prisma.careRequest.count();

  if (requestCount === 0) {
    await prisma.careRequest.createMany({
      data: SAMPLE_REQUESTS.map((request) => ({ ...request })),
    });
    console.log(`Care requests seed OK: ${SAMPLE_REQUESTS.length} demandes`);
  } else {
    console.log(`Care requests déjà présentes (${requestCount}), seed ignoré`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
