"use client"

import { useTickers } from "@/hooks/use-public-market-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"

export function MarketTickerTable() {
  const { tickers, loading, error } = useTickers()
  const [sortField, setSortField] = useState<string>("vol24h")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Sort tickers
  const sortedTickers = [...tickers].sort((a, b) => {
    const aValue = Number.parseFloat(a[sortField as keyof typeof a] as string) || 0
    const bValue = Number.parseFloat(b[sortField as keyof typeof b] as string) || 0

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue
  })

  // Handle sort click
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Calculate 24h change percentage
  const getChangePercentage = (ticker: any) => {
    const last = Number.parseFloat(ticker.last)
    const open24h = Number.parseFloat(ticker.open24h)

    if (open24h === 0) return 0

    return ((last - open24h) / open24h) * 100
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-red-700">
        <p className="font-medium">Error loading market data</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border/50 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead className="cursor-pointer hover:bg-secondary/80" onClick={() => handleSort("instId")}>
                Market
                {sortField === "instId" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-secondary/80 text-right" onClick={() => handleSort("last")}>
                Price
                {sortField === "last" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-secondary/80 text-right"
                onClick={() => handleSort("open24h")}
              >
                24h Change
                {sortField === "open24h" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-secondary/80 text-right"
                onClick={() => handleSort("high24h")}
              >
                24h High
                {sortField === "high24h" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-secondary/80 text-right"
                onClick={() => handleSort("low24h")}
              >
                24h Low
                {sortField === "low24h" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-secondary/80 text-right"
                onClick={() => handleSort("vol24h")}
              >
                24h Volume
                {sortField === "vol24h" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(10)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
            ) : sortedTickers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No market data available
                </TableCell>
              </TableRow>
            ) : (
              sortedTickers.map((ticker) => {
                const changePercentage = getChangePercentage(ticker)
                const isPositive = changePercentage >= 0

                return (
                  <TableRow key={ticker.instId}>
                    <TableCell className="font-medium">{ticker.instId}</TableCell>
                    <TableCell className="text-right">${formatCurrency(Number.parseFloat(ticker.last))}</TableCell>
                    <TableCell className={`text-right ${isPositive ? "text-green-500" : "text-red-500"}`}>
                      {isPositive ? "+" : ""}
                      {changePercentage.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right">${formatCurrency(Number.parseFloat(ticker.high24h))}</TableCell>
                    <TableCell className="text-right">${formatCurrency(Number.parseFloat(ticker.low24h))}</TableCell>
                    <TableCell className="text-right">{formatCurrency(Number.parseFloat(ticker.vol24h))}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
