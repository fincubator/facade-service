const core = require('gls-core-service');
const Basic = core.controllers.Basic;

class Registration extends Basic {
    async getState({ params: { user } }) {
        const data = { user };

        return await this._transfer('getState', data);
    }

    async firstStep({ params: { captcha, user, phone, mail } }) {
        const data = { captcha, user, phone, mail };

        return await this._transfer('firstStep', data);
    }

    async verify({ params: { user, ...data } }) {
        const requestData = { user, ...data };

        return await this._transfer('verify', requestData);
    }

    async toBlockChain({ params: { user, owner, active, posting, memo } }) {
        const data = { user, owner, active, posting, memo };

        return await this._transfer('toBlockChain', data);
    }

    async changePhone({ params: { user, phone, captcha } }) {
        const data = { user, phone, captcha };

        return await this._transfer('changePhone', data);
    }

    async resendSmsCode({ params: { user, phone } }) {
        const data = { user, phone };

        return await this._transfer('resendSmsCode', data);
    }

    async subscribeOnSmsGet({ channelId, params: { user, phone } }) {
        const data = { channelId, user, phone };

        return await this._transfer('subscribeOnSmsGet', data);
    }

    async _transfer(method, data) {
        return await this.callService('registration', method, data);
    }
}

module.exports = Registration;
