"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const fastifyOrganizer = (fastify, opts, next) => {
    const directory = (process.env.NODE_ENV !== 'production' || !opts.prodDir) ? opts.dir : opts.prodDir;
    glob_1.default(path_1.default.join(directory, '/**/*.{js,ts}'), (error, files) => {
        if (error)
            throw error;
        for (let file of files) {
            if (opts.ignorePattern && opts.ignorePattern.test(file))
                return;
            const plugin = require(file);
            switch (opts.type) {
                case 'routes':
                    try {
                        fastify.route(new plugin(fastify));
                    }
                    catch (err) {
                        fastify.route(plugin(fastify));
                    }
                    break;
                case 'decorators':
                    fastify.decorate(plugin.name, plugin.default);
                    break;
                case 'middlewares':
                    fastify.use(plugin(fastify));
                    break;
                case 'hooks':
                    break;
                case 'plugins':
                    fastify.register(plugin(fastify), opts);
                    break;
                case 'parsers':
                    break;
                default:
                    break;
            }
        }
        next();
    });
};
module.exports = fastifyOrganizer;
//# sourceMappingURL=index.js.map