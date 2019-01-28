const core = require('gls-core-service');
const Basic = core.controllers.Basic;

class History extends Basic {
    async notify({ user, params: { fromId, limit, types, markAsViewed = true, freshOnly } }) {
        const data = { user, fromId, limit, types, markAsViewed, freshOnly };

        return await this.callService('notify', 'history', data);
    }

    async notifyFresh({ user }) {
        return await this.callService('notify', 'historyFresh', { user });
    }

    async onlineNotify({ user, params: { fromId, limit, markAsViewed = true, freshOnly } }) {
        const data = { user, fromId, limit, markAsViewed, freshOnly };

        return await this.callService('onlineNotify', 'history', data);
    }

    async onlineNotifyFresh({ user }) {
        return await this.callService('onlineNotify', 'historyFresh', { user });
    }

    async push({
        user,
        params: { profile, afterId, limit, types, markAsViewed = true, freshOnly },
    }) {
        const data = { user, profile, afterId, limit, types, markAsViewed, freshOnly };

        return await this.callService('push', 'history', data);
    }

    async pushFresh({ user, params: { profile } }) {
        const data = { user, profile };

        return await this.callService('push', 'historyFresh', data);
    }

    async markAsViewed({ user, params: { ids } }) {
        const data = { user, ids };

        return await this.callService('notify', 'markAsViewed', data);
    }

    async markAllAsViewed({ user }) {
        const data = { user };

        return await this.callService('notify', 'markAllAsViewed', data);
    }
}

module.exports = History;
