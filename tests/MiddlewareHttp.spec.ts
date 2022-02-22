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
    httpRequestHandler: () => ({
      status: 200,
      json: async () => mockAPIAnswers,
    }),
  }),
];

const store = createStore(rootReducer, applyMiddleware(...middleWare));

test('server result with custom Middleware', async () => {
  const result = await store.dispatch(await loadTodoItemById('1'));
  const state = store.getState().todo;
  const todoState = [...todoInitState.todoItems, mockAPIAnswers.title];

  expect(result.payload).toStrictEqual(mockAPIAnswers);
  expect(state.todoItems).toStrictEqual(todoState);

  store.dispatch(await resetState());

  const resetTest = store.getState().todo;
  expect(resetTest.todoItems).toStrictEqual(todoInitState.todoItems);
});
