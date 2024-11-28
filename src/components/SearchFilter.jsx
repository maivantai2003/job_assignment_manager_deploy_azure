import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchEmployees } from "../redux/employees/employeeSlice";
import { fetchDepartments } from "../redux/departments/departmentSlice";

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  department,
  setDepartment,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  priority,
  setPriority,
  status,
  setStatus,
  assignee,
  setAssignee,
}) {
  const dispatch = useDispatch();
  const nhanviens = useSelector((state) => state.employees.list);
  const phongbans = useSelector((state) => state.departments.list);

  useEffect(() => {
    const loadData = async () => {
      await dispatch(fetchEmployees({ search: "", page: 20 }));
      await dispatch(fetchDepartments({ search: "", page: 20 }));
    };
    loadData();
  }, [dispatch]);

  const resetFilters = () => {
    setSearchQuery("");
    setDepartment("All");
    setStartDate("");
    setEndDate("");
    setPriority("All");
    setStatus("All");
    setAssignee("All");
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      {/* Tìm kiếm */}
      <div className="flex-1">
        <input
          type="text"
          placeholder="Tìm kiếm công việc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Phòng ban */}
      <div className="w-30">
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">Phòng ban</option>
          {phongbans.map((pb) => (
            <option key={pb.maPhongBan} value={pb.tenPhongBan}>
              {pb.tenPhongBan}
            </option>
          ))}
        </select>
      </div>

      {/* Thời gian bắt đầu và kết thúc */}
      <div className="flex gap-4">
        <div className="w-40">
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-40">
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Mức độ ưu tiên */}
      <div className="w-30">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">Mức Độ</option>
          <option value="CAO">Cao</option>
          <option value="THẤP">Thấp</option>
          <option value="BÌNH THƯỜNG">Bình Thường</option>
          <option value="TRUNG BÌNH">Trung Bình</option>
        </select>
      </div>

      {/* Trạng thái */}
      <div className="w-32">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">Trạng Thái</option>
          <option value="Chưa hoàn thành">Đang thực hiện</option>
          <option value="Hoàn thành">Đã hoàn thành</option>
          <option value="Trì hoãn">Trì hoãn</option>
        </select>
      </div>

      {/* Người thực hiện */}
      <div className="w-40">
        <select
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">Nhân Viên</option>
          {nhanviens.map((nv) => (
            <option key={nv.maNhanVien} value={nv.tenNhanVien}>
              {nv.tenNhanVien}
            </option>
          ))}
        </select>
      </div>

      {/* Nút Reset */}
      <div>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
