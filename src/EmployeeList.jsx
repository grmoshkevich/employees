import { useState, useCallback, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './EmployeeList.scss'
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { roleMap } from './utils';

const parseDate = (date) => {
  if (!date) return NaN; // Handle falsy inputs
  const [day, month, year] = date.split('.');
  return new Date(year, month - 1, day).getTime();
};

const dateComparator = (date1, date2) => {
  const date1Number = parseDate(date1);
  const date2Number = parseDate(date2);

  if (isNaN(date1Number) && isNaN(date2Number)) {
    return 0; // Both dates are invalid or null
  }
  if (isNaN(date1Number)) {
    return -1; // date1 is invalid
  }
  if (isNaN(date2Number)) {
    return 1; // date2 is invalid
  }
  return date1Number - date2Number;
};

function EmployeeList() {
  const navigate = useNavigate();
  const gridRef = useRef();
  const [selectedRole, setSelectedRole] = useState('everyone');
  const [status, setStatus] = useState(false);

  const employees = useSelector((state) => state.employees)
  console.log('hey', employees)
  const [rowData, setRowData] = useState(employees);
  useEffect(() => {
    setRowData(employees)
  }, [employees]);
  const [colDefs, setColDefs] = useState([
    { field: "name", headerName: 'Имя', minWidth: 200 },
    { field: "role", sortable: false, headerName: 'Должность', valueGetter: p => roleMap[p.data.role], minWidth: 200 },
    { field: "phone", sortable: false, headerName: 'Телефон', minWidth: 200 },
    { field: "birthday", comparator: dateComparator, headerName: 'Дата рождения', minWidth: 200 }
  ]);

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
        return (selectedRole !== "everyone" ? node.data.role === selectedRole : true) && (status ? node.data.isArchive : true);
      }
      return true;
    },
    [selectedRole, status],
  );

  const onRowClicked = (event) => {
    const employeeId = event.data.id;
    navigate(`/employees/edit/${employeeId}`);
  };

  const handleAddNew = () => {
    console.log('hei')
    navigate('/employees/new');
  };
  const onGridReady = useCallback((params) => {
    params.api.sizeColumnsToFit(); // Automatically resize columns
  }, []);

  const [domLayout, setDomLayout] = useState('normal'); // Высота таблицы
  useEffect(() => {
    const displayedRowsCount = gridRef.current.api?.getDisplayedRowCount()
    console.log('displayedRowsCount', displayedRowsCount)
    if (displayedRowsCount < 10) {
      setDomLayout("autoHeight");
    }
    else {
      setDomLayout("normal");
    }
  }, [doesExternalFilterPass]);


  return (
    <div className="list-container">
      <h1>Сотрудники</h1>
      <button onClick={handleAddNew}>Добавить сотрудника</button>
      <div className="filter">

        <div>
          <label htmlFor="role">Должность:</label>
          <select
            id="role"
            value={selectedRole}
            onChange={e => externalFilterChanged('role', e.target.value)}
          >
            <option value="everyone">Все</option>
            <option value="driver">Водитель</option>
            <option value="waiter">Официант</option>
            <option value="cook">Повар</option>
          </select>
        </div>
        <div>
          <label htmlFor="isArchive">В архиве:
          </label>
          <input
            type="checkbox"
            id="isArchive"
            name="isArchive"
            checked={status}
            onChange={e => externalFilterChanged('status', e.target.checked)}
          />
        </div>
      </div>
      <div
        className="ag-theme-quartz"
        style={{ height: 500, maxWidth: 1000, margin: "0.5rem 0" }}
      >

        <AgGridReact
          ref={gridRef}
          rowClass="grid-row"
          rowData={rowData}
          columnDefs={colDefs}
          isExternalFilterPresent={isExternalFilterPresent}
          doesExternalFilterPass={doesExternalFilterPass}
          onRowClicked={onRowClicked}
          onGridReady={onGridReady}
          domLayout={domLayout}
        />
      </div>
    </div>
  )
}

export default EmployeeList
