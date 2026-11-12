import { createCrudSlice } from '../createCrudSlice.js';

export const leaves = createCrudSlice({ name: 'leaves', url: '/leaves' });
export default leaves.reducer;

export const review = (id, status, note) => leaves.update({ id, data: { status, note }, path: '/review', method: 'patch' });
export const cancel = (id) => leaves.update({ id, path: '/cancel', method: 'patch' });
