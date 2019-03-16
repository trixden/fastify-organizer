/// <reference types="node" />
import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
declare const fastifyOrganizer: fastify.Plugin<Server, IncomingMessage, ServerResponse, {
    type: 'routes' | 'decorators' | 'plugins' | 'middlewares' | 'hooks' | 'parsers';
    ignorePattern: RegExp;
    dir: string;
    prodDir?: string;
}>;
export = fastifyOrganizer;
//# sourceMappingURL=index.d.ts.map