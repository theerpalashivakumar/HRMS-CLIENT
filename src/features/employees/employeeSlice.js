import { createCrudSlice } from '../createCrudSlice.js';

export const employees = createCrudSlice({ name: 'employees', url: '/employees' });
export default employees.reducer;
