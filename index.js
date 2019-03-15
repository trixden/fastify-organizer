'use strict'

// const fs = require('fs')
const path = require('path')
// const steed = require('steed')
const glob = require('glob')

module.exports = function (fastify, opts, next) {
  console.log('RUNNED');
  
  const directory = (process.env.NODE_ENV !== 'production' || !opts.prodDir) ? opts.dir : opts.prodDir;
  console.log('DIRECTORY', directory)

  glob(path.join(directory, '**/*.{js,ts}'), (error, files) => {
    console.log('FILES', files);

    for (let i = 0; i < files.length; i++) {
      try {
        const plugin = require(files[i]);

        if (plugin.autoload !== false) {
          if (opts.type === 'routes') {
            fastify.route(plugin(fastify));
          } 
          if (opts.type === 'decorators') {
            fastify.decorate(plugin.name, plugin);
          }
          if (opts.type === 'plugins') {
            fastify.register(plugin, plugin.options)
          }
          if (opts.type === 'middlewares') {
            fastify.use(plugin)
          }
          if (opts.type === 'hooks') {
            fastify.addHook(plugin.name, plugin)
          }
          if (opts.type === 'parsers') {
            fastify.addContentTypeParser(plugin.name, plugin)
          }
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

  // fs.readdir(directory, function (err, list) {
  //   if (err) {
  //     next(err)
  //     return
  //   }

  //   steed.map(list, (file, cb) => {
  //     if (opts.ignorePattern && file.match(opts.ignorePattern)) {
  //       cb(null, { skip: true }) // skip files matching `ignorePattern`
  //       return
  //     }

  //     const toLoad = path.join(directory, file)
  //     fs.stat(toLoad, (err, stat) => {
  //       if (err) {
  //         cb(err)
  //         return
  //       }

  //       if (stat.isDirectory()) {
  //         fs.readdir(toLoad, (err, files) => {
  //           if (err) {
  //             cb(err)
  //             return
  //           }

  //           cb(null, {
  //             // skip directories without .js or .ts files inside
  //             skip: files.every(name => !name.match(/.(js | ts)$/)),
  //             file: toLoad
  //           })
  //         })
  //       } else {
  //         cb(null, {
  //           // only accept .js and .ts files
  //           skip: !(stat.isFile() && file.match(/.(js | ts)$/)),
  //           file: toLoad
  //         })
  //       }
  //     })
  //   }, (err, stats) => {
  //     console.log('FILES TAKED', stats);
      
  //     if (err) {
  //       next(err)
  //       return
  //     }

  //     for (let i = 0; i < stats.length; i++) {
  //       const { skip, file } = stats[i]

  //       if (skip) {
  //         continue
  //       }

  //       try {
  //         const plugin = require(file);

  //         if (plugin.autoload !== false) {
  //           if (opts.type === 'routes') {
  //             fastify.route(plugin(fastify));
  //           } 
  //           if (opts.type === 'decorators') {
  //             fastify.decorate(plugin.name, plugin);
  //           }
  //           if (opts.type === 'plugins') {
  //             fastify.register(plugin, plugin.options)
  //           }
  //           if (opts.type === 'middlewares') {
  //             fastify.use(plugin)
  //           }
  //           if (opts.type === 'hooks') {
  //             fastify.addHook(plugin.name, plugin)
  //           }
  //           if (opts.type === 'parsers') {
  //             fastify.addContentTypeParser(plugin.name, plugin)
  //           }
  //         }
  //       } catch (err) {
  //         if (err instanceof SyntaxError) {
  //           err.message += ' at ' + err.stack.split('\n')[0]
  //         }

  //         next(err)
  //         return
  //       }
  //     }

  //     next()
  //   })
  // })
}

// do not create a new context, do not encapsulate
// same as fastify-plugin
module.exports[Symbol.for('skip-override')] = true