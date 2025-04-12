import { createMiddlewareClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/database.types" // Adjust path if your types are elsewhere

export async function middleware(request: NextRequest) {
  try {
    // This creates a Supabase client configured to use cookies
    const supabase = createMiddlewareClient<Database>({
      request,
      response: NextResponse.next(), // Initialize response here
    })

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
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

    // IMPORTANT: Avoid modifying the response directly here unless necessary for redirects.
    // createMiddlewareClient handles cookie updates internally when using NextResponse.next().
    // If you need to modify headers or cookies *after* Supabase operations,
    // capture the response from NextResponse.next() first, then pass it to Supabase,
    // and finally return the modified response. Example:
    // const response = NextResponse.next({ request: { headers: request.headers } });
    // const supabase = createMiddlewareClient({ request, response });
    // await supabase.auth.getSession(); // Perform Supabase operations
    // // Modify response if needed, e.g., response.headers.set('X-Custom-Header', 'value');
    // return response;

    // For basic session refresh, just creating the client and calling getSession is enough.
    // The cookie handling is managed by the library when using NextResponse.next().
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // Re-create client with the response object to ensure cookies are set correctly
     const supabaseWithResponse = createMiddlewareClient<Database>({
      request,
      response,
    })

    await supabaseWithResponse.auth.getSession(); // Ensure session is handled

    return response

  } catch (e) {
    // If you are here, a server side error occurred.
    // It's crucial to return a response, even if it's an error page.
    console.error("Error in middleware:", e);
    // Return a simple response or render an error page
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
