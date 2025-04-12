"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase-singleton"

export default function SimplifiedDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const getSession = async () => {
      try {
        // Get the singleton client
        const supabase = getSupabaseClient()

        console.log("Checking session on dashboard page...")

        // Get the current session
        const { data, error } = await supabase.auth.getSession()

        // Store debug info
        setDebugInfo({
          timestamp: new Date().toISOString(),
          action: "getSession",
          data,
          error,
        })

        if (error) {
          console.error("Error getting session:", error)
          setError(`Failed to get session: ${error.message}`)
          setLoading(false)
          return
        }

        if (data?.session) {
          console.log("Session found:", data.session.user.email)
          setUser(data.session.user)
        } else {
          console.log("No active session found")
          setError("No active session found")
          // Redirect to login page after a short delay
          setTimeout(() => {
            window.location.href = "/auth/simplified-login"
          }, 1500)
        }
      } catch (err: any) {
        console.error("Session check error:", err)
        setError(`An unexpected error occurred: ${err.message}`)
        setDebugInfo({
          timestamp: new Date().toISOString(),
          action: "exception",
          error: err.message,
          stack: err.stack,
        })
      } finally {
        setLoading(false)
      }
    }

    getSession()
  }, [])

  const handleSignOut = async () => {
    try {
      setLoading(true)

      // Get the singleton client
      const supabase = getSupabaseClient()

      console.log("Signing out...")

      // Sign out
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Sign out error:", error)
        alert(`Failed to sign out: ${error.message}`)
        return
      }

      console.log("Sign out successful")

      // Redirect to login page
      window.location.href = "/auth/simplified-login"
    } catch (err: any) {
      console.error("Sign out error:", err)
      alert(`Failed to sign out: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-2">Loading session data...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Authentication Error</h2>
          <p className="mb-4">{error || "You are not authenticated"}</p>
          <p className="mb-6">Please try logging in again.</p>
          <Link href="/auth/simplified-login">
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700">
              Go to Login Page
            </button>
          </Link>

          {debugInfo && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 overflow-auto">
              <h3 className="text-sm font-medium mb-2">Debug Information</h3>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <div className="bg-green-50 border border-green-200 rounded p-4 mb-6">
          <p className="font-medium text-green-800">Successfully Authenticated!</p>
          <p className="text-green-700">You are logged in as: {user.email}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6">
          <h3 className="font-medium mb-2">User Information</h3>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Sign Out"}
        </button>
      </div>
    </div>
  )
}
