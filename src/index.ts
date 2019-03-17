import path from 'path';
import glob from 'glob';
import * as fastify from 'fastify';
import fp from 'fastify-plugin';
import {Server, IncomingMessage, ServerResponse} from 'http';

interface OrganizerOpts {
  type: 'routes' | 'decorators' | 'middlewares' | 'hooks' | 'plugins' | 'parsers',
  dir: string,
  ignorePattern?: RegExp,
  prodDir?: string
};

const fastifyOrganizer: fastify.Plugin<Server, IncomingMessage, ServerResponse, OrganizerOpts> = (fastify, opts, next) => {
  const directory = (process.env.NODE_ENV !== 'production' || !opts.prodDir) ? opts.dir : opts.prodDir;

  glob(path.join(directory, '/**/*.{js,ts}'), (error, files) => {
    if (error) throw error;

    for (let file of files) {
      if (opts.ignorePattern && opts.ignorePattern.test(file)) return;

      const plugin = require(file);

      switch (opts.type) {
        case 'routes':
          try {
            fastify.route(new plugin(fastify));
          } catch(err) {
            fastify.route(plugin(fastify));
          }
          break;
        case 'decorators':
          if (plugin.target === 'request') {
            fastify.decorateRequest(plugin.name, plugin.default);
          }
          if (plugin.target === 'reply') {
            fastify.decorateReply(plugin.name, plugin.default);
          }
          if (!plugin.target) {
            fastify.decorate(plugin.name, plugin.default);
          }
          break;
        case 'middlewares':
          fastify.use(plugin(fastify))
          break;
        case 'hooks':
          fastify.addHook(plugin.event, plugin.default);
          break;
        case 'plugins':
          fastify.register(plugin.default, plugin.opts);
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

export = fp(fastifyOrganizer);
