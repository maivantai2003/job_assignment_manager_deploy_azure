import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Login as LoginAPI, RefreshToken as RefreshTokenAPI} from "./authenAPI";
export const AuthLogin = createAsyncThunk('auth/login', async (AuthRequest) => {
  const response = await LoginAPI(AuthRequest);
  localStorage.setItem("authUser",JSON.stringify(response))
  var temp=JSON.parse(localStorage.getItem("authUser"))
  var res=JSON.parse(atob(temp.token.split('.')[1]))
  localStorage.setItem("name",decodeURIComponent(escape(res.TenNhanVien)))
  localStorage.setItem("role",decodeURIComponent(escape(res.role)))
  return response;
});

export const AuthRefreshToken = createAsyncThunk('auth/RefreshToken', async (RefreshTokenRequest) => {
  const response = await RefreshTokenAPI(RefreshTokenRequest);
  localStorage.setItem("authUser", JSON.stringify(response)); 
  return response;
});
const initialState = {
  user: localStorage.getItem("authUser")
    ? JSON.parse(localStorage.getItem("authUser"))
    : null,
  isSidebarOpen: false,
  loading: false,
  error: null,
};
const AuthSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("authUser");
    },
    updateAuthUser: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: (builder) => {
   builder.addCase(AuthLogin.pending,(state)=>{
    state.loading=true;
    state.user=null;
    state.error=null;
   }).addCase(AuthLogin.fulfilled,(state,action)=>{
    state.loading=false;
    state.user=action.payload;
    state.error=null;
   }).addCase(AuthLogin.rejected,(state,action)=>{
    state.loading=false;
    state.user=null;
    console.log(action.error.message)
    if(action.error.message==='Request failed with status code 401'){
      state.error="Acces Denied! Invalid";
    }else{
      state.error=action.error.message;
    }
   }).addCase(AuthRefreshToken.pending, (state) => {
    state.loading = true;
  }).addCase(AuthRefreshToken.fulfilled, (state, action) => {
    state.loading = false;
    state.user = action.payload;
    state.error = null;
  }).addCase(AuthRefreshToken.rejected, (state, action) => {
    state.loading = false;
    state.error = action.error.message;
  });
  },
});
export const { setOpenSidebar, logout,updateAuthUser } = AuthSlice.actions;
export default AuthSlice.reducer;
