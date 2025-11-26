// config/emailConfig.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// PERBAIKAN: createTransport (bukan createTransporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verifikasi koneksi
transporter.verify((error, success) => {
  if (error) {
    console.log('Error koneksi email:', error);
  } else {
    console.log('Server email siap mengirim pesan');
  }
});

// Export fungsi sendEmail
export const sendEmail = async ({ sendTo, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sendTo,
      subject: subject,
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email terkirim:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error mengirim email:', error);
    return { success: false, error: error.message };
  }
};

// Export default transporter juga jika diperlukan
export default transporter;