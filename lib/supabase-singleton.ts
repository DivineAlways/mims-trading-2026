import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Create a singleton Supabase client with better error handling
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

// Use the correct working URL and key directly
// These are the values that worked in the HTML test
const WORKING_URL = "https://bgfcqsfppskmjkyabaqk.supabase.co"
const WORKING_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnZmNxc2ZwcHNrbWpreWFiYXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MjYxMTMsImV4cCI6MjA1OTEwMjExM30.BBn9XwASTCnmG_Yx5q1d1z-MLsb4x5_RW28nnuF5gGs"

export function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance
  }

  try {
    // Log initialization attempt
    console.log("Initializing Supabase client...")

    // Use the working values directly instead of environment variables
    // This ensures we're using values that we know work
    supabaseInstance = createClient<Database>(WORKING_URL, WORKING_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false, // Important: disable this to avoid redirect issues
        flowType: "implicit",
        debug: true, // Enable debug mode for auth
      },
      global: {
        headers: {
          "X-Client-Info": "trading-platform-app",
        },
      },
    })

    console.log("Supabase singleton client successfully initialized")

    // Test the client immediately to verify it's working
    supabaseInstance.auth.onAuthStateChange((event, session) => {
      console.log(`Auth state changed: ${event}`, session ? "User session exists" : "No session")
    })

    return supabaseInstance
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
    throw new Error(
      `Supabase client initialization failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

// Helper function to check if we're in a browser environment
export function isBrowser() {
  return typeof window !== "undefined"
}

// Helper function to clear any stored auth data (for troubleshooting)
export function clearSupabaseAuth() {
  if (isBrowser()) {
    localStorage.removeItem("supabase.auth.token")
    localStorage.removeItem("supabase.auth.expires_at")
    localStorage.removeItem("supabase.auth.refresh_token")
    console.log("Cleared Supabase auth data from localStorage")
  }
}
