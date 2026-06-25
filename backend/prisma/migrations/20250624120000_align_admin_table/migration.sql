-- Align admins table with Prisma Admin model (optional names, default role)
ALTER TABLE "admins" ALTER COLUMN "first_name" DROP NOT NULL;
ALTER TABLE "admins" ALTER COLUMN "last_name" DROP NOT NULL;
ALTER TABLE "admins" ALTER COLUMN "role" SET DEFAULT 'super_admin';
