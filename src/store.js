import { combineReducers, configureStore } from '@reduxjs/toolkit'
import employeesReducer from './employeesSlice'

const rootReducer = combineReducers({
  employees: employeesReducer
})

export function setupStore(preloadedState) {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}

