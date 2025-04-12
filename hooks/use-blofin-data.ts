"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// Types for Blofin API responses
export interface Balance {
  ccy: string
  availBal: string
  frozenBal: string
  totalBal: string
}

export interface FillsHistoryItem {
  instId: string
  tradeId: string
  ordId: string
  clOrdId: string
  billId: string
  tag: string
  fillPx: string
  fillSz: string
  side: string
  posSide: string
  execType: string
  feeCcy: string
  fee: string
  ts: string
}

export interface OrdersHistoryItem {
  instId: string
  ordId: string
  clOrdId: string
  tag: string
  px: string
  sz: string
  ordType: string
  side: string
  posSide: string
  tdMode: string
  accFillSz: string
  fillPx: string
  tradeId: string
  fillSz: string
  fillTime: string
  state: string
  avgPx: string
  lever: string
  tpTriggerPx: string
  tpOrdPx: string
  slTriggerPx: string
  slOrdPx: string
  feeCcy: string
  fee: string
  rebateCcy: string
  rebate: string
  category: string
  uTime: string
  cTime: string
}

// Hook for fetching balances
export function useBalances(pollingInterval = 30000) {
  const [balances, setBalances] = useState<Balance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const hasCredentialsRef = useRef<boolean | null>(null)

  const fetchBalances = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/blofin/balances")

      // Handle non-JSON responses
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        if (response.status === 429) {
          setError("rate_limited")
          return
        }
        throw new Error(`Failed to parse response: ${await response.text()}`)
      }

      if (!response.ok) {
        // Check if this is a rate limiting error
        if (response.status === 429) {
          setError("rate_limited")
          return
        }

        // Check if this is a credentials error
        if (data.error && data.error.includes("No Blofin API credentials")) {
          hasCredentialsRef.current = false
          setError("missing_credentials")
        } else {
          // For other errors, preserve the credential state
          setError(data.error || "Failed to fetch balances")
        }
        return
      }

      // If we got here, we definitely have credentials
      hasCredentialsRef.current = true

      setBalances(data.data || [])
      setError(null)
      setRetryCount(0) // Reset retry count on success
    } catch (err: any) {
      console.error("Error fetching balances:", err)
      // Don't change credential state on network errors
      setError(err.message || "Failed to fetch balances")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBalances()

    // Set up polling if interval is provided
    if (pollingInterval > 0) {
      // If rate limited, use exponential backoff
      const actualInterval =
        error === "rate_limited"
          ? Math.min(pollingInterval * Math.pow(2, retryCount), 300000) // Max 5 minutes
          : pollingInterval

      const intervalId = setInterval(() => {
        fetchBalances()
        if (error === "rate_limited") {
          setRetryCount((prev) => prev + 1)
        }
      }, actualInterval)

      return () => clearInterval(intervalId)
    }
  }, [fetchBalances, pollingInterval, error, retryCount])

  return {
    balances,
    loading,
    error,
    hasCredentials: hasCredentialsRef.current,
    refetch: fetchBalances,
  }
}

// Hook for fetching fills history
export function useFillsHistory(params: Record<string, string> = {}, pollingInterval = 0) {
  const [fills, setFills] = useState<FillsHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const hasCredentialsRef = useRef<boolean | null>(null)

  const fetchFillsHistory = useCallback(async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams(params).toString()
      const response = await fetch(`/api/blofin/fills-history?${queryParams}`)

      // Handle non-JSON responses
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        if (response.status === 429) {
          setError("rate_limited")
          return
        }
        throw new Error(`Failed to parse response: ${await response.text()}`)
      }

      if (!response.ok) {
        // Check if this is a rate limiting error
        if (response.status === 429) {
          setError("rate_limited")
          return
        }

        // Check if this is a credentials error
        if (data.error && data.error.includes("No Blofin API credentials")) {
          hasCredentialsRef.current = false
          setError("missing_credentials")
        } else {
          // For other errors, preserve the credential state
          setError(data.error || "Failed to fetch fills history")
        }
        return
      }

      // If we got here, we definitely have credentials
      hasCredentialsRef.current = true

      setFills(data.data || [])
      setError(null)
      setRetryCount(0) // Reset retry count on success
    } catch (err: any) {
      console.error("Error fetching fills history:", err)
      // Don't change credential state on network errors
      setError(err.message || "Failed to fetch fills history")
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchFillsHistory()

    // Set up polling if interval is provided
    if (pollingInterval > 0) {
      // If rate limited, use exponential backoff
      const actualInterval =
        error === "rate_limited"
          ? Math.min(pollingInterval * Math.pow(2, retryCount), 300000) // Max 5 minutes
          : pollingInterval

      const intervalId = setInterval(() => {
        fetchFillsHistory()
        if (error === "rate_limited") {
          setRetryCount((prev) => prev + 1)
        }
      }, actualInterval)

      return () => clearInterval(intervalId)
    }
  }, [fetchFillsHistory, pollingInterval, error, retryCount])

  return {
    fills,
    loading,
    error,
    hasCredentials: hasCredentialsRef.current,
    refetch: fetchFillsHistory,
  }
}

// Hook for fetching orders history
export function useOrdersHistory(params: Record<string, string> = {}, pollingInterval = 0) {
  const [orders, setOrders] = useState<OrdersHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const hasCredentialsRef = useRef<boolean | null>(null)

  const fetchOrdersHistory = useCallback(async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams(params).toString()
      const response = await fetch(`/api/blofin/orders-history?${queryParams}`)

      // Handle non-JSON responses
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        if (response.status === 429) {
          setError("rate_limited")
          return
        }
        throw new Error(`Failed to parse response: ${await response.text()}`)
      }

      if (!response.ok) {
        // Check if this is a rate limiting error
        if (response.status === 429) {
          setError("rate_limited")
          return
        }

        // Check if this is a credentials error
        if (data.error && data.error.includes("No Blofin API credentials")) {
          hasCredentialsRef.current = false
          setError("missing_credentials")
        } else {
          // For other errors, preserve the credential state
          setError(data.error || "Failed to fetch orders history")
        }
        return
      }

      // If we got here, we definitely have credentials
      hasCredentialsRef.current = true

      setOrders(data.data || [])
      setError(null)
      setRetryCount(0) // Reset retry count on success
    } catch (err: any) {
      console.error("Error fetching orders history:", err)
      // Don't change credential state on network errors
      setError(err.message || "Failed to fetch orders history")
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchOrdersHistory()

    // Set up polling if interval is provided
    if (pollingInterval > 0) {
      // If rate limited, use exponential backoff
      const actualInterval =
        error === "rate_limited"
          ? Math.min(pollingInterval * Math.pow(2, retryCount), 300000) // Max 5 minutes
          : pollingInterval

      const intervalId = setInterval(() => {
        fetchOrdersHistory()
        if (error === "rate_limited") {
          setRetryCount((prev) => prev + 1)
        }
      }, actualInterval)

      return () => clearInterval(intervalId)
    }
  }, [fetchOrdersHistory, pollingInterval, error, retryCount])

  return {
    orders,
    loading,
    error,
    hasCredentials: hasCredentialsRef.current,
    refetch: fetchOrdersHistory,
  }
}

// Hook to check API credentials status
export function useApiCredentialsStatus() {
  const [status, setStatus] = useState<{
    hasCredentials: boolean
    isEnabled: boolean
    loading: boolean
    error: string | null
  }>({
    hasCredentials: false,
    isEnabled: false,
    loading: true,
    error: null,
  })

  useEffect(() => {
    async function checkCredentials() {
      try {
        const response = await fetch("/api/blofin/debug")
        const data = await response.json()

        if (!response.ok) {
          setStatus({
            hasCredentials: false,
            isEnabled: false,
            loading: false,
            error: data.error || "Failed to check API credentials",
          })
          return
        }

        setStatus({
          hasCredentials: data.keysFound > 0,
          isEnabled: data.keysEnabled > 0,
          loading: false,
          error: null,
        })
      } catch (err: any) {
        setStatus({
          hasCredentials: false,
          isEnabled: false,
          loading: false,
          error: err.message || "Failed to check API credentials",
        })
      }
    }

    checkCredentials()
  }, [])

  return status
}
