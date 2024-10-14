import { render, screen, within } from '@testing-library/react'
import { expect} from 'vitest'
import { Provider } from 'react-redux'
import { setupStore } from './store'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import routes from './routes'
import { roleMap } from './utils'

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


export function checkEmployeeRow(employee, toBeInTheDocument = true) {
  if (!employee) return;
  const { name, phone, role, birthday } = employee;
  const nameCell = screen.queryByText(name);
  if (!toBeInTheDocument) return expect(nameCell).not.toBeInTheDocument()
  expect(nameCell).toBeInTheDocument()
  const row = nameCell.closest('.ag-row')
  expect(within(row).getByText(roleMap[role])).toBeInTheDocument()
  expect(within(row).getByText(phone)).toBeInTheDocument()
  expect(within(row).getByText(birthday)).toBeInTheDocument()
}