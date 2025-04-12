"use client"

import { useFillsHistory } from "@/hooks/use-blofin-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { AlertCircle, Clock } from "lucide-react"

export function FillsHistoryTable() {
  const [limit, setLimit] = useState("20")
  const { fills, loading, error, refetch } = useFillsHistory({ limit }, 60000) // Poll every minute

  if (error === "missing_credentials") {
    return (
      <div className="rounded-md border border-border/50 p-6 text-center">
        <h3 className="text-lg font-medium mb-2">API Credentials Required</h3>
        <p className="text-muted-foreground mb-4">
          To view your trade history, you need to add your Blofin API credentials.
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
          {loading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null}
          Refresh
        </Button>
      </div>

      {error && error !== "missing_credentials" && error !== "rate_limited" && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-red-700">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p className="font-medium">Error</p>
          </div>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="rounded-md border border-border/50 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary">
              <TableHead>Time</TableHead>
              <TableHead>Instrument</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Order ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))
            ) : fills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  No fills history found
                </TableCell>
              </TableRow>
            ) : (
              fills.map((fill) => {
                const value = Number.parseFloat(fill.fillPx) * Number.parseFloat(fill.fillSz)
                return (
                  <TableRow key={fill.tradeId}>
                    <TableCell>{formatDate(new Date(Number.parseInt(fill.ts)))}</TableCell>
                    <TableCell>{fill.instId}</TableCell>
                    <TableCell className={fill.side === "buy" ? "text-green-500" : "text-red-500"}>
                      {fill.side.toUpperCase()}
                    </TableCell>
                    <TableCell>{formatCurrency(Number.parseFloat(fill.fillPx))}</TableCell>
                    <TableCell>{fill.fillSz}</TableCell>
                    <TableCell>${formatCurrency(value)}</TableCell>
                    <TableCell>
                      {fill.fee} {fill.feeCcy}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{fill.ordId}</TableCell>
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
