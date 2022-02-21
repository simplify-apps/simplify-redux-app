import { applyMiddleware, createStore } from "redux";
import { middlewareBuilder } from "../src";
import {
  todoInitState,
  resetState,
  loadTodoItemById,
  rootReducer,
} from "./mock";

// Middleware & stores
const middleWare = [
  middlewareBuilder({
    serverAction: () => ({
      status: 500,
    }),
    httpErrorHandler: (response: Response) => response.status == 200,
  }),
];

const store = createStore(rootReducer, applyMiddleware(...middleWare));

test("custom http handler for errors", async () => {
  const result = await store.dispatch(await loadTodoItemById("1"));
  const state = store.getState().todo;
  const todoState = [...todoInitState.todoItems];

  expect(result).toStrictEqual(null);
  expect(state.todoItems).toStrictEqual(todoState);

  store.dispatch(await resetState());

  const resetTest = store.getState().todo;
  expect(resetTest.todoItems).toStrictEqual(todoInitState.todoItems);
});
