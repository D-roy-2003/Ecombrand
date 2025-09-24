import nodemailer from 'nodemailer'

/**
 * Send OTP email to user
 */
export async function sendOTPEmail(email: string, otp: string, name?: string): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    })

    const mailOptions = {
      from: {
        name: 'ROT KIT',
        address: process.env.EMAIL_USER || 'noreply@rotkit.com'
      },
      to: email,
      subject: 'Verify Your Email - ROT KIT Registration',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification - ROT KIT</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #666;
              font-size: 16px;
            }
            .otp-container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px;
              text-align: center;
              margin: 30px 0;
            }
            .otp-code {
              font-size: 36px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 20px 0;
              font-family: 'Courier New', monospace;
            }
            .message {
              font-size: 16px;
              margin-bottom: 20px;
              line-height: 1.5;
            }
            .warning {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              color: #856404;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">ROT KIT</div>
              <div class="subtitle">Fashion & Lifestyle</div>
            </div>
            
            <div class="message">
              <p>Hello${name ? ` ${name}` : ''},</p>
              <p>Welcome to ROT KIT! To complete your registration, please verify your email address using the OTP code below:</p>
            </div>
            
            <div class="otp-container">
              <div>Your Verification Code</div>
              <div class="otp-code">${otp}</div>
              <div>This code will expire in 5 minutes</div>
            </div>
            
            <div class="message">
              <p>Enter this code on the registration page to verify your email and complete your account setup.</p>
            </div>
            
            <div class="warning">
              <strong>Security Note:</strong> Never share this code with anyone. ROT KIT will never ask for your verification code via phone or email.
            </div>
            
            <div class="footer">
              <p>If you didn't request this verification, please ignore this email.</p>
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; 2024 ROT KIT. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        ROT KIT - Email Verification
        
        Hello${name ? ` ${name}` : ''},
        
        Welcome to ROT KIT! To complete your registration, please verify your email address using the OTP code below:
        
        Verification Code: ${otp}
        
        This code will expire in 5 minutes.
        
        Enter this code on the registration page to verify your email and complete your account setup.
        
        If you didn't request this verification, please ignore this email.
        
        © 2024 ROT KIT. All rights reserved.
      `
    }

    await transporter.sendMail(mailOptions)
    
    return {
      success: true,
      message: 'OTP sent successfully to your email address.'
    }
  } catch (error) {
    console.error('Email sending error:', error)
    return {
      success: false,
      message: 'Failed to send OTP email. Please try again later.'
    }
  }
}

/**
 * Send welcome email after successful registration
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    })

    const mailOptions = {
      from: {
        name: 'ROT KIT',
        address: process.env.EMAIL_USER || 'noreply@rotkit.com'
      },
      to: email,
      subject: 'Welcome to ROT KIT - Registration Successful!',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ROT KIT</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 10px;
            }
            .welcome-message {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 10px;
              text-align: center;
              margin: 30px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">ROT KIT</div>
            </div>
            
            <div class="welcome-message">
              <h2>Welcome to ROT KIT, ${name}! 🎉</h2>
              <p>Your account has been successfully created and verified.</p>
            </div>
            
            <div style="text-align: center;">
              <p>Thank you for joining ROT KIT! You can now explore our latest fashion collections and start shopping.</p>
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/shop" class="button">Start Shopping</a>
            </div>
            
            <div class="footer">
              <p>If you have any questions, feel free to contact our support team.</p>
              <p>&copy; 2024 ROT KIT. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    await transporter.sendMail(mailOptions)
    
    return {
      success: true,
      message: 'Welcome email sent successfully.'
    }
  } catch (error) {
    console.error('Welcome email sending error:', error)
    return {
      success: false,
      message: 'Failed to send welcome email.'
    }
  }
}
