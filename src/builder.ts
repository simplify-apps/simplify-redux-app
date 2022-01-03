import { ActionFun, serverActionFun, SimpleAction } from './types';

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
    (state = initState, action: SimpleAction) =>
      reducers[action.type] ? reducers[action.type](state, action) : state;

  const apiReducer =
    (handlePayload: any) => (state: TInitialState, action: SimpleAction) => {
      return {
        ...state,
        ...(handlePayload ? handlePayload(state, action.payload) : {}),
      };
    };

  const genericReducer =
    (handlePayload: any) => (state: TInitialState, action: SimpleAction) => {
      return {
        ...state,
        ...(handlePayload ? action.updater(state) : {}),
      };
    };

  const getPayload = (values: any[]) => {
    if (!values.length) {
      return {};
    }

    return values.length == 1 ? values[0] : values;
  };

  return {
    getState: state,
    getReducers: () => createReducer(state, reducers),
    createReduxAction: function <FuncType extends ActionFun<TInitialState>>(
      fn: FuncType
    ): (...args: Parameters<FuncType>) => SimpleAction {
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
      FuncType extends serverActionFun<TInitialState>
    >(fn: FuncType): (...args: Parameters<FuncType>) => Promise<TInitialState> {
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
      ) => Promise<TInitialState>;
    },
  };
}
