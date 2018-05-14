# Work Flow Usage

After you installed ```nuxt-neo``` package and added there are some required options you must set.

The main idea is that this project extends nuxt functionality for the server-side and 
to make a smooth and simplified communication between client an server.

For that reason ```nuxt-neo``` options tree are separated by context modules that can be integrated independently.

```js
{
  modules: [
    ['nuxt-neo', {
      api: {
          // api related options
      },
      services: {
          // services related options
      }
    }]
  ]
}
```

If you want to disable, for example, ```services```, you should pass the value as ```false```:
```js
{
  modules: [
    ['nuxt-neo', {
      api: {
          // api related options
      },
      services: false
    }]
  ]
}
```


### API Module ###
To make the api module to work, you should first create a new folder on your project, lets assume ```~/api```.
```js
{
  modules: [
    ['nuxt-neo', {
      api: {
          directory: __dirname + '/api'
      },
    }]
  ]
}
```
Then lets create a new file, for example, ```~/api/todos.js``` and export a new class:
```js
const Todos = require('<your_todos_data_provider>');

class TodosController {
    // Everytime this class instantiates, request object will be injected into the construtor params.
    constructor(request) {
        this.request = request;
    }
    
    async allAction() {
        const todos = await Todos.fetchAll();
        
        return {
            total: todos.length,
            items: todos
        }
    }
    
     // An object is passed to all actions, with the route params, query string and body.
    async getAction({params}) {
        const todo = await Todos.fetchById(params.id);
        
        return todo;
    }
    
    // An object is passed to all actions, with the route params, query string and body.
    async createAction({params, query, body}) {
        
        return await Todos.create(body.title, body.content);
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

Now if you call your server at: ```GET http://<your_local_host>:<your_local_port>/api/todos```,
it will return a response with ```200``` status code and the given structure:
```json
{
    total: '<number_of_todos>',
    items: [
        {
            title: '<rand_title>',
            content: '<rand_content>'
        }
        // ...
    ]
}
```

There are a few magical things here:
- By default, your api will have the prefix ```/api```, this can be changed editing api options ```prefix```.
```js
{
  modules: [
    ['nuxt-neo', {
      api: {
          directory: __dirname + '/api',
          prefix: '/api/<some_other_prefix>'
      },
    }]
  ]
}
```
- By default, it will return a json response (with the content being what you return in the controller action),
with ```200``` status code. If the result returned by the controller action is ```null/undefined/false/empty-array```, 
it will return ```204``` status code, with no content (which is what the http code standard definition represents).
You can change this by changing the api options default handlers (more above).

Now Imagine that you have some kind of validation you want to perform before creating a new todo:
```js
    // An object is passed to all actions, with the route params, query string and body.
    async createAction({params, query, body}) {
        if (!body.title || !body.content) {
            throw new BadRequestError('Invalid body payload', [
                !body.title && 'Title is required',
                !body.content && 'Content is required'
            ].filter(Boolean));    
        }
        
        return await Todos.create(body.title, body.content);
    }
```

Or in case you fetch a todo by id and it doesn't exist:
```js
    // An object is passed to all actions, with the route params, query string and body.
    async getAction({params}) {
        const todo = await Todos.fetchById(params.id);
        if (!todo) {
            throw new NotFoundError(`Todo "${params.id}" doesn't exist.`)
        }
                
        return todo;
    }
```

- By default, ```nuxt-neo``` globalizes what we call ```http errors/exceptions```. Those exceptions,
are a kind of error that is a request flow error (route not found, bad request payload, reserved/private areas).
If an ```http errors/exceptions``` is throwed, a special kind of response will be sent 
(e.g bad request will send a list of errors, not found will represent that a given id todo doesn't exist, ...).

**NOTE**: You are not required to use this, you can simply throw a normal error (```Error native class```), its simply a
nice-to-have way to organize your error handling. If you don't want this classes you can simply disable it doing:
```js
{
  modules: [
    ['nuxt-neo', {
      api: {
          directory: __dirname + '/api',
          prefix: '/api/<some_other_prefix>',
          httpErrors: false // disable http global error classes
      },
    }]
  ]
}
```

### Services Module ###
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

``` Client Side - Vue Pages ```
First you need to create your client-side http request handler:
```js
{
  modules: [
    ['nuxt-neo', {
      api: {
          clientSideApiHandler: '~/api_handler' // since its client-side we can use alias resolver '~'
      },
      services: {
          // services related options
      }
    }]
  ]
}
```
Lets create our handler now (e.g we using axios to take care of this for us):
```js
// file: ~/api_handler
import axios from 'axios';

export default () {
    
    // path is the relative path of the route
    // verb is the method type
    // {query, body, params} are the given payload to send
    // {prefix} are api options (prefix is the api prefix, e.g: '/api') 
    export default (path, verb, {query, body}, {prefix}) => {
        return axios({
            baseURL: `http://${process.env.HOST}:${process.env.PORT}${prefix || ''}`,
            timeout: 10000,
            url: path,
            method: verb.toLowerCase(),
            data: body,
            params: query
        }).then(({data}) => data);
    };

}
```

**NOTE**: Your should return exactly what the controller action + ```successHandler``` return,
 to keep the data uniform.
 
Now lets connect our api with our page. Using the power of ```asyncData``` and/or ```fetch``` special 
properties for server-side fetching on vue.js pages, we can simply do this:

```vue
<template>
    <div class="index-page">
        <div class="current-todo" v-if="currentTodo">
            Current todo is: {{currentTodo.title}}
        </div>
    
        <div v-for="todo in todos">
            {{todo.title}}
            <button @click="handleClick(todo.id)">Click for details</button>
        </div>
    </div>
</template>

<script>
    export default {
        asyncData: asyncData({
            todos: ({app}) => app.$api.todos.allAction()
        }),
        // or
        asyncData: asyncData(({app}) => {
            return {
                todos: app.$api.todos.allAction()
            }
        }),
        methods: {
            async handleClick(id) {
                this.currentTodo = await this.$api.todos.getAction({id});
            }
        }
    }
</script>

```

- ```asyncData``` global function is an helper to declare initial data, whatever if it's server or client side
(because client routing changes are client side only)
- ```$api``` is injected into all Vue instances (including root), since ```asyncData``` doesn't have ```this```
property since the component is not yet instantiated.
- You can always not use the helpers:
```js
 asyncData: function ({req, app}) {
    if (process.server) {
        return {
            todos: req.generateControllersTree().todos.allAction();
        }
    }
    
    return {
        todos: app.$api.todos.allAction()
    }
 }
```
- ```req.generateControllersTree``` will create the controllers tree, so you can access directly the code, 
when you are on server side, instead of having to make a new request. It must be executed, since it may not be needed
everytime, on every vue page. 
- On the other hand, ```app.$api``` tree will always be generated/executed on runtime, since it's browser work.