# Resend Email Setup

This guide will help you set up Resend for email notifications in the DressForSuccess platform.

## Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Key

1. Log into your Resend dashboard
2. Go to the "API Keys" section
3. Create a new API key
4. Copy the API key (it starts with `re_`)

## Step 3: Configure Environment Variables

Create or update your `.env.local` file in the `frontend` directory:

```bash
# Resend Configuration
RESEND_API_KEY=re_your_api_key_here
```

Replace `re_your_api_key_here` with your actual Resend API key.

## Step 4: Email "From" Address

### Development/Testing
For development and testing, the system uses `noreply@resend.dev` which is automatically verified by Resend.

### Production (Optional but Recommended)
For production use, you should verify your domain:

1. In your Resend dashboard, go to "Domains"
2. Add your domain (e.g., `dressforsuccess.ca`)
3. Follow the DNS verification steps
4. Update the `from` email in the code to use your verified domain

**Current "From" Address**: `DressForSuccess <noreply@resend.dev>`

## Step 5: Test the Implementation

### Option A: Test Email Service Directly

Run the test script to verify your Resend configuration:

```bash
npm run test:email
```

This will send a test email to `fmustans@uoguelph.ca` and show you if the configuration is working.

### Option B: Test Through the Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Submit an attire request through the cart
3. Check your Resend dashboard for sent emails
4. Check the console logs for any errors

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | Your Resend API key | Yes |

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Verify your API key is correct
   - Make sure there are no extra spaces or characters

2. **"Unauthorized" error**
   - Check if your Resend account is active
   - Verify your API key has the correct permissions

3. **"Domain not verified" error**
   - Verify your domain in Resend dashboard
   - Or use a verified domain for the `from` address

4. **Emails not sending**
   - Check browser console for errors
   - Verify environment variables are loaded
   - Check Resend dashboard for delivery status

### Development vs Production

- **Development**: Uses mock mode if no API key is set
- **Production**: Requires valid Resend API key and verified domain

## Email Template

The system sends professional HTML emails with:
- Student information
- Requested items and sizes
- Date ranges
- Professional styling

## Monitoring

- Check Resend dashboard for delivery status
- Monitor console logs for errors
- Set up webhooks for delivery tracking (optional)

## Security Notes

- Never commit your API key to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Monitor API usage in Resend dashboard 