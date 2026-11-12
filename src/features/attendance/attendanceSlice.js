import api from '../../api/axios.js';
import { createCrudSlice, apiThunk } from '../createCrudSlice.js';

export const fetchToday = apiThunk('attendance/today', async () => (await api.get('/attendance/today')).data.data);
export const checkIn = apiThunk('attendance/checkIn', async () => (await api.post('/attendance/check-in')).data.data);
export const checkOut = apiThunk('attendance/checkOut', async () => (await api.post('/attendance/check-out')).data.data);
export const markAttendance = apiThunk('attendance/mark', async (d) => (await api.post('/attendance/mark', d)).data.data);

export const attendance = createCrudSlice({
  name: 'attendance',
  url: '/attendance',
  initialState: { today: null },
  extraReducers: (b) => {
    [fetchToday, checkIn, checkOut].forEach((t) => b.addCase(t.fulfilled, (s, a) => { s.today = a.payload; }));
  },
});
export default attendance.reducer;
