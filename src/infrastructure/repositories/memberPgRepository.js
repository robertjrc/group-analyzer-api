import { and, eq, sql } from "drizzle-orm";
import { IMemberRepository } from "../../application/interfaces/IMemberRepository.js";
import { Member } from "../../domain/entities/Member.js";
import { db } from "../persistence/dbContext.js";
import { groups, members } from "../persistence/schema/index.js";
import { MemberGetByGroupDTO } from "../../application/DTOs/memberGetByGroupDTO.js";
import { membersToGroups } from "../persistence/schema/membersToGroups.js";
import { MemberToGroup } from "../../domain/valueObject/MemberToGroup.js";

/** @implements {IMemberRepository} */
export class MemberPgRepository {
    /**
     * Add member in SQLite db.
     * @param {Member} member 
     * @returns {Promise<void>} void.
     */
    async addAsync(member) {
        await db.insert(members).values({
            id: member.id,
            name: member.name,
            shortName: member.shortName
        });
    }

    /**
     * get member by id. 
     * @param {string} id 
     * @returns {Promise<Member|null>} MemberGetByIdDTO or null.
     */
    async getByIdAsync(id) {
        const member = await db.select().from(members).where(eq(members.id, id))

        return (member[0]) ? new Member(
            member[0].id,
            member[0].name,
        ) : null;
    }

    /**
     * get member by group id. 
     * @param {string} id 
     * @param {string} groupId 
     * @returns {Promise<MemberGetByGroupDTO|null>} MemberOutDTO or null.
     */
    async getByGroupId(id, groupId) {
        const member = await db.select({
            id: members.id,
            name: members.name,
            groupId: membersToGroups.groupId,
            shortName: members.shortName,
            level: membersToGroups.level,
            xp: membersToGroups.xp,
            xpRequired: membersToGroups.xpRequired,
            credits: membersToGroups.credits,
            position: sql`(${await this.#getMemberPosition(id, groupId)})`.mapWith(Number),
            messageCount: membersToGroups.messageCount,
            lastMessageAt: membersToGroups.lastMessageAt
        }).from(members)
            .innerJoin(membersToGroups, eq(members.id, membersToGroups.memberId))
            .innerJoin(groups, eq(groups.id, membersToGroups.groupId))
            .where(
                and(
                    eq(members.id, id),
                    eq(groups.id, groupId),
                )
            );

        return (member[0]) ? new MemberGetByGroupDTO(
            member[0].id,
            member[0].groupId,
            member[0].name,
            member[0].shortName,
            member[0].level,
            member[0].xp,
            member[0].xpRequired,
            member[0].credits,
            member[0].position,
            member[0].messageCount,
            member[0].lastMessageAt
        ) : null;
    }

    /**
     * get member position by group id. 
     * @param {string} id 
     * @param {string} groupId 
     * @returns {Promise<number>} number.
     */
    async #getMemberPosition(id, groupId) {
        const sq = db.select({
            id: membersToGroups.memberId,
            position: sql`RANK() OVER (ORDER BY ${membersToGroups.xpRequired} DESC)`.as('position'),
        }).from(membersToGroups)
            .where(eq(membersToGroups.groupId, groupId))
            .as('sq');

        const [result] = await db.select({
            position: sq.position
        }).from(sq)
            .where(eq(sq.id, id));

        return result?.position ?? 0;
    }

    /**
     * Get all members. 
     * @returns {Promise<Array<Member>|Array>} Member or []
     */
    async getAllAsync() {
        return await db.select().from(members) || [];
    }

    /**
     * Get all members by group. 
     * @param {string} groupId - group id.
     * @returns {Promise<Array<MemberGetByGroupDTO>|Array>} MemberGetByGroupDTO or []
     */
    async getAllByGroupIdAsync(groupId) {
        const membersByGroup = await db.select({
            id: members.id,
            groupId: membersToGroups.groupId,
            name: members.name,
            shortName: members.shortName,
            level: membersToGroups.level,
            xp: membersToGroups.xp,
            xpRequired: membersToGroups.xpRequired,
            credits: membersToGroups.credits,
            position: sql`ROW_NUMBER() OVER (ORDER BY ${membersToGroups.xpRequired} DESC)`.mapWith(Number),
            messageCount: membersToGroups.messageCount,
            lastMessageAt: membersToGroups.lastMessageAt
        }).from(groups)
            .innerJoin(membersToGroups, eq(groups.id, membersToGroups.groupId))
            .innerJoin(members, eq(members.id, membersToGroups.memberId))
            .where(eq(groups.id, groupId));

        return membersByGroup.map(member => new MemberGetByGroupDTO(
            member.id,
            member.groupId,
            member.name,
            member.shortName,
            member.level,
            member.xp,
            member.xpRequired,
            member.credits,
            member.position,
            member.messageCount,
            member.lastMessageAt,
        ));
    }

    /**
     * Get member by association. 
     * @param {string} memberId - member id.
     * @param {string} groupId - group id.
     * @returns {Promise<object|null>} object or []
     */
    async getByAssociantion(memberId, groupId) {
        const member = await db.select()
            .from(membersToGroups)
            .where(and(
                eq(membersToGroups.memberId, memberId),
                eq(membersToGroups.groupId, groupId)
            ));

        return (!member[0]) ? null : member[0];
    }

    /**
     * Get member count by association.
     * @param {string} id - member id.
     * @returns {Promise<object>} member count.
     */
    async getAssociationCount(id) {
        const memberAssociation = await db.select({
            count: sql`count(*)`.mapWith(Number)
        })
            .from(membersToGroups)
            .where(eq(membersToGroups.memberId, id))

        return memberAssociation[0];
    }

    /**
     * Member name update. 
     * @param {string} id - member id.
     * @param {string} newName - new member name.
     * @param {string} newShortName - new member short name.
     * @returns {Promise<void>} void 
     */
    async nameUpdateAsync(id, newName, newShortName) {
        await db.update(members).set({
            name: newName, shortName: newShortName
        }).where(eq(members.id, id));
    }

    /**
     * Member update status. 
     * @param {string} id - member id.
     * @param {string} groupId - group id.
     * @param {object} request - update requeset.
     * @returns {Promise<void>} void 
     */
    async statusUpdateAsync(id, groupId, request) {
        await db.update(membersToGroups).set(request).where(and(
            eq(membersToGroups.memberId, id),
            eq(membersToGroups.groupId, groupId)
        ));
    }

    /**
     * Delete member by id. 
     * @param {string} id - member id.
     * @returns {Promise<void>} void
     */
    async deleteByIdAsync(id) {
        await db.delete(members).where(eq(members.id, id));
    }

    /**
     * Delete member by group id. 
     * @param {string} id - member id.
     * @param {string} groupId - group id.
     * @returns {Promise<void>} void
     */
    async deleteByGroupIdAsync(id, groupId) {
        await db.delete(membersToGroups)
            .where(
                and(
                    eq(membersToGroups.memberId, id),
                    eq(membersToGroups.groupId, groupId)
                )
            )
    }

    /**
     * Create member to group association. 
     * @param {MemberToGroup} memberToGroup - member to group.
     * @returns {Promise<void>} void
     */
    async addMemberToGroupAsync(memberToGroup) {
        await db.insert(membersToGroups).values({
            memberId: memberToGroup.memberId,
            groupId: memberToGroup.groupId,
            level: memberToGroup.level,
            xp: memberToGroup.xp,
            xpRequired: memberToGroup.xpRequired,
            credits: memberToGroup.credits,
            messageCount: memberToGroup.messageCount,
            lastMessageAt: memberToGroup.lastMessageAt
        });
    }
}
