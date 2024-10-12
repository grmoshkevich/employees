import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import EmployeeList from './EmployeeList.jsx'
import './index.css'
import store from './store'
import { Provider } from 'react-redux'
import EditEmployee from './EmployeeEdit.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/employees",
    element: <EmployeeList />
  }, {
    path: "/employees/new",
    element: <EditEmployee />
  }, {
    path: "/employees/edit/:id",
    element: <EditEmployee />
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
)
