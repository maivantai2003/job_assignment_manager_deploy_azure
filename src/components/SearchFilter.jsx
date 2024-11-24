import React from "react";

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  priority,
  setPriority,
  status,
  setStatus,
}) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
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

      {/* Thời gian bắt đầu và kết thúc */}
      <div className="flex gap-4">
        <div className="w-32">
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-32">
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Mức độ */}
      <div className="w-32">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">TẤT CẢ</option>
          <option value="CAO">CAO</option>
          <option value="TRUNG BÌNH">TRUNG BÌNH</option>
          <option value="BÌNH THƯỜNG">BÌNH THƯỜNG</option>
          <option value="THẤP">THẤP</option>
        </select>
      </div>

      {/* Trạng thái */}
      <div className="w-32">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Đang thực hiện">Đang thực hiện</option>
          <option value="Đã hoàn thành">Đã hoàn thành</option>
          <option value="Trì hoãn">Trì hoãn</option>
        </select>
      </div>
    </div>
  );
}
