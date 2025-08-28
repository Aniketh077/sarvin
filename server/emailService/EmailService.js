const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const {
  adminContactFormTemplate,
  customerContactFormTemplate
} = require('./templates/contactFormTemplates');
const {
  newsletterSubscriptionTemplate,
  welcomeNewsletterTemplate
} = require('./templates/newsletterTemplates');
const {
  verificationEmailTemplate,
  passwordResetTemplate,
  welcomeEmailTemplate
} = require('./templates/authTemplates');
const {
  orderConfirmationTemplate,
  orderAdminNotificationTemplate
} = require('./templates/orderTemplates');

class EmailService {
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    this.oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });
    this.adminEmail = process.env.ADMIN_EMAIL;
  }

  async getAccessToken() {
    try {
      const { token } = await this.oauth2Client.getAccessToken();
      return token;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }

  async createTransporter() {
    try {
      console.log('Attempting to get Access Token...');
      const accessToken = await this.getAccessToken();
      console.log('Access Token acquired:');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.GMAIL_USER,
          clientId: process.env.GMAIL_CLIENT_ID,
          clientSecret: process.env.GMAIL_CLIENT_SECRET,
          refreshToken: process.env.GMAIL_REFRESH_TOKEN,
          accessToken: accessToken
        }
         , apiUrl: 'https://gmail.googleapis.com/'
      });

      return transporter;
    } catch (error) {
      console.error('Error creating transporter:', error);
      throw error;
    }
  }

  async sendNewsletterSubscriptionNotification(subscriberData) {
    try {
      const transporter = await this.createTransporter();
      
      const mailOptions = {
  from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
  to: this.adminEmail,
  subject: 'New Newsletter Subscription - Sarvin Electronics',
  html: newsletterSubscriptionTemplate(subscriberData)
};


      await transporter.sendMail(mailOptions);
      console.log('Newsletter subscription notification sent to admin');
      return { success: true, message: 'Newsletter subscription notification sent' };
    } catch (error) {
      console.error('Error sending newsletter subscription notification:', error);
      throw error;
    }
  }

  async sendContactFormNotification(contactData) {
    try {
      const transporter = await this.createTransporter();

      // Email to admin
      const adminMailOptions = {
  from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
  to: this.adminEmail,
  subject: `New Contact Form Submission - ${contactData.subject}`,
  html: adminContactFormTemplate(contactData)
};

const customerMailOptions = {
  from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
  to: contactData.email,
  subject: 'Thank you for contacting Sarvin Electronics',
  html: customerContactFormTemplate(contactData)
};


      // Send both emails
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(customerMailOptions)
      ]);

      console.log('Contact form notifications sent to both admin and customer');
      return { success: true, message: 'Contact form notifications sent' };
    } catch (error) {
      console.error('Error sending contact form notifications:', error);
      throw error;
    }
  }

  async sendWelcomeEmailToSubscriber(subscriberData) {
    try {
      const transporter = await this.createTransporter();
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: subscriberData.email,
        subject: 'Welcome to Sarvin Electronics Newsletter!',
        html: welcomeNewsletterTemplate(subscriberData)
      };

      await transporter.sendMail(mailOptions);
      console.log('Welcome email sent to subscriber');
      return { success: true, message: 'Welcome email sent' };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email, verificationToken, name) {
    try {
      console.log(`Creating transporter for verification email to ${email}...`)
      const transporter = await this.createTransporter();
      console.log('Transporter created. Sending mail...');
      
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html: verificationEmailTemplate(email, verificationUrl, name)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Verification email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email, resetToken, name) {
    try {
      const transporter = await this.createTransporter();
      
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Reset Your Password',
        html: passwordResetTemplate(email, resetUrl, name)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email, name) {
    try {
      const transporter = await this.createTransporter();
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `Welcome to ${process.env.APP_NAME}!`,
        html: welcomeEmailTemplate(email, name)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendOrderConfirmationEmail(order, user) {
    try {
      const transporter = await this.createTransporter();
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: `Order Confirmation - #${order.orderId}`,
        html: orderConfirmationTemplate(order, user)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent to customer:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw error;
    }
  }

  async sendOrderNotificationToAdmin(order, user) {
    try {
      const transporter = await this.createTransporter();
      
      const mailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.GMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Order Received - #${order.orderId}`,
        html: orderAdminNotificationTemplate(order, user)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Order notification email sent to admin:', result.messageId);
      return result;
    } catch (error) {
      console.error('Error sending order notification email to admin:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();