import path from 'path';
import glob from 'fast-glob';
import * as fastify from 'fastify';
import fp from 'fastify-plugin';

interface OrganizerOpts {
  type: 'routes' | 'decorators' | 'middlewares' | 'hooks' | 'plugins' | 'parsers' | 'schemas',
  dir: string,
  ignorePattern?: RegExp,
  prodDir?: string
};

const fastifyOrganizer: fastify.FastifyPlugin<OrganizerOpts> = async (fastify, opts) => {
  const directory = (process.env.NODE_ENV !== 'production' || !opts.prodDir) ? opts.dir : opts.prodDir;

  const entries = await glob(path.join(directory, '**/*.{js,ts}'));

  for (let entry of entries) {
    if (opts.ignorePattern && opts.ignorePattern.test(entry)) continue;

    const plugin = await import(entry);

    if (plugin.autoload !== undefined && plugin.autoload !== true) continue;

    switch (opts.type) {
      case 'routes':
        fastify.route(plugin.default.default);
        break;
      case 'decorators':
        if (plugin.target === 'request') {
          fastify.decorateRequest(plugin.default.name, plugin.default.default);
        }
        if (plugin.target === 'reply') {
          fastify.decorateReply(plugin.default.name, plugin.default.default);
        }
        if (!plugin.target) {
          fastify.decorate(plugin.default.name, plugin.default.default);
        }
        break;
      case 'middlewares':
        if (plugin.url) {
          fastify.use(plugin.default.url, plugin.default.default);
        } else {
          fastify.use(plugin.default.default);
        }
        break;
      case 'hooks':
        fastify.addHook(plugin.default.event, plugin.default.default);
        break;
      case 'plugins':
        fastify.register(plugin.default.default, plugin.default.opts);
        break;
      case 'parsers':
        fastify.addContentTypeParser(plugin.default.type, plugin.default.default);
        break;
      case 'schemas':
        fastify.addSchema(plugin.default.default);
        break;
      default:
        break;
    }
  }
};

export = fp(fastifyOrganizer);
