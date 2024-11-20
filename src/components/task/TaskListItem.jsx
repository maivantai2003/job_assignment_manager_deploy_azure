import { BiCalendar, BiPlus } from "react-icons/bi";
import { BGS, formatDate } from "../../utils";
import Selection from "../Selection";
import clsx from "clsx";
import Button from "../Button";
import AddTask from "./AddTask";
import { useEffect, useState } from "react";

import {
  IoMdAdd,
  IoMdCreate,
  IoMdMore,
  IoMdSwap,
  IoMdTime,
  IoMdTrash,
} from "react-icons/io";
import DetailTask from "./DetailTask";
import { useDispatch, useSelector } from "react-redux";
import { fetchByIdTask, updateCompleteTask } from "../../redux/task/taskSlice";
import EmployeeInfo from "../EmployeeInfo";
import UpdateTask from "./UpdateTask";
import AddTaskTransfer from "../tasktransfer/AddTaskTransfer";
import TaskHistory from "./TaskHistory";
import { checkPermission } from "../../redux/permissiondetail/permissionDetailSlice";
import API_ENDPOINTS from "../../constant/linkapi";
import getConnection from "../../hub/signalRConnection";
import AddAssignmentTask from "./AddAssignmentTask";
import { useNavigate } from "react-router-dom";
import { CiViewList } from "react-icons/ci";
const priorities = [
  { id: "low", name: "Thấp" },
  { id: "medium", name: "Trung Bình" },
  { id: "high", name: "Cao" },
];

const stages = [
  { id: "todo", name: "Cần Làm" },
  { id: "in_progress", name: "Đang làm" },
  { id: "done", name: "Hoàn thành" },
];

const TaskListItem = ({ congviec, duAn }) => {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openAssignment, setopenAssignment] = useState(false);
  const [openTransfer, setOpenTransfer] = useState(false);
  const [openTaskHistory, setOpenTaskHistory] = useState(false);
  const [taskRoot, setTaskRoot] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [subTasks, setSubTasks] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnectionStarted, setIsConnectionStarted] = useState(false);
  const [permissionAction, setpermissionAction] = useState([]);
  const maquyen = Number(localStorage.getItem("permissionId"));
  const [statusTask, setStatusTask] = useState(congviec.trangThaiCongViec);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const maCongViec = congviec.maCongViec;
  const trangThaiCongViec = congviec.trangThaiCongViec;
  const phancong = useSelector((state) =>
    state.tasks.list.find((task) => task.maCongViec === maCongViec)
  );
  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (maCongViec) {
          setLoading(true);
          await dispatch(fetchByIdTask(maCongViec));
          const result = await dispatch(
            checkPermission({ maQuyen: maquyen, tenChucNang: "Công Việc" })
          ).unwrap();
          setpermissionAction(result);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [dispatch, maCongViec]);
  useEffect(() => {
    const connection = getConnection();
    const connectSignalR = async () => {
      try {
        if (connection && connection.state === "Disconnected") {
          await connection.start();
          //console.log("SignalR connected!");
        }
        //console.log("Connected! update");
        connection.on("updateCongViec", async () => {
          if (maCongViec) {
            await dispatch(fetchByIdTask(maCongViec));
          }
        });

        connection.on("loadPhanCong", async () => {
          if (maCongViec) {
            await dispatch(fetchByIdTask(maCongViec));
          }
        });

        connection.on("loadHanhDong", async () => {
          if (maCongViec) {
            const result = await dispatch(
              checkPermission({ maQuyen: maquyen, tenChucNang: "Công Việc" })
            ).unwrap();
            setpermissionAction(result);
          }
        });
        connection.onclose(() => {
          console.error("Connection lost, trying to reconnect...");
          setTimeout(() => connectSignalR(), 3000);
        });
      } catch (error) {
        console.error("Connection failed: ", error);
      }
    };
    connectSignalR();
    return () => {
      if (connection) {
        connection.off("loadHanhDong");
        connection.off("loadPhanCong");
        connection.off("updateCongViec");
      }
    };
  }, [maCongViec, dispatch, maquyen]);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const handleToggleDetail = () => {
    setExpanded(!expanded);
  };
  const phanCongs =
    phancong?.phanCongs?.filter((task) => task.trangThai === true) || [];
  const chiuTrachNhiem = phanCongs?.filter(
    (m) => m.vaiTro === "Người Chịu Trách Nhiệm"
  );
  const thucHien = phanCongs?.filter((m) => m.vaiTro === "Người Thực Hiện");
  const congViecHoanThanh = phanCongs.filter(
    (task) => task.trangThaiCongViec === true
  ).length;
  const tongCongViec = phanCongs.length || 1;
  const completionPercent = (congViecHoanThanh / tongCongViec) * 100;
  useEffect(() => {
    if (completionPercent === 100 && trangThaiCongViec === false) {
      try {
        const result = dispatch(
          updateCompleteTask({
            id: maCongViec,
            task: true,
            mucDo: 100,
          })
        ).unwrap();
        setStatusTask(true);
      } catch (e) {
        console.log(e);
      }
    } else if (completionPercent < 100 && trangThaiCongViec === false) {
      try {
        const result = dispatch(
          updateCompleteTask({
            id: maCongViec,
            task: false,
            mucDo: completionPercent,
          })
        ).unwrap();
        setStatusTask(false);
      } catch (e) {
        console.log(e);
      }
    }
  }, [completionPercent, trangThaiCongViec, maCongViec, dispatch]);
  const handleAddSubTask = (newSubTask) => {
    setSubTasks([...subTasks, newSubTask]);
    setOpen(false);
  };
  const isParentTask = (task) => {
    return !task.maCongViecCha;
  };
  const hasSubTasks = (task) => {
    return task.congViecCon && task.congViecCon.length > 0;
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
  const itemClass = isParentTask(congviec)
    ? hasSubTasks(congviec)
      ? "font-bold text-blue-600 bg-blue-100"
      : "font-bold bg-blue-200"
    : "pl-6 bg-gray-100";
  return (
    <div
      className={`w-full flex items-center px-4 ${
        isParentTask(congviec) ? "" : "ml-4"
      }`}
    >
      <div
        className={`w-full flex items-center py-1 border-b text-sm ${itemClass}`}
      >
        <div
          className={`flex-1 w-1/4 px-4 truncate cursor-pointer ${
            isParentTask(congviec) ? "font-bold" : "pl-4"
          }`}
          onClick={handleToggleDetail}
        >
          {isParentTask(congviec) ? (
            <span className="text-gray-500 break-words">
              🔹 {congviec.tenCongViec}
            </span>
          ) : (
            <span className="break-words">{congviec.tenCongViec}</span>
          )}
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
        <div className="flex-1 w-1/5 px-4">
          <span
            className={`px-2 py-1 rounded-full border-1 ${
              congviec.mucDoUuTien === "CAO"
                ? "text-red-500 border-red-500 bg-red-100"
                : congviec.mucDoUuTien === "TRUNG BÌNH"
                ? "text-orange-500 border-orange-500 bg-orange-100"
                : congviec.mucDoUuTien === "BÌNH THƯỜNG"
                ? "text-blue-500 border-blue-500 bg-blue-100"
                : "text-green-500 border-green-500 bg-green-100"
            }`}
          >
            {congviec.mucDoUuTien}
          </span>
        </div>
        <div className="flex-1 px-4 text-gray-400 flex flex-col items-start">
          {/* Hiển thị thời gian bắt đầu */}
          {congviec.thoiGianBatDau && (
            <span className="text-gray-500">
              {formatDate(new Date(congviec.thoiGianBatDau))}
            </span>
          )}

          {/* Hiển thị thời gian kết thúc */}
          <button
            className="hover:bg-gray-200 rounded-full px-2 mt-2"
            onClick={() => {
              alert("show calendar");
            }}
          >
            {congviec.thoiGianKetThuc ? (
              <span
                className={`${
                  new Date(congviec.thoiGianKetThuc) < new Date()
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {formatDate(new Date(congviec.thoiGianKetThuc))}
              </span>
            ) : (
              <div className="p-1 w-fit border-2 border-dashed rounded-full border-gray-400">
                <BiCalendar size={20} />
              </div>
            )}
          </button>
        </div>

        <div className="flex-1 px-4 flex items-center">
          {chiuTrachNhiem?.map((m, index) => (
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
          <button
            onClick={() => {
              setopenAssignment(true);
            }}
            className="rounded-full border-2 border-dashed size-fit p-1 ml-2 border-gray-400 text-gray-400"
          >
            <BiPlus />
          </button>
        </div>
        <div className="flex-1 px-4 flex items-center">
          {thucHien?.map((m, index) => (
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
          <button
            onClick={() => {
              setopenAssignment(true);
            }}
            className="rounded-full border-2 border-dashed size-fit p-1 ml-2 border-gray-400 text-gray-400"
          >
            <BiPlus />
          </button>
        </div>
        <div className="flex-1 px-4 ">
          <span
            className={`${
              statusTask === true
                ? "text-green-500"
                : statusTask === false &&
                  new Date(congviec.thoiGianKetThuc) < new Date()
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            {statusTask === true
              ? "Đã hoàn thành"
              : statusTask === false &&
                new Date(congviec.thoiGianKetThuc) > new Date()
              ? "Chưa hoàn thành"
              : "Trì hoãn"}
          </span>
        </div>

        <div className="flex-1 px-4 flex flex-wrap justify-end items-center gap-1">
          {isMobile ? (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-blue-600"
            >
              <IoMdMore className="text-lg" />
            </button>
          ) : (
            <>
              {permissionAction.includes("Thêm") && (
                <>
                  <Button
                    onClick={() => navigate("/fileView/" + maCongViec)}
                    icon={<CiViewList className="text-base" />}
                    className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1 text-xs h-7"
                  ></Button>
                  <Button
                    onClick={() => {
                      setTaskRoot(congviec.maCongViec);
                      setOpen(true);
                    }}
                    icon={<IoMdAdd className="text-base" />}
                    className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1 text-xs h-7" // Giảm padding và xác định chiều cao
                  />
                </>
              )}
              {permissionAction.includes("Sửa") && (
                <Button
                  onClick={() => {
                    setOpenUpdate(true);
                  }}
                  icon={<IoMdCreate className="text-base" />}
                  className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1 text-xs h-7" // Giảm padding và xác định chiều cao
                />
              )}
              {permissionAction.includes("Xóa") && (
                <Button
                  onClick={() => {}}
                  icon={<IoMdTrash className="text-base" />}
                  className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1 text-xs h-7" // Giảm padding và xác định chiều cao
                />
              )}
              {permissionAction.includes("Sửa") && (
                <Button
                  onClick={() => {
                    setOpenTransfer(true);
                  }}
                  icon={<IoMdSwap className="text-base" />}
                  className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1 text-xs h-7" // Giảm padding và xác định chiều cao
                />
              )}
              <Button
                onClick={() => {
                  setOpenTaskHistory(true);
                }}
                icon={<IoMdTime className="text-base" />}
                className="flex flex-row-reverse items-center bg-blue-600 text-white rounded-md py-0.5 px-1 text-xs h-7" // Giảm padding và xác định chiều cao
              />
            </>
          )}
        </div>
        {menuOpen && isMobile && (
          <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            {permissionAction.includes("Thêm") && (
              <button
                onClick={() => {
                  setTaskRoot(congviec.maCongViec);
                  setOpen(true);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-blue-600"
              >
                <IoMdAdd className="inline mr-2" /> Thêm
              </button>
            )}
            {permissionAction.includes("Sửa") && (
              <button
                onClick={() => {
                  setOpenUpdate(true);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-blue-600"
              >
                <IoMdCreate className="inline mr-2" /> Sửa
              </button>
            )}
            {permissionAction.includes("Xóa") && (
              <button
                onClick={() => setMenuOpen(false)}
                className="w-full text-left px-4 py-2 text-blue-600"
              >
                <IoMdTrash className="inline mr-2" /> Xóa
              </button>
            )}
            {permissionAction.includes("Sửa") && (
              <button
                onClick={() => {
                  setOpenTransfer(true);
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-blue-600"
              >
                <IoMdSwap className="inline mr-2" /> Chuyển
              </button>
            )}
            <button
              onClick={() => {
                setOpenTaskHistory(true);
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-blue-600"
            >
              <IoMdTime className="inline mr-2" /> Lịch sử
            </button>
          </div>
        )}
      </div>
      <AddTask
        open={open}
        setOpen={setOpen}
        phanDuAn={congviec.maPhanDuAn}
        duAn={duAn}
        congViecCha={taskRoot}
      />
      <UpdateTask
        openUpdate={openUpdate}
        setOpenUpdate={setOpenUpdate}
        phanDuAn={congviec.maPhanDuAn}
        duAn={duAn}
        maCongViec={congviec.maCongViec}
        task={congviec}
        phanCong={phancong}
      />
      <AddTaskTransfer
        openTransfer={openTransfer}
        setOpenTransfer={setOpenTransfer}
        maCongViec={maCongViec}
        tenCongViec={congviec.tenCongViec}
        maPhongBan={null}
        currentEmployee={phancong?.phanCongs}
        thoiGianKetThuc={congviec.thoiGianKetThuc}
      />
      <TaskHistory
        openTaskHistory={openTaskHistory}
        setOpenTaskHistory={setOpenTaskHistory}
        maCongViec={maCongViec}
      />
      <AddAssignmentTask
        openAssignment={openAssignment}
        setopenAssignment={setopenAssignment}
        maCongViec={maCongViec}
        tenCongViec={congviec.tenCongViec}
        nhanViens={phancong?.phanCongs}
        thoiGianKetThuc={congviec.thoiGianKetThuc}
      />
      {expanded && (
        <DetailTask
          expanded={expanded}
          setExpanded={setExpanded}
          task={congviec}
          titleTask={congviec.tenCongViec}
          date={formatDate(new Date(congviec.thoiGianKetThuc))}
          roleTeam={chiuTrachNhiem}
          userTeam={thucHien}
        />
      )}
    </div>
  );
};
export default TaskListItem;
