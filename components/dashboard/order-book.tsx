"use client"

import type React from "react"

import { useOrderBook } from "@/hooks/use-public-market-data"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function OrderBook() {
  const [selectedMarket, setSelectedMarket] = useState("BTC-USDT")
  const [inputValue, setInputValue] = useState("BTC-USDT")
  const [depth, setDepth] = useState("10")
  const { orderBook, loading, error } = useOrderBook(selectedMarket, Number.parseInt(depth))
  const [customMarketError, setCustomMarketError] = useState<string | null>(null)

  const marketOptions = ["BTC-USDT", "ETH-USDT", "SOL-USDT", "BNB-USDT", "XRP-USDT"]

  const depthOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "20", label: "20" },
    { value: "50", label: "50" },
    { value: "100", label: "100" },
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

  if (error) {
    return (
      <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-red-700">
        <p className="font-medium">Error loading order book</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="w-full sm:w-[280px]">
          <div className="space-y-1">
            <label htmlFor="order-book-search" className="text-xs font-medium text-foreground/70">
              Enter any coin pair (e.g., SOL-USDT, DOGE-BTC)
            </label>
            <form onSubmit={handleMarketSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="order-book-search"
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
              {marketOptions.map((market) => (
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

        <Select value={depth} onValueChange={setDepth}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Depth" />
          </SelectTrigger>
          <SelectContent>
            {depthOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Bids</h3>
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Asks</h3>
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      ) : !orderBook ? (
        <div className="flex h-[300px] items-center justify-center flex-col">
          <p className="text-muted-foreground mb-2">No order book data available for {selectedMarket}</p>
          <p className="text-xs text-muted-foreground">Try a different market pair</p>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Bids (Buy)</h3>
            <div className="space-y-1">
              {orderBook.bids.map((bid, index) => {
                const price = Number.parseFloat(bid[0])
                const size = Number.parseFloat(bid[1])
                const total = price * size

                return (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-green-500">${price.toFixed(2)}</span>
                    <span>{size.toFixed(4)}</span>
                    <span className="text-muted-foreground">${total.toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Asks (Sell)</h3>
            <div className="space-y-1">
              {orderBook.asks.map((ask, index) => {
                const price = Number.parseFloat(ask[0])
                const size = Number.parseFloat(ask[1])
                const total = price * size

                return (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-red-500">${price.toFixed(2)}</span>
                    <span>{size.toFixed(4)}</span>
                    <span className="text-muted-foreground">${total.toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
