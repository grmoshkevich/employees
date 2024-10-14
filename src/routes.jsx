import EmployeeList from './EmployeeList.jsx'
import EditEmployee from './EmployeeEdit.jsx'

const routes = [
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
];

export default routes;