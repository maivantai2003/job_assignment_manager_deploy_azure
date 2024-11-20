import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import { useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  LogLevel,
  HttpTransportType,
} from "@microsoft/signalr";
import {
  fetchTaskHistories,
  fetchTaskHistoryById,
} from "../../redux/taskhistory/taskhistorySlice";
import API_ENDPOINTS from "../../constant/linkapi";
import getConnection from "../../hub/signalRConnection";

const TaskHistory = ({ openTaskHistory, setOpenTaskHistory, maCongViec }) => {
  const dispatch = useDispatch();
  const lichsucongviec = useSelector((state) => state.taskhistories.list);
  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchTaskHistories());
    };
    loadData();
  }, [dispatch, maCongViec]);

  useEffect(() => {
    const connection = getConnection();
    const connectSignalR = async () => {
      try {
        if (connection && connection.state === "Disconnected") {
          await connection.start();
          console.log("Connected!");
        }

        connection.on("loadLichSuCongViec", async () => {
          await dispatch(fetchTaskHistories());
        });
        //console.log("Connected! update");
      } catch (error) {
        console.error("Connection failed: ", error);
      }
    };
    connectSignalR();
    return () => {
      if (connection) {
        connection.off("loadLichSuCongViec");
      }
    };
  }, [dispatch, maCongViec]);
  const lichsu = lichsucongviec.filter(
    (item) => item.maCongViec === maCongViec
  );
  const getItemDotColor = (content) => {
    if (content.includes("phân công")) {
      return "bg-blue-500";
    } else if (content.includes("hoàn thành nhiệm vụ")) {
      return "bg-green-500";
    } else if (content.includes("chuyển giao")) {
      return "bg-red-500";
    } else if (content.includes("cập nhật")) {
      return "bg-yellow-500";
    }
    return "bg-gray-300";
  };
  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };
  return (
    <>
      <ModalWrapper open={openTaskHistory} setOpen={setOpenTaskHistory}>
        <div className="bg-gray-50 py-6 px-6 rounded-md shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Lịch Sử Công Việc
          </h2>
          {lichsu.length === 0 ? (
            <p className="text-gray-500">
              Không có lịch sử nào cho công việc này.
            </p>
          ) : (
            <div className="relative max-h-80 overflow-y-auto">
              <div className="border-l-2 border-gray-300 pl-4 space-y-6">
                {lichsu.map((item) => (
                  <div key={item.maLichSuCongViec} className="relative pl-8">
                  <div
                    className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white ${getItemDotColor(
                      item.noiDung
                    )}`}
                  ></div>
                  <div className="ml-8">
                    <p className="text-sm text-gray-500">{formatDateTime(item.ngayCapNhat)}</p>
                    <p className="text-base text-gray-800 font-medium mt-1">{item.noiDung}</p>
                  </div>
                </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-4 mt-6">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md"
              onClick={() => setOpenTaskHistory(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
};
export default TaskHistory;
