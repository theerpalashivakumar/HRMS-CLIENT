import { createSlice } from '@reduxjs/toolkit';
import api from '../../api/axios.js';
import { apiThunk } from '../createCrudSlice.js';

export const login = apiThunk('auth/login', async (creds) => (await api.post('/auth/login', creds)).data.data);
export const fetchMe = apiThunk('auth/me', async () => (await api.get('/auth/me')).data.data);
export const updateProfile = apiThunk('auth/profile', async (d) => (await api.put('/auth/profile', d)).data.data);
export const changePassword = apiThunk('auth/password', async (d) => (await api.put('/auth/password', d)).data);

const token = localStorage.getItem('token');

const slice = createSlice({
  name: 'auth',
  initialState: { user: null, token, initializing: Boolean(token), loading: false },
  reducers: {
    logout: (s) => { localStorage.removeItem('token'); s.user = null; s.token = null; },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => { s.loading = true; })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false; s.user = a.payload.user; s.token = a.payload.token;
        localStorage.setItem('token', a.payload.token);
      })
      .addCase(login.rejected, (s) => { s.loading = false; })
      .addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; s.initializing = false; })
      .addCase(fetchMe.rejected, (s) => { localStorage.removeItem('token'); s.token = null; s.user = null; s.initializing = false; })
      .addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload; });
  },
});
export const { logout } = slice.actions;
export default slice.reducer;
