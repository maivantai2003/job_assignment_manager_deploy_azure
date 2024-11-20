import axiosInstance from "../../interceptors/AxiosInstance";
export const fetchExchanges = async ({ search, page }) => {
  try {
    const response = await axiosInstance.get(`/api/traodoi?search=${search}&page=${page}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};
export const addExchange = async (exchange) => {
  try {
    const response = await axiosInstance.post('TraoDoiThongTin', exchange);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};
export const findExchangeByTask=async(id)=>{
  try {
    const response = await axiosInstance.get(`TraoDoiThongTin/GetAll/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
}
export const updateExchange = async ({ id, exchange }) => {
  try {
    const response = await axiosInstance.put(`TraoDoiThongTin/${id}`, exchange);
    return response.data;
  } catch (error) {
    throw new Error(error.response ? error.response.data : error.message);
  }
};
