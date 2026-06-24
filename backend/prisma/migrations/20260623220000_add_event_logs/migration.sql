-- CreateTable
CREATE TABLE `event_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `event_type` VARCHAR(100) NOT NULL,
    `page_url` VARCHAR(500) NULL,
    `element_name` VARCHAR(255) NULL,
    `user_role` VARCHAR(20) NOT NULL DEFAULT 'visitor',
    `session_id` VARCHAR(64) NULL,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `browser` VARCHAR(100) NULL,
    `os` VARCHAR(100) NULL,
    `device_type` VARCHAR(50) NULL,
    `referrer` VARCHAR(500) NULL,
    `locale` VARCHAR(10) NULL,
    `country` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `timezone` VARCHAR(100) NULL,
    `metadata` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `event_logs_created_at_idx`(`created_at`),
    INDEX `event_logs_event_type_idx`(`event_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
