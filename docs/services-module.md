# Services Module #

## Configuration ##
The default options of the service module are:

```js
services: {
    // services folder -- required
    directory: __dirname + '/api'
}
```

## Creating a service ##
Services are pretty much your data providers (it's sometimes called repositories), but it can be whatever your want,
even a bag of utility functions. Services are request dependent. We provide a simple, lazy-loaded,
way to abstract your controllers from, for example, database connectors.

To make the services module to work, you should first create a new folder on your project, lets assume ```~/services```.
```js
{
  modules: [
    ['nuxt-neo', {
      services: {
          directory: __dirname + '/services'
      }
    }]
  ]
}
```

Now lets create our ```Todo Service``` class (```~/services/todos.js```):
```js
class TodoService {
    constructor(request) {
        this.request = request;
    }
    
    async fetchAll() {
        // your database/cache/private api todos fetching logic
        
        return todos;
    }
    
    async fetchById(id) {
         // your database/cache/private api todos fetching logic
                
         return todo;
    }
    
    async create(title, content) {
        // your database/cache/private api todos fetching logic
                    
        return todo;
    }
}

module.exports = TodoService;
```

Now lets change our ```TodoController``` class (```~/api/todos.js```):
```js
class TodosController {
    // Everytime this class instantiates, request object will be injected into the construtor params.
    constructor(request) {
        this.request = request;
    }
    
    async allAction() {
        const todos = await this.getService('todos').fetchAll();
        
        return {
            total: todos.length,
            items: todos
        }
    }
    
     // An object is passed to all actions, with the route params, query string and body.
    async getAction({params}) {
        const todo = await this.getService('todos').fetchById(params.id);
        
        return todo;
    }
    
    // An object is passed to all actions, with the route params, query string and body.
    async createAction({params, query, body}) {
        
        return await this.getService('todos').create(body.title, body.content);
    }
    
    // Shortcut to access to getService (you can always create a controller class and extend it from there).
    getService(name) {
        return this.request.getService(name);
    }
}

// Required: This will be the action to route mapper.
TodosController.ROUTES = {
    allAction: {
        path: '/', // your route will be /api/todos'/'
        verb: 'GET'
    },
    getAction: {
        path: '/:id', // your route will be /api/todos/:id - route paths are express-like
        verb: 'GET'
    },
    createAction: {
        path: '/', // your route will be /api/todos'/'
        verb: 'POST'
    },
};

module.exports = TodosController;
```

As you can see, now we can simply access to the todo service, calling ```getService('todos')```.
```'todos'``` is the name of the service file (without the ```.js``` part).
