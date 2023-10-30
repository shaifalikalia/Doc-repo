import { applyMiddleware, createStore, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware as createRouterMiddleware } from "connected-react-router";
import reducer from "../reducers/reducer";
import rootSaga from "../sagas";

const store = (history) => {
  const sagaMiddleware = createSagaMiddleware();
  const routerMiddleware = createRouterMiddleware(history);
  const configStore = createStore(
    reducer(history),
    compose(
      applyMiddleware(routerMiddleware, sagaMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : (f) => f
    )
  );

  sagaMiddleware.run(rootSaga);

  return configStore;
};

export default store;
