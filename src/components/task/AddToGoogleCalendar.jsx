import React from "react";

const AddToGoogleCalendar = ({ congViecList }) => {
  const generateGoogleCalendarUrl = (congViec) => {
    const formatDateToGoogle = (date) => {
      return new Date(date).toISOString().replace(/-|:|\.\d+/g, "");
    };

    const start = formatDateToGoogle(congViec.thoiGianBatDau);
    const end = formatDateToGoogle(congViec.thoiGianKetThuc);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      congViec.tenCongViec
    )}&dates=${start}/${end}&details=${encodeURIComponent(congViec.moTa)}`;
  };

  return (
    <div>
      <h2>Danh sách công việc</h2>
      <ul>
        {congViecList.map((congViec) => (
          <li key={congViec.id}>
            <strong>{congViec.tenCongViec}</strong>
            <p>Bắt đầu: {new Date(congViec.thoiGianBatDau).toLocaleString()}</p>
            <p>Kết thúc: {new Date(congViec.thoiGianKetThuc).toLocaleString()}</p>
            <a
              href={generateGoogleCalendarUrl(congViec)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "blue" }}
            >
              Thêm vào Google Calendar
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddToGoogleCalendar;
