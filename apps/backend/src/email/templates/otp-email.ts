export const getOtpEmailHtml = (otp: string, name: string): string => `
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
              <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">A.H Learning</h1>
              <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:16px;">Email Verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 30px;">
              <p style="color:#333;font-size:16px;margin:0 0 8px;">Hello ${name},</p>
              <p style="color:#666;font-size:15px;margin:0 0 24px;line-height:1.6;">
                Please use the following OTP to verify your email address. This code is valid for 10 minutes.
              </p>
              <div style="text-align:center;margin:24px 0;">
                <div style="display:inline-block;background:#f8f9fa;border-radius:12px;padding:20px 40px;border:2px dashed #667eea;letter-spacing:12px;font-size:36px;font-weight:700;color:#667eea;font-family:'Courier New',monospace;">
                  ${otp}
                </div>
              </div>
              <p style="color:#999;font-size:13px;margin:24px 0 0;">
                If you did not request this verification, please ignore this email.
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
