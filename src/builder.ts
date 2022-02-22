import { ActionFun, ServerActionFun, SimpleAction } from './types';

export function simplifyBuilder<TInitialState, TInitialReducers>(
  initialState: TInitialState,
  initialReducers: TInitialReducers
) {
  let state = initialState;
  let reducers = initialReducers;

  const updateReducers = (apiReducers: any) => {
    reducers = { ...reducers, ...apiReducers };
  };

  const createReducer =
    (initState: TInitialState, reducers: TInitialReducers) =>
    (state = initState, action: SimpleAction<TInitialState, any>) =>
      reducers[action.type] ? reducers[action.type](state, action) : state;

  const genericReducer =
    () => (state: TInitialState, action: SimpleAction<TInitialState, any>) => {
      return {
        ...state,
        ...(action.updater ? action.updater(state, action.payload) : {}),
      };
    };

  const getPayload = (values: any[]) => (!values.length ? {} : values);

  return {
    getState: state,
    getReducers: () => createReducer(state, reducers),
    createReduxAction: function <FuncType extends ActionFun<TInitialState>>(
      fn: FuncType
    ): (
      ...args: Parameters<FuncType>
    ) => Promise<SimpleAction<TInitialState, Parameters<FuncType>>> {
      const actionFactory = (...args: any[]): any => {
        const model = fn(...Array.from(args));

        updateReducers({ [model.name]: genericReducer() });

        return (...args: any[]): any => {
          const data = fn(...args);

          return {
            name: model.name,
            type: model.name,
            updater: data.updater,
            payload: getPayload(args),
            toString: () => model.name,
          };
        };
      };

      return actionFactory();
    },
    createServerAction: function <
      FuncType extends ServerActionFun<TInitialState, TPayload>,
      TPayload
    >(
      fn: FuncType
    ): (
      ...args: Parameters<FuncType>
    ) => Promise<SimpleAction<TInitialState, TPayload>> {
      const actionFactory = (...args: any[]) => {
        const model = fn(...Array.from(args));
        updateReducers({ [model.name]: genericReducer() });

        return (...args: any[]) => {
          const data = fn(...args);

          return {
            name: data.name,
            url: data.url,
            body: data.body,
            updater: data.updater,
            payload: getPayload(args),
            method: data.method,
            toString: () => model.name,
          };
        };
      };

      return actionFactory() as any as (
        ...args: Parameters<FuncType>
      ) => Promise<SimpleAction<TInitialState, TPayload>>;
    },
  };
}
