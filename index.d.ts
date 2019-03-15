import fastify = require('fastify');
import { Server, IncomingMessage, ServerResponse } from 'http';

declare const fastifyOrganizer: fastify.Plugin<Server, IncomingMessage, ServerResponse, {
  type: 'routes' | 'decorators' | 'plugins' | 'middlewares' | 'hooks' | 'parsers';
  ignorePattern: RegExp;
  dir: string;
  prodDir?: string;
}>;

export = fastifyOrganizer;