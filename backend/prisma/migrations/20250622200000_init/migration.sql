-- CreateTable
CREATE TABLE `care_requests` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) NULL,
    `address` TEXT NOT NULL,
    `care_type` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `requested_date` DATE NOT NULL,
    `requested_time` VARCHAR(10) NOT NULL,
    `is_urgent` BOOLEAN NOT NULL DEFAULT false,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
