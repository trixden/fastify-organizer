> # This library is not completed.

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

## Routes

### Register plugin

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

### Creating files

Routing files are created according to the specification of the [full declaration](https://www.fastify.io/docs/v2.1.x/Routes/#full-declaration).

*using `javascript`:*
```javascript
module.exports = fastify => {
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
import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

export = (fastify: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>) => {
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

## Decorators

### Register plugin

*using `javascript`:*
```javascript
const path = require('path');
const fastify = require('fastify');
const Organizer = require('fastify-organizer');

const server = fastify();

server.register(Organizer, {
    type: 'decorators',
    dir: path.join(__dirname, 'decorators')
});
```

*using `typescript`:*
```typescript
import path from 'path';
import * as fastify from 'fastify'
import * as fastifyOrganizer from 'fastify-organizer';

const server = fastify();

server.register(Organizer, {
    type: 'decorators',
    dir: path.join(__dirname, 'src/decorators')
});
```

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

### Register plugin

*using `javascript`:*
```javascript
const path = require('path');
const fastify = require('fastify');
const Organizer = require('fastify-organizer');

const server = fastify();

server.register(Organizer, {
    type: 'hooks',
    dir: path.join(__dirname, 'decorators')
});
```

*using `typescript`:*
```typescript
import path from 'path';
import * as fastify from 'fastify'
import * as fastifyOrganizer from 'fastify-organizer';

const server = fastify();

server.register(Organizer, {
    type: 'hooks',
    dir: path.join(__dirname, 'src/decorators')
});
```

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
