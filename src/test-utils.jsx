import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { setupStore } from './store'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import routes from './routes'

export function renderWithProviders({ initialEntries = ['/'], preloadedState = {}, store = setupStore(preloadedState) }) {
  // Create the memory router using the provided initial route entries
  const router = createMemoryRouter(routes, { initialEntries });

  // Render the RouterProvider directly with the store
  return {
    store,
    ...render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    ),
  };
}
