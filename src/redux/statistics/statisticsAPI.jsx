import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchStatisticsTask=async ()=>{
    const response=await axiosInstance.get("ThongKe")
    return response.data;
}
export const fetchStatisticsEmployee=async ()=>{
    const response=await axiosInstance.get("ThongKe/ThongKeNhanVien")
    return response.data;
}
export const fetchStatisticsDepartment=async ()=>{
    const response=await axiosInstance.get("ThongKe/ThongKePhongBan")
    return response.data;
}