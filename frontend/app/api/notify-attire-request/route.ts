import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email-service';

interface AttireRequest {
  student_id: string;
  attire_id: string;
  use_start_date: string | null;
  use_end_date: string | null;
}

interface StudentData {
  first_name: string;
  last_name: string;
  student_id: string;
  email: string;
}

interface RequestBody {
  student: StudentData;
  attireRequests: AttireRequest[];
  cartItems: Array<{
    id: string;
    name: string;
    size: string;
    gender: string;
    category: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { student, attireRequests, cartItems } = body;

    // Format the email content
    const emailContent = formatEmailContent(student, attireRequests, cartItems);

    // Send email notification
    // Note: For production, you need to verify a domain with Resend
    // to send emails to external domains like uoguelph.ca
    const emailResult = await emailService.sendEmail({
      to: 'fmustans@uoguelph.ca', // This will work once domain is verified
      subject: `New Attire Request - ${student.first_name} ${student.last_name}`,
      html: emailContent,
    });

    if (!emailResult.success) {
      console.error('Email service error:', emailResult.error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send email notification',
          details: emailResult.error
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email notification sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email notification:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email notification' 
      },
      { status: 500 }
    );
  }
}

function formatEmailContent(
  student: StudentData, 
  attireRequests: AttireRequest[], 
  cartItems: Array<{ id: string; name: string; size: string; gender: string; category: string }>
): string {
  const itemsList = cartItems.map(item => 
    `<li><strong>${item.name}</strong> - Size: ${item.size}, Category: ${item.category}</li>`
  ).join('');

  const dateRanges = attireRequests.map((request, index) => {
    const item = cartItems[index];
    const startDate = request.use_start_date ? new Date(request.use_start_date).toLocaleDateString() : 'Not specified';
    const endDate = request.use_end_date ? new Date(request.use_end_date).toLocaleDateString() : 'Not specified';
    return `<li><strong>${item.name}</strong> - ${startDate} to ${endDate}</li>`;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; }
        .content { padding: 20px; }
        .item-list { margin: 15px 0; }
        .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>New Attire Request Submitted</h2>
        <p>A new attire request has been submitted through the DressForSuccess system.</p>
      </div>
      
      <div class="content">
        <h3>Student Information</h3>
        <ul>
          <li><strong>Name:</strong> ${student.first_name} ${student.last_name}</li>
          <li><strong>Student ID:</strong> ${student.student_id}</li>
          <li><strong>Email:</strong> ${student.email}</li>
        </ul>
        
        <h3>Requested Items</h3>
        <div class="item-list">
          <ul>
            ${itemsList}
          </ul>
        </div>
        
        <h3>Requested Date Ranges</h3>
        <div class="item-list">
          <ul>
            ${dateRanges}
          </ul>
        </div>
        
        <p><strong>Total Items Requested:</strong> ${cartItems.length}</p>
      </div>
      
      <div class="footer">
        <p>This is an automated notification from the DressForSuccess system.</p>
        <p>Please review and process this request accordingly.</p>
      </div>
    </body>
    </html>
  `;
}

 