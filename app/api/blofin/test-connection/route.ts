import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-singleton"
import { makeAuthenticatedRequest } from "@/lib/blofin-api"

export async function GET() {
  try {
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
      .select("api_key, api_secret, passphrase, enabled")
      .eq("user_id", userId)
      .eq("exchange", "blofin")
      .order("created_at", { ascending: false })
      .limit(1)

    // Check if we have any API keys
    if (apiKeysError || !apiKeys || apiKeys.length === 0) {
      return NextResponse.json({ success: false, message: "No Blofin API credentials found" }, { status: 400 })
    }

    // Get the most recent API key
    const apiKey = apiKeys[0]

    // Check if the API key is enabled
    if (!apiKey.enabled) {
      return NextResponse.json({ success: false, message: "Blofin API key is disabled" }, { status: 400 })
    }

    try {
      // Make a simple request to test the connection
      const result = await makeAuthenticatedRequest(
        apiKey.api_key,
        apiKey.api_secret,
        apiKey.passphrase,
        "GET",
        "/api/v1/account/config",
      )

      // Update the last_used timestamp for the API key
      await supabase.from("api_keys").update({ last_used: new Date().toISOString() }).eq("api_key", apiKey.api_key)

      return NextResponse.json({
        success: true,
        message: "Successfully connected to Blofin API",
        timestamp: new Date().toISOString(),
      })
    } catch (apiError: any) {
      // Handle rate limiting specifically
      if (apiError.message && apiError.message.includes("RATE_LIMITED")) {
        return NextResponse.json(
          { success: false, message: "Rate limited by Blofin API. Please try again in a few minutes." },
          { status: 429 },
        )
      }

      // Handle other API errors
      return NextResponse.json(
        { success: false, message: apiError.message || "Failed to connect to Blofin API" },
        { status: 500 },
      )
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Failed to test connection" }, { status: 500 })
  }
}
