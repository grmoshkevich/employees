import { createSlice } from '@reduxjs/toolkit'
import { employees } from './employees'

export const employeesSlice = createSlice({
  name: 'employees',
  initialState: employees,
  reducers: {
    add: (state) => {
      state.employees.push({
        "id": 321,
        "name": "Гриша",
        "isArchive": false,
        "role": "driver",
        "phone": "+7 (883) 508-3269",
        "birthday": "12.02.1994"
      },)
    },
  },
})

export const { add } = employeesSlice.actions

export default employeesSlice.reducer

