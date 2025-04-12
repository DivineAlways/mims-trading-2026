"use client"

import { useOrdersHistory } from "@/hooks/use-blofin-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { AlertCircle, Clock } from "lucide-react"

export function OrdersHistoryTable() {
  const [limit, setLimit] = useState("20")
  const { orders, loading, error, refetch } = useOrdersHistory({ limit }, 60000) // Poll every minute

  // Function to get badge color based on order state
  const getStateColor = (state: string) => {
    switch (state) {
      case "filled":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
      case "canceled":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
      case "live":
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
      case "partially_filled":
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30"
    }
  }

  if (error === "missing_credentials") {
    return (
      <div className="rounded-md border border-border/50 p-6 text-center">
        <h3 className="text-lg font-medium mb-2">API Credentials Required</h3>
        <p className="text-muted-foreground mb-4">
          To view your order history, you need to add your Blofin API credentials.
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
              <TableHead>Type</TableHead>
              <TableHead>Side</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Filled</TableHead>
              <TableHead>Status</TableHead>
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
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  </TableRow>
                ))
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  No orders history found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.ordId}>
                  <TableCell>{formatDate(new Date(Number.parseInt(order.cTime)))}</TableCell>
                  <TableCell>{order.instId}</TableCell>
                  <TableCell>{order.ordType}</TableCell>
                  <TableCell className={order.side === "buy" ? "text-green-500" : "text-red-500"}>
                    {order.side.toUpperCase()}
                  </TableCell>
                  <TableCell>{formatCurrency(Number.parseFloat(order.px))}</TableCell>
                  <TableCell>{order.sz}</TableCell>
                  <TableCell>
                    {order.accFillSz}
                    {order.sz !== "0" && (
                      <span>
                        {" "}
                        ({((Number.parseFloat(order.accFillSz) / Number.parseFloat(order.sz)) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStateColor(order.state)}>{order.state.replace("_", " ")}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
