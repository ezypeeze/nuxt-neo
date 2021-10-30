import { Router, Request, Response, RequestHandler, NextFunction } from 'express';
import { NextHandleFunction } from 'connect';
import { OptionsJson, OptionsText, OptionsUrlencoded } from 'body-parser';

export type BodyParserType = 'json' | 'raw' | 'text' | 'urlencoded';
export type Middleware = (req: Request) => Promise<void> | void;
export type NeoRequestHandler = (req: Request, res: SuccessResponse, next: NextFunction) => void;

interface SuccessResponse extends Response {
    result?: any;
}

export interface ModuleConfiguration {
    /**
     * Api folder tree directory.
     * @default '~/api'
     */
    directory?: string;
    /**
     * Api prefix path.
     * @default '/api'
     */
    prefix?: string;
    /**
     * Request body parser (using `expressjs/body-parser`: https://github.com/expressjs/body-parser).
     * @default 'json'
     */
    bodyParsers?:
        BodyParserType
        | BodyParserType[]
        | { adapter: BodyParserType; options: OptionsJson | OptionsText | OptionsUrlencoded }
        | { adapter: BodyParserType; options: OptionsJson | OptionsText | OptionsUrlencoded }[]
        | ((options: ResolvedModuleOptions) => RequestHandler | NextHandleFunction);
    /**
     * Globalize http error classes (BadRequestError, NotFoundError, ...)
     * @default true
     */
    httpErrors?: boolean;
    /**
     * Debug mode - detailed internal server errors response, with stack, etc...
     * Enabled by default when process.env.NODE_ENV !== 'production'.
     * @default false
     */
    debug?: boolean;
    /**
     * If controller action return is null/empty, return 204 No Content
     * @default true
     */
    noContentStatusOnEmpty?: boolean;
    /**
     * Allows you to extend express router before going to request middleware.
     * @default null
     */
    extendRouter?: (router: Router) => void;
    /**
     * Middleware handlers for all your api.
     * @default []
     */
    middleware?: Middleware[];
    /**
     * Client side http request handler -- required
     * @default '~/api_handler'
     */
    clientSideApiHandler?: string;
    /**
     * Universal success handler (will run both on client side and server side $api calls)
     * @default null
     */
    successHandler?: string | null;
    /**
     * Universal error handler (will run both on client side and server side $api calls)
     * @default null
     */
    errorHandler?: string | null;
    /**
     * Success Response handler - will decide how the data will be send (as json, xml, etc..)
     */
    serverSuccessResponse?: (req: Request, res: SuccessResponse, options: ModuleConfiguration) => void;
    /**
     * Error Response handler - will decide how the error will be send to the client
     */
    serverErrorResponse?: (err: any, req: Request, res: Response, options: ModuleConfiguration) => void;
    /**
     * In case the route wasn't found,  will decide what to send to the client
     */
    serverNotFoundRouteResponse?: (req: Request, res: Response, options: ModuleConfiguration) => void;
}

// Contains resolved values that are no longer optional and include some extra properties.
interface ResolvedModuleOptions extends Required<ModuleConfiguration> {
    aliasKey: RegExp;
    srcDir: string;
}
