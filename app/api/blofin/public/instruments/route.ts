import { NextResponse } from "next/server"
import { BLOFIN_API_BASE_URL } from "@/lib/blofin-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const instId = searchParams.get("instId")

    // Build the URL with query parameters if provided
    let url = `${BLOFIN_API_BASE_URL}/api/v1/market/instruments`
    if (instId) {
      url += `?instId=${instId}`
    }

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
    console.error("Error fetching instruments:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch instruments" }, { status: 500 })
  }
}
