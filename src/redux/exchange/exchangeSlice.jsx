import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchExchanges as fetchAPI, addExchange as addAPI, findExchangeByTask as findByTaskAPI, updateExchange as updateAPI } from './exchangeAPI';

// Thunks
export const fetchExchanges = createAsyncThunk(
  'exchanges/fetchExchanges',
  async ({ search, page }) => {
    const response = await fetchAPI({ search, page });
    return response;
  }
);

export const addExchange = createAsyncThunk(
  'exchanges/addExchange',
  async (exchange) => {
    const response = await addAPI(exchange);
    return response;
  }
);

export const findExchangeByTask = createAsyncThunk(
  'exchanges/findExchangeByTask',
  async (id) => {
    const response = await findByTaskAPI(id);
    return response;
  }
);

export const updateExchange = createAsyncThunk(
  'exchanges/updateExchange',
  async ({ id, exchange }) => {
    const response = await updateAPI({ id, exchange });
    return response;
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
  status: "All"
};

const  exchangeSlice = createSlice({
  name: 'exchanges',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExchanges.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchExchanges.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchExchanges.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addExchange.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateExchange.fulfilled, (state, action) => {
        const index = state.list.findIndex((exchange) => exchange.maTraoDoiThongTin === action.payload.maDuAn);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      }).addCase(findExchangeByTask.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(findExchangeByTask.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(findExchangeByTask.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default exchangeSlice.reducer;
