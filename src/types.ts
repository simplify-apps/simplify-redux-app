import { AnyAction, Dispatch } from 'redux';

/**
 * HTTP enum defines a set of request methods to indicate the desired action to be performed for a given resource.
 *
 */
export enum httpMethod {
  /**
   * The `GET` method requests a representation of the specified resource. Requests using GET should only retrieve data.
   */
  get = 'GET',

  /**
   * The `POST` method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
   */
  post = 'POST',

  /**
   * The `PATCH` method is used to apply partial modifications to a resource.
   */
  put = 'PUT',

  /**
   * The `PATCH` method is used to apply partial modifications to a resource.
   */
  patch = 'PATCH',

  /**
   * The `DELETE` method deletes the specified resource.
   */
  delete = 'DELETE',

  /**
   * The `HEAD` method asks for a response identical to that of a GET request, but without the response body.
   */
  head = 'HEAD',

  /**
   * The `OPTIONS` method is used to describe the communication options for the target resource.
   */
  options = 'OPTIONS',

  /**
   * The `TRACE` method performs a message loop-back test along the path to the target resource.
   */
  trace = 'TRACE',

  /**
   * The `CONNECT` method establishes a tunnel to the server identified by the target resource.
   */
  connect = 'CONNECT',
}

/**
 * The interface for simplifying action creation and server interaction.
 * After the HTTP request will be done by a specific URL, the response will be used in updating the store.
 */
export interface ReduxServerAction<TInitialState, TPayload> {
  /**
   * The name which will be used for action name
   */
  name: string;

  /**
   * The URL where will be send request
   */
  url: string;

  /**
   * The HTTP method which  will be used for HTTP request
   */
  method: httpMethod;

  /**
   * The body request which  will be used in the HTTP request
   */
  body?: any;

  /**
   * The method which will be used for the store updating after successful server response
   */
  updater: (state: TInitialState, payload: TPayload) => TInitialState;
}

export interface SimpleAction<TState, TPayload> extends AnyAction {
  /**
   * The payload which will be used in the middleware
   */
  payload: TPayload;

  /**
   * The type name which will be used in the middleware
   */
  type: string;

  /**
   * The state updater which will be used in the middleware
   */
  updater: (...args: any) => TState;
}

export type ActionFun<TState> = (...args: any) => ReduxAction<TState>;

/**
 * The interface for simplifying action creation.
 */
export interface ReduxAction<TInitialState> {
  /**
   * The name which will be used for action name
   */
  name: string;

  /**
   * The method which will be used for the store updating after successful server response
   */
  updater: (state: TInitialState) => TInitialState;
}

/**
 * Default type for the server action
 */
export type ServerActionFun<TInitialState, TPayload> = (
  ...args: any
) => ReduxServerAction<TInitialState, TPayload>;

/**
 * The options which will be used in the custom middleware
 */
export interface BuilderOptions {
  /**
   * @param httpMethod - The HTTP method for HTTP request
   * @param url - The URL where will be send request
   * @param body - The body request which  will be used in the HTTP request
   *
   * @returns {Object} The response which will be used in the store update
   */
  serverAction?: (httpMethod: httpMethod, url: string, body: any) => any;

  /**
   * @param response - result of HTTP response from the middleware
   *
   * @returns {boolean} - show whether action should be dispatched or not
   */
  httpErrorHandler?: (
    response: Response,
    dispatch: Dispatch
  ) => Promise<boolean>;
}
