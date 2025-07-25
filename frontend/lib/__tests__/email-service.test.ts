import { emailService } from '../email-service';

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
  console.log = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

describe('EmailService', () => {
  beforeEach(() => {
    // Clear environment variables
    delete process.env.RESEND_API_KEY;
    delete process.env.SENDGRID_API_KEY;
    delete process.env.SMTP_HOST;
  });

  it('should use mock mode when no email provider is configured', async () => {
    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test content</p>',
    });

    expect(result.success).toBe(true);
    expect(console.log).toHaveBeenCalledWith(
      'Mock email would be sent:',
      expect.objectContaining({
        to: 'test@example.com',
        subject: 'Test Subject',
      })
    );
  });

  it('should use Resend when RESEND_API_KEY is set', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    
    // Mock the Resend import
    jest.doMock('resend', () => ({
      Resend: jest.fn().mockImplementation(() => ({
        emails: {
          send: jest.fn().mockResolvedValue({ id: 'test-id' }),
        },
      })),
    }));

    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test content</p>',
    });

    expect(result.success).toBe(true);
  });

  it('should use SendGrid when SENDGRID_API_KEY is set', async () => {
    process.env.SENDGRID_API_KEY = 'test-key';
    
    // Mock the @sendgrid/mail import
    jest.doMock('@sendgrid/mail', () => ({
      setApiKey: jest.fn(),
      send: jest.fn().mockResolvedValue({}),
    }));

    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test content</p>',
    });

    expect(result.success).toBe(true);
  });

  it('should use Nodemailer when SMTP_HOST is set', async () => {
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'test-pass';
    
    // Mock the nodemailer import
    jest.doMock('nodemailer', () => ({
      createTransporter: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue({ messageId: 'test-id' }),
      }),
    }));

    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test content</p>',
    });

    expect(result.success).toBe(true);
  });

  it('should handle errors gracefully', async () => {
    // Mock a failed email send
    jest.doMock('resend', () => ({
      Resend: jest.fn().mockImplementation(() => ({
        emails: {
          send: jest.fn().mockRejectedValue(new Error('API Error')),
        },
      })),
    }));

    process.env.RESEND_API_KEY = 'test-key';

    const result = await emailService.sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test content</p>',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('API Error');
  });
}); 