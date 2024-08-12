const updatedProfileEmailTemplate = (emailData: any) => `
<body style="font-family: 'REM', Arial, sans-serif;background-color: #ffffff;padding: 20px; font-size: 14px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #F05A28; color: #ffffff; padding: 8px; text-align: center;">
        <h2 style="margin: 10px 0 0;">CashFusion</h2>
      </div>
      <div style="padding: 20px">
        <p><b>Dear ${emailData.name},</b></p>
        <p>Your profile has been successfully updated. Here are the details:</p>
        <ul>
            <li><strong>Name:</strong> ${emailData.name}</li>
            <li><strong>Email:</strong> ${emailData.email}</li>
        </ul>
        <p>You can view and manage your profile using the following link:</p>
        <p style="text-align: center">
          <a
            href="${process.env.FRONTEND_URL}/profile"
            class="verify-button" style="display: inline-block;padding: 8px 18px; background-color: #202046; color: #ffffff; text-decoration: none; border-radius: 5px;">
            View Profile</a>
        </p>
        <hr style="color: #dfdcdc" />
        <div style="color: #333; font-size: 12px; max-width: 550px; margin: 20px auto 0;">
          <p>
            If you did not make this change or if you have any concerns, please contact our support team immediately at <a href="mailto:support@cashfusion.com">support@cashfusion.com</a>.
          </p>
        </div>
      </div>
    </div>
  </body>`;
export default updatedProfileEmailTemplate;
