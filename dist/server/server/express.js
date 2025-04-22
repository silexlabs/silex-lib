"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = create;
exports.start = start;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const events_1 = require("./events");
function create(config) {
    const app = (0, express_1.default)();
    app.set('config', config);
    const opts = config.expressOptions;
    if (opts.cors) {
        console.info('> CORS are ENABLED:', opts.cors);
        app.use((0, cors_1.default)({ origin: opts.cors }));
    }
    app.use((0, compression_1.default)());
    app.use(body_parser_1.default.json({ limit: opts.jsonLimit }));
    app.use(body_parser_1.default.text({ limit: opts.textLimit }));
    app.use(body_parser_1.default.urlencoded({ limit: opts.urlencodedLimit }));
    console.info('> Session name:', opts.sessionName);
    app.use((0, cookie_parser_1.default)());
    app.use((0, cookie_session_1.default)({
        name: opts.sessionName,
        secret: opts.sessionSecret,
    }));
    app.use((req, _res, next) => {
        try {
            req.url = decodeURIComponent(req.url);
        }
        catch (err) {
            console.warn('Failed to decode URL:', req.url);
        }
        next();
    });
    const fsRoot = process.env.SILEX_FS_ROOT
        || path_1.default.join(__dirname, '..', '..', 'silex', 'websites');
    app.use('/en', express_1.default.static(path_1.default.join(fsRoot, 'en')));
    return app;
}
async function start(app) {
    const config = app.get('config');
    config.emit(events_1.ServerEvent.STARTUP_START, { app });
    await new Promise((resolve) => app.listen(config.port, resolve));
    config.emit(events_1.ServerEvent.STARTUP_END, { app });
    return app;
}
