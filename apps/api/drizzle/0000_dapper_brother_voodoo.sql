CREATE TABLE "links" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"short_code" varchar(20) NOT NULL,
	"original_url" varchar(2048) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"created_by_ip" varchar(45),
	CONSTRAINT "links_short_code_unique" UNIQUE("short_code")
);
--> statement-breakpoint
CREATE INDEX "short_code_idx" ON "links" USING btree ("short_code");--> statement-breakpoint
CREATE INDEX "is_active_idx" ON "links" USING btree ("is_active");