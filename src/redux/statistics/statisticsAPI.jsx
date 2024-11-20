import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchStatisticsTask=async ()=>{
    const response=await axiosInstance.get("ThongKe")
    return response.data;
}