const nodemailer = require("nodemailer");

// Create a transporter object using SMTP transport with Gmail incluiding TLS settings
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true, // use SSL
  port: 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: false,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000, // 10 seconds
  socketTimeout: 20000, // 20 seconds
});

async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"InstaMato 🍔" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email sending error:", error);
    try {
      await new Promise((res) => setTimeout(res, 500));
      const info = await transporter.sendMail({
        from: `"InstaMato" <${process.env.MAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.log("Email sent on retry:", info.messageId);
      return true;
    } catch (err2) {
      console.error("Email failed again:", err2.message);
      return false;
    }
  }
}

module.exports = sendEmail;
