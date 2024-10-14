import { expect, test } from 'vitest'
import { renderWithProviders } from './test-utils'
import EmployeeList from './EmployeeList'
import { waitForElementToBeRemoved, within, screen, fireEvent } from '@testing-library/react'

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3)
})

test('fetches & receives a user after clicking the fetch user button', async () => {
  const initialEmployees = [{
    "id": 16,
    "name": "Прасковья Кондратьева",
    "isArchive": true,
    "role": "cook",
    "phone": "+7 (875) 517-3873",
    "birthday": "07.06.1983"
  },
  {
    "id": 17,
    "name": "Евдокия Филиппова",
    "isArchive": false,
    "role": "waiter",
    "phone": "+7 (877) 450-3253",
    "birthday": "03.12.1994"
  }]

  renderWithProviders({ initialEntries: ["/employees"], preloadedState: { employees: initialEmployees } });

  // check initial list

  expect(screen.getByText('Сотрудники')).toBeInTheDocument()

  let row;
  // row of Прасковья Кондратьева
  row = screen.getByText('Прасковья Кондратьева').closest('.ag-row')
  expect(row).toBeInTheDocument()
  expect(within(row).getByText('Повар')).toBeInTheDocument()
  expect(within(row).getByText('+7 (875) 517-3873')).toBeInTheDocument()
  // row of Евдокия Филиппова
  row = screen.getByText('Евдокия Филиппова').closest('.ag-row')
  expect(row).toBeInTheDocument()
  expect(within(row).getByText('+7 (877) 450-3253')).toBeInTheDocument()
  expect(within(row).getByText('Официант')).toBeInTheDocument()

  // check that it doesn't show non-archive employees
  fireEvent.click(screen.getByLabelText('В архиве:'))
  await waitForElementToBeRemoved(() => screen.queryByText('Евдокия Филиппова'))
  expect(screen.getByText('Прасковья Кондратьева')).toBeInTheDocument();

  // add a new employee
  fireEvent.click(screen.getByRole('button', { name: 'Добавить сотрудника' }))
  expect(screen.getByText('Добавление нового сотрудника')).toBeInTheDocument()

  // attempt to save and check for error messages
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить данные сотрудника' }))
  expect(screen.getByText('Имя сотрудника обязательно.')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Имя сотрудника:'), {target: {value: 'Иван Иванов'}})

  fireEvent.click(screen.getByRole('button', { name: 'Сохранить данные сотрудника' }))
  expect(screen.getByText('Введите корректный номер телефона.')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Телефон:'), {target: {value: '+7 (875) 512-3123'}})

  fireEvent.click(screen.getByRole('button', { name: 'Сохранить данные сотрудника' }))
  expect(screen.getByText('Введите дату рождения в формате ДД.ММ.ГГГГ.')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Дата рождения:'), {target: {value: '22.11.1994'}})

  fireEvent.change(screen.getByLabelText('Должность:'), {target: {value: 'driver'}})
  fireEvent.click(screen.getByLabelText('В архиве:'))
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить данные сотрудника' }))

  // check to see if employee list is updated properly
  expect(screen.getByText('Сотрудники')).toBeInTheDocument()

  fireEvent.change(screen.getByLabelText('Должность:'), {target: {value: 'driver'}})
  fireEvent.click(screen.getByLabelText('В архиве:'))
  await waitForElementToBeRemoved(() => screen.queryByText('Евдокия Филиппова'))

  expect(screen.queryByText('Евдокия Филиппова')).not.toBeInTheDocument()
  expect(screen.queryByText('Прасковья Кондратьева')).not.toBeInTheDocument()
  row = screen.getByText('Иван Иванов').closest('.ag-row')
  expect(row).toBeInTheDocument()
  expect(within(row).getByText('+7 (875) 512-3123')).toBeInTheDocument()
  expect(within(row).getByText('22.11.1994')).toBeInTheDocument()

})