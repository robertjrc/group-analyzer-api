import { pgTable, index, primaryKey } from "drizzle-orm/pg-core";
import * as types from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { members } from "./member.js";
import { groups } from "./group.js";

export const membersToGroups = pgTable(
    "members_to_groups",
    {
        memberId: types.varchar("member_id")
            .notNull()
            .references(() => members.id, { onDelete: "cascade" }),
        groupId: types.varchar("group_id")
            .notNull()
            .references(() => groups.id, { onDelete: "cascade" }),
        level: types.integer("level").notNull(),
        xp: types.bigint("xp", { mode: "number" }).notNull(),
        xpRequired: types.bigint("xp_required", { mode: "number" }).notNull(),
        balance: types.bigint("balance", { mode: "number" }).notNull().default(10000),
        credits: types.integer("credits").notNull().default(100),
        messageCount: types.bigint("message_count", { mode: "number" }).notNull(),
        msgByMonth: types.bigint("msg_by_month", { mode: "number" }).notNull(),
        lastMessageAt: types.bigint("last_message_at", { mode: "number" }).notNull(),
        nextAttemp: types.bigint("next_attemp", { mode: "number" }).notNull().default(Date.now()),
        nextCollect: types.bigint("next_collect", { mode: "number" }).notNull().default(Date.now()),
        nextMsgReset: types.bigint("next_msg_reset", { mode: "number" }).notNull().default(Date.now())
    },
    (table) => [
        index("member_to_grupo_idx").on(table.memberId),
        index("group_to_member_idx").on(table.groupId),
        primaryKey({ columns: [table.groupId, table.memberId] })
    ]
);

export const membersToGroupRelations = relations(membersToGroups, ({ one }) => ({
    member: one(members, {
        fields: [membersToGroups.memberId],
        references: [members.id]
    }),
    group: one(groups, {
        fields: [membersToGroups.groupId],
        references: [groups.id]
    }),
}));
