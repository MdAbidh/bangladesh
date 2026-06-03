export const getWelcomeEmailHtml = (name: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:40px 30px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">Welcome to A.H Learning!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px;">
              <p style="color:#333;font-size:16px;margin:0 0 8px;">Hi ${name},</p>
              <p style="color:#666;font-size:15px;margin:0 0 24px;line-height:1.6;">
                Welcome to A.H Learning! We're excited to have you on board.
                Start exploring our courses and begin your learning journey today.
              </p>
              <div style="text-align:center;margin:24px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/courses"
                   style="display:inline-block;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:#ffffff;text-decoration:none;padding:14px 36px;border-radius:8px;font-size:16px;font-weight:600;">
                  Browse Courses
                </a>
              </div>
              <p style="color:#999;font-size:13px;margin:24px 0 0;">
                If you have any questions, feel free to contact our support team.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8f9fa;padding:20px 30px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#999;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} A.H Learning. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
