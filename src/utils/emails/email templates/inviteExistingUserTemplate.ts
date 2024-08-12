const inviteExistingUserTemplate = (emailData: any) => `
<body style="font-family: 'REM', Arial, sans-serif; background-color: #ffffff; padding: 20px; font-size: 14px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #F05A28; color: #ffffff; padding: 8px; text-align: center;">
        <h3 style="margin: 10px 0 0;">CashFusion</h3>
      </div>
      <div style="padding: 20px">
        <p><b>Hello ${emailData.name},</b></p>
        <p>You've been invited to use CashFusion under the <strong>${emailData.companyName}</strong> organization.</p>
        <p style="text-align: center">
          <a
            href="${process.env.FRONTEND_URL}/login"
            class="verify-button" style="display: inline-block; padding: 8px 18px; background-color: #202046; color: #ffffff; text-decoration: none; border-radius: 5px;">
            Accept Invite</a>
        </p>
        <hr style="color: #dfdcdc" />
        <div style="color: #333; font-size: 12px; max-width: 550px; margin: 20px auto 0;">
          <p>If the button above doesn't work, copy and paste the URL below into your web browser:</p>
          <p style="word-wrap: break-word; max-width: 100%; color: #202046;">
            <a href="${process.env.FRONTEND_URL}/login">${process.env.FRONTEND_URL}/login</a>
          </p>
        </div>
      </div>
    </div>
  </body>`;
export default inviteExistingUserTemplate;
