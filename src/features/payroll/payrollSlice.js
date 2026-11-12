import api from '../../api/axios.js';
import { createCrudSlice, apiThunk } from '../createCrudSlice.js';

export const generatePayroll = apiThunk('payroll/generate', async (d) => (await api.post('/payroll/generate', d)).data);

export const payroll = createCrudSlice({
  name: 'payroll',
  url: '/payroll',
  extraReducers: (b) => {
    b.addCase(generatePayroll.fulfilled, (s, a) => { s.items = a.payload.data; });
  },
});
export default payroll.reducer;

export const markPaid = (id) => payroll.update({ id, path: '/pay', method: 'patch' });
