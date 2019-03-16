> # This library is not be completed.

* [Why is this library need](#why-is-this-library-need)
* [Requirements](#requirements)
* [Getting started](#getting-started)
    * [Installation](#installation)
    * [Usage](#usage)
* [Plugin options](#plugin-options)

# Why is this library need

This library will help you to organize the file structure in your project.

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

| Name | Required | Type | Description |
|------|----------|------|-------------|
| `type` | **+** | string ( may be one of `routes`, `decorators`, `plugins`, `middlewares`, `hooks` or `parsers`) | Type of folder structure |
| `dir` | **+** | string | Path to folder |
| `prodDir` | - | string | Path to folder in production mode. This path will be used in production mode. If your files in production mode are transpiled to another folder, you need to specify it here. |
| `ignorePattern` | - | Regexp | If the file name matches the specified pattern, this file will be ignored.

