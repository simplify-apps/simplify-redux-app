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

  const apiReducer =
    (handlePayload: any) =>
    (state: TInitialState, action: SimpleAction<TInitialState, any>) => {
      return {
        ...state,
        ...(handlePayload ? handlePayload(state, action.payload) : {}),
      };
    };

  const genericReducer =
    (handlePayload: any) =>
    (state: TInitialState, action: SimpleAction<TInitialState, any>) => {
      return {
        ...state,
        ...(handlePayload ? action.updater(state) : {}),
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

        updateReducers({ [model.name]: genericReducer(model.updater) });

        return (...args: any[]): any => {
          const data = fn(...args);

          return {
            name: model.name,
            type: model.name,
            updater: data.updater,
            payload: getPayload(args),
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
        updateReducers({ [model.name]: apiReducer(model.updater) });

        return (...args: any[]) => {
          const data = fn(...args);

          return {
            name: data.name,
            url: data.url,
            body: data.body,
            payload: getPayload(args),
            method: data.method,
          };
        };
      };

      return actionFactory() as any as (
        ...args: Parameters<FuncType>
      ) => Promise<SimpleAction<TInitialState, TPayload>>;
    },
  };
}
