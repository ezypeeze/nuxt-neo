import { Request } from 'express';
import { Middleware } from './configuration';

// This interface can be extended by the user.
export interface Api {}

// Below are types and interfaces that the user can annotate the code with.

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
