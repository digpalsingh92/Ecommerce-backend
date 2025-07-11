import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

export const testEmail = async () => {
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: 'digpalsingh18901@gmail.com',
    subject: 'Test Email',
    html: '<h1>Hello World</h1>',
  });

  console.log({ data, error });
}

testEmail();
