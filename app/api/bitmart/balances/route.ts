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

    // Get the user's Bitmart API credentials
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from("api_keys")
      .select("api_key, api_secret, memo, enabled")
      .eq("user_id", userId)
      .eq("exchange", "bitmart")
      .order("created_at", { ascending: false })
      .limit(1)

    // Check if we have any API keys
    if (apiKeysError || !apiKeys || apiKeys.length === 0) {
      console.log("No Bitmart API credentials found")
      return NextResponse.json(
        { error: "No Bitmart API credentials found. Please add your API keys in the API Keys section." },
        { status: 400 },
      )
    }

    // Get the most recent API key
    const apiKey = apiKeys[0]

    // Check if the API key is enabled
    if (!apiKey.enabled) {
      console.log("Bitmart API key is disabled")
      return NextResponse.json(
        { error: "Your Bitmart API key is disabled. Please enable it in the API Keys section." },
        { status: 400 },
      )
    }

    // Log that we're making a request (for debugging)
    console.log(`Making request to Bitmart API with key: ${apiKey.api_key.substring(0, 5)}...`)

    try {
      // Make the request to Bitmart API
      const balances = await makeAuthenticatedRequest(
        apiKey.api_key,
        apiKey.api_secret,
        apiKey.memo, // Using the memo column
        "GET",
        "/spot/v1/wallet",
      )

      // Update the last_used timestamp for the API key
      await supabase.from("api_keys").update({ last_used: new Date().toISOString() }).eq("api_key", apiKey.api_key)

      return NextResponse.json(balances)
    } catch (apiError: any) {
      // Handle rate limiting specifically
      if (apiError.message && apiError.message.includes("RATE_LIMITED")) {
        return NextResponse.json(
          { error: "Rate limited by Bitmart API. Please try again in a few minutes." },
          { status: 429 },
        )
      }

      // Handle other API errors
      console.error("Bitmart API error:", apiError.message)
      return NextResponse.json({ error: apiError.message || "Failed to fetch data from Bitmart API" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error fetching balances:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch balances" }, { status: 500 })
  }
}
