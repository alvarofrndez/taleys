import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import authReducer from './authSlice'
import toastReducer from './toastSlice'
import modalRefucer from './modalSlice'
import { modalMiddleware } from './modalMiddleware'

const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
  modal: modalRefucer
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(modalMiddleware),
})

export default store