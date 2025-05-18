import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.BASE_URL}/api/auth/verify-email/${token}`;

  const { data, error } = await resend.emails.send({
    from: 'YourApp <onboarding@resend.dev>', // You can set this in Resend dashboard
    to: email,
    subject: 'Verify Your Email',
    html: `
      <div style="display: flex; justify-content: center; align-items: center; padding: 20px; background-color: #f4f4f4;">
      <div style="font-family: sans-serif; background-color: rgb(148, 164, 180); padding: 20px; border-radius: 20px; width: 400px;">
        <img
          src="https://resend.dev/logo.png"
          alt="Digpal Singh"
          style="width: 100px; height: 100px; border-radius: 50%"
        />
        <h2>Confirm Your Account</h2>
        <p>Please verify your email by clicking the link below:</p>
       <button style="padding: 10px; border-radius: 10px; border: 1px solid darkcyan; cursor: pointer; background-color: darkcyan;"> <a style="text-decoration: none; font-weight: 600; color: #f4f4f4;" href="${verifyUrl}">Verify Email</a></button>
        <p>This link will expire in 1 hour.</p>
      </div>
      <div style="font-family: sans-serif; margin-top: 20px; padding: 10px; border-radius: 20px;">
        <h3>Need Help?</h3>
        <p>If you didn't request this email, please ignore it.</p>
        <p>If you have any questions, feel free to reach out to us.</p>
      </div>
      <p>Maded By Digpal Singh</p>
    </div>
    `,
  });
  console.log("Email sent:", data);

  if (error) {
    throw new Error("Failed to send verification email");
  }

  return data;
};
