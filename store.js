import { combineReducers, configureStore } from '@reduxjs/toolkit';
import cartItemSlice from './redux/cartItemSlice';
import logger from 'redux-logger'

import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import accountSlice from './redux/accountSlice';



const reducer = combineReducers({
  cartItem: cartItemSlice,
  account: accountSlice
})


const loggerMiddleware = (store) => (next) => (action) => {
  // your code here
  // console.log(action)
  console.log(store)
  // action.payload = 10
  next(action)
}

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  // middleware: [thunk],
  middleware: (gDM) => gDM().concat(logger, loggerMiddleware)
})