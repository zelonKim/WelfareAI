import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const idToken = formData.get("id_token") as string;
  const code = formData.get("code") as string;
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "https";

  const baseUrl = host
    ? `${protocol}://${host}`
    : process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI?.replace(
        "/apple-callback",
        "",
      );

  const redirectUrl = new URL(`${baseUrl}/login`);
  if (idToken) redirectUrl.searchParams.set("id_token", idToken);
  if (code) redirectUrl.searchParams.set("code", code);

  return NextResponse.redirect(redirectUrl.toString(), 303);
}
