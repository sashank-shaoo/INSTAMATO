import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: "InstaMato 🍔 <no-reply@yourdomain.com>", // use your domain or default resend.dev
      to,
      subject,
      html,
    });
    console.log("Email sent:", data);
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

export default sendEmail;
