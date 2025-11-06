const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: "InstaMato 🍔 <onboarding@resend.dev>",
      to,
      subject,
      html,
      text: "Please view this email in an HTML compatible client.",
    });
    console.log("Email sent:", data);
  } catch (error) {
    console.error("Email sending error:", error);
  }
};

module.exports = sendEmail;
