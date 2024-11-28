import React, { useEffect, useState } from "react";
import SearchFilter from "../SearchFilter";
import { useDispatch, useSelector } from "react-redux";
import { searchTasks } from "../../redux/task/taskSlice";
import { BGS, formatDate } from "../../utils";
import EmployeeInfo from "../EmployeeInfo";
import clsx from "clsx";
import Button from "../Button";
import { IoMdTime } from "react-icons/io";
import TaskHistory from "../task/TaskHistory";
const SeachTask = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [department, setDepartment] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("All");
  const [status, setStatus] = useState("All");
  const [assignee, setAssignee] = useState("All");
  const [loading, setLoading] = useState(false);
  const [openTaskHistory, setOpenTaskHistory] = useState(false);

  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.searchResults);
  useEffect(()=>{
    
  },[dispatch])
  const handleSearch = async () => {
    setLoading(true);
    try {
      await dispatch(
        searchTasks({
          nhanVien: assignee === "All" ? "" : assignee,
          phongBan: department === "All" ? "" : department,
          mucDo: priority === "All" ? "" : priority,
          trangThai: status === "All" ? "" : status,
          tenCongViec: searchQuery,
        })
      );
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };
  const filterByDate = (tasks) => {
    if (!startDate && !endDate) return tasks;

    return tasks.filter((task) => {
      const taskDate = new Date(task.thoiGianKetThuc || task.thoiGianKetThuc);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (!start || taskDate >= start) && (!end || taskDate <= end);
    });
  };
  const getCompletionColor = (percent) => {
    if (percent < 50) {
      return "bg-red-600";
    } else if (percent >= 50 && percent < 80) {
      return "bg-yellow-500";
    } else {
      return "bg-green-500";
    }
  };
  const filteredResults = filterByDate(tasks)
  return (
    <div>
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        department={department}
        setDepartment={setDepartment}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        priority={priority}
        setPriority={setPriority}
        status={status}
        setStatus={setStatus}
        assignee={assignee}
        setAssignee={setAssignee}
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
      </button>
      {loading && (
        <div className="mt-4">
          <p className="text-blue-500">Đang tải dữ liệu, vui lòng chờ...</p>
        </div>
      )}
      {!loading && filteredResults && filteredResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Kết quả tìm kiếm:</h3>
          <ul>
            {filteredResults.map((task, index) => {
              const completionPercent = task.mucDoHoanThanh || 0;
              const itemClass = task.isParentTask
                ? task.hasSubTasks
                  ? "font-bold text-blue-600 bg-blue-100"
                  : "font-bold bg-blue-200"
                : "pl-6 bg-gray-100";

              return (
                <li key={index} className={`py-2 border-b ${itemClass}`}>
                  <div className="flex items-center px-4">
                    {/* Tên công việc */}
                    <div className="flex-1 px-4 truncate cursor-pointer">
                      <span className="break-words">
                        {task.isParentTask
                          ? `🔹 ${task.tenCongViec}`
                          : task.tenCongViec}
                      </span>
                      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                        <div
                          className={`${getCompletionColor(
                            completionPercent
                          )} h-4 rounded-full`}
                          style={{ width: `${completionPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {completionPercent.toFixed(2)}% Hoàn thành
                      </span>
                    </div>

                    {/* Mức độ ưu tiên */}
                    <div className="flex-1 px-4">
                      <span
                        className={`px-2 py-1 rounded-full border-1 ${
                          task.mucDoUuTien === "CAO"
                            ? "text-red-500 border-red-500 bg-red-100"
                            : task.mucDoUuTien === "TRUNG BÌNH"
                            ? "text-orange-500 border-orange-500 bg-orange-100"
                            : "text-blue-500 border-blue-500 bg-blue-100"
                        }`}
                      >
                        {task.mucDoUuTien}
                      </span>
                    </div>

                    {/* Thời gian */}
                    <div className="flex-1 px-4 text-gray-400 flex flex-col items-start">
                      <span className="text-gray-500">
                        {task.thoiGianBatDau &&
                          `${formatDate(new Date(task.thoiGianBatDau))}`}
                      </span>
                      <span
                        className={`${
                          new Date(task.thoiGianKetThuc) < new Date()
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {task.thoiGianKetThuc
                          ? `${formatDate(new Date(task.thoiGianKetThuc))}`
                          : "Chưa xác định"}
                      </span>
                    </div>
                    <div className="flex-1 px-4 flex items-center">
                      {task.phanCongs
                        ?.filter(
                          (m) =>
                            m.vaiTro === "Người Chịu Trách Nhiệm" &&
                            m.trangThai === true
                        )
                        .map((m, index) => (
                          <div
                            key={index}
                            className={clsx(
                              "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                              BGS[index % BGS?.length]
                            )}
                          >
                            <EmployeeInfo employee={m} />
                          </div>
                        ))}
                    </div>
                    <div className="flex-1 px-4 flex items-center">
                      {task.phanCongs
                        ?.filter(
                          (m) =>
                            m.vaiTro === "Người Thực Hiện" &&
                            m.trangThai === true
                        )
                        .map((m, index) => (
                          <div
                            key={index}
                            className={clsx(
                              "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                              BGS[index % BGS?.length]
                            )}
                          >
                            <EmployeeInfo employee={m} />
                          </div>
                        ))}
                    </div>
                    {/* Trạng thái */}
                    <div className="flex-1 px-4">
                      <span
                        className={`${
                          task.trangThaiCongViec === true
                            ? "text-green-500"
                            : task.trangThaiCongViec === false &&
                              new Date(task.thoiGianKetThuc) < new Date()
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {task.trangThaiCongViec === true
                          ? "Đã hoàn thành"
                          : task.trangThaiCongViec === false &&
                            new Date(task.thoiGianKetThuc) > new Date()
                          ? "Chưa hoàn thành"
                          : "Trì hoãn"}
                      </span>
                    </div>
                    <div className="flex-1 px-4 flex items-center">
                      <Button
                        onClick={() => {
                          setOpenTaskHistory(true);
                        }}
                        icon={<IoMdTime className="text-base" />}
                        className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1 text-xs h-7"
                      />
                    </div>
                  </div>
                  <TaskHistory
                      openTaskHistory={openTaskHistory}
                      setOpenTaskHistory={setOpenTaskHistory}
                      maCongViec={task.maCongViec}
                    />
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {!loading && filteredResults && filteredResults.length === 0 && (
        <div className="mt-4">
          <p className="text-gray-500">Không tìm thấy công việc nào.</p>
        </div>
      )}
      
    </div>
  );
};

export default SeachTask;
