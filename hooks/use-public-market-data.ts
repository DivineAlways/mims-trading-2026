"use client"

import { useState, useEffect } from "react"

// Types for market data
export interface Instrument {
  instId: string
  instType: string
  baseCcy: string
  quoteCcy: string
  settleCcy: string
  ctVal: string
  ctMult: string
  ctValCcy: string
  optType: string
  stk: string
  listTime: string
  expTime: string
  tickSz: string
  lotSz: string
  minSz: string
  ctType: string
  alias: string
  state: string
}

export interface Ticker {
  instId: string
  last: string
  lastSz: string
  askPx: string
  askSz: string
  bidPx: string
  bidSz: string
  open24h: string
  high24h: string
  low24h: string
  volCcy24h: string
  vol24h: string
  ts: string
  sodUtc0: string
  sodUtc8: string
}

export interface OrderBook {
  asks: [string, string][]
  bids: [string, string][]
  ts: string
}

export interface MarkPrice {
  instId: string
  markPx: string
  ts: string
}

// Update the Candle interface to match the API response
export interface Candle {
  ts: string // timestamp
  o: string // open
  h: string // high
  l: string // low
  c: string // close
  vol: string // volume in contracts
  volCcy: string // volume in base currency
  volCcyQuote?: string // volume in quote currency
  confirm?: string // candle confirmation status
}

// Hook for fetching instruments
export function useInstruments(instId?: string) {
  const [instruments, setInstruments] = useState<Instrument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInstruments() {
      try {
        setLoading(true)
        let url = "/api/blofin/public/instruments"
        if (instId) {
          url += `?instId=${instId}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch instruments")
        }

        setInstruments(data.data || [])
        setError(null)
      } catch (err: any) {
        console.error("Error fetching instruments:", err)
        setError(err.message || "Failed to fetch instruments")
      } finally {
        setLoading(false)
      }
    }

    fetchInstruments()
  }, [instId])

  return { instruments, loading, error }
}

// Hook for fetching tickers
export function useTickers(instId?: string) {
  const [tickers, setTickers] = useState<Ticker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTickers() {
      try {
        setLoading(true)
        let url = "/api/blofin/public/tickers"
        if (instId) {
          url += `?instId=${instId}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch tickers")
        }

        setTickers(data.data || [])
        setError(null)
      } catch (err: any) {
        console.error("Error fetching tickers:", err)
        setError(err.message || "Failed to fetch tickers")
      } finally {
        setLoading(false)
      }
    }

    fetchTickers()

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchTickers, 30000)

    return () => clearInterval(intervalId)
  }, [instId])

  return { tickers, loading, error }
}

// Hook for fetching order book
export function useOrderBook(instId: string, size?: number) {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrderBook() {
      try {
        setLoading(true)
        let url = `/api/blofin/public/books?instId=${instId}`
        if (size) {
          url += `&size=${size}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch order book")
        }

        setOrderBook(data.data?.[0] || null)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching order book:", err)
        setError(err.message || "Failed to fetch order book")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderBook()

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchOrderBook, 30000)

    return () => clearInterval(intervalId)
  }, [instId, size])

  return { orderBook, loading, error }
}

// Hook for fetching mark prices
export function useMarkPrices(instId?: string) {
  const [markPrices, setMarkPrices] = useState<MarkPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMarkPrices() {
      try {
        setLoading(true)
        let url = "/api/blofin/public/mark-price"
        if (instId) {
          url += `?instId=${instId}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch mark prices")
        }

        setMarkPrices(data.data || [])
        setError(null)
      } catch (err: any) {
        console.error("Error fetching mark prices:", err)
        setError(err.message || "Failed to fetch mark prices")
      } finally {
        setLoading(false)
      }
    }

    fetchMarkPrices()

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchMarkPrices, 30000)

    return () => clearInterval(intervalId)
  }, [instId])

  return { markPrices, loading, error }
}

// Hook for fetching candles
export function useCandles(instId: string, bar?: string, limit?: number) {
  const [candles, setCandles] = useState<Candle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCandles() {
      try {
        setLoading(true)
        let url = `/api/blofin/public/candles?instId=${instId}`
        if (bar) {
          url += `&bar=${bar}`
        }
        if (limit) {
          url += `&limit=${limit}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch candles")
        }

        // Transform the data into a more usable format
        const formattedCandles = (data.data || []).map((candle: string[]) => ({
          ts: candle[0], // timestamp
          o: candle[1], // open
          h: candle[2], // high
          l: candle[3], // low
          c: candle[4], // close
          vol: candle[5], // volume in contracts
          volCcy: candle[6], // volume in base currency
          volCcyQuote: candle[7] || "", // volume in quote currency
          confirm: candle[8] || "1", // candle confirmation status
        }))

        setCandles(formattedCandles)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching candles:", err)
        setError(err.message || "Failed to fetch candles")
      } finally {
        setLoading(false)
      }
    }

    fetchCandles()

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchCandles, 30000)

    return () => clearInterval(intervalId)
  }, [instId, bar, limit])

  return { candles, loading, error }
}
