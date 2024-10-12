import { configureStore } from '@reduxjs/toolkit'
import employeesReducer from './employeesSlice'

export default configureStore({
  reducer: {
    employees: employeesReducer,
  },
})