import API_ENDPOINTS from "../constant/linkapi"

export const generateDeadlineNotification = (taskName,dueDate) => {
  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333333;
          }
          .email-container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .logo {
            margin-bottom: 24px;
          }
          .warning-icon {
            width: 36px;
            height: 36px;
            margin-bottom: 16px;
          }
          .email-header {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            margin-bottom: 20px;
          }
          .email-body {
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
            margin-bottom: 24px;
          }
          .highlight {
            color: #d35400;
            font-weight: bold;
          }
          .cta-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #d93025;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            margin: 16px 0;
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #888888;
            border-top: 1px solid #dddddd;
            padding-top: 20px;
          }
          .footer a {
            color: #888888;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">Thông Báo Công Việc Sắp Hết Hạn</div>
          <div class="email-body">
            <p>
              Công việc <span class="highlight">${taskName}</span> mà bạn phụ
              trách sắp đến hạn hoàn thành.
            </p>
            <p>
              Ngày hết hạn dự kiến: <span class="highlight">${dueDate}</span>
            </p>
            <p>
              Vui lòng kiểm tra lại và hoàn tất công việc trước thời hạn để đảm bảo
              tiến độ dự án.
            </p>
            <a href="${API_ENDPOINTS.EMAIL}/taskassignment" class="cta-button">Xem Chi Tiết Công Việc</a>
          </div>
          <div class="footer">
            <p>
              Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ quản lý dự án.
            </p>
          </div>
        </div>
      </body>
    </html>
  `
}
