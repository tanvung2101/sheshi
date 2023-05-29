import { combineReducers, configureStore } from '@reduxjs/toolkit';
import cartItemSlice from './redux/cartItemSlice';
import logger from 'redux-logger'


const reducer = combineReducers({
    cartItem: cartItemSlice
})


const loggerMiddleware = (store) => (next) => (action) => {
    // your code here
    // console.log(action)
    console.log(store)
    // action.payload = 10
    next(action)
}
export const store = configureStore({
  reducer: reducer,
  middleware: (gDM) => gDM().concat(logger,loggerMiddleware)
})