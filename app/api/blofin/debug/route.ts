import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-singleton"

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData?.session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const userId = sessionData.session.user.id

    // Get the user's Blofin API credentials
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from("api_keys")
      .select("*") // Select all fields for debugging
      .eq("user_id", userId)
      .eq("exchange", "blobfin")

    if (apiKeysError) {
      return NextResponse.json(
        {
          error: "Error fetching API keys",
          details: apiKeysError,
        },
        { status: 500 },
      )
    }

    // Return diagnostic info (with sensitive data masked)
    return NextResponse.json({
      success: true,
      keysFound: apiKeys?.length || 0,
      keysEnabled: apiKeys?.filter((k) => k.enabled).length || 0,
      firstKey:
        apiKeys && apiKeys.length > 0
          ? {
              id: apiKeys[0].id,
              exchange: apiKeys[0].exchange,
              enabled: apiKeys[0].enabled,
              hasApiKey: !!apiKeys[0].api_key,
              hasApiSecret: !!apiKeys[0].api_secret,
              hasPassphrase: !!apiKeys[0].passphrase,
              created_at: apiKeys[0].created_at,
              last_used: apiKeys[0].last_used,
            }
          : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
      },
      { status: 500 },
    )
  }
}
