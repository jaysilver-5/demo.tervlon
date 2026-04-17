import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      );
    }

    // TODO: In production, store to database or send to email service
    // For now, log to console (visible in Vercel logs)
    console.log("📬 New early access signup:", { email, role, timestamp: new Date().toISOString() });

    // TODO: Optionally send a confirmation email via Resend, SendGrid, etc.
    // await sendConfirmationEmail(email, role);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}