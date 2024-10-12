import { createSlice } from '@reduxjs/toolkit'
import { employees } from './employees'

export const employeesSlice = createSlice({
  name: 'employees',
  initialState: employees,
  reducers: {
    add: (state, action) => {
      const lastId = state.at(-1)?.id ?? 0
      state.push({
        id: lastId + 1,
        ...action.payload
      })
    },
    edit: (state, action) => {
      const { id, name, isArchive, role, phone, birthday } = action.payload;
      const existingEmployee = state.find((employee) => employee.id === id);

      if (existingEmployee) {
        existingEmployee.name = name;
        existingEmployee.isArchive = isArchive;
        existingEmployee.role = role;
        existingEmployee.phone = phone;
        existingEmployee.birthday = birthday;
      }
    }
  },
})

export const { add, edit } = employeesSlice.actions

export default employeesSlice.reducer

