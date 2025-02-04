import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEmployees as fetchAPI, addEmployee as addAPI,updateEmployee as updateAPI,deleteEmployee as deleteAPI } from './employeeAPI';

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async ({ search, page }) => {
  const response = await fetchAPI(search, page);
  return response;
});

export const addEmployee = createAsyncThunk('employees/addEmployee', async (employee) => {
  const response = await addAPI(employee);
  return response;
});
export const updateEmployee=createAsyncThunk('employees/updateEmployee',async({id,employee})=>{
  const response=await updateAPI(id,employee);
  return response;
})
export const deleteEmployee=createAsyncThunk('employees/deleteEmployee',async(id)=>{
  const response=await deleteAPI(id);
  return response;
})

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],
    pagination: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.error.message;
      }).addCase(addEmployee.fulfilled, (state, action) => {
        state.list.push(action.payload);
      }).addCase(deleteEmployee.fulfilled, (state, action) => {
        const index = state.list.findIndex((file) => file.maNhanVien === action.payload.maNhanVien);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export default employeeSlice.reducer;
