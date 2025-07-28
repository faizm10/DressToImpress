# Email Notification Setup Guide

This guide will help you set up email notifications to your Gmail account when users make attire requests.

## Current Status ✅

The email notification system is **working** and sending emails to `faizmustansar10@gmail.com` (your verified Resend email).

## Quick Setup

### 1. Create a Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key
1. Log into your Resend dashboard
2. Go to "API Keys" section
3. Create a new API key
4. Copy the API key (starts with `re_`)

### 3. Configure Environment Variables
Create a `.env.local` file in the `frontend` directory:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here

# Email recipient for attire request notifications (optional)
NOTIFICATION_EMAIL=faizmustansar10@gmail.com
```

Replace `re_your_api_key_here` with your actual Resend API key.

### 4. Test the Setup
Run the test script to verify everything works:

```bash
npm run test:email
```

This will send a test email to your verified email address.

### 5. Test with the Application
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Submit an attire request through the cart
3. Check your verified email for the notification

## How It Works

- **Trigger**: When a user submits an attire request through the cart
- **Email Content**: Professional HTML email with student details and requested items
- **Recipient**: Your verified Resend email address
- **Provider**: Resend (reliable email delivery service)

## Email Template

The notification email includes:
- Student information (name, ID, email)
- Requested items with details (name, size, category)
- Requested date ranges
- Total number of items requested

## Sending to Other Email Addresses

To send emails to `langcareers3@gmail.com` or other addresses, you need to:

### Option A: Domain Verification (Recommended)
1. **Verify a Domain**:
   - Go to [resend.com/domains](https://resend.com/domains)
   - Add your domain (e.g., `dressforsuccess.ca`)
   - Follow the DNS verification steps

2. **Update Email Configuration**:
   Once verified, update the email service:
   ```typescript
   // In lib/email-service.ts
   from: emailData.from || 'DressForSuccess <noreply@yourdomain.com>'
   ```

3. **Set Environment Variable**:
   ```bash
   NOTIFICATION_EMAIL=langcareers3@gmail.com
   ```

### Option B: Add Email to Resend Account
1. Log into your Resend dashboard
2. Go to "Settings" → "Email Addresses"
3. Add `langcareers3@gmail.com` as a verified email
4. Set environment variable:
   ```bash
   NOTIFICATION_EMAIL=langcareers3@gmail.com
   ```

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Verify your Resend API key is correct
   - Make sure there are no extra spaces

2. **"Unauthorized" error**
   - Check if your Resend account is active
   - Verify your API key permissions

3. **"Domain not verified" error**
   - Verify your domain in Resend dashboard
   - Or use a verified email address

4. **Emails not sending**
   - Check browser console for errors
   - Verify environment variables are loaded
   - Check Resend dashboard for delivery status

### Development vs Production

- **Development**: Uses mock mode if no API key is set
- **Production**: Requires valid Resend API key and verified domain

## Advanced Configuration

For production use, consider:
- Verifying your domain with Resend for better deliverability
- Using a custom "from" address
- Setting up email templates in Resend dashboard

See [RESEND_SETUP.md](./RESEND_SETUP.md) for detailed configuration options. 