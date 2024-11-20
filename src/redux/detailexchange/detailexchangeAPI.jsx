import axiosInstance from "../../interceptors/AxiosInstance";
export const addDetailExchange = async (detailExchange) => {
  try {
    const response = await axiosInstance.post('ChiTietTraoDoiThongTin', detailExchange);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};
// export const findExchangeByTask=async(id)=>{
//   try {
//     const response = await axiosInstance.get(`TraoDoiThongTin/GetAll/${id}`);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response ? error.response.data : error.message);
//   }
// }
// export const updateExchange = async ({ id, exchange }) => {
//   try {
//     const response = await axiosInstance.put(`TraoDoiThongTin/${id}`, exchange);
//     return response.data;
//   } catch (error) {
//     throw new Error(error.response ? error.response.data : error.message);
//   }
// };
