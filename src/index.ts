import path from 'path';
import glob from 'glob';
import * as fastify from 'fastify';
import {Server, IncomingMessage, ServerResponse} from 'http';

const fastifyOrganizer: fastify.Plugin<Server, IncomingMessage, ServerResponse, {
  type: 'routes' | 'decorators' | 'plugins' | 'middlewares' | 'hooks' | 'parsers';
  ignorePattern: RegExp;
  dir: string;
  prodDir?: string;
}> = (fastify, opts, next) => {
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
          fastify.decorate(plugin.name, plugin.default);
          break;
        case 'middlewares':
          fastify.use(plugin(fastify))
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

export = fastifyOrganizer;
