// utils/emailTemplates.js

export const welcomeEmailTemplate = (user) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background: white;
        }
        .header { 
          background: #4CAF50; 
          color: white; 
          padding: 20px; 
          text-align: center; 
          border-radius: 5px 5px 0 0;
        }
        .content { 
          padding: 30px; 
          background: #f9f9f9;
        }
        .footer { 
          text-align: center; 
          padding: 20px; 
          font-size: 12px; 
          color: #666; 
          background: white;
          border-radius: 0 0 5px 5px;
        }
        .button { 
          background: #2196F3; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 5px; 
          display: inline-block;
          margin: 15px 0;
          border: none;
          cursor: pointer;
          font-size: 16px;
        }
        .user-info {
          background: white;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
          border-left: 4px solid #4CAF50;
        }
        .button-container {
          text-align: center;
          margin: 25px 0;
        }
        .verification-note {
          background: #fff3cd;
          padding: 15px;
          border-radius: 5px;
          border-left: 4px solid #ffc107;
          margin: 15px 0;
        }
        .url-box {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 5px;
          word-break: break-all;
          font-size: 14px;
          border: 1px solid #ddd;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Selamat Datang di Awan Store! 🎉</h1>
        </div>
        <div class="content">
          <h2>Halo ${user.name},</h2>
          <p>Terima kasih telah mendaftar di <strong>Awan Store</strong>. Akun Anda telah berhasil dibuat.</p>
          
          <div class="user-info">
            <p><strong>Detail Akun Anda:</strong></p>
            <p>📧 Email: ${user.email}</p>
            <p>📅 Tanggal Registrasi: ${user.date}</p>
          </div>

          <div class="verification-note">
            <p><strong>⚠️ Verifikasi Email Diperlukan</strong></p>
            <p>Untuk melengkapi registrasi dan mengaktifkan akun Anda, silakan verifikasi alamat email Anda.</p>
          </div>

          <div class="button-container">
            <a href="${user.url}" class="button">
              ✅ Verifikasi Email Saya
            </a>
          </div>

          <p>Atau copy dan paste link berikut di browser Anda:</p>
          <div class="url-box">
            ${user.url}
          </div>

          <p><strong>Penting:</strong> Link verifikasi akan kadaluarsa dalam 24 jam.</p>
          
          <p>Jika Anda tidak merasa mendaftar di Awan Store, silakan abaikan email ini.</p>
          
          <p>Salam hangat,<br><strong>Tim Awan Store</strong></p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Awan Store. Semua hak dilindungi.</p>
          <p>Email ini dikirim secara otomatis, mohon tidak membalas.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Export lainnya jika ada (opsional)
export const verifyEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2196F3; color: white; padding: 10px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { background: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verifikasi Email</h1>
        </div>
        <div class="content">
          <h2>Halo ${data.name},</h2>
          <p>Silakan verifikasi email Anda dengan klik tombol berikut:</p>
          <a href="${data.url}" class="button">Verifikasi Email</a>
          <p>Atau copy link ini: ${data.url}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};