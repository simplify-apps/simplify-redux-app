import {
  addTodoItem,
  store,
  todoInitState,
  resetState,
  loadTodoItemById,
  mockAPIAnswers,
  ADD_NEW_ITEM_NAME,
} from './mock';

beforeAll(() => {
  //@ts-ignore todo: fix typing for mock
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockAPIAnswers),
    })
  );
});

test('store default state', () => {
  const todoState = store.getState().todo;

  expect(todoState.todoItems).toStrictEqual(todoInitState.todoItems);
});

test('action tests', () => {
  const { title } = mockAPIAnswers;
  store.dispatch(addTodoItem(title));

  const todoState = [...todoInitState.todoItems, title];
  const currentState = store.getState();

  expect(todoState).toStrictEqual(currentState.todo.todoItems);
  store.dispatch(resetState());

  const resetTest = store.getState().todo;
  expect(resetTest.todoItems).toStrictEqual(todoInitState.todoItems);
});

test('action result', () => {
  const newItem = 'test item';
  const action = addTodoItem(newItem);
  const actionName = ADD_NEW_ITEM_NAME;

  expect(action.payload).toEqual(newItem);
  expect(action.name).toEqual(actionName);
});

test('server result', async () => {
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
