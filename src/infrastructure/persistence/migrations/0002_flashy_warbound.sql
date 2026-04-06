ALTER TABLE "members_to_groups" RENAME COLUMN "gorup_id" TO "group_id";--> statement-breakpoint
ALTER TABLE "members_to_groups" DROP CONSTRAINT "members_to_groups_gorup_id_groups_id_fk";
--> statement-breakpoint
DROP INDEX "group_to_member_idx";--> statement-breakpoint
ALTER TABLE "members_to_groups" DROP CONSTRAINT "members_to_groups_gorup_id_member_id_pk";--> statement-breakpoint
ALTER TABLE "members_to_groups" ADD CONSTRAINT "members_to_groups_group_id_member_id_pk" PRIMARY KEY("group_id","member_id");--> statement-breakpoint
ALTER TABLE "members_to_groups" ADD COLUMN "balance" bigint DEFAULT 10000 NOT NULL;--> statement-breakpoint
ALTER TABLE "members_to_groups" ADD COLUMN "next_attemp" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "members_to_groups" ADD COLUMN "next_collect" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "members_to_groups" ADD CONSTRAINT "members_to_groups_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "group_to_member_idx" ON "members_to_groups" USING btree ("group_id");