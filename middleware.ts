import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/database.types" // Adjust path if your types are elsewhere

export async function middleware(request: NextRequest) {
  // Create an initial response object
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    // Create authenticated Supabase client
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value; // Use request.cookies directly
          },
          set(name: string, value: string, options: any) {
            response.cookies.set(name, value, options); // Set cookies on the response
          },
          remove(name: string, options: any) {
            response.cookies.delete(name, options); // Remove cookies on the response
          },
        },
      }
    );

    // Refresh session if expired - required for Server Components
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // OPTIONAL: Redirect to login if no session and trying to access protected routes
    // const protectedPaths = ["/dashboard"]; // Add paths that require login
    // if (!session && protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    //   const redirectUrl = request.nextUrl.clone();
    //   redirectUrl.pathname = '/auth/simplified-login'; // Adjust to your login page path
    //   redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname);
    //   return NextResponse.redirect(redirectUrl);
    // }

    return response // Return the potentially modified response

  } catch (e) {
    // If you are here, a server side error occurred.
    console.error("Error in middleware:", e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
