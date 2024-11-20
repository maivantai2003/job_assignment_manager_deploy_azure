import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addDetailExchange as addAPI} from './detailexchangeAPI';

// Thunks
// export const fetchExchanges = createAsyncThunk(
//   'exchanges/fetchExchanges',
//   async ({ search, page }) => {
//     const response = await fetchAPI({ search, page });
//     return response;
//   }
// );

export const addDetailExchange = createAsyncThunk(
  'detailexchanges/addDetailExchange',
  async (detailExchange) => {
    const response = await addAPI(detailExchange);
    return response;
  }
);

// export const findExchangeByTask = createAsyncThunk(
//   'exchanges/findExchangeByTask',
//   async (id) => {
//     const response = await findByTaskAPI(id);
//     return response;
//   }
// );

// export const updateExchange = createAsyncThunk(
//   'exchanges/updateExchange',
//   async ({ id, exchange }) => {
//     const response = await updateAPI({ id, exchange });
//     return response;
//   }
// );

const initialState = {
  list: [],
  loading: false,
  error: null,
  status: "All"
};

const detailexchangeSlice = createSlice({
  name: 'detailexchanges',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addDetailExchange.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
  },
});

export default detailexchangeSlice.reducer;
