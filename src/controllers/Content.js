const core = require('gls-core-service');
const Basic = core.controllers.Basic;

class Content extends Basic {
    async getComments({
        auth: { user: currentUserId },
        params: {
            sortBy,
            sequenceKey,
            limit,
            userId: requestedUserId,
            permlink,
            refBlockNum,
            type,
            contentType,
        },
    }) {
        const data = {
            sortBy,
            sequenceKey,
            limit,
            requestedUserId,
            currentUserId,
            permlink,
            refBlockNum,
            type,
            contentType,
        };

        return await this.callService('prism', 'getComments', data);
    }

    async getPost({
        auth: { user: currentUserId },
        params: { userId: requestedUserId, permlink, refBlockNum, contentType },
    }) {
        const data = { currentUserId, requestedUserId, permlink, refBlockNum, contentType };

        return await this.callService('prism', 'getPost', data);
    }

    async getComment({
        auth: { user: currentUserId },
        params: { userId: requestedUserId, permlink, refBlockNum, contentType },
    }) {
        const data = { currentUserId, requestedUserId, permlink, refBlockNum, contentType };

        return await this.callService('prism', 'getComment', data);
    }

    async getFeed({
        auth: { user: currentUserId },
        params: {
            type,
            sortBy,
            sequenceKey,
            limit,
            userId: requestedUserId,
            communityId,
            timeframe,
            tags,
            contentType,
        },
    }) {
        const data = {
            type,
            sortBy,
            sequenceKey,
            limit,
            currentUserId,
            requestedUserId,
            communityId,
            timeframe,
            tags,
            contentType,
        };

        return await this.callService('prism', 'getFeed', data);
    }

    async getProfile({ params: { userId: requestedUserId, type } }) {
        const data = { requestedUserId, type };

        return await this.callService('prism', 'getProfile', data);
    }

    async getHashTagTop({ params: { communityId, limit, sequenceKey } }) {
        const data = { communityId, limit, sequenceKey };

        return await this.callService('prism', 'getHashTagTop', data);
    }

    async getLeadersTop({
        auth: { user: currentUserId },
        params: { communityId, limit, sequenceKey },
    }) {
        const data = { currentUserId, communityId, limit, sequenceKey };

        return await this.callService('prism', 'getLeadersTop', data);
    }

    async waitForBlock({ params: { blockNum } }) {
        const data = { blockNum };

        return await this.callService('prism', 'waitForBlock', data);
    }

    async waitForTransaction({ params: { transactionId } }) {
        const data = { transactionId };

        return await this.callService('prism', 'waitForTransaction', data);
    }
}

module.exports = Content;
