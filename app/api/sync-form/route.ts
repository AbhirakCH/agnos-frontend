import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Trigger Event to Pusher
    // Channel: "hospital-form"
    // Event: "patient-update"
    await pusherServer.trigger("hospital-form", "patient-update", data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pusher Trigger Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync" },
      { status: 500 }
    );
  }
}
