export class MemberGetByGroupDTO {
    /**
     * @param {string} id - member id.
     * @param {string} groupId - group id.
     * @param {string} name - member name.
     * @param {string} shortName - member short name.
     * @param {number} level - member level.
     * @param {number} xp - member xp.
     * @param {number} xpRequired - member xp required.
     * @param {number} balance - member balance.
     * @param {number} credits - member credit.
     * @param {number} position - member position.
     * @param {number} messageCount - member message count.
     * @param {number} lastMessageAt - member last message timestamp.
     * @param {number} nextAttemp - member next play timestamp.
     * @param {number} nextCollect - member next gift collect timestamp.
     */
    constructor(
        id,
        groupId,
        name,
        shortName,
        level,
        xp,
        xpRequired,
        balance,
        credits,
        position,
        messageCount,
        lastMessageAt,
        nextAttemp,
        nextCollect
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
        this.balance = balance;
        /** @type {number} */
        this.credits = credits;
        /** @type {number} */
        this.position = position;
        /** @type {number} */
        this.messageCount = messageCount;
        /** @type {number} */
        this.lastMessageAt = lastMessageAt;
        /** @type {number} */
        this.nextAttemp = nextAttemp;
        /** @type {number} */
        this.nextCollect = nextCollect;
    }
}
