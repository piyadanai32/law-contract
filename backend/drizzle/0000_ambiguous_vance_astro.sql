CREATE TABLE `document_types` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `document_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `document_types_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`document_type_id` int NOT NULL,
	`data` json NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `documents` ADD CONSTRAINT `documents_document_type_id_document_types_id_fk` FOREIGN KEY (`document_type_id`) REFERENCES `document_types`(`id`) ON DELETE no action ON UPDATE no action;