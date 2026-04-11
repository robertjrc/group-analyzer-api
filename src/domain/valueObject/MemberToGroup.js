export class MemberToGroup {
    /** 
     * @param {string} memberId - member id.
     * @param {string} groupId - group id.
     */

    constructor(memberId, groupId) {
        /** @type {string}*/
        this.memberId = memberId;
        /** @type {string}*/
        this.groupId = groupId;
        /** @type {number}*/
        this.level = 1;
        /** @type {number}*/
        this.balance = 0;
        /** @type {number}*/
        this.credits = 0;
        /** @type {number}*/
        this.xp = 0;
        /** @type {number}*/
        this.xpRequired = 0;
        /** @type {number}*/
        this.messageCount = 1;
        /** @type {number}*/
        this.msgByMonth = 1;
        /** @type {number}*/
        this.lastMessageAt = Date.now();
        /** @type {number}*/
        this.nextAttemp = Date.now();
        /** @type {number}*/
        this.nextCollect = Date.now();
        /** @type {number}*/
        this.nextMsgReset = this.setNextReset();
    }

    /**
     * set level.
     * @param {number} newLevel - new member level.
     * @return {void} void
     */
    setXpRequired(newLevel) {
        this.level = newLevel;
        this.xpRequired = this.#xpRequiredCalc();
    }

    /**
    * Calculate required xp.
    * @return {number} void
    */
    #xpRequiredCalc() {
        return Math.floor(Math.pow(this.level, 2) * 10);
    }

    /**
     * Set next msg reset.
     * @return {number} timestamp 
     */
    setNextReset() {
        let date = new Date();

        date.setMonth(date.getMonth() + 1);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);

        return date.getTime();
    }

    /**
     * Update level.
     * @param {object} member 
     * @return {void}
     */
    levelUp(member) {
        let xp = member.xp;
        let newXp = 0;

        if (member.level === 1000) return;

        if (xp >= member.xpRequired) {
            newXp = xp - member.xpRequired

            member.level++;
            this.setXpRequired(member.level);

            if (newXp >= member.xpRequired) {
                do {
                    newXp = newXp - member.xpRequired;
                    member.level++;
                    this.setXpRequired(member.level);
                } while (newXp >= member.xpRequired);


                this.level = member.level;
                this.xp = newXp;
                return;
            }

            this.level = member.level;
            this.xp = newXp;
            return;
        }

        this.xp = xp;
        return;
    }
}
