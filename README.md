* [Why is this library need](#why-is-this-library-need)
* [Requirements](#requirements)
* [Getting started](#getting-started)
    * [Installation](#installation)
    * [Usage](#usage)
* [Plugin options](#plugin-options)
* [Types of structures](#types-of-structures)
    * [Routes](#routes)
    * [Decorators](#decorators)
    * [Hooks](#hooks)
    * [Plugins](#plugins)
    * [Content type parsers](#content-type-parsers)
    * [Middlewares](#middlewares)

# Why is this library need

This library will help you to organize the file structure in your project. Just specify the path to the folder, and it will automatically register all files in this folder as components of the specified type. It can register **routes**, **decorators**, **plugins**, **middlewares**, **hooks** and **content type parsers**.

# Requirements

* `fastify` = 2.1.x

# Getting started

## Installation

Install `fastify-organizer` package via NPM:

```
npm install --save fastify-organizer
```

Or via Yarn:

```
yarn add fastify-organizer
```

## Usage

Import `fastify-organizer` into your project and connect it to your fastify instance as plugin:

*using `javascript`:*
```javascript
const path = require('path');
const fastify = require('fastify');
const Organizer = require('fastify-organizer');

const server = fastify();

server.register(Organizer, {
    type: 'routes',
    dir: path.join(__dirname, 'routes'),
    ignorePattern: /.*\.test\.(ts | js)$/
});
```

*using `typescript`:*
```typescript
import path from 'path';
import * as fastify from 'fastify'
import * as fastifyOrganizer from 'fastify-organizer';

const server = fastify();

server.register(Organizer, {
    type: 'routes',
    dir: path.join(__dirname, 'src/routes'),
    prodDir: path.join(__dirname, 'dist/routes'),
    ignorePattern: /.*\.test\.(ts | js)$/
});
```

# Plugin options

These options are used when registering the plugin.

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `type` | **+** | string ( may be one of `routes`, `decorators`, `plugins`, `middlewares`, `hooks` or `parsers`) | Type of folder structure |
| `dir` | **+** | string | Path to folder |
| `prodDir` | - | string | Path to folder in production mode. This path will be used in production mode. If your files in production mode are transpiled to another folder, you need to specify it here. |
| `ignorePattern` | - | Regexp | If the file name matches the specified pattern, this file will be ignored.

# Types of structures

All files have several required parameters. These parameters are what you need to export from the file.

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `default` | **+** | any | The main entity to be connected. Each file type has its own specifics. Read about the types below.
| `autoload` | - | boolean | If the value is `false`, the file will not be connected. If no value is specified, the file will be connected anyway.

## Routes

### Creating files

Routing files are created according to the specification of the [full declaration](https://www.fastify.io/docs/v2.1.x/Routes/#full-declaration).

*using `javascript`:*
```javascript
exports.default = fastify => {
  return {
    url: '/articles',
    method: 'GET'
    schema: {...},
    async handler(request, reply) {
        ...
    }
  }
}
```

*using `typescript`:*
```typescript
import { FastifyInstance, RouteOptions } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

export default (fastify: FastifyInstance<Server, IncomingMessage, ServerResponse>) => {
  const router: RouteOptions<Server, IncomingMessage, ServerResponse> = {
    url: '/articles',
    method: 'GET'
    schema: {...},
    async handler(request, reply) {
        ...
    }
  }

  return router;
}
```

## Decorators

### Additional options

These parameters are passed along with the export of the decorator. See example below.

| Name | Required? | Type | Description |
|------|-----------|------|-------------|
| `name` | **+** | string | Property name to be added |
| `target` | - | string (may be one of `request` or `response`) | Defines which entity should be decorated. If the target property is not passed, the global fastify object will be decorated. |

### Creating files

For example, let's connect the configuration object from the `config` library to the global object `fastify`

*using `javascript`:*
```javascript
const config = require('config');

exports.name = 'config';
exports.target = undefined; // Or just do not define this variable.
exports.default = config;
```

*using `typescript`:*
```typescript
import * as config from 'config';
import {FastifyInstance} from 'fastify';

declare module 'fastify' {
  export interface FastifyInstance {
    config: any;
  }
}

export const name = 'config';
export const target = undefined; // Or just do not define this variable.
export default config;
```

## Hooks

### Additional options

These parameters are passed along with the export of the hook. See example below.

| Name | Required? | Type | Description |
|------|-----------|------|-------------|
| `event` | **+** | string | Lifecycle event to which the hook will be connected |

### Creating files

*using `javascript`:*
```javascript
exports.event = 'onRequest';
exports.default = function (request, reply, next) {
  ...
  next();
};
```

*using `typescript`:*
```typescript
import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

export const event = 'onRequest';
const hook: fastify.FastifyMiddleware<Server, IncomingMessage, ServerResponse> = function (request, reply, next) {
  ...
  next();
}

export default hook;
```

## Plugins

### Additional options

| Name | Required? | Type | Description |
|------|-----------|------|-------------|
| `opts` | - | object | Default options of [fastify plugin](https://www.fastify.io/docs/v2.1.x/Plugins/) |

### Creating files

*using `javascript`:*
```javascript
exports.opts = {
  prefix: '/articles'
};

exports.default = function (request, reply, next) {
  ...
  next();
};
```

*using `typescript`:*
```typescript
import {Plugin}  from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";

export const opts = {
  prefix: '/articles'
};

const plugin: Plugin<Server, IncomingMessage, ServerResponse, {}> = (fastify, opts, next) => {
  ...
  next();
};

export default plugin;
```

## Content type parsers

### Additional options

| Name | Required? | Type | Description |
|------|-----------|------|-------------|
| `type` | **+** | string or array | Type or array of types of the added parser |

### Creating files

*using `javascript`:*
```javascript
exports.type = 'application/jsoff';

exports.default = function (reqest, done) {
  jsoffParser(request, function (err, body) {
    done(err, body)
  });
};
```

*using `typescript`:*
```typescript
import {ContentTypeParser, FastifyRequest} from "fastify";
import {IncomingMessage} from "http";

export const type = 'application/jsoff';

const parser: ContentTypeParser<FastifyRequest<IncomingMessage>> = function (request, done) {
  done(null, request.body)
}

export default parser;
```

## Middlewares

### Additional options

| Name | Required? | Type | Description |
|------|-----------|------|-------------|
| `url` | - | string or array of strings | Define this property if you want the middleware above to work only under certain path(s). |

### Creating files

*using `javascript`:*
```javascript
exports.default = function (reqest, reply, next) {
  ...
  next();
};
```

*using `typescript`:*
```typescript
import { FastifyMiddleware } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";

const mware: FastifyMiddleware<Server, IncomingMessage, ServerResponse> = function (request, reply, next) {
  ...
  next()
}

export default mware;
```
