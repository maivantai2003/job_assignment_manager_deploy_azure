import React from 'react';

const PageSizeSelect = ({ pageSize, setPageSize }) => (
  <div className="mb-4">
    <label htmlFor="pageSize" className="block text-sm font-medium text-gray-700">
      Số lượng:
    </label>
    <select
      id="pageSize"
      className="mt-1 block w-auto rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      value={pageSize}
      onChange={(e) => setPageSize(Number(e.target.value))}
      style={{ width: '80px' }}
    >
      {[5, 10,15,20,25, 50].map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  </div>
);

export default PageSizeSelect;
