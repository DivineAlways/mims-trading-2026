import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-singleton"
import { makeAuthenticatedRequest } from "@/lib/blofin-api"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const instId = searchParams.get("instId") || ""
    const ordId = searchParams.get("ordId") || ""
    const after = searchParams.get("after") || ""
    const before = searchParams.get("before") || ""
    const limit = searchParams.get("limit") || "100"

    // Get the current user session
    const supabase = getSupabaseClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData?.session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = sessionData.session.user.id

    // Get the user's Blofin API credentials
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from("api_keys")
      .select("api_key, api_secret, enabled")
      .eq("user_id", userId)
      .eq("exchange", "blobfin")
      .order("created_at", { ascending: false })
      .limit(1)

    // Check if we have any API keys
    if (apiKeysError || !apiKeys || apiKeys.length === 0) {
      console.log("No Blofin API credentials found")
      return NextResponse.json(
        { error: "No Blofin API credentials found. Please add your API keys in the API Keys section." },
        { status: 400 },
      )
    }

    // Get the most recent API key
    const apiKey = apiKeys[0]

    // Check if the API key is enabled
    if (!apiKey.enabled) {
      console.log("Blofin API key is disabled")
      return NextResponse.json(
        { error: "Your Blofin API key is disabled. Please enable it in the API Keys section." },
        { status: 400 },
      )
    }

    // Build query parameters for Blofin API
    const queryParams: Record<string, string> = {}
    if (instId) queryParams.instId = instId
    if (ordId) queryParams.ordId = ordId
    if (after) queryParams.after = after
    if (before) queryParams.before = before
    if (limit) queryParams.limit = limit

    try {
      // Make the request to Blofin API
      const fillsHistory = await makeAuthenticatedRequest(
        apiKey.api_key,
        apiKey.api_secret,
        "GET",
        "/api/v1/trade/fills-history",
        queryParams,
      )

      // Update the last_used timestamp for the API key
      await supabase.from("api_keys").update({ last_used: new Date().toISOString() }).eq("api_key", apiKey.api_key)

      return NextResponse.json(fillsHistory)
    } catch (apiError: any) {
      // Handle rate limiting specifically
      if (apiError.message && apiError.message.includes("RATE_LIMITED")) {
        return NextResponse.json(
          { error: "Rate limited by Blofin API. Please try again in a few minutes." },
          { status: 429 },
        )
      }

      // Handle other API errors
      console.error("Blofin API error:", apiError.message)
      return NextResponse.json({ error: apiError.message || "Failed to fetch data from Blofin API" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error fetching fills history:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch fills history" }, { status: 500 })
  }
}
