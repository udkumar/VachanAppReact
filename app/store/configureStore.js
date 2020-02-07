

// import {createStore,combineReducers,applyMiddleware} from 'redux'
// import createSagaMiddleware from 'redux-saga'
// import rootReducer from './reducer/'

// const store = createStore(
//     reducer,
//     applyMiddleware(sagaMiddleware)
//   )
// export default function configureStore(initialState){

//     const sagaMiddleware = createSagaMiddleware()
//     return {
//         ...createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware)),
//         runSaga: sagaMiddleware.run
//     }
// }