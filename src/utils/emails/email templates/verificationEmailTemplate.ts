const verificationEmailTemplate = (emailData: any) => `
<body style="font-family: 'REM', Arial, sans-serif;background-color: #ffffff;padding: 20px; font-size: 14px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #F05A28; color: #ffffff; padding: 8px; text-align: center;">
        <h2 style="margin: 10px 0 0;">CashFusion</h2>
      </div>
      <div style="padding: 20px">
        <p><b>Welcome ${emailData.name},</b></p>
        <p>Thank you for signing up. We're excited to have you on board.</p>
        <p>Click the button below to verify your email address:</p>
        <p style="text-align: center">
          <a
            href="${process.env.BASE_URL}/api/auth/verify?token=${emailData.token}"
            class="verify-button" style="display: inline-block;padding: 8px 18px; background-color: #202046; color: #ffffff; text-decoration: none; border-radius: 5px;">
            Verify Email</a>
        </p>
        <hr style="color: #dfdcdc" />
        <div style="color: #333; font-size: 12px; max-width: 550px; margin: 20px auto 0;">
          <p>
            If the button above doesn't work, copy and paste the URL below into
            your web browser:
          </p>
          <p style="word-wrap: break-word; max-width: 100%; color: #202046">
          <a href="${process.env.BASE_URL}/api/auth/verify?token=${emailData.token}">${process.env.BASE_URL}/api/auth/verify?token=${emailData.token}</a>
          </p>
        </div>
      </div>
    </div>
  </body>`;
export default verificationEmailTemplate;
