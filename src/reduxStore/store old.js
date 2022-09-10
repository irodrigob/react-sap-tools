import { useMemo } from "react";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import reducers from "./reducers";

let store;

/**
 * Crea la store para poder guardar la información de los distintos estados
 * @param {object} initialState - Estado inicial
 * @returns
 */
function initStore(initialState) {
  return createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}

/**
 * Este paso creo que sirve para crear la store redux
 * @param {object} preloadedState - Estado anterior
 * @returns
 */
export const initializeStore = (preloadedState) => {
  // Crea una tienda local con los valores inicialices del proceso.
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

/**
 *
 * @param {object} initialState - Estados inicial que se le pasará desde el fichro _app.js
 * @returns
 */
export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
