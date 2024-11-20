import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAssignments,
  fetchEmployeeAssignment,
} from "../redux/assignment/assignmentSlice";
import TaskAssignmentList from "../components/taskassigment/TaskAssignmentList";
import getConnection from "../hub/signalRConnection";
const TaskAssignment = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const maNhanVien = Number(localStorage.getItem("userId"));
  const phancongs = useSelector((state) => state.assignments);
  const [filter, setFilter] = useState("incomplete");
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);   
      await dispatch(fetchEmployeeAssignment(maNhanVien));
      setLoading(false);
    };
    loadData();
  }, [maNhanVien, dispatch]);
  
  useEffect(() => {
    const connection=getConnection()
    const startConnection = async () => {
      try {
        if (connection && connection.state === "Disconnected") {
          await connection.start();
          console.log("Connection started"); 
        }
        connection.on("loadCongViec", async () => {
         await dispatch(fetchEmployeeAssignment(maNhanVien))
        });
        connection.on("loadPhanCong", async () => {
          await dispatch(fetchEmployeeAssignment(maNhanVien))
        });
        connection.on("deletePhanCong", async () => {
          await dispatch(fetchEmployeeAssignment(maNhanVien))
        });
        connection.on("updateCongViec", async () => {
          await dispatch(fetchEmployeeAssignment(maNhanVien));
        });
        console.log("Connection update"); 
        connection.onclose(async (error) => {
          console.error("Connection closed due to error: ", error);
          setTimeout(() => {
            startConnection();
          }, 2000);
        });
      } catch (err) {
        console.error("Error while starting connection: ", err);
      }
    };
    startConnection();
    return () => {
      if (connection) {
        console.log("off")
        connection.off("loadCongViec");
        connection.off("deletePhanCong");
        connection.off("loadPhanCong");
        connection.off("updateCongViec");
      }
    };
  }, [dispatch, maNhanVien,phancongs.list,filter]);
  const filteredAssignments = phancongs.list.filter((item) => item.trangThai === true).filter((item) => {
    if (filter === "incomplete") {
      return item.trangThaiCongViec === false;
    }
    if (filter === "completed") {
      return item.trangThaiCongViec === true;
    }
    return true;
  });
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  return (
    <div className="w-full bg-transparent">
      <div className="text-lg bg-transparent">
      <div className="mb-4">
          <label htmlFor="filter" className="mr-2">Lọc Công Việc:</label>
          <select
           value={filter}
           onChange={handleFilterChange}
           className="p-2 border rounded"
          >
            <option value="incomplete">Chưa hoàn thành</option>
            <option value="completed">Hoàn thành</option>
            <option value="all">Tất cả</option>
          </select>
        </div>
        <div className="w-full flex border-y-2 py-2 px-4 font-bold bg-white shadow-sm text-sm mb-4">
          <div className="flex-1 px-2">Công Việc</div>
          <div className="flex-1 px-2">Mức Độ Ưu Tiên</div>
          <div className="flex-1 px-2">Bắt Đầu</div>
          <div className="flex-1 px-2">Kết Thúc</div>
          <div className="flex-1 px-2">Chịu Trách Nhiệm</div>
          <div className="flex-1 px-2">Nhóm</div>
          <div className="flex-1 px-2">Trình Trạng</div>
          <div className="flex-1 px-2">File</div>
        </div>
        <div className="bg-slate-50 rounded-md shadow-md p-4 space-y-2">
          {filteredAssignments.map((item, index) => (
            <TaskAssignmentList congviec={item} filterTask={filter} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default TaskAssignment;
