import { NextResponse } from "next/server"
import { BLOFIN_API_BASE_URL } from "@/lib/blofin-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const instId = searchParams.get("instId")
    const bar = searchParams.get("bar")
    const after = searchParams.get("after")
    const before = searchParams.get("before")
    const limit = searchParams.get("limit")

    // Check if instId is provided (required parameter)
    if (!instId) {
      return NextResponse.json({ error: "instId parameter is required" }, { status: 400 })
    }

    // Build the URL with query parameters
    let url = `${BLOFIN_API_BASE_URL}/api/v1/market/candles?instId=${instId}`
    if (bar) url += `&bar=${bar}`
    if (after) url += `&after=${after}`
    if (before) url += `&before=${before}`
    if (limit) url += `&limit=${limit}`

    // Make the request to Blofin API
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    // Parse the response
    const data = await response.json()

    // Return the data
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Error fetching candles:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch candles" }, { status: 500 })
  }
}
