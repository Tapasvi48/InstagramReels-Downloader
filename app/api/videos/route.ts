// app/api/videos/route.ts

// import { getVideosByUserName } from "@/index";

import { getVideosByUserName } from "../../index";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("POST /api/videos called");

  try {
    // Parse the incoming request body
    const { username } = await request.json();
    console.log(username);

    // Check if the username is provided
    if (!username) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

    // Get videos by username
    const videos = await getVideosByUserName(username);

    // Return success response with videos
    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    // Handle any errors
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
