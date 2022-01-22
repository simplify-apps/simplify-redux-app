import {
  addTodoItem,
  store,
  todoInitState,
  resetState,
  loadTodoItemById,
  mockAPIAnswers,
  addTwoTodoItem,
  addTodoObject,
  ADD_NEW_ITEM_NAME,
  ADD_TODO_TWO_ITEM,
  ADD_NEW_ITEM_FROM_OBJECT,
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

test('action tests', async () => {
  const { title } = mockAPIAnswers;
  const result = await addTodoItem(title);
  store.dispatch(result);
  expect(result.payload.length).toBe(1);

  const todoState = [...todoInitState.todoItems, title];
  const currentState = store.getState();

  expect(todoState).toStrictEqual(currentState.todo.todoItems);
  store.dispatch(await resetState());

  const resetTest = store.getState().todo;
  expect(resetTest.todoItems).toStrictEqual(todoInitState.todoItems);
});

test('action result', async () => {
  const newItem = 'test item';
  const action = await addTodoItem(newItem);

  expect(action.payload.length).toEqual(1);
  expect(action.payload[0]).toEqual(newItem);
  expect(action.name).toEqual(ADD_NEW_ITEM_NAME);
});

test('add two todo item', async () => {
  const firstItem = 'first item';
  const secondItem = 'second item';

  const action = await addTwoTodoItem(firstItem, secondItem);

  expect(action.payload.length).toEqual(2);
  expect(action.payload[0]).toEqual(firstItem);
  expect(action.payload[1]).toEqual(secondItem);
  expect(action.name).toEqual(ADD_TODO_TWO_ITEM);
});

test('add two todo item via object', async () => {
  const firstItem = 'first item';
  const secondItem = 'second item';

  const action = await addTodoObject({ first: firstItem, second: secondItem });

  expect(action.payload.length).toEqual(1);
  expect(action.payload[0].first).toEqual(firstItem);
  expect(action.payload[0].second).toEqual(secondItem);
  expect(action.name).toEqual(ADD_NEW_ITEM_FROM_OBJECT);
});

test('action todo items state test', async () => {
  const firstItem = 'first item';
  const secondItem = 'second item';

  const result = await addTwoTodoItem(firstItem, secondItem);

  store.dispatch(result);
  expect(result.payload.length).toBe(2);

  const todoState = [...todoInitState.todoItems, firstItem, secondItem];
  const currentState = store.getState();

  expect(todoState).toStrictEqual(currentState.todo.todoItems);
  store.dispatch(await resetState());

  const resetTest = store.getState().todo;
  expect(resetTest.todoItems).toStrictEqual(todoInitState.todoItems);
});

test('server result', async () => {
  const result = await store.dispatch(await loadTodoItemById('1'));
  const state = store.getState().todo;
  const todoState = [...todoInitState.todoItems, mockAPIAnswers.title];

  expect(result.payload).toStrictEqual(mockAPIAnswers);
  expect(state.todoItems).toStrictEqual(todoState);

  store.dispatch(await resetState());

  const resetTest = store.getState().todo;
  expect(resetTest.todoItems).toStrictEqual(todoInitState.todoItems);
});
