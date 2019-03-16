import fastify = require('fastify');
import { Server, IncomingMessage, ServerResponse } from 'http';

declare const FastifyOrganizer: fastify.Plugin<Server, IncomingMessage, ServerResponse, {
  type: 'routes' | 'decorators' | 'plugins' | 'middlewares' | 'hooks' | 'parsers';
  ignorePattern: RegExp;
  dir: string;
  prodDir?: string;
}>;

export = FastifyOrganizer;