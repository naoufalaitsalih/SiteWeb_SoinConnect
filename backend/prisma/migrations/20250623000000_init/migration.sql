-- CreateTable
CREATE TABLE "care_requests" (
    "id" SERIAL NOT NULL,
    "full_name" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255),
    "address" TEXT NOT NULL,
    "care_type" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "requested_date" DATE NOT NULL,
    "requested_time" VARCHAR(10) NOT NULL,
    "is_urgent" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "admin_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "care_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_logs" (
    "id" SERIAL NOT NULL,
    "event_type" VARCHAR(100) NOT NULL,
    "page_url" VARCHAR(500),
    "element_name" VARCHAR(255),
    "user_role" VARCHAR(20) NOT NULL DEFAULT 'visitor',
    "session_id" VARCHAR(64),
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "browser" VARCHAR(100),
    "os" VARCHAR(100),
    "device_type" VARCHAR(50),
    "referrer" VARCHAR(500),
    "locale" VARCHAR(10),
    "country" VARCHAR(100),
    "city" VARCHAR(100),
    "timezone" VARCHAR(100),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" SERIAL NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "user_id" INTEGER,
    "user_email" VARCHAR(255),
    "user_role" VARCHAR(50),
    "ip_address" VARCHAR(45),
    "user_agent" TEXT,
    "resource" VARCHAR(255),
    "resource_id" VARCHAR(50),
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE INDEX "event_logs_created_at_idx" ON "event_logs"("created_at");

-- CreateIndex
CREATE INDEX "event_logs_event_type_idx" ON "event_logs"("event_type");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");
