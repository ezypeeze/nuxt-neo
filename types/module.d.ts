declare module 'nuxt-neo' {
    import { Request, Response, Router, RequestHandler, NextFunction } from 'express';
    import { NextHandleFunction } from 'connect';
    import { OptionsJson, OptionsText, OptionsUrlencoded } from 'body-parser';

    // The main interface for the '$api' object that the user can extend.
    export interface Api {}

    // Types for the module configuration.

    export type BodyParserType = 'json' | 'raw' | 'text' | 'urlencoded';
    export type Middleware = (req: Request) => Promise<void> | void;
    export type NeoRequestHandler = (req: Request, res: SuccessResponse, next: NextFunction) => void;

    export interface SuccessResponse extends Response {
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
            | { adapter: BodyParserType; options?: OptionsJson | OptionsText | OptionsUrlencoded }
            | Array<BodyParserType | { adapter: BodyParserType; options?: OptionsJson | OptionsText | OptionsUrlencoded }>
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

    // Contains resolved values that are no longer optional.
    type ResolvedModuleOptions = Required<ModuleConfiguration>;

    // Types and interfaces for the controllers. The user can use those to annotate controllers.

    export interface ControllerConstructor {
        new(request: Request): Controller;
        ROUTES?: ControllerRoutes;
        MIDDLEWARE?: Middleware[];
    }

    export interface Controller {
        [T: string]: (args: Args) => any;
    }

    export type ControllerRoutes = Record<string, ControllerRoute>;

    export interface ControllerRoute {
        path: string;
        verb: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
        middleware?: Middleware[];
    }

    export interface Args {
        body: Request['body'];
        params: Request['params'];
        query: Request['query'];
    }
}
