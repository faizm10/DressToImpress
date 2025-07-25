# Domain Verification Guide for Resend

To send emails to `uoguelph.ca` addresses, you need to verify a domain with Resend. Here's how to set it up:

## Option 1: Verify Your Own Domain (Recommended)

### Step 1: Choose a Domain
You can verify any domain you own, such as:
- `dressforsuccess.ca`
- `yourcompany.com`
- Any domain you control

### Step 2: Add Domain to Resend
1. Go to [resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `dressforsuccess.ca`)
4. Click "Add Domain"

### Step 3: Configure DNS Records
Resend will provide you with DNS records to add to your domain:

**Example DNS Records:**
```
Type: TXT
Name: @
Value: resend-verification=abc123...

Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.yourdomain.com
```

### Step 4: Update Email Configuration
Once verified, update the email service:

```typescript
// In lib/email-service.ts
from: emailData.from || 'DressForSuccess <noreply@yourdomain.com>'
```

## Option 2: Use Resend's Sandbox Domain (Temporary)

For immediate testing, you can use Resend's sandbox domain:

### Step 1: Update Email Configuration
```typescript
// In lib/email-service.ts
from: emailData.from || 'DressForSuccess <onboarding@resend.dev>'
```

### Step 2: Test with Your Email
Update the test script to use your verified email:

```javascript
// In scripts/test-resend.js
to: 'faizmustansar10@gmail.com', // Your verified email
```

## Option 3: Use a Subdomain (Alternative)

If you don't own a domain, you can use a subdomain:

### Step 1: Create a Subdomain
- Use a service like Vercel, Netlify, or GitHub Pages
- Create a subdomain like `dressforsuccess.vercel.app`

### Step 2: Verify the Subdomain
Follow the same DNS verification process for your subdomain.

## Current Status

**Problem**: Resend only allows sending to verified email addresses without domain verification.

**Solution**: Verify a domain or use the sandbox domain temporarily.

## Quick Fix for Testing

For immediate testing, update the test script:

```javascript
// Change this line in scripts/test-resend.js
to: 'faizmustansar10@gmail.com', // Your verified email
```

## Production Setup

For production, you should:

1. **Verify a domain** (recommended: `dressforsuccess.ca`)
2. **Update the from address** to use your verified domain
3. **Test thoroughly** before going live

## DNS Verification Tips

- DNS changes can take up to 48 hours to propagate
- Use tools like `dig` or online DNS checkers to verify
- Contact your domain registrar if you need help with DNS settings

## Support

If you need help with domain verification:
- Resend documentation: [resend.com/docs](https://resend.com/docs)
- DNS troubleshooting: Check with your domain registrar
- Email delivery issues: Check Resend dashboard for logs 