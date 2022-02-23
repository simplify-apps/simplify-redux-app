# 🐒  Simplify redux ap
<p align="center">
  <a href="https://github.com/simplify-apps/simplify-redux-app/actions/workflows/publish.yml">
    <img src="https://github.com/simplify-apps/simplify-redux-app/actions/workflows/publish.yml/badge.svg" />
  </a>

  <a href="https://npm.im/simplify-redux-app/">
    <img src="https://img.shields.io/npm/v/simplify-redux-app.svg" />
  </a>

  <a href="https://www.npmjs.com/package/simplify-redux-app">
    <img src="https://badgen.net/npm/dw/simplify-redux-app" />
  </a>

  <a href="https://github.com/simplify-apps/simplify-redux-app/blob/master/LICENSE">
    <img src="https://badgen.now.sh/badge/license/MIT" />
  </a>
  
  <a href="https://bundlephobia.com/result?p=simplify-redux-app">
    <img src="https://badgen.net/bundlephobia/minzip/simplify-redux-app">
  </a>
</p>

Simplify redux app (SRA) is the modern and lightweight (less than 2 kb) toolkit that will simplify your work with redux. SRA allows you to forget all pain with actions, constants, reducers, moreover, it is fully compatible with existing code.

The library is actively used and developed, so if you have any questions welcome! 👋 


## 📦 Installation

To use SRA in your project, install it via npm:

```
npm i simplify-redux-app
```
or by yarn:
```
yarn add simplify-redux-app
```

then create module

```jsx
import { simplifyBuilder } from 'simplify-redux-app';

// create builder that will handle all the work
const builder = simplifyBuilder(state, existReducers);

// create reducer that will be used by redux
const reducer = builder.getReducers()
```

more cool example can be found below

## ✨ Features
SRA allows you to create actions that can be used to dispatch data to your store. Here is an example of these actions:

```jsx
import { simplifyBuilder } from 'simplify-redux-app';

export interface ITodoState {
  items: string[];
}

export const todoState: ITodoState = {
  items: ['test'],
};

// init builder from the library
const builder = simplifyBuilder(todoState, {});

// example how to create simple redux action
const addTodoItem = builder.createReduxAction((test: string) => ({
  name: 'ADD_TODO_ITEM',
  updater: (state) => ({
    ...state,
    items: [...state.items, test],
  }),
}));

// example how to send a server request
const loadTodoItemById = builder.createServerAction((id: string) => ({
  name: 'LOAD_TODO_ITEM_BY_ID',
  url: 'https://jsonplaceholder.typicode.com/todos/' + id,
  method: httpMethod.get,
  updater: (state, payload: APITodoItemResponse) => ({
    ...state,
    items: [...state.items, payload.title],
  }),
}));

// create reducer for redux
export const rootReducer = combineReducers({
  todo: builder.getReducers(),
});

// create store
export const store = createStore(rootReducer);
```

for the simple redux store update you can use `createReduxAction`, for example `addTodoItem` will create promise
```typescript
const addTodoItem: (test: string) => Promise<SimpleAction<ITodoState, [test: string]>>
```

and simply by dispatching it your react component `dispatch(addTodoItem('test'))` your redux store will be updated, that's it!

in the case when you need to send the request to the server via HTTP and put the result into redux, you can use `createServerAction`. For example `loadTodoItemById` will create promise:

```typescript
const loadTodoItemById: (id: string) => Promise<SimpleAction<ITodoState, APITodoItemResponse>>
```

and like previously by dispatching the function in the react component your store will be updated!

if you will call `toString` method on any function, that was created from SRA build, it will return the `name` of the action. (no more constants 😅)

Want more? Check the `example` folder or ask questions

## 👷 Custom middleware 

here is some cool example of using custom middleware:

```typescript
// custom middleware for web requests
const middleWare = [
  middlewareBuilder({
    httpRequestHandler: async (httpMethod: httpMethod, url: string, body: any) => {
      const data = await fetch(url, {
        method: httpMethod,
        body: body && httpMethod !== 'GET' ? body : null,
      });

      return data;
    },
    responseHandler: async (response: Response, dispatch: Dispatch) => {
      const isRequestSuccess = response.status < 400;

      if (!isRequestSuccess) {
        const result = await addError(errorText);
        dispatch(result);
      }

      return isRequestSuccess;
    },
  }),
];

// added support for redux-dev tool
const composeEnhancers =
  (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

// create store for redux
export const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middleWare))
);

```

here 
- `httpRequestHandler` -  it's a way how you can override HTTP requests to the server, and for example, use some custom logic
- `responseHandler`  - and this will help you to handle response, and trigger some additional logic if something went wrong. (dispatch something for ex.****)

