import API_ENDPOINTS from "../constant/linkapi";

export const generateEmailTemplate = (employee) => {
    return `
      <html>
          <head>
              <style>
                  body {
                      margin: 0;
                      padding: 0;
                      font-family: Arial, sans-serif;
                      background-color: #f4f4f4;
                  }
                  .email-container {
                      max-width: 600px;
                      margin: 20px auto;
                      padding: 20px;
                      background-color: #ffffff;
                      border-radius: 10px;
                      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                      line-height: 1.6;
                  }
                  .email-header {
                      font-size: 24px;
                      font-weight: bold;
                      color: #2e86c1;
                      text-align: center;
                      margin-bottom: 20px;
                  }
                  .email-body {
                      font-size: 16px;
                      color: #333;
                  }
                  p {
                      margin: 10px 0;
                  }
                  .highlight {
                      color: #d35400;
                      font-weight: bold;
                  }
                  .button-container {
                      text-align: center;
                      margin-top: 20px;
                  }
                  .action-button {
                      display: inline-block;
                      padding: 12px 24px;
                      background-color: #2e86c1;
                      color: #fff;
                      text-decoration: none;
                      font-size: 16px;
                      font-weight: bold;
                      border-radius: 5px;
                      transition: background-color 0.3s ease;
                  }
                  .action-button:hover {
                      background-color: #1a5276;
                  }
                  .footer {
                      margin-top: 30px;
                      font-size: 14px;
                      color: #888;
                      text-align: center;
                  }
              </style>
          </head>
          <body>
              <div class="email-container">
                  <div class="email-header">Xin chào ${employee.tenNhanVien},</div>
                  <div class="email-body">
                      <p>Bạn đã được chọn để tham gia dự án với vai trò: <span class="highlight">${employee.vaiTro}</span>.</p>
                      <p>Vui lòng kiểm tra lại chi tiết trong hệ thống quản lý công việc của chúng tôi.</p>
                      <div class="button-container">
                          <a href="${API_ENDPOINTS.EMAIL}/taskassignment" class="action-button">Truy cập ứng dụng</a>
                      </div>
                      <p>Trân trọng,</p>
                      <p>Đội ngũ quản lý dự án</p>
                  </div>
                  <div class="footer">
                      <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email <a href="mailto:support@company.com">support@company.com</a>.</p>
                  </div>
              </div>
          </body>
      </html>
    `;
};
