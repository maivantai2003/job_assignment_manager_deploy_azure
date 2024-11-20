import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStatisticsTask as fetchAPI} from './statisticsAPI';

export const fetchStatisticsTask = createAsyncThunk('statistics/statisticsTasks', async () => {
  const response = await fetchAPI();
  return response;
});

const statisticSlice = createSlice({
  name: 'statistics',
  initialState: {
    list: [],
    pagination: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatisticsTask.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchStatisticsTask.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchStatisticsTask.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
});

export default statisticSlice.reducer;
