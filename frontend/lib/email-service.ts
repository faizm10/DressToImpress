interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  private static instance: EmailService;
  private emailProvider: 'resend' | 'mock';

  private constructor() {
    // Determine which email provider to use based on environment variables
    // Prioritize Resend as it's the recommended provider for Next.js
    if (process.env.RESEND_API_KEY) {
      this.emailProvider = 'resend';
      console.log('Email service: Using Resend provider');
    } else {
      this.emailProvider = 'mock';
      console.log('Email service: Using mock provider (development mode)');
    }
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; error?: string }> {
    try {
      switch (this.emailProvider) {
        case 'resend':
          return await this.sendWithResend(emailData);
        case 'mock':
        default:
          return await this.sendMock(emailData);
      }
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async sendWithResend(emailData: EmailData) {
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const result = await resend.emails.send({
        from: emailData.from || 'Dress To Impress <onboarding@resend.dev>',
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
      });

      if (result.error) {
        console.error('Resend API error:', result.error);
        return { success: false, error: result.error.message || 'Resend API error' };
      }

      return { success: true };
    } catch (error) {
      console.error('Resend error:', error);
      if (error instanceof Error && error.message.includes('Cannot find module')) {
        return { success: false, error: 'Resend package not installed. Run: npm install resend' };
      }
      return { success: false, error: error instanceof Error ? error.message : 'Resend error' };
    }
  }

  private async sendMock(emailData: EmailData) {
    // Mock implementation for development/testing
    console.log('Mock email would be sent:', {
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html.substring(0, 200) + '...',
    });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return { success: true };
  }
}

export const emailService = EmailService.getInstance(); 