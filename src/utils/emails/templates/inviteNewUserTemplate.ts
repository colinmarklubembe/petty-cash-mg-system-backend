const inviteNewUserTemplate = (emailData: any) => `
<body style="font-family: 'REM', Arial, sans-serif;background-color: #ffffff;padding: 20px; font-size: 14px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #f3f1f1; color: #333; padding: 8px; text-align: center;">
        <h2 style="margin: 10px 0 0; color:#009699" > NovaCRM </h2>
      </div>
      <div style="padding: 20px">
        <p><b>Hello ${emailData.name},</b></p>
        <p>You've been invited to join NOVA CRM under <strong>${emailData.organization}</strong> organization.
    <p>Your initial login password is: <strong>${emailData.password}</strong></p>
    <p> Use this same email address for login.</p>
    <p>You will login using the current email to which this invite was sent.</p>
        <p>Click the button below to verify your email address:</p>
        <p style="text-align: center">
          <a
            href="${process.env.FRONTEND_URL}/login"
            class="verify-button" style="display: inline-block;padding: 8px 18px; background-color: #009699; color: #ffffff; text-decoration: none; border-radius: 5px;">
            Accept Invite</a>
        </p>
        <hr style="color: #dfdcdc" />
        <div style="color: #333; font-size: 12px; max-width: 550px; margin: 20px auto 0;">
          <p>
            If the button above doesn't work, copy and paste the URL below into
            your web browser:
          </p>
          <p style="word-wrap: break-word; max-width: 100%; color: #009699">
          <a href="${process.env.FRONTEND_URL}/login">${process.env.FRONTEND_URL}/login</a>
          </p>
        </div>
      </div>
    </div>
  </body>`;
export default inviteNewUserTemplate;
