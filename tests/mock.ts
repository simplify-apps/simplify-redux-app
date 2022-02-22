import { combineReducers, createStore, applyMiddleware } from 'redux';
import { simplifyBuilder, middlewareBuilder, httpMethod } from '../src/index';

export interface ITodoState {
  todoItems: string[];
  errors: string[];
}

export const todoInitState: ITodoState = {
  todoItems: ['firstItem', 'secondItem'],
  errors: [],
};

export interface APITodoItemResponse {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

// mocks
export const mockAPIAnswers = {
  userId: 1,
  id: 1,
  title: 'delectus aut autem',
  completed: false,
};

const builder = simplifyBuilder(todoInitState, {});

// simple action
export const ADD_NEW_ITEM_NAME = 'ADD_TODO_ITEM';
export const addTodoItem = builder.createReduxAction((test: string) => ({
  name: ADD_NEW_ITEM_NAME,
  updater: (state) => ({
    ...state,
    todoItems: [...state.todoItems, test],
  }),
}));

export interface ITodo {
  first: string;
  second: string;
}

export const ADD_NEW_ITEM_FROM_OBJECT = 'ADD_NEW_ITEM_FROM_OBJECT';
export const addTodoObject = builder.createReduxAction((data: ITodo) => ({
  name: ADD_NEW_ITEM_FROM_OBJECT,
  updater: (state) => ({
    ...state,
    todoItems: [...state.todoItems, data.first, data.second],
  }),
}));

export const ADD_TODO_TWO_ITEM = 'ADD_TODO_TWO_ITEM';
export const addTwoTodoItem = builder.createReduxAction(
  (fist: string, second: string) => ({
    name: ADD_TODO_TWO_ITEM,
    updater: (state) => ({
      ...state,
      todoItems: [...state.todoItems, fist, second],
    }),
  })
);

export const resetState = builder.createReduxAction(() => ({
  name: 'RESEAT_STATE',
  updater: (state) => ({
    ...state,
    todoItems: todoInitState.todoItems,
    errors: [],
  }),
}));

// rest api action
export const LOAD_TODO_ITEM_BY_ID = 'ADD_ITEM_FROM_WEB_REQUEST';
export const loadTodoItemById = builder.createServerAction((id: string) => ({
  name: LOAD_TODO_ITEM_BY_ID,
  url: 'https://jsonplaceholder.typicode.com/todos/' + id,
  method: httpMethod.get,
  updater: (state, payload: APITodoItemResponse) => ({
    ...state,
    todoItems: [...state.todoItems, payload.title],
  }),
}));

export const addError = builder.createReduxAction((error: string) => ({
  name: 'ADD_ERROR',
  updater: (state) => ({
    ...state,
    errors: [...state.errors, error],
  }),
}));

// reducers
export const rootReducer = combineReducers({
  todo: builder.getReducers(),
});

export const store = createStore(
  rootReducer,
  applyMiddleware(middlewareBuilder())
);
