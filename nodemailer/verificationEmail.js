import { transporter } from "../services/email.service.js";

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;

  const mailOptions = {
    from: `"YourApp" <${process.env.USER_NAME}>`,
    to: email, // Now it will send to the actual user's email
    subject: 'Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <!-- Main Card -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 20px;">
            
            <!-- Logo/Avatar -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);">
                <span style="font-size: 32px; color: white;">📧</span>
              </div>
            </div>

            <!-- Main Content -->
            <div style="text-align: center; color: white;">
              <h1 style="margin: 0 0 20px 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                Confirm Your Account
              </h1>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; color: rgba(255,255,255,0.9); max-width: 400px; margin-left: auto; margin-right: auto;">
                We're excited to have you on board! Please verify your email address to complete your registration.
              </p>

              <!-- CTA Button -->
              <div style="margin: 30px 0;">
                <a href="${verifyUrl}" style="display: inline-block; background-color: #ffffff; color: #667eea; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: all 0.3s ease; border: 2px solid transparent;">
                  Verify Email Address
                </a>
              </div>

              <p style="margin: 20px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.8);">
                ⏰ This link will expire in 1 hour
              </p>
            </div>
          </div>

          <!-- Help Section -->
          <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px;">
            <h2 style="margin: 0 0 15px 0; font-size: 20px; color: #2d3748; font-weight: 600;">
              Need Help?
            </h2>
            
            <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px;">
              If you didn't request this email, you can safely ignore it.
            </p>
            
            <p style="margin: 0; color: #4a5568; font-size: 14px;">
              If you have any questions, feel free to reach out to our support team.
            </p>

            <!-- Alternative Link -->
            <div style="margin-top: 25px; padding: 15px; background-color: #f7fafc; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #2d3748; font-weight: 600;">
                Button not working?
              </p>
              <p style="margin: 0; font-size: 13px; color: #4a5568; word-break: break-all;">
                Copy and paste this link into your browser: <br>
                <span style="color: #667eea;">${verifyUrl}</span>
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #a0aec0; font-size: 12px;">
            <p style="margin: 0 0 10px 0;">
              Made by <strong style="color: #667eea;">Digpal Singh</strong>
            </p>
            <p style="margin: 0;">
              © 2024 YourApp. All rights reserved.
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};