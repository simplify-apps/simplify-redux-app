import { AnyAction, Dispatch, MiddlewareAPI } from "redux";
import { BuilderOptions } from "./types";

export function middlewareBuilder(options?: BuilderOptions) {
  const simplifyReactMiddleware =
    ({ dispatch }: MiddlewareAPI<any>) =>
    (next: Dispatch<AnyAction>) =>
    async (action: AnyAction) => {
      if (!action.name) {
        return next(action);
      }

      if (!action.url) {
        const simpleAction = {
          type: action.name,
          payload: action.payload,
          updater: action.updater,
        };

        dispatch(simpleAction);

        return simpleAction;
      }

      const response = options?.serverAction
        ? await options.serverAction(action.method, action.url, action.body)
        : await fetch(action.url, {
            method: action.method,
            body: action.body && action.method !== "GET" ? action.body : null,
          });

      const data = options?.serverAction
        ? await response
        : await response.json();

      const shouldDispatch = options?.httpErrorHandler
        ? options.httpErrorHandler(response, dispatch)
        : true;

      if (!shouldDispatch) {
        return null;
      }

      const serverAction = {
        type: action.name,
        payload: data,
      };

      dispatch(serverAction);

      return serverAction;
    };

  return simplifyReactMiddleware;
}
