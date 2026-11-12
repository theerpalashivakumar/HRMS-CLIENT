import { createCrudSlice } from '../createCrudSlice.js';

export const departments = createCrudSlice({ name: 'departments', url: '/departments' });
export default departments.reducer;
