"use server"

import { createServerClient, type CookieOptions } from "@supabase/ssr" // Import CookieOptions
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types" // Assuming you have this type definition

export async function saveApiKeys(formData: FormData) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    }
  )

  try {

    // Get the current user
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    // Detailed logging for session check
    if (sessionError) {
      console.error("Supabase session error in saveApiKeys:", sessionError.message);
      // Return a more specific error if possible, but keep it generic for the client
      return { success: false, message: `Authentication error occurred. Please try logging in again.` };
    }
    if (!session) {
      console.warn("No active session found in saveApiKeys. User might be logged out or cookie is invalid/missing.");
      return { success: false, message: "You must be logged in to save API keys. Please ensure you are logged in." };
    }
    // Log session details if successful (optional, remove if too verbose or sensitive)
    // console.log("Session successfully retrieved in saveApiKeys:", JSON.stringify(session, null, 2));

    const userId = session.user.id
    console.log(`User authenticated for saveApiKeys: ${userId}`); // Log user ID if session is valid
    const exchange = formData.get("exchange") as string
    const apiKey = formData.get("apiKey") as string
    const apiSecret = formData.get("apiSecret") as string

    // Generate a name for the API key entry
    const name = `${exchange.charAt(0).toUpperCase() + exchange.slice(1)} API Keys`

    // Create the data object based on the exchange
    const apiKeyData: any = {
      name,
      api_key: apiKey,
      api_secret: apiSecret,
      enabled: true,
      test_mode: false,
      last_used: new Date().toISOString(),
    }

    // Add exchange-specific fields
    if (exchange === "bitmart") {
      const memo = formData.get("memo") as string
      if (!exchange || !apiKey || !apiSecret || !memo) {
        return { success: false, message: "Exchange, API key, API secret, and memo are required" }
      }
      apiKeyData.memo = memo
    } else if (exchange === "blofin") {
      const passphrase = formData.get("passphrase") as string
      if (!exchange || !apiKey || !apiSecret || !passphrase) {
        return { success: false, message: "Exchange, API key, API secret, and API passphrase are required" }
      }
      apiKeyData.passphrase = passphrase
    } else {
      return { success: false, message: "Invalid exchange" }
    }

    // Check if this user already has keys for this exchange
    const { data: existingKeys, error: queryError } = await supabase
      .from("api_keys")
      .select("id")
      .eq("user_id", userId)
      .eq("exchange", exchange)
      .single()

    if (queryError && queryError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is expected if no keys exist
      return { success: false, message: `Error checking existing keys: ${queryError.message}` }
    }

    let result

    if (existingKeys) {
      // Update existing keys
      result = await supabase.from("api_keys").update(apiKeyData).eq("id", existingKeys.id)
    } else {
      // Insert new keys
      result = await supabase.from("api_keys").insert({
        user_id: userId,
        exchange,
        ...apiKeyData,
        created_at: new Date().toISOString(),
      })
    }

    if (result.error) {
      console.error("Error saving API keys:", result.error)
      return { success: false, message: `Failed to save API keys: ${result.error.message}` }
    }

    return { success: true, message: `${exchange} API keys saved successfully` }
  } catch (error: any) {
    console.error("Error in saveApiKeys:", error)
    return { success: false, message: `An unexpected error occurred: ${error.message}` }
  }
}

export async function getApiKeys() {
  // No need to re-import CookieOptions here as it's already imported at the top
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) { // Use CookieOptions type
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
          }
        },
        remove(name: string, options: CookieOptions) { // Use CookieOptions type
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
          }
        },
      },
    }
  )
  try {

    // Get the current user
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    // Detailed logging for session check
    if (sessionError) {
      console.error("Supabase session error in getApiKeys:", sessionError.message);
      return { success: false, message: `Authentication error occurred. Please try logging in again.`, data: null };
    }
    if (!session) {
      console.warn("No active session found in getApiKeys. User might be logged out or cookie is invalid/missing.");
      return { success: false, message: "You must be logged in to retrieve API keys. Please ensure you are logged in.", data: null };
    }
    // Log session details if successful (optional, remove if too verbose or sensitive)
    // console.log("Session successfully retrieved in getApiKeys:", JSON.stringify(session, null, 2));

    const userId = session.user.id
    console.log(`User authenticated for getApiKeys: ${userId}`); // Log user ID if session is valid

    // Get all API keys for this user
    const { data, error } = await supabase.from("api_keys").select("*").eq("user_id", userId)

    if (error) {
      console.error("Error retrieving API keys:", error)
      return { success: false, message: `Failed to retrieve API keys: ${error.message}`, data: null }
    }

    // Transform data to hide full API secrets but keep the actual API keys
    const transformedData = data.map((item) => ({
      exchange: item.exchange,
      apiKey: item.api_key,
      apiSecret: maskString(item.api_secret),
      memo: item.memo ? maskString(item.memo) : null,
      passphrase: item.passphrase ? maskString(item.passphrase) : null,
      enabled: !!item.enabled,
      id: item.id,
    }))

    return { success: true, message: "API keys retrieved successfully", data: transformedData }
  } catch (error: any) {
    console.error("Error in getApiKeys:", error)
    return { success: false, message: `An unexpected error occurred: ${error.message}`, data: null }
  }
}

// Helper function to mask sensitive strings
function maskString(str: string): string {
  if (!str || str.length < 8) return "••••••••"

  const firstChars = str.slice(0, 4)
  const lastChars = str.slice(-4)
  const middleMask = "••••••••"

  return `${firstChars}${middleMask}${lastChars}`
}
