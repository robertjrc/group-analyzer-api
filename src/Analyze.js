import { GroupController } from "./adapters/controllers/groupController.js";
import { MemberController } from "./adapters/controllers/memberController.js";
import NodeCache from "node-cache";

const groupsCache = new NodeCache({ stdTTL: 3600, checkperiod: 7200 });

export class Analyze {
    /**
     * @property {GroupController} group - groupController.
     * @property {MemberController} member - memberController.
     */
    #group;
    #member;

    constructor() {
        /** @type {GroupController} */
        this.#group = new GroupController();
        /** @type {MemberController} */
        this.#member = new MemberController();
    }

    /**
     * analyze group chat.
     * @param {object} chat - chat object.
     * @returns {Promise<void>}
    */
    async on(chat) {
        if (!chat.lastMessage.author || chat.lastMessage.hasMedia) return;

        let group;
        let member;
        const groupId = chat.id._serialized;
        const memberId = chat.lastMessage.author;

        /**
        * XP calculator
        * @param {number} msgLength
        */
        let xpCalc = (msgLength) => (msgLength > 50) ? 7 : 3;

        if (groupsCache.has(groupId)) {
            group = groupsCache.get(groupId);
        } else {
            const getGroupResponse = await this.#group.getById(groupId);

            if (!getGroupResponse.success) {
                group = (await this.#group.create({
                    id: chat.id._serialized,
                    name: chat.name,
                    memberCount: chat.participants.length,
                    createdAt: chat.groupMetadata.creation * 1000
                })).data;
            } else { group = getGroupResponse.data; }

            groupsCache.set(group.id, group);
        }

        if (group.memberCount !== chat.participants.length) {
            await this.#group.newMemberCount(group.id, chat.participants.length);
        }

        if (group.name !== chat.name) await this.#group.newName(group.id, chat.name);

        let getMemberResponse;

        getMemberResponse = await this.#member.getByAssociation(memberId, group.id);

        if (!getMemberResponse.success) {
            getMemberResponse = await this.#member.getByGroupId(memberId, group.id);

            if (!getMemberResponse.success) {
                if (getMemberResponse.data) {
                    await this.#member.addMemberToGroup(memberId, group.id);

                    await this.#member.statusUpdate(
                        memberId,
                        group.id,
                        { xp: xpCalc(chat.lastMessage.body.length) }
                    );
                    return;
                }

                member = (await this.#member.create(
                    group.id,
                    {
                        id: memberId,
                        name: chat.lastMessage._data.notifyName
                    }
                )).data;

                await this.#member.statusUpdate(
                    memberId,
                    group.id,
                    { xp: xpCalc(chat.lastMessage.body.length) }
                );

                return;
            }
        }

        member = getMemberResponse.data;

        const newXp = member.xp + xpCalc(chat.lastMessage.body.length);

        if (newXp >= member.xpRequired) {
            member.xp = newXp;
            const { level, xp, xpRequired } = this.#member.xpManager(memberId, group.id, member).data;

            await this.#member.statusUpdate(
                memberId,
                group.id,
                {
                    level,
                    xp,
                    xpRequired,
                    messageCount: member.messageCount += 1,
                    lastMessageAt: Date.now()
                }
            );

            return;
        }

        await this.#member.statusUpdate(
            memberId,
            group.id,
            {
                xp: newXp,
                messageCount: member.messageCount += 1,
                lastMessageAt: Date.now()
            }
        );

        return;
    }
}
