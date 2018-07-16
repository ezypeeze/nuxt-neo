# Basic Usage #

After you installed ```nuxt-neo``` package and added there are some required options you must set.

## Creating your API ##
Create a new folder on your project, lets assume ```~/api```.
```js
{
  modules: [
    ['nuxt-neo', {
        directory: __dirname + '/api'
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

## Accessing your API in your Vue Pages ##
First you need to create your client-side http request handler:
```js
{
  modules: [
    ['nuxt-neo', {
        clientSideApiHandler: '~/api_handler' // since its client-side we can use alias resolver '~'
    }]
  ]
}
```
Lets create our handler now (e.g we using axios to take care of this for us):
```js
// file: ~/api_handler
import axios from 'axios';

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
```

**NOTE**: You must return exactly what the controller action + ```successHandler``` return,
 to keep the data uniform.
 
Now lets connect our api with our page. Using the power of ```asyncData``` and/or ```fetch``` special 
properties for server-side fetching on vue.js pages, we can simply do this:

```vue
<template>
    <div class="index-page">
        <div class="current-todo" v-if="currentTodo">
            Current todo is: {{currentTodo.title}}
        </div>
    
        <div v-for="todo in todos.items">
            {{todo.title}}
            <button @click="handleClick(todo.id)">Click for details</button>
        </div>
    </div>
</template>

<script>
    export default {
        asyncData: async ({app}) => ({todos: await app.$api.todos.allAction()}),
        methods: {
            async handleClick(id) {
                this.currentTodo = await this.$api.todos.getAction({params: {id}});
            }
        }
    }
</script>
```

- ```$api``` is injected into all Vue instances (including root), since ```asyncData``` doesn't have ```this```
property.
- If ```asyncData``` is called on server-side, it will go directly to your controller action code. If its called on
client-side it uses your ```clientSideApiHandler``` to handle the api request.
- When calling an ```action``` (e.g: ```todos.allActions```), it accepts an object as param:
```json
{
    // the route params, same as express
    params: {id: 1}, 
    
    // the request body (in server side is server directly as JSON, 
    // in client side its your api handler that should define which encode type to use)
    body: {foo: true},
    
    // the url query string (in server side is server directly as JSON,
    // in client side its your api handler that should assemble to url query string (axios does that out-of-the-box)
    query: {bar: true}
}
```