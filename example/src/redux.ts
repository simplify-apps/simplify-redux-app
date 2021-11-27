import { useSelector, useDispatch } from 'react-redux';
import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose,
  bindActionCreators,
} from 'redux';

import {
  simplifyBuilder,
  middlewareBuilder,
  httpMethod,
} from 'simplify-redux-app';

// type of state
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

// type of the api response
export interface APITodoItemResponse {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
// example of web request for redux
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

// example of custom hook
export const useTodo = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: any) => state.todo) as ITodoState;

  return {
    ...state,
    ...bindActionCreators(
      {
        addTodoItem,
        loadTodoItemById,
      },
      dispatch
    ),
  };
};

// custom middleware for web requests
const middleWare = [
  middlewareBuilder({
    serverAction: async (httpMethod: httpMethod, url: string, body: any) => {
      const data = await fetch(url, {
        method: httpMethod,
        body: body && httpMethod !== 'GET' ? body : null,
      });

      return data.json();
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
