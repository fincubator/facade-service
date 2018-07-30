// Описание переменных окружения смотри в Readme.
const env = process.env;

module.exports = {
    GLS_FRONTEND_GATE_CONNECT: env.GLS_FRONTEND_GATE_CONNECT,
    GLS_NOTIFY_CONNECT: env.GLS_NOTIFY_CONNECT,
    GLS_OPTIONS_CONNECT: env.GLS_OPTIONS_CONNECT,
    GLS_PUSH_CONNECT: env.GLS_PUSH_CONNECT,
    GLS_MAIL_CONNECT: env.GLS_MAIL_CONNECT,
};
