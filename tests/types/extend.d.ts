declare module 'nuxt-neo' {
    interface TestController {
        allAction(args?: any): Promise<any>;
        createAction(args?: any): Promise<any>;
        getAction(args?: any): Promise<any>;
        getActionOptional(args?: any): Promise<any>;
        removeAction(args?: any): Promise<any>;
        updateAction(args?: any): Promise<any>;
    }

    interface CategoriesController extends TestController {
        order: TestController;
        types: TestController;
    }

    interface UsersController extends TestController {
        categories: CategoriesController;
    }

    interface Api {
        nuxtError: { error: () => Promise<void> };
        products: TestController;
        users: UsersController;
    }
}
