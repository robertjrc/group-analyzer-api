import { pgTable, varchar, integer, bigint, index, foreignKey, unique, primaryKey, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const groups = pgTable("groups", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	memberCount: integer("member_count").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	registeredAt: bigint("registered_at", { mode: "number" }).notNull(),
});

export const blockedModules = pgTable("blocked_modules", {
	groupId: varchar("group_id").primaryKey().notNull(),
	moduleName: varchar("module_name").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdAt: bigint("created_at", { mode: "number" }).notNull(),
}, (table) => [
	index("group_blocked_module_idx").using("btree", table.groupId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [groups.id],
			name: "blocked_modules_group_id_groups_id_fk"
		}).onDelete("cascade"),
	unique("blocked_modules_module_name_unique").on(table.moduleName),
]);

export const members = pgTable("members", {
	id: varchar().primaryKey().notNull(),
	name: varchar().notNull(),
	shortName: varchar("short_name").notNull(),
});

export const membersTimeouts = pgTable("members_timeouts", {
	groupId: varchar("group_id").notNull(),
	memberId: varchar("member_id").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	expiresIn: bigint("expires_in", { mode: "number" }).notNull(),
	reason: text(),
}, (table) => [
	index("group_timeouts_idx").using("btree", table.groupId.asc().nullsLast().op("text_ops")),
	index("member_timoutes_idx").using("btree", table.memberId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.groupId],
			foreignColumns: [groups.id],
			name: "members_timeouts_group_id_groups_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "members_timeouts_member_id_members_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.memberId, table.groupId], name: "members_timeouts_group_id_member_id_pk"}),
]);

export const membersToGroups = pgTable("members_to_groups", {
	memberId: varchar("member_id").notNull(),
	gorupId: varchar("gorup_id").notNull(),
	level: integer().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	xp: bigint({ mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	xpRequired: bigint("xp_required", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	messageCount: bigint("message_count", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	lastMessageAt: bigint("last_message_at", { mode: "number" }).notNull(),
}, (table) => [
	index("group_to_member_idx").using("btree", table.gorupId.asc().nullsLast().op("text_ops")),
	index("member_to_grupo_idx").using("btree", table.memberId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.gorupId],
			foreignColumns: [groups.id],
			name: "members_to_groups_gorup_id_groups_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "members_to_groups_member_id_members_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.memberId, table.gorupId], name: "members_to_groups_gorup_id_member_id_pk"}),
]);
