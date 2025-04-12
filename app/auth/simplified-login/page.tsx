"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseClient, clearSupabaseAuth } from "@/lib/supabase-singleton"

export default function SimplifiedLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const router = useRouter()

  // Handle login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    setDebugInfo(null)

    try {
      // Validate inputs
      if (!email || !password) {
        setError("Email and password are required")
        setLoading(false)
        return
      }

      // Get the singleton client
      const supabase = getSupabaseClient()

      // Log the attempt with timestamp
      console.log(`Login attempt at ${new Date().toISOString()} with email: ${email}`)

      // Attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // Store debug info
      setDebugInfo({
        timestamp: new Date().toISOString(),
        action: "signInWithPassword",
        email,
        data,
        error,
      })

      // Handle errors
      if (error) {
        console.error("Login error:", error)
        setError(`Authentication failed: ${error.message}`)
        return
      }

      // Success
      if (data?.user) {
        console.log("Login successful:", data.user.email)
        setSuccess(`Login successful! Redirecting...`)

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = "/dashboard/simplified"
        }, 1500)
      } else {
        setError("No user returned. Please try again.")
      }
    } catch (err: any) {
      console.error("Login exception:", err)
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

  // Handle signup
  async function handleSignUp() {
    setLoading(true)
    setError(null)
    setSuccess(null)
    setDebugInfo(null)

    try {
      // Validate inputs
      if (!email || !password) {
        setError("Email and password are required")
        setLoading(false)
        return
      }

      // Get the singleton client
      const supabase = getSupabaseClient()

      // Log the attempt with timestamp
      console.log(`Signup attempt at ${new Date().toISOString()} with email: ${email}`)

      // Attempt to sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: email.split("@")[0],
          },
        },
      })

      // Store debug info
      setDebugInfo({
        timestamp: new Date().toISOString(),
        action: "signUp",
        email,
        data,
        error,
      })

      // Handle errors
      if (error) {
        console.error("Signup error:", error)
        setError(`Signup failed: ${error.message}`)
        return
      }

      // Success
      if (data?.user) {
        console.log("Signup successful:", data.user.email)
        setSuccess(`Signup successful! Please check your email for confirmation.`)
      } else {
        setError("No user returned. Please try again.")
      }
    } catch (err: any) {
      console.error("Signup exception:", err)
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

  // Clear auth data (for troubleshooting)
  function handleClearAuth() {
    clearSupabaseAuth()
    setSuccess("Auth data cleared from localStorage")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold">Simplified Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Using direct Supabase client</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            <p className="font-medium">Success</p>
            <p className="text-sm">{success}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={handleSignUp}
              disabled={loading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={handleClearAuth}
              className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear Auth Data
            </button>
          </div>
        </form>

        {debugInfo && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 overflow-auto">
            <h3 className="text-sm font-medium mb-2">Debug Information</h3>
            <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-500">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
