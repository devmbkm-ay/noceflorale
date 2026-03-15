import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const createEmailTransporter = async () => {
  // Check if we have SMTP credentials
  const hasCredentials = process.env.SMTP_USER && process.env.SMTP_PASS && 
                        process.env.SMTP_PASS !== 'your_app_password_here';

  if (!hasCredentials) {
    console.log('⚠️ No valid SMTP credentials found. Creating test account for development.');
    
    try {
      // Create test account using Ethereal Email
      const testAccount = await nodemailer.createTestAccount();
      
      const transporter = nodemailer.createTransporter({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('📧 Test email account created:');
      console.log('- Preview URL will be logged after sending');
      console.log('- Test account user:', testAccount.user);
      
      return transporter;
    } catch (error) {
      console.error('❌ Error creating test email account:', error);
      return null;
    }
  }

  // Use real SMTP configuration
  const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    },
  };

  try {
    const transporter = nodemailer.createTransporter(emailConfig);
    console.log('✅ Real email transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Error creating email transporter:', error);
    return null;
  }
};

// Generate HTML email template
const generateHtmlTemplate = (subject, guestName, message, fromName) => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
            body {
                font-family: 'Georgia', serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background: linear-gradient(135deg, #6366f1, #8b5cf6);
                color: white;
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 300;
            }
            .content {
                background: #f8fafc;
                padding: 30px;
                border-radius: 0 0 10px 10px;
            }
            .greeting {
                font-size: 18px;
                color: #6366f1;
                margin-bottom: 20px;
            }
            .message {
                background: white;
                padding: 25px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #6366f1;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .signature {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                color: #64748b;
                font-style: italic;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding: 20px;
                color: #64748b;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>💐 Noce Florale</h1>
        </div>
        <div class="content">
            <div class="greeting">
                Bonjour ${guestName},
            </div>
            
            <div class="message">
                ${message.replace(/\n/g, '<br>')}
            </div>
            
            <div class="signature">
                Avec nos meilleurs sentiments,<br>
                <strong>${fromName}</strong>
            </div>
        </div>
        <div class="footer">
            Ce message vous a été envoyé dans le cadre de votre invitation à notre mariage.<br>
            Si vous avez des questions, n'hésitez pas à nous contacter.
        </div>
    </body>
    </html>
  `;
};

// Generate text email template
const generateTextTemplate = (guestName, message, fromName) => {
  return `
Bonjour ${guestName},

${message}

Avec nos meilleurs sentiments,
${fromName}

---
Ce message vous a été envoyé dans le cadre de votre invitation à notre mariage.
Si vous avez des questions, n'hésitez pas à nous contacter.
  `;
};

// Create mail options object
const createMailOptions = (guestEmail, subject, htmlContent, textContent, fromEmail, fromName) => {
  return {
    from: `"${fromName}" <${fromEmail}>`,
    to: guestEmail,
    subject: subject,
    text: textContent,
    html: htmlContent,
  };
};

// Send feedback email to a guest
export const sendFeedbackEmail = async ({
  guestEmail,
  guestName,
  subject,
  message,
  fromEmail = process.env.SMTP_USER || 'wedding@noce-florale.com',
  fromName = 'Équipe Noce Florale'
}) => {
  const transporter = await createEmailTransporter();
  
  if (!transporter) {
    throw new Error('Email transporter is not configured. Please check your SMTP settings.');
  }

  // Generate email content
  const htmlContent = generateHtmlTemplate(subject, guestName, message, fromName);
  const textContent = generateTextTemplate(guestName, message, fromName);
  const mailOptions = createMailOptions(guestEmail, subject, htmlContent, textContent, fromEmail, fromName);

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Feedback email sent successfully:', info.messageId);
    
    // Log preview URL for test emails (Ethereal)
    if (info.messageId && process.env.SMTP_PASS === 'your_app_password_here') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log('📧 Preview URL:', previewUrl);
      }
    }
    
    return {
      success: true,
      messageId: info.messageId,
      recipient: guestEmail,
    };
  } catch (error) {
    console.error('❌ Error sending feedback email:', error);
    throw new Error(`Failed to send feedback email: ${error.message}`);
  }
};

// Send bulk feedback emails
export const sendBulkFeedbackEmails = async (emails) => {
  const results = [];
  const transporter = await createEmailTransporter();
  
  if (!transporter) {
    throw new Error('Email transporter is not configured. Please check your SMTP settings.');
  }

  for (const emailData of emails) {
    try {
      const result = await sendFeedbackEmail(emailData);
      results.push({ ...result, status: 'sent' });
      
      // Add delay between emails to avoid overwhelming the SMTP server
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({
        success: false,
        recipient: emailData.guestEmail,
        error: error.message,
        status: 'failed'
      });
    }
  }

  return results;
};

// Test email configuration
export const testEmailConfiguration = async () => {
  const transporter = await createEmailTransporter();
  
  if (!transporter) {
    return { success: false, error: 'Email transporter not configured' };
  }

  try {
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
