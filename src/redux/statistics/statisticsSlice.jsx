import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchStatisticsTask as fetchAPI, fetchStatisticsEmployee as fetchAPIEmployee,
  fetchStatisticsDepartment as fetchAPIDepartment } from './statisticsAPI';

export const fetchStatisticsTask = createAsyncThunk('statistics/statisticsTasks', async () => {
  const response = await fetchAPI();
  return response;
});
export const fetchStatisticsEmployee = createAsyncThunk(
  'statistics/statisticsEmployees', 
  async () => {
    const response = await fetchAPIEmployee();
    return response;
  }
);

export const fetchStatisticsDepartment = createAsyncThunk(
  'statistics/statisticsDepartments', 
  async () => {
    const response = await fetchAPIDepartment();
    return response;
  }
);
const statisticSlice = createSlice({
  name: 'statistics',
  initialState: {
    list: [],
    employeeList: [],
    departmentList: [],
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
      }).addCase(fetchStatisticsEmployee.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStatisticsEmployee.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.employeeList = action.payload;
      })
      .addCase(fetchStatisticsEmployee.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchStatisticsDepartment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStatisticsDepartment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.departmentList = action.payload;
      })
      .addCase(fetchStatisticsDepartment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default statisticSlice.reducer;
