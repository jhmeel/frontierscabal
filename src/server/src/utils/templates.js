import { Config} from "../config/config.js";
const {NAME} = Config

export const welcomeMsg = (username)=>{

 return { subject: "Welcome Aboard!",
  content: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome aboard!</title>
  </head>
  <body style="background-color: #fff; font-family: sans-serif; padding: 30px;">
    <div style="background-color: white; border-radius: 5px; box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.1); max-width: 500px; margin: 0 auto; padding: 30px;">
      <h1 style="color: #0078FF; margin-bottom: 20px;">Welcome to frontierscabal ${username}!</h1>
      <p style="font-size: 18px;">Thank you for signing up. We are excited to have you on board!</p>
      <p style="font-size: 18px;">To get started, you can:</p>
      <ul style="font-size: 18px; padding-left: 30px;">
        <li>Explore our app features</li>
        <li>Update your profile information</li>
        <li>Contact us if you have any questions</li>
      </ul>
      <p style="font-size: 18px;">If you have any questions or need any help, feel free to contact us at any time.</p>
      <p style="font-size: 18px;">Thank you,</p>
      <hr>
      <p style="font-size: 18px;">The ${NAME.toLocaleLowerCase()} Team</p>
    </div>
  </body>
</html>

`,
};

}

export const resetPasswordMessage = (resetUrl) => {
  return {
    subject: "Reset Password",
    content: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
           
            body {
              font-family: Arial, sans-serif;
              background-color: #fff;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 4px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1 {
              font-size: 24px;
              margin-bottom: 20px;
              color: #333;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
              color: #555;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #176984;
              color: #fff;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              transition:.3s ease-in;
              border:none;
            }
            .button:hover {
              border: 2px solid #176984;
              color: #176984;
              background-color:transparent;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 14px;
              color: #888;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Reset</h1>
            <p>Please click on the button below to reset your password:</p>
            <a href=${resetUrl} class="button">Reset</a>
            <p>If you have any questions or need any help, feel free to contact us at any time.</p>
            <p>Thank you,</p>
            <p>The frontierscabal Team</p>
          </div>
          <div class="footer">
            This email was sent by frontierscabal. Please do not reply to this email.
          </div>
        </body>
        </html>
        
        `,
  };
};
