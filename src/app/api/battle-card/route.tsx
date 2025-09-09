import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contestId = searchParams.get("contestId");

    if (!contestId) {
      return new Response("contestId parameter is required", { status: 400 });
    }

    // Path to your hosted battle card image
    const imagePath = path.join(process.cwd(), "public", "battle-card.png");

    // Check if image exists
    if (!fs.existsSync(imagePath)) {
      return new Response("Battle card image not found", { status: 404 });
    }

    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);

    // Return the image with proper headers
    return new Response(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving battle card:", error);
    return new Response("Error serving card", { status: 500 });
  }
}
