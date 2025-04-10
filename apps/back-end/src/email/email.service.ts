import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class EmailService {
  private readonly apiKey: string;
  private readonly senderEmail: string;
  private readonly senderName: string;
  private readonly frontendUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = configService.get<string>('BREVO_API_KEY') || '';
    this.senderEmail = configService.get<string>(
      'EMAIL_SENDER_ADDRESS',
      'nourprone@gmail.com',
    );
    this.senderName = configService.get<string>(
      'EMAIL_SENDER_NAME',
      'Your App Name',
    );
    this.frontendUrl = configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
  }

  /**
   * Send password reset email using Brevo API
   */
  async sendPasswordResetEmail(
    recipientEmail: string,
    token: string,
  ): Promise<any> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;
    console.log('resetUrl', resetUrl);
    console.log('api key', this.apiKey);
    console.log('sender email', this.senderEmail);
    console.log('sender name', this.senderName);

    const emailData = {
      sender: {
        name: this.senderName,
        email: this.senderEmail,
      },
      to: [{ email: recipientEmail }],
      subject: 'Reset Your Password',
      htmlContent: `
        <html>
          <body>
            <h1>Reset Your Password</h1>
            <p>You requested a password reset for your account.</p>
            <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
            <p>If you didn't request this, please ignore this email or contact support if you have concerns.</p>
            <p>If the button doesn't work, copy and paste this URL into your browser:</p>
            <p>${resetUrl}</p>
          </body>
        </html>
      `,
      textContent: `
        Reset Your Password
        
        You requested a password reset for your account.
        
        To reset your password, visit the following link (expires in 1 hour):
        ${resetUrl}
        
        If you didn't request this, please ignore this email or contact support if you have concerns.
      `,
    };

    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        emailData,
        {
          headers: {
            accept: 'application/json',
            'api-key': this.apiKey,
            'content-type': 'application/json',
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(
        'Error sending password reset email:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}
