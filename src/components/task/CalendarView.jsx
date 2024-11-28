import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useLocation } from "react-router-dom";

const localizer = momentLocalizer(moment);
const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`
const CalendarView = () => {
const location = useLocation();
  const { state } = location;
  const { duan } = state || {};

  if (!duan || !duan.phanDuAn) {
    return <div>Không có dữ liệu</div>;
  }
  const events = duan.phanDuAn
    .flatMap(phan =>
      (phan.congViecs || []).map(congViec => ({
        title: congViec.tenCongViec,
        start: new Date(congViec.thoiGianKetThuc),
        end: new Date(congViec.thoiGianKetThuc),
        description: congViec.moTa,
        color:getRandomColor(),
      }))
    )
    .filter(event => event.start && event.end);
    const eventPropGetter = (event) => {
        return {
          style: {
            backgroundColor: event.color,
            color: "#fff",
            borderRadius: "5px",
            border: "none",
          },
        };
      };
  return (
    <div style={{ height: "80vh" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        tooltipAccessor="description"
        eventPropGetter={eventPropGetter}
      />
    </div>
  );
};

export default CalendarView;
