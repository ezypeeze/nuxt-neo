# Middleware #
It's possible to add middleware into 3 parts of your API:
- Middleware for all your api (this means all routes from ```/api/**/*```)
```js
// file: nuxt.config.js
{
  modules: [
    ['nuxt-neo', {
      // ...
      middleware: [
        function (req) {
            console.log('first');
        },
        function (req) {
            if (req.query.fail === 'true') {
                throw new Error("force fail");
            }
        }
      ]
      // ...
    }]
  ]
}
```

- Middleware for a controller (this means that all routes of the controller).

```js
// file: ~/api/todos.js

class TodoController {
    // ...
}

TodoController.ROUTES = {
    //...
};

TodoController.MIDDLEWARE = [
    function (req) {
        console.log('first');
    }
]
```
- Middleware for a specific action in a controller.
```js
//file: ~/api/todos.js

class TodoController {
    // ...
}

TodoController.ROUTES = {
    //...
};

TodoController.MIDDLEWARE = [
    ['allAction',
     function (req) {
         console.log('second');
     },
     function (req) {
         // supports promises
         return Promise.resolve().then(() => console.log('third'));
     }
    ]
]
```

*NOTE:* The middleware is mostly used to block access and enrich request object with data.
 You only have access to ```request``` object and can only break the continuation to the controller action
 throwing errors (e.g : ```throw new InternalServer("I dont want to continue")```);

## Response Middleware ##
You will mostly get to the point to make your api payload data more structured and abstracted. 
(for example: inject payload data into somekind of collection).

To do this, define the response middleware file into module config:
```js
// nuxt.config.js
{
  modules: [
    ['nuxt-neo', {
      // ...
      responseMiddleware: '~/response_middleware'
      // ...
    }
  ]
}
```

Then create that file:
```js
// ~/response_middleware.js

class Collection() {
    
    constructor(payload, meta) {
        this.payload = payload;
        this.meta    = meta;
    }
    
    getTotal() {
        return this.meta.total;
    }
    
    getPayload() {
        return this.payload;
    }
}

// The result is the response payload, that you define on successHandler option.
// Imagine you have this response json structure:

/**
* {
*   meta: { total: 100, offset: 0, limit: 25 },
*   payload: [ {...}, {...}, {...} }
* }
*/

export default function(result) {
    return new Collection(result.payload, result.meta);
}
```

Then on your Vue Page:
```vue
<template>
    <div class="index-page">
        <div class="current-todo" v-if="currentTodo">
            Current todo is: {{currentTodo.getPayload().title}}
        </div>
    
        <div v-for="todo in todos.getPayload()">
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