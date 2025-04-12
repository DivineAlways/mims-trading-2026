"use client"

import type React from "react"

import { useCandles } from "@/hooks/use-public-market-data"
import { useState, useMemo, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Search } from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
  Bar,
  Line,
} from "recharts"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

export function MarketOverviewChart() {
  const [selectedMarket, setSelectedMarket] = useState("BTC-USDT")
  const [inputValue, setInputValue] = useState("BTC-USDT")
  const [timeframe, setTimeframe] = useState("1D")
  const { candles, loading, error } = useCandles(selectedMarket, timeframe, 100)
  const [customMarketError, setCustomMarketError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const marketOptions = [
    "BTC-USDT",
    "ETH-USDT",
    "SOL-USDT",
    "BNB-USDT",
    "XRP-USDT",
    "ADA-USDT",
    "DOGE-USDT",
    "DOT-USDT",
    "AVAX-USDT",
    "MATIC-USDT",
  ]

  const timeframes = [
    { value: "15m", label: "15m" },
    { value: "1H", label: "1h" },
    { value: "4H", label: "4h" },
    { value: "1D", label: "1d" },
    { value: "1W", label: "1w" },
  ]

  // Handle market selection change
  const handleMarketSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate the market format (should be XXX-YYY)
    const marketRegex = /^[A-Za-z0-9]+-[A-Za-z0-9]+$/
    if (!marketRegex.test(inputValue)) {
      setCustomMarketError("Invalid market format. Use format like 'BTC-USDT'")
      return
    }

    setCustomMarketError(null)
    setSelectedMarket(inputValue.toUpperCase())
  }

  // Format candles data for the chart
  const formattedData = useMemo(() => {
    return candles
      .map((candle) => {
        const timestamp = new Date(Number.parseInt(candle.ts))
        const open = Number.parseFloat(candle.o)
        const high = Number.parseFloat(candle.h)
        const low = Number.parseFloat(candle.l)
        const close = Number.parseFloat(candle.c)
        const volume = Number.parseFloat(candle.vol)

        return {
          timestamp,
          time: timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          date: timestamp.toLocaleDateString([], { month: "short", day: "numeric" }),
          open,
          high,
          low,
          close,
          volume,
          // For candlestick coloring
          gain: close >= open,
          // For volume coloring
          volumeColor: close >= open ? "rgba(0, 255, 0, 0.5)" : "rgba(255, 0, 0, 0.5)",
          // For tooltip and display
          displayTime: timestamp.toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }
      })
      .reverse() // Reverse to show newest data on the right
  }, [candles])

  // Calculate current price and change
  const currentPrice = formattedData.length > 0 ? formattedData[formattedData.length - 1].close : 0
  const previousClose = formattedData.length > 1 ? formattedData[0].close : currentPrice
  const priceChange = currentPrice - previousClose
  const priceChangePercent = previousClose !== 0 ? (priceChange / previousClose) * 100 : 0
  const isPriceUp = priceChange >= 0

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{data.displayTime}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            <p className="text-sm">Open:</p>
            <p className="text-sm font-medium">${data.open.toFixed(2)}</p>
            <p className="text-sm">High:</p>
            <p className="text-sm font-medium">${data.high.toFixed(2)}</p>
            <p className="text-sm">Low:</p>
            <p className="text-sm font-medium">${data.low.toFixed(2)}</p>
            <p className="text-sm">Close:</p>
            <p className="text-sm font-medium">${data.close.toFixed(2)}</p>
            <p className="text-sm">Volume:</p>
            <p className="text-sm font-medium">{data.volume.toFixed(2)}</p>
          </div>
        </div>
      )
    }
    return null
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-red-700">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="font-medium">Error loading chart data</p>
        </div>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="w-full sm:w-[280px]">
              <div className="space-y-1">
                <label htmlFor="market-search" className="text-xs font-medium text-foreground/70">
                  Enter any coin pair (e.g., SOL-USDT, DOGE-BTC)
                </label>
                <form onSubmit={handleMarketSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="market-search"
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                      placeholder="Type any market pair"
                      className="pl-8"
                    />
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <Button type="submit" size="sm">
                    Search
                  </Button>
                </form>
                {customMarketError && <p className="text-xs text-red-500 mt-1">{customMarketError}</p>}
              </div>

              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">Popular markets:</p>
                <div className="flex flex-wrap gap-1">
                  {marketOptions.slice(0, 5).map((market) => (
                    <Button
                      key={market}
                      variant="outline"
                      size="sm"
                      className="text-xs py-0 h-6"
                      onClick={() => {
                        setInputValue(market)
                        setSelectedMarket(market)
                      }}
                    >
                      {market}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf.value}
                  variant={timeframe === tf.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(tf.value)}
                >
                  {tf.label}
                </Button>
              ))}
            </div>
          </div>

          {!loading && formattedData.length > 0 && (
            <div className="flex items-center">
              <span className="text-xl font-bold mr-2">${currentPrice.toFixed(2)}</span>
              <span className={`text-sm ${isPriceUp ? "text-green-500" : "text-red-500"}`}>
                {isPriceUp ? "+" : ""}
                {priceChange.toFixed(2)} ({isPriceUp ? "+" : ""}
                {priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>

        <div className="h-[400px] w-full">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : formattedData.length === 0 ? (
            <div className="flex h-full items-center justify-center flex-col">
              <p className="text-muted-foreground mb-2">No chart data available for {selectedMarket}</p>
              <p className="text-xs text-muted-foreground">Try a different market pair or timeframe</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setInputValue("BTC-USDT")
                  setSelectedMarket("BTC-USDT")
                }}
              >
                Reset to BTC-USDT
              </Button>
            </div>
          ) : (
            <div className="h-full w-full">
              <ResponsiveContainer width="100%" height="70%">
                <ComposedChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                    tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                    tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
                    orientation="right"
                  />
                  <Tooltip content={<CustomTooltip />} />

                  {/* Candlestick representation using bars */}
                  <Bar dataKey="low" fill="transparent" stroke="transparent" yAxisId={0} isAnimationActive={false} />
                  <Bar dataKey="high" fill="transparent" stroke="transparent" yAxisId={0} isAnimationActive={false} />
                  <Bar
                    dataKey={(data) => (data.gain ? data.close - data.open : data.open - data.close)}
                    fill={(data) => (data.gain ? "#00c853" : "#ff1744")}
                    stroke={(data) => (data.gain ? "#00c853" : "#ff1744")}
                    stackId="stack"
                    yAxisId={0}
                    isAnimationActive={false}
                  />

                  {/* Wicks */}
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke="rgba(255,255,255,0.8)"
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke="rgba(255,255,255,0.8)"
                    dot={false}
                    activeDot={false}
                    isAnimationActive={false}
                  />

                  {/* Moving Average */}
                  <Line type="monotone" dataKey="close" stroke="#2196f3" dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>

              {/* Volume Chart */}
              <ResponsiveContainer width="100%" height="30%">
                <AreaChart data={formattedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                    tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    tick={{ fill: "rgba(255,255,255,0.5)" }}
                    tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
                    orientation="right"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="#8884d8"
                    fill={(data) => data.volumeColor}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {!loading && formattedData.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Open</p>
              <p className="text-lg font-medium">${formattedData[formattedData.length - 1].open.toFixed(2)}</p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">High</p>
              <p className="text-lg font-medium text-green-500">
                ${formattedData[formattedData.length - 1].high.toFixed(2)}
              </p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Low</p>
              <p className="text-lg font-medium text-red-500">
                ${formattedData[formattedData.length - 1].low.toFixed(2)}
              </p>
            </Card>
            <Card className="p-3">
              <p className="text-xs text-muted-foreground">Close</p>
              <p className="text-lg font-medium">${formattedData[formattedData.length - 1].close.toFixed(2)}</p>
            </Card>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
