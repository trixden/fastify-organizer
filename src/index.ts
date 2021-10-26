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

  const entries = await glob(path.join(directory, '/**/*.{js,ts}'));

  for (let entry of entries) {
    const file = typeof entry === 'string' ? {path: entry} : {path: entry};

    if (opts.ignorePattern && opts.ignorePattern.test(file.path)) return;

    const plugin = await import(file.path);

    if (plugin.autoload !== undefined && plugin.autoload !== true) continue;

    switch (opts.type) {
      case 'routes':
        fastify.route(plugin.default);
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
        if (plugin.url) {
          fastify.use(plugin.url, plugin.default);
        } else {
          fastify.use(plugin.default);
        }
        break;
      case 'hooks':
        fastify.addHook(plugin.event, plugin.default);
        break;
      case 'plugins':
        fastify.register(plugin.default, plugin.opts);
        break;
      case 'parsers':
        fastify.addContentTypeParser(plugin.type, plugin.default);
        break;
      case 'schemas':
        fastify.addSchema(plugin.default);
        break;
      default:
        break;
    }
  }
};

export = fp(fastifyOrganizer);
