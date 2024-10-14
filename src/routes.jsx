import EmployeeList from './EmployeeList.jsx'
import EditEmployee from './EmployeeEdit.jsx'
import NotFoundPage from './NotFoundPage.jsx';

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
    }, {
        path: "*",
        element: <NotFoundPage />
    }
];

export default routes;