import { NextResponse } from "next/server"
import { getSupabaseClient } from "@/lib/supabase-singleton"

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    // Get the current user
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !sessionData?.session) {
      return NextResponse.json({ error: "Not authenticated", session: null }, { status: 401 })
    }

    const userId = sessionData.session.user.id

    // Get API keys count only (for security)
    const { data, error, count } = await supabase
      .from("api_keys")
      .select("exchange", { count: "exact" })
      .eq("user_id", userId)

    if (error) {
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    // Return diagnostic info
    return NextResponse.json({
      success: true,
      userId: userId,
      keysFound: count,
      exchanges: data?.map((k) => k.exchange) || [],
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 })
  }
}
