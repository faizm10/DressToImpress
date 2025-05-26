// app/api/send/route.ts
import { NextResponse } from "next/server";
import EmailTemplate from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { firstName, email, rentalStartDate, rentalEndDate, pickupDate } =
    await req.json();

  try {
    const { data, error } = await resend.emails.send({
      from: "Business Career Development Centre <langcareers@uoguelph.ca>",
      to: [email],
      subject: "Your Dress to Impress rental is approved!",
      react: (
        <EmailTemplate
          firstName={firstName}
          email={email}
          rentalStartDate={rentalStartDate}
          rentalEndDate={rentalEndDate}
          pickupDate={pickupDate}
        />
      ),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
