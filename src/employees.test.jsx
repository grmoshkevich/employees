import { expect, test } from 'vitest'
import { renderWithProviders, checkEmployeeRow } from './test-utils'
import { waitFor, waitForElementToBeRemoved, screen, fireEvent } from '@testing-library/react'

const archiveEmployee = {
  "id": 16,
  "name": "Прасковья Кондратьева",
  "isArchive": true,
  "role": "cook",
  "phone": "+7 (875) 517-3873",
  "birthday": "07.06.1983"
};
const nonArchiveEmployee = {
  "id": 17,
  "name": "Евдокия Филиппова",
  "isArchive": false,
  "role": "waiter",
  "phone": "+7 (877) 450-3253",
  "birthday": "03.12.1994"
}
const initialEmployees = [archiveEmployee, nonArchiveEmployee];

test('shows initial employees on the /employees page + filtering works', async () => {

  renderWithProviders({ initialEntries: ["/employees"], preloadedState: { employees: initialEmployees } });

  // check initial list
  expect(screen.getByText('Сотрудники')).toBeInTheDocument()

  for (const employee of initialEmployees) {
    checkEmployeeRow(employee)
  }

  // check that it doesn't show non-archive employees
  fireEvent.click(screen.getByLabelText('В архиве:'))
  await waitForElementToBeRemoved(() => screen.queryByText(nonArchiveEmployee.name))
  checkEmployeeRow(archiveEmployee)
});

test('the add new employee button works + adding works and is reflected on the /employees page (with filtering) after save', async () => {
  renderWithProviders({ initialEntries: ["/employees"], preloadedState: { employees: initialEmployees } });

  // check initial list
  expect(screen.getByText('Сотрудники')).toBeInTheDocument()

  for (const employee of initialEmployees) {
    checkEmployeeRow(employee)
  }

  // check that it doesn't show non-archive employees
  fireEvent.click(screen.getByLabelText('В архиве:'))
  await waitForElementToBeRemoved(() => screen.queryByText(nonArchiveEmployee.name))
  checkEmployeeRow(archiveEmployee)

  // add a new employee
  fireEvent.click(screen.getByRole('button', { name: 'Добавить сотрудника' }))
  expect(screen.getByText('Добавление нового сотрудника')).toBeInTheDocument()

  const newArchiveDriverEmployee = {
    "id": 18,
    "name": "Иван Иванов",
    "isArchive": true,
    "role": "driver",
    "phone": "+7 (875) 512-3123",
    "birthday": "22.11.1994"
  }

  const saveButton = screen.getByRole('button', { name: 'Сохранить данные сотрудника' })
  // attempt to save and check for error messages
  fireEvent.click(saveButton)
  expect(screen.getByText('Имя сотрудника обязательно.')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Имя сотрудника:'), { target: { value: newArchiveDriverEmployee.name } })
  fireEvent.click(saveButton)

  expect(screen.getByText('Введите корректный номер телефона.')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Телефон:'), { target: { value: newArchiveDriverEmployee.phone.slice(0, -2) + '__' } })
  fireEvent.click(saveButton)

  expect(screen.getByText('Введите корректный номер телефона.')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Телефон:'), { target: { value: newArchiveDriverEmployee.phone } })
  fireEvent.click(saveButton)

  expect(screen.getByText('Введите дату рождения в формате ДД.ММ.ГГГГ.')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Дата рождения:'), { target: { value: newArchiveDriverEmployee.birthday.slice(0, -4) + '____' } })
  fireEvent.click(saveButton)

  expect(screen.getByText('Введите дату рождения в формате ДД.ММ.ГГГГ.')).toBeInTheDocument()
  fireEvent.change(screen.getByLabelText('Дата рождения:'), { target: { value: newArchiveDriverEmployee.birthday } })
  fireEvent.click(saveButton)

  fireEvent.change(screen.getByLabelText('Должность:'), { target: { value: newArchiveDriverEmployee.role } })
  if (newArchiveDriverEmployee.isArchive) fireEvent.click(screen.getByLabelText('В архиве:'))

  fireEvent.click(saveButton)

  // check to see if employee list is updated properly
  expect(screen.getByText('Сотрудники')).toBeInTheDocument()

  fireEvent.click(screen.getByLabelText('В архиве:'))
  checkEmployeeRow(nonArchiveEmployee, nonArchiveEmployee.isArchive)
  checkEmployeeRow(archiveEmployee, archiveEmployee.isArchive)
  checkEmployeeRow(newArchiveDriverEmployee)
})

test('shows inidividual employee data in the editing page', async () => {
  renderWithProviders({ initialEntries: ["/employees"], preloadedState: { employees: initialEmployees } });

  fireEvent.click(screen.getByText(nonArchiveEmployee.name));
  await waitFor(() => {
    expect(screen.getByText('Изменение данных сотрудника')).toBeInTheDocument()
    expect(screen.getByDisplayValue(nonArchiveEmployee.name)).toBeInTheDocument()
  });

  expect(screen.getByLabelText('Имя сотрудника:').value).toBe(nonArchiveEmployee.name)
  expect(screen.getByLabelText('Телефон:').value).toBe(nonArchiveEmployee.phone)
  expect(screen.getByLabelText('Дата рождения:').value).toBe(nonArchiveEmployee.birthday)
  expect(screen.getByLabelText('Должность:').value).toBe(nonArchiveEmployee.role)
  expect(screen.getByLabelText('В архиве:').checked).toBe(nonArchiveEmployee.isArchive)
});

test(('edit page routing by id works + employee data changes are reflected in the /employees list'), async () => {
  renderWithProviders({ initialEntries: ["/employees/edit/" + nonArchiveEmployee.id], preloadedState: { employees: initialEmployees } });
  expect(screen.getByLabelText('Имя сотрудника:').value).toBe(nonArchiveEmployee.name)

  const newName = 'Мария Иванова';
  fireEvent.change(screen.getByLabelText('Имя сотрудника:'), { target: { value: newName } })
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить данные сотрудника' }));

  expect(screen.getByText('Сотрудники')).toBeInTheDocument()
  checkEmployeeRow(nonArchiveEmployee, false)
  checkEmployeeRow({ ...nonArchiveEmployee, name: newName })
})