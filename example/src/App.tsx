import { useTodo } from './redux';
import { useRef } from 'react';

const App = () => {
  const { items, addTodoItem, loadTodoItemById } = useTodo();

  const todoInput = useRef<HTMLInputElement>(null);
  const todoIdInput = useRef<HTMLInputElement>(null);

  const onSubmit = () => {
    const todoItemValue = todoInput?.current?.value;
    if (todoItemValue) {
      addTodoItem(todoItemValue);
    }
  };

  const sendRequest = async () => {
    const todoItemId = todoIdInput?.current?.value;
    if (todoItemId) {
      loadTodoItemById(todoItemId);
    }
  };

  return (
    <div className="App">
      <div className="Todo-header">
        <h2>Todo list:</h2>

        <div className="Todo-elements">
          <input ref={todoInput} type="text" name="todo" />
          <button type="submit" onClick={onSubmit}>
            Add todo
          </button>
        </div>

        <div className="Todo-elements">
          <input ref={todoIdInput} type="number" defaultValue="1" name="todo" />
          <button type="submit" onClick={sendRequest}>
            Load item
          </button>
        </div>
      </div>

      <div className="Todo-list">
        {items &&
          items.map((it: string, index: number) => (
            <p key={index} className="Todo-item">
              {it}
            </p>
          ))}
      </div>
    </div>
  );
};

export default App;
