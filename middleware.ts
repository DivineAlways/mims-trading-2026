import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/database.types" // Adjust path if your types are elsewhere

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  try {
    const supabase = createMiddlewareClient<Database>(request, response);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    return response;
  } catch (e) {
    console.error("Error in middleware:", e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
```
```
"dependencies": {
  "@supabase/auth-helpers-nextjs": "^0.x.x", // Ensure this is present
  ...
}
