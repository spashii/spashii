import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;
if (!REVALIDATE_SECRET) {
  throw new Error("REVALIDATE_SECRET is not set");
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const path = request.nextUrl.searchParams.get("path");

  if (secret !== REVALIDATE_SECRET) {
    return Response.json({
      revalidated: false,
      now: Date.now(),
      message: "Invalid secret",
    });
  }

  revalidatePath("/");

  if (path) {
    // specific path
    revalidatePath(path, "page");
  }

  return Response.json({
    revalidated: true,
    now: Date.now(),
    message: "Revalidated " + (path ? path : "/"),
  });
}
