import { useState, useEffect } from "react";

// Masked input libraries
import InputMask from "@mona-health/react-input-mask";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import { add, edit } from "./employeesSlice"; // Import the add action from employeesSlice
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'; // For routing
import './EmployeeEdit.scss'

const EmployeeEdit = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employee = useSelector((state) =>
    state.employees.find((employee) => employee.id === parseInt(id))
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthday: "",
    role: "driver",
    isArchive: false,
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee); // Pre-fill form if editing
    }
  }, [employee]);

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Имя сотрудника обязательно.";
    }

    // Phone validation (if not matching mask format)
    if (!formData.phone || formData.phone.includes("_")) {
      newErrors.phone = "Введите корректный номер телефона.";
    }

    // Birthday validation (basic validation for DD.MM.YYYY format)
    const birthdayPattern = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!birthdayPattern.test(formData.birthday)) {
      newErrors.birthday = "Введите дату рождения в формате ДД.ММ.ГГГГ.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    if (employee) {
      dispatch(edit({ ...formData, id: employee.id }));
    } else {
      dispatch(add(formData));
    }
    navigate('/employees?' + searchParams.toString());
  };

  const handleCancel = () => {
    navigate('/employees?' + searchParams.toString()); // Go back to list without saving
  };

  return (
    <div className="edit-container">
      <h1>{employee ? 'Изменение данных сотрудника' : 'Добавление нового сотрудника'}</h1>
      <form onSubmit={handleSubmit} className="form">
        {/* Name */}
        <div>
          <label htmlFor="name">Имя сотрудника:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        {/* Phone with Mask */}
        <div>
          <label htmlFor="phone">Телефон:</label>
          <InputMask
            mask="+7 (999) 999-9999"
            value={formData.phone}
            onChange={handleChange}
          >
            <input
              type="text"
              id="phone"
              name="phone"
            />
          </InputMask>
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>

        {/* Birthday with Mask */}
        <div>
          <label htmlFor="birthday">Дата рождения:</label>
          <InputMask
            mask="99.99.9999"
            value={formData.birthday}
            onChange={handleChange}
          >
            <input
              type="text"
              id="birthday"
              name="birthday"
              placeholder="DD.MM.YYYY"
            />
          </InputMask>
          {errors.birthday && (
            <p className="error">{errors.birthday}</p>
          )}
        </div>

        {/* Role Dropdown */}
        <div>
          <label htmlFor="role">Должность:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="cook">Повар</option>
            <option value="waiter">Официант</option>
            <option value="driver">Водитель</option>
          </select>
        </div>

        {/* Status Checkbox */}
        <div>
          <label htmlFor="isArchive">В архиве:
          </label>
          <input
            type="checkbox"
            id="isArchive"
            name="isArchive"
            checked={formData.isArchive}
            onChange={handleChange}
          />
        </div>

        <div className="form-buttons">
          <button type="submit">Сохранить данные сотрудника</button>
          <button type="button" onClick={handleCancel}>Отменить</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeEdit;
