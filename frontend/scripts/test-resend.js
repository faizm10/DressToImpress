#!/usr/bin/env node

/**
 * Test script for Resend email configuration
 * Run with: node scripts/test-resend.js
 */

const { Resend } = require('resend');

async function testResend() {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not found in environment variables');
    console.log('Please add RESEND_API_KEY to your .env.local file');
    process.exit(1);
  }

  console.log('✅ RESEND_API_KEY found');
  
  try {
    const resend = new Resend(apiKey);
    
    console.log('📧 Sending test email...');
    
    const result = await resend.emails.send({
      from: 'Dress To Impress <onboarding@resend.dev>',
      to: 'langcareers3@gmail.com', // Use verified email for testing
      subject: 'Test Email - Dress To Impress Platform',
      html: `
        <h2>Test Email from Dress To Impress</h2>
        <p>This is a test email to verify your Resend configuration.</p>
        <p>If you receive this email, your setup is working correctly!</p>
        <hr>
        <p><small>Sent at: ${new Date().toISOString()}</small></p>
      `,
    });

    if (result.error) {
      console.error('❌ Email send failed:', result.error);
      process.exit(1);
    }

    console.log('✅ Test email sent successfully!');
    console.log('📧 Check your Resend dashboard for delivery status');
    console.log('📧 Check langcareers3@gmail.com for the test email');
    
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    process.exit(1);
  }
}

// Load environment variables from .env.local
require('dotenv').config({ path: '.env' });

testResend(); 