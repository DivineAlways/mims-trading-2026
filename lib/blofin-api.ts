import crypto from "crypto"

// Base URL for Blofin API
export const BLOFIN_API_BASE_URL = "https://api.blofin.com"

// Helper function to sign Blofin API requests
export function signBlofinRequest(
  apiKey: string,
  apiSecret: string,
  passphrase: string,
  timestamp: string,
  method: string,
  requestPath: string,
  body: string | null = null,
): { signature: string; headers: Record<string, string> } {
  // Ensure all parameters are strings
  const timestampStr = String(timestamp)
  const methodStr = String(method).toUpperCase()
  const requestPathStr = String(requestPath)
  const bodyStr = body ? String(body) : ""

  try {
    // Create the message to sign
    let message = timestampStr + methodStr + requestPathStr
    if (bodyStr) {
      message += bodyStr
    }

    // Sign the message
    const signature = crypto.createHmac("sha256", apiSecret).update(message).digest("base64")

    // Return the signature and headers
    return {
      signature,
      headers: {
        "Content-Type": "application/json",
        "BF-ACCESS-KEY": apiKey,
        "BF-ACCESS-SIGN": signature,
        "BF-ACCESS-TIMESTAMP": timestampStr,
        "BF-ACCESS-PASSPHRASE": passphrase,
      },
    }
  } catch (error) {
    console.error("Error signing Blofin request:", error)
    throw new Error(`Failed to sign Blofin request: ${error.message}`)
  }
}

// Helper function to make authenticated requests to Blofin API
export async function makeAuthenticatedRequest(
  apiKey: string,
  apiSecret: string,
  passphrase: string,
  method: string,
  endpoint: string,
  queryParams: Record<string, string> = {},
  body: any = null,
): Promise<any> {
  try {
    // Validate inputs
    if (!apiKey || !apiSecret || !passphrase) {
      throw new Error("API key, secret, and passphrase are required")
    }

    // Build the request path with query parameters
    let requestPath = endpoint
    if (Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString()
      requestPath = `${endpoint}?${queryString}`
    }

    const timestamp = Math.floor(Date.now() / 1000).toString()
    const bodyString = body ? JSON.stringify(body) : null

    // Sign the request
    const { headers } = signBlofinRequest(apiKey, apiSecret, passphrase, timestamp, method, requestPath, bodyString)

    // Build the full URL
    const url = `${BLOFIN_API_BASE_URL}${requestPath}`

    console.log(`Making ${method} request to ${url}`)
    console.log(`Using API key: ${apiKey.substring(0, 5)}...`)

    // Make the request
    const response = await fetch(url, {
      method,
      headers,
      body: bodyString,
    })

    // Log the response status
    console.log(`Response status: ${response.status}`)

    // Check for rate limiting
    if (response.status === 429) {
      throw new Error("RATE_LIMITED: Too many requests to Blofin API. Please try again later.")
    }

    // Check for other errors
    if (!response.ok) {
      // Try to parse as JSON first
      let errorMessage = "Unknown API error"
      try {
        const errorData = await response.json()
        errorMessage = `Blofin API error: ${JSON.stringify(errorData)}`
      } catch (parseError) {
        // If JSON parsing fails, use the status text
        errorMessage = `Blofin API error: ${response.status} ${response.statusText}`

        // Try to get the response text
        try {
          const responseText = await response.text()
          errorMessage += ` - ${responseText}`
        } catch (textError) {
          // If that fails too, just use what we have
        }
      }
      throw new Error(errorMessage)
    }

    // Parse the response as JSON
    try {
      const responseData = await response.json()
      console.log(`Response data received successfully`)
      return responseData
    } catch (parseError) {
      console.error("Failed to parse response as JSON:", parseError)

      // Try to get the response text for debugging
      try {
        const responseText = await response.text()
        console.error("Response text:", responseText)
        throw new Error(
          `Failed to parse Blofin API response: ${parseError.message}. Response text: ${responseText.substring(0, 100)}...`,
        )
      } catch (textError) {
        throw new Error(`Failed to parse Blofin API response: ${parseError.message}`)
      }
    }
  } catch (error) {
    console.error("Error making authenticated request to Blofin API:", error)
    throw error
  }
}

// Base URL for Bitmart API
export const BITMART_API_BASE_URL = "https://api-cloud.bitmart.com"

// Helper function to sign Bitmart API requests
export function signBitmartRequest(
  apiKey: string,
  apiSecret: string,
  memo: string,
  timestamp: string,
  method: string,
  requestPath: string,
  body: string | null = null,
): { signature: string; headers: Record<string, string> } {
  // Ensure all parameters are strings
  const timestampStr = String(timestamp)
  const methodStr = String(method).toUpperCase()
  const requestPathStr = String(requestPath)
  const bodyStr = body ? String(body) : ""

  try {
    // Create the message to sign
    let message = timestampStr + methodStr + requestPathStr
    if (bodyStr) {
      message += bodyStr
    }

    // Sign the message
    const signature = crypto.createHmac("sha256", apiSecret).update(message).digest("hex")

    // Return the signature and headers
    return {
      signature,
      headers: {
        "Content-Type": "application/json",
        "X-BM-KEY": apiKey,
        "X-BM-SIGN": signature,
        "X-BM-TIMESTAMP": timestampStr,
        "X-BM-MEMO": memo,
      },
    }
  } catch (error) {
    console.error("Error signing Bitmart request:", error)
    throw new Error(`Failed to sign Bitmart request: ${error.message}`)
  }
}
