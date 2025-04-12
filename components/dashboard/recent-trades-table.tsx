"use client"

import { useFillsHistory } from "@/hooks/use-blofin-data"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, Clock } from "lucide-react"

export function RecentTradesTable() {
  const { fills, loading, error, refetch } = useFillsHistory({ limit: "5" }, 30000) // Poll every 30 seconds

  if (error === "missing_credentials") {
    return (
      <div className="rounded-md border border-border/50 p-6 text-center">
        <h3 className="text-lg font-medium mb-2">API Credentials Required</h3>
        <p className="text-muted-foreground mb-4">
          To view your recent trades, you need to add your Blofin API credentials.
        </p>
        <Button asChild>
          <Link href="/dashboard/api-keys">Add API Keys</Link>
        </Button>
      </div>
    )
  }

  if (error === "rate_limited") {
    return (
      <div className="rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4 text-yellow-700">
        <div className="flex items-center mb-2">
          <Clock className="h-5 w-5 mr-2" />
          <p className="font-medium">Rate Limited</p>
        </div>
        <p className="text-sm mb-3">Too many requests to the Blofin API. Please wait a moment before trying again.</p>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (error && error !== "missing_credentials" && error !== "rate_limited") {
    return (
      <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-red-700">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="font-medium">Error</p>
        </div>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {loading ? (
        Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-2 w-2 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))
      ) : fills.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">No recent trades found</div>
      ) : (
        fills.map((fill) => (
          <div key={fill.tradeId} className="flex items-center gap-4">
            <div className={`h-2 w-2 rounded-full ${fill.side === "buy" ? "bg-green-500" : "bg-red-500"}`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {fill.side.toUpperCase()} {fill.instId}
              </p>
              <p className="text-xs text-foreground/60">{formatDate(new Date(Number.parseInt(fill.ts)))}</p>
            </div>
            <div className={`text-sm ${fill.side === "buy" ? "text-green-500" : "text-red-500"}`}>
              {fill.side === "buy" ? "+" : "-"}$
              {formatCurrency(Number.parseFloat(fill.fillPx) * Number.parseFloat(fill.fillSz))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
