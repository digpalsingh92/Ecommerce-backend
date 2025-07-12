import { transporter } from "../services/email.service.js";

export const sendOrderConfirmationEmail = async (order) => {
  if (!order || !order.user || !order.user.email) {
    console.error("Order data:", order);
    throw new Error("Order data is incomplete");
  }

  const { fullName, email } = order.user;

  const itemsList = order.items
    .map(
      (item) =>
        `<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
          <div style="flex: 1;">
            <span style="font-size: 15px; color: #2d3748; font-weight: 500;">${item.product.title}</span>
            <span style="font-size: 14px; color: #718096; margin-left: 8px;">× ${item.quantity}</span>
          </div>
          <span style="font-size: 15px; font-weight: 600; color: #2d3748;">₹${item.product.price}</span>
        </div>`
    )
    .join("");

  const statusColor = order.status === 'pending' ? '#f59e0b' : order.status === 'confirmed' ? '#10b981' : '#6b7280';
  const statusBg = order.status === 'pending' ? '#fef3c7' : order.status === 'confirmed' ? '#d1fae5' : '#f3f4f6';

  const mailOptions = {
    from: `"Digpal" <${process.env.EMAIL_USER}>`,
    to: email, // Now sends to actual user email
    subject: 'Order Confirmation - Thank You!',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 20px; text-align: center;">
            <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 32px; color: white;">🎉</span>
            </div>
            
            <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 700; color: white;">
              Order Confirmed!
            </h1>
            <p style="margin: 0; font-size: 16px; color: rgba(255,255,255,0.9);">
              Hi ${fullName}, thank you for your order!
            </p>
          </div>

          <!-- Order Summary -->
          <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px;">
            <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #2d3748; font-weight: 600;">
              Order Summary
            </h2>
            
            <!-- Order ID -->
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #667eea;">
              <p style="margin: 0 0 5px 0; font-size: 14px; color: #4a5568;">Order ID</p>
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #2d3748; font-family: monospace;">${order._id}</p>
            </div>

            <!-- Status -->
            <div style="margin-bottom: 25px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #4a5568;">Status</p>
              <span style="display: inline-block; background-color: ${statusBg}; color: ${statusColor}; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">
                ${order.status}
              </span>
            </div>

            <!-- Items -->
            <div style="margin-bottom: 20px;">
              <p style="margin: 0 0 15px 0; font-size: 16px; color: #2d3748; font-weight: 600;">Items Ordered</p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px;">
                ${itemsList}
              </div>
            </div>

            <!-- Total -->
            <div style="background-color: #667eea; color: white; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="margin: 0 0 5px 0; font-size: 14px; opacity: 0.9;">Total Amount</p>
              <p style="margin: 0; font-size: 24px; font-weight: 700;">₹${order.totalAmount}</p>
            </div>
          </div>

          <!-- What's Next -->
          <div style="background-color: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #2d3748; font-weight: 600;">
              What's Next?
            </h3>
            
            <ul style="margin: 0; padding-left: 20px; color: #4a5568; font-size: 14px;">
              <li style="margin-bottom: 8px;">We'll process your order within 24 hours</li>
              <li style="margin-bottom: 8px;">You'll receive a shipping confirmation email</li>
              <li style="margin-bottom: 8px;">Track your order status in your account</li>
              <li>Contact support if you have any questions</li>
            </ul>
          </div>

          <!-- Footer -->
          <div style="text-align: center; padding: 20px; color: #a0aec0; font-size: 12px;">
            <p style="margin: 0 0 10px 0;">
              Made with ❤️ by <strong style="color: #667eea;">Digpal Singh</strong>
            </p>
            <p style="margin: 0;">
              © 2024 YourApp. All rights reserved.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 11px;">
              If you have any questions, reply to this email or contact our support team.
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order confirmation:', error);
    throw new Error('Failed to send order confirmation email');
  }
};