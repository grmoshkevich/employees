import { useState, useCallback, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { useSelector, useDispatch } from 'react-redux'

const dateComparator = (date1, date2) => {
  const date1Arr = date1.split('.');
  const date1Number = date1 && new Date(+date1Arr[2], date1Arr[1] - 1, +date1Arr[0]).getTime();
  const date2Arr = date2.split('.');
  const date2Number = date2 && new Date(+date2Arr[2], date2Arr[1] - 1, +date2Arr[0]).getTime();
  console.log(date1Arr, date1Number)
  console.log(date2Arr, date2Number)
  if (date1Number == null && date2Number == null) {
    return 0;
  }
  if (date1Number == null) {
    return -1;
  }
  if (date2Number == null) {
    return -1;
  }
  return date1Number - date2Number;
}

const roleMap = {
  'driver': 'Водитель',
  'waiter': 'Официант',
  'cook': 'Повар'
}

function App() {
  const gridRef = useRef();
  const [selectedRole, setSelectedRole] = useState('driver');
  const [status, setStatus] = useState(false);

  const employees = useSelector((state) => state.employees)
  const [rowData, setRowData] = useState(employees);
  const [colDefs, setColDefs] = useState([
    { field: "name", headerName: 'Имя' },
    { field: "role", sortable: false, headerName: 'Должность', valueGetter: p => roleMap[p.data.role] },
    { field: "phone", sortable: false, headerName: 'Телефон' },
    { field: "birthday", comparator: dateComparator, headerName: 'Дата рождения' }
  ]);

  console.log('hi', rowData)

  const externalFilterChanged = useCallback((filter, newValue) => {
    switch (filter) {
      case 'role':
        setSelectedRole(newValue);
        break;
      case 'status':
        setStatus(newValue)
        break;
    }
    gridRef.current.api.onFilterChanged();
  }, []);

  const isExternalFilterPresent = useCallback(() => {
    return selectedRole !== "everyone" || status;
  }, [selectedRole, status]);

  const doesExternalFilterPass = useCallback(
    (node) => {
      if (node.data) {
        console.log(selectedRole, status, node.data)
        return (selectedRole !== "everyone" ? node.data.role === selectedRole : true) && (status ? node.data.isArchive : true);
      }
      return true;
    },
    [selectedRole, status],
  );


  return (
    <>
      <select
        value={selectedRole}
        onChange={e => externalFilterChanged('role', e.target.value)}
      >
        <option value="everyone">Все</option>
        <option value="driver">Водитель</option>
        <option value="waiter">Официант</option>
        <option value="cook">Повар</option>
      </select>
      <label>
        В архиве
        <input type="checkbox" checked={status} onChange={e => externalFilterChanged('status', e.target.checked)} />
      </label>

      <div
        className="ag-theme-quartz" // applying the Data Grid theme
        style={{ height: 500 }} // the Data Grid will fill the size of the parent container
      >

        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
        />
      </div>
    </>
  )
}

export default App
