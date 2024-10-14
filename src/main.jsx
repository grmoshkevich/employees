import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { setupStore } from './store'
import { Provider } from 'react-redux'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import routes from './routes'

export const router = createBrowserRouter(routes);

const store = setupStore();

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
)
