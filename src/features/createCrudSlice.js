import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios.js';
import { errMsg } from '../utils/helpers.js';

/** Async thunk that unwraps our { success, data } envelope and rejects with a readable message. */
export const apiThunk = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try { return await fn(arg); } catch (e) { return rejectWithValue(errMsg(e)); }
  });

/**
 * Generic CRUD slice factory (DRY): list/create/update/remove against a REST endpoint.
 * `update` accepts { id, data, path, method } so custom actions (e.g. PATCH /leaves/:id/review) reuse it.
 */
export const createCrudSlice = ({ name, url, initialState = {}, reducers = {}, extraReducers }) => {
  const fetchAll = apiThunk(`${name}/fetchAll`, async (params) => (await api.get(url, { params })).data.data);
  const create = apiThunk(`${name}/create`, async (data) => (await api.post(url, data)).data.data);
  const update = apiThunk(`${name}/update`, async ({ id, data, path = '', method = 'put' }) =>
    (await api[method](`${url}/${id}${path}`, data)).data.data);
  const remove = apiThunk(`${name}/remove`, async (id) => { await api.delete(`${url}/${id}`); return id; });

  const slice = createSlice({
    name,
    initialState: { items: [], loading: false, ...initialState },
    reducers,
    extraReducers: (b) => {
      b.addCase(fetchAll.pending, (s) => { s.loading = true; })
        .addCase(fetchAll.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
        .addCase(fetchAll.rejected, (s) => { s.loading = false; })
        .addCase(create.fulfilled, (s, a) => { s.items.unshift(a.payload); })
        .addCase(update.fulfilled, (s, a) => { s.items = s.items.map((i) => (i._id === a.payload._id ? a.payload : i)); })
        .addCase(remove.fulfilled, (s, a) => { s.items = s.items.filter((i) => i._id !== a.payload); });
      extraReducers?.(b);
    },
  });
  return { reducer: slice.reducer, actions: slice.actions, fetchAll, create, update, remove };
};
