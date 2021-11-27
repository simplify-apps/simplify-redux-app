import { applyMiddleware, createStore } from 'redux';
import { middlewareBuilder } from '../src';
import {
  todoInitState,
  resetState,
  loadTodoItemById,
  mockAPIAnswers,
  rootReducer,
} from './mock';

// Middleware & stores
const middleWare = [
  middlewareBuilder({
    serverAction: () => mockAPIAnswers,
  }),
];

const store = createStore(rootReducer, applyMiddleware(...middleWare));

test('server result with custom Middleware', async () => {
  //@ts-ignore fix typing for dispatch async methods
  const result = await store.dispatch(loadTodoItemById('1'));
  const state = store.getState().todo;
  const todoState = [...todoInitState.todoItems, mockAPIAnswers.title];

  expect(result.payload).toStrictEqual(mockAPIAnswers);
  expect(state.todoItems).toStrictEqual(todoState);

  store.dispatch(resetState());

  const resetTest = store.getState().todo;
  expect(resetTest.todoItems).toStrictEqual(todoInitState.todoItems);
});
