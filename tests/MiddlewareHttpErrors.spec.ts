import { applyMiddleware, createStore, Dispatch } from 'redux';
import { middlewareBuilder } from '../src';
import {
  todoInitState,
  resetState,
  loadTodoItemById,
  rootReducer,
  addError,
} from './mock';

const errorText = 'caught unexpected error';

// Middleware & stores
const middleWare = [
  middlewareBuilder({
    serverAction: () => ({
      status: 500,
    }),
    httpErrorHandler: async (response: Response, dispatch: Dispatch) => {
      const result = await addError(errorText);
      dispatch(result);

      return response.status == 200;
    },
  }),
];

const store = createStore(rootReducer, applyMiddleware(...middleWare));

test('custom http handler for errors', async () => {
  const result = await store.dispatch(await loadTodoItemById('1'));
  const state = store.getState().todo;
  const todoState = [...todoInitState.todoItems];

  expect(result).toStrictEqual(null);
  expect(state.todoItems).toStrictEqual(todoState);
  expect(state.errors).toStrictEqual([errorText]);

  store.dispatch(await resetState());

  const resetTest = store.getState().todo;
  expect(resetTest.todoItems).toStrictEqual(todoInitState.todoItems);
});
