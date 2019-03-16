'use strict'

const path = require('path')
const glob = require('glob')

module.exports = function (fastify, opts, next) {
  console.log('RUNNED');
  
  const directory = (process.env.NODE_ENV !== 'production' || !opts.prodDir) ? opts.dir : opts.prodDir;

  glob(path.join(directory, '**/*.{js,ts}'), (error, files) => {

    for (let i = 0; i < files.length; i++) {
      try {
        const file = require(files[i]);

        let plugin;
        
        if (file.default) plugin = file.default;
        else plugin = file;

        console.log('PLUGIN', typeof plugin, plugin);

        if (file.autoload !== false) {
          // if (opts.type === 'routes') {
          //   fastify.route(plugin(fastify));
          // } 
          // if (opts.type === 'decorators') {
          //   fastify.decorate(plugin.name, plugin);
          // }
          // if (opts.type === 'plugins') {
          //   fastify.register(plugin, plugin.options)
          // }
          // if (opts.type === 'middlewares') {
          //   fastify.use(plugin)
          // }
          // if (opts.type === 'hooks') {
          //   fastify.addHook(plugin.name, plugin)
          // }
          // if (opts.type === 'parsers') {
          //   fastify.addContentTypeParser(plugin.name, plugin)
          // }
        }
      } catch (err) {
        if (err instanceof SyntaxError) {
          err.message += ' at ' + err.stack.split('\n')[0]
        }

        next(err)
        return
      }
    }

    next();
  });
}

// do not create a new context, do not encapsulate
// same as fastify-plugin
module.exports[Symbol.for('skip-override')] = true
