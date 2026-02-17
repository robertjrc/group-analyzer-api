export class MemberGetByGroupDTO {
    /**
     * @param {string} id - member id.
     * @param {string} groupId - group id.
     * @param {string} name - member name.
     * @param {string} shortName - member short name.
     * @param {number} level - member level.
     * @param {number} xp - member xp.
     * @param {number} xpRequired - member xp required.
     * @param {number} credits - member credit.
     * @param {number} messageCount - member message count.
     * @param {number} lastMessageAt - member last message timestamp.
     */
    constructor(
        id,
        groupId,
        name,
        shortName,
        level,
        xp,
        xpRequired,
        credits,
        messageCount,
        lastMessageAt
    ) {
        /** @type {string} */
        this.id = id;
        /** @type {string} */
        this.groupId = groupId;
        /** @type {string} */
        this.name = name;
        /** @type {string} */
        this.shortName = shortName;
        /** @type {number} */
        this.level = level;
        /** @type {number} */
        this.xp = xp;
        /** @type {number} */
        this.xpRequired = xpRequired;
        /** @type {number} */
        this.credits = credits;
        /** @type {number} */
        this.messageCount = messageCount;
        /** @type {number} */
        this.lastMessageAt = lastMessageAt;
    }
}
