import { NextResponse } from "next/server"
import { BLOFIN_API_BASE_URL } from "@/lib/blofin-api"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const instId = searchParams.get("instId")
    const size = searchParams.get("size")

    // Check if instId is provided (required parameter)
    if (!instId) {
      return NextResponse.json({ error: "instId parameter is required" }, { status: 400 })
    }

    // Build the URL with query parameters
    let url = `${BLOFIN_API_BASE_URL}/api/v1/market/books?instId=${instId}`
    if (size) {
      url += `&size=${size}`
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
    console.error("Error fetching order books:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch order books" }, { status: 500 })
  }
}
