import "regenerator-runtime/runtime"

import { Component, PropTypes} from "react"
import { createStore, combineReducers, compose, applyMiddleware } from "redux"
import { ApolloProvider } from "react-apollo"
import thunk from "redux-thunk"
import sagaMiddleware from "redux-saga"

import Global from "../blocks/global"
import { reducers, middlewares, sagas } from "./utilities"
import { syncHistory, routeReducer } from "../store/routing"

// let logger;
// if (process.env.NODE_ENV === "development") {
  // const createLogger = require("redux-logger")
  // logger = createLogger()
// }

const createReduxStore = (initialState, history) => {

  if (initialState) {
    // bug with SSR
    delete initialState.nav
  }


  const joinedReducers = {...reducers, ...{
    routing: routeReducer
  }}

  let convertedSagas = sagas.map((saga) => (saga()))

  let sharedMiddlewares = [...[
    thunk
  ], ...middlewares]

  const reduxRouterMiddleware = syncHistory(history)
  let sharedCompose = [
    applyMiddleware(...sharedMiddlewares, sagaMiddleware(...convertedSagas), reduxRouterMiddleware),
  ]


  if (process.env.NODE_ENV != "production") {
    sharedCompose = [...sharedCompose, ...[
      typeof window === 'object' && typeof window.devToolsExtension !== 'undefined' ? window.devToolsExtension() : f => f
    ]]

  }

  const store = compose(...sharedCompose)(createStore)(combineReducers(joinedReducers), initialState)


  return store

}


// const wrapper = (props) => (
//   <Provider {...props}>
//     <Global>
//       {props.children}
//     </Global>
//   </Provider>
// )
// class wrapper extends Component {
//   render() {
//     return (
//       <Provider {...this.props}>
//         <Global>
//           {this.props.children}
//         </Global>
//       </Provider>
//     )
//   }
// }
const wrapper = ApolloProvider

export {
  wrapper,
  createReduxStore
}