"use client"

import { useState, useEffect } from "react"
import { getSupabaseClient } from "@/lib/supabase-singleton"

export function UserWelcome() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = getSupabaseClient()
        const { data } = await supabase.auth.getSession()

        if (data?.session?.user) {
          setUser(data.session.user)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  if (loading) {
    return <div className="h-8 w-40 animate-pulse rounded bg-gray-200"></div>
  }

  if (!user) {
    return <div>Welcome, Guest</div>
  }

  return <div className="font-medium">Welcome, {user.email?.split("@")[0] || "User"}</div>
}
