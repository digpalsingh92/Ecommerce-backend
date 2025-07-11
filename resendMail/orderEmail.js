import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


export const sendOrderConfirmationEmail = async (order) => {
  if (!order || !order.user || !order.user.email) {
    console.error("Order data:", order);
    throw new Error("Order data is incomplete", error);
  }

  const { fullName, email } = order.user;

  const itemsList = order.items
    .map(
      (item) =>
        `<li>${item.product.title} - ₹${item.product.price} × ${item.quantity}</li>`
    )
    .join("");

  const { data, error } = await resend.emails.send({
    from: "Digpal <onboarding@resend.dev>",
    to: "digpalsingh18901@gmail.com",
    subject: "Order Confirmation",
    html: `
      <h2>Hi ${fullName},</h2>
      <p>Thank you for your order!</p>
      <h3>Order ID: ${order._id}</h3>
      <ul>${itemsList}</ul>
      <p><strong>Total:</strong> ₹${order.totalAmount}</p>
      <p>Status: ${order.status}</p>
    `,
  });

  console.log("Email sent:", data);

  if (error) {
    throw new Error("Failed to send order confirmation email", error);
  }

  return data;
};
