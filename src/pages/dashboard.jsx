import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchStatisticsTask } from '../redux/statistics/statisticsSlice';
import { jsPDF } from 'jspdf'; 
import 'jspdf-autotable';
const barData = [
  { name: 'Lam viec', value: 4, color: '#4CAF50' },
  { name: 'Nghi', value: 0, color: '#F44336' },
  { name: 'Hoc', value: 0, color: '#2196F3' },
];

const pieData = [
  { name: 'Incomplete', value: 4, color: '#FF6384' },
];

const lineData = Array.from({ length: 14 }, (_, i) => ({
  name: `09/${i + 1}`,
  value: 4
}));

const lollipopData = [
  { name: 'A', value: 5 },
  { name: 'B', value: 4 },
  { name: 'C', value: 3 },
  { name: 'D', value: 2 },
  { name: 'E', value: 1 },
  { name: 'F', value: 1 },
  { name: 'G', value: 1 },
];

const DatePicker = ({ label, value, onChange }) => (
  <div style={styles.datePickerContainer}>
    <label style={styles.dateLabel}>{label}</label>
    <input
      type="date"
      value={value}
      onChange={onChange}
      style={styles.dateInput}
    />
  </div>
);

const StatBox = ({ title, value, filters }) => (
  <div style={styles.statBox}>
    <h2 style={styles.statValue}>{value}</h2>
    <p style={styles.statTitle}>{title}</p>
    <p style={styles.statFilters}>{filters}</p>
  </div>
);

const BarChartComponent = () => (
  <div style={styles.chartBox}>
    <h6 style={styles.chartTitle}>Total Tasks by Section</h6>
    <div style={styles.barChart}>
      <div style={styles.yAxis}>
        <span>4</span>
        <span>2</span>
        <span>0</span>
      </div>
      <div style={styles.barContainer}>
        {barData.map((item) => (
          <div key={item.name} style={styles.barColumn}>
            <div
              style={{
                ...styles.bar,
                height: `${(item.value / 4) * 100}%`,
                backgroundColor: item.color,
              }}
            >
              {item.value > 0 && <span style={styles.barValue}>{item.value}</span>}
            </div>
            <span style={styles.barLabel}>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
    <p style={styles.chartFilters}>No Filters</p>
  </div>
);

const PieChartComponent = () => (
  <div style={styles.chartBox}>
    <h6 style={styles.chartTitle}>Total Tasks by Completion Status</h6>
    <div style={styles.donutChartContainer}>
      <div style={styles.donutChart}>
        <div style={styles.donutHole}></div>
        <div style={{ ...styles.donutRing, background: `conic-gradient(${pieData[0].color} 360deg, ${pieData[0].color} 360deg)` }}></div>
        <div style={styles.donutNumber}>{pieData[0].value}</div>
      </div>
    </div>
    <div style={styles.legend}>
      <div style={styles.legendItem}>
        <div style={{ ...styles.legendColor, backgroundColor: pieData[0].color }}></div>
        <span>{pieData[0].name}</span>
      </div>
    </div>
    <p style={styles.chartFilters}>1 Filter</p>
  </div>
);

const LollipopChartComponent = () => (
  <div style={styles.chartBox}>
    <h6 style={styles.chartTitle}>Upcoming Tasks by Assignee</h6>
    <div style={styles.lollipopChart}>
      {lollipopData.map((item, index) => (
        <div key={index} style={{ ...styles.lollipopItem, height: `${item.value * 20}px` }}>
          <div style={styles.lollipopCircle}></div>
          <div style={styles.lollipopLine}></div>
          <span style={styles.lollipopLabel}>{item.name}</span>
        </div>
      ))}
    </div>
    <p style={styles.chartFilters}>2 Filters</p>
  </div>
);

const LineChartComponent = () => (
  <div style={styles.chartBox}>
    <h6 style={styles.chartTitle}>Task Completion Over Time</h6>
    <div style={styles.lineChart}>
      <div style={styles.yAxis}>
        {[4, 3, 2, 1, ''].map((value, index) => (
          <div key={index}>{value}</div>
        ))}
      </div>
      <div style={styles.lineChartContent}>
        {[0, 1, 2, 3].map((value) => (
          <div key={value} style={{ ...styles.gridLine, bottom: `${value * 25}%` }} />
        ))}
        {lineData.map((item, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${(index / (lineData.length - 1)) * 100}%`,
              bottom: 0,
              width: '1px',
              height: '100%',
            }}
          >
            <div style={styles.dataPoint} />
          </div>
        ))}
      </div>
      <div style={styles.xAxis}>
        {lineData.map((item, index) => (
          index % 2 === 0 && <div key={index}>{item.name}</div>
        ))}
      </div>
    </div>
    <div style={styles.lineLegend}>
      <span style={styles.lineLegendItem}>
        <span style={{ ...styles.lineLegendColor, backgroundColor: '#E0E0E0' }}></span>
        Total
      </span>
      <span style={styles.lineLegendItem}>
        <span style={{ ...styles.lineLegendColor, backgroundColor: '#8884D8' }}></span>
        Completed
      </span>
    </div>
    <p style={styles.chartFilters}>No Filters</p>
  </div>
);

function App() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const dispatch=useDispatch()
  const statistics=useSelector((state)=>state.statistics.list)
  useEffect(()=>{
    const loadData=async()=>{
      await dispatch(fetchStatisticsTask())
    }
    loadData()
  },[dispatch])
  const filteredTasks = statistics.filter((task) => {
    const taskStartDate = new Date(task.thoiGianBatDau);
    const taskEndDate = new Date(task.thoiGianKetThuc);
    const filterStartDate = startDate ? new Date(startDate) : null;
    const filterEndDate = endDate ? new Date(endDate) : null;

    const isStartDateValid = filterStartDate ? taskStartDate >= filterStartDate : true;
    const isEndDateValid = filterEndDate ? taskEndDate <= filterEndDate : true;

    return isStartDateValid && isEndDateValid;
  });
  const completedTasks = filteredTasks.filter(
    (task) => task.mucDoHoanThanh === 100 && task.trangThaiCongViec === true
  ).length;

  const incompleteTasks = filteredTasks.filter(
    (task) => new Date(task.thoiGianKetThuc) > new Date() && task.trangThaiCongViec === false
  ).length;

  const overdueTasks = filteredTasks.filter(
    (task) => new Date(task.thoiGianKetThuc) < new Date() && task.trangThaiCongViec === false
  ).length;

  const totalTasks = filteredTasks.length;
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Tiêu đề
    doc.setFontSize(18);
    doc.text('Task Report', 20, 20);

    // Thêm thông tin thống kê vào PDF
    doc.setFontSize(12);
    doc.text(`Completed tasks: ${completedTasks}`, 20, 30);
    doc.text(`Incomplete tasks: ${incompleteTasks}`, 20, 40);
    doc.text(`Overdue tasks: ${overdueTasks}`, 20, 50);
    doc.text(`Total tasks: ${totalTasks}`, 20, 60);

    // Thêm thông tin chi tiết về các công việc
    const taskDetails = statistics.map((task) => {
      return [
        task.maCongViec,
        task.tenCongViec,
        task.thoiGianBatDau,
        task.thoiGianKetThuc,
        task.mucDoHoanThanh,
        task.trangThaiCongViec ? 'Completed' : 'In Progress'
      ];
    });

    let yPosition = 70;
    doc.autoTable({
      startY: yPosition,
      head: [
        ['Mã Công Việc', 'Tên Công Việc', 'Ngày Bắt Đầu', 'Ngày Kết Thúc', 'Mức Độ Hoàn Thành', 'Trạng Thái']
      ],
      body: taskDetails,
      theme: 'grid'
    });
    doc.save('task_report.pdf');
  };

  return (
    <div style={styles.app}>
      {/* Nút download */}
      <div style={styles.downloadContainer}>
      <button onClick={exportToPDF} style={styles.downloadButton}>
          <div style={styles.downloadContent}>
            <div style={styles.fileInfoWrapper}>
              <span style={styles.pdfIcon}>PDF</span>
              <span>Xuất File Báo Cáo</span>
            </div>
          </div>
        </button>
      </div>

      <div style={styles.header}>
        <div style={styles.datePickersWrapper}>
          <DatePicker
            label="From"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <DatePicker
            label="To"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>
      <div style={styles.statContainer}>
        <StatBox title="Hoàn Thành" value={completedTasks} filters="1 Filter" />
        <StatBox title="Chưa Hoàn Thành" value={incompleteTasks} filters="1 Filter" />
        <StatBox title="Trễ Hạn" value={overdueTasks} filters="1 Filter" />
        <StatBox title="Tổng" value={totalTasks} filters="No Filters" />
      </div>
      <div style={styles.chartContainer}>
        <BarChartComponent />
        <PieChartComponent />
        <LollipopChartComponent />
        <LineChartComponent />
      </div>
    </div>
  );
}
//
const styles = {
  app: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#EEEEEE',
    color: '#fff',
    minHeight: '100vh',
    position: 'relative',
  },
  downloadContainer: {
    position: 'absolute',
    top: '30px',
    left: '30px',
  },
  downloadButton: {
    display: 'block',
    padding: '8px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
    transition: 'background-color 0.2s',
    width: 'fit-content',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    }
  },
  downloadContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fileInfoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  timeInfo: {
    fontSize: '12px',
    color: '#666',
    marginLeft: '-250px',
  },
  pdfIcon: {
    backgroundColor: '#f40f02',
    color: 'white',
    padding: '2px 4px',
    borderRadius: '3px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  fileSize: {
    color: '#666',
    fontSize: '12px',
    marginLeft: '8px',
  },
  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '20px',
    width: '100%',
  },
  datePickersWrapper: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  datePickerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dateLabel: {
    color: '#2D2D2D',
    fontSize: '14px',
    fontWeight: '500',
  },
  dateInput: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #3D3D3D',
    backgroundColor: '#FFFFFF',
    color: '#2D2D2D',
    fontSize: '14px',
    cursor: 'pointer',
    outline: 'none',
  },
  statContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '25px',
    marginBottom: '30px',
    marginTop: '40px',
  },
  statBox: {
    padding: '25px',
    backgroundColor: '#2D2D2D',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  statValue: {
    fontSize: '2.8em',
    margin: '0',
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statTitle: {
    margin: '10px 0',
    fontSize: '1.1em',
    color: '#B0B0B0',
  },
  statFilters: {
    margin: '5px 0 0',
    fontSize: '0.9em',
    color: '#808080',
  },
  chartContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '25px',
  },
  chartBox: {
    padding: '25px',
    backgroundColor: '#2D2D2D',
    borderRadius: '12px',
    position: 'relative',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  chartTitle: {
    margin: '0 0 20px',
    fontSize: '1.3em',
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chartFilters: {
    margin: '20px 0 0',
    fontSize: '0.9em',
    color: '#808080',
  },
  barChart: {
    display: 'flex',
    height: '220px',
    position: 'relative',
    paddingBottom: '30px',
  },
  yAxis: {
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    paddingRight: '15px',
    color: '#B0B0B0',
    fontSize: '0.9em',
  },
  barContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    flex: 1,
    borderBottom: '2px solid #3D3D3D',
  },
  barColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  bar: {
    width: '35px',
    position: 'relative',
    transition: 'height 0.5s ease',
    borderRadius: '6px 6px 0 0',
  },
  barValue: {
    position: 'absolute',
    top: '-25px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#FFFFFF',
    fontSize: '0.9em',
    fontWeight: 'bold',
  },
  barLabel: {
    fontSize: '0.9em',
    color: '#B0B0B0',
    marginTop: '10px',
  },
  donutChartContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '220px',
  },
  donutChart: {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    position: 'relative',
  },
  donutHole: {
    width: '70%',
    height: '70%',
    borderRadius: '50%',
    backgroundColor: '#2D2D2D',
    position: 'absolute',
    top: '15%',
    left: '15%',
  },
  donutRing: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    transition: 'transform 0.3s ease',
  },
  donutNumber: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '2.8em',
    fontWeight: 'bold',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '25px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1em',
  },
  legendColor: {
    width: '14px',
    height: '14px',
    marginRight: '8px',
    borderRadius: '3px',
  },
  lollipopChart: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '220px',
    position: 'relative',
  },
  lollipopItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '25px',
    transition: 'height 0.5s ease',
  },
  lollipopCircle: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    boxShadow: '0 0 10px rgba(76, 175, 80, 0.5)',
  },
  lollipopLine: {
    width: '2px',
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  lollipopLabel: {
    position: 'absolute',
    bottom: '-25px',
    fontSize: '0.9em',
    color: '#B0B0B0',
  },
  lineChart: {
    height: '220px',
    position: 'relative',
    display: 'flex',
    paddingBottom: '30px',
  },
  lineChartContent: {
    flex: 1,
    position: 'relative',
    borderLeft: '2px solid #3D3D3D',
    borderBottom: '2px solid #3D3D3D',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTop: '1px dashed #3D3D3D',
  },
  dataPoint: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#8884D8',
    position: 'absolute',
    bottom: '-4px',
    left: '-4px',
    boxShadow: '0 0 10px rgba(136, 132, 216, 0.5)',
  },
  xAxis: {
    position: 'absolute',
    left: '30px',
    right: 0,
    bottom: '-25px',
    display: 'flex',
    justifyContent: 'space-between',
    color: '#B0B0B0',
    fontSize: '0.9em',
  },
  lineLegend: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '35px',
  },
  lineLegendItem: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '20px',
    fontSize: '1em',
  },
  lineLegendColor: {
    width: '16px',
    height: '16px',
    marginRight: '8px',
    borderRadius: '3px',
  },

};

export default App;