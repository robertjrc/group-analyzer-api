import { relations } from "drizzle-orm/relations";
import { groups, blockedModules, membersTimeouts, members, membersToGroups } from "./schema";

export const blockedModulesRelations = relations(blockedModules, ({one}) => ({
	group: one(groups, {
		fields: [blockedModules.groupId],
		references: [groups.id]
	}),
}));

export const groupsRelations = relations(groups, ({many}) => ({
	blockedModules: many(blockedModules),
	membersTimeouts: many(membersTimeouts),
	membersToGroups: many(membersToGroups),
}));

export const membersTimeoutsRelations = relations(membersTimeouts, ({one}) => ({
	group: one(groups, {
		fields: [membersTimeouts.groupId],
		references: [groups.id]
	}),
	member: one(members, {
		fields: [membersTimeouts.memberId],
		references: [members.id]
	}),
}));

export const membersRelations = relations(members, ({many}) => ({
	membersTimeouts: many(membersTimeouts),
	membersToGroups: many(membersToGroups),
}));

export const membersToGroupsRelations = relations(membersToGroups, ({one}) => ({
	group: one(groups, {
		fields: [membersToGroups.gorupId],
		references: [groups.id]
	}),
	member: one(members, {
		fields: [membersToGroups.memberId],
		references: [members.id]
	}),
}));