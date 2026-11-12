import { configureStore } from '@reduxjs/toolkit';
import auth from '../features/auth/authSlice.js';
import employees from '../features/employees/employeeSlice.js';
import departments from '../features/departments/departmentSlice.js';
import attendance from '../features/attendance/attendanceSlice.js';
import leaves from '../features/leaves/leaveSlice.js';
import payroll from '../features/payroll/payrollSlice.js';

export default configureStore({
  reducer: { auth, employees, departments, attendance, leaves, payroll },
});
