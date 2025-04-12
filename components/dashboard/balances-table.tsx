"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import type { Balance } from "@/hooks/use-blofin-data"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, Clock } from "lucide-react"

interface BalancesTableProps {
  balances: Balance[]
  loading: boolean
  error: string | null
  refetch?: () => void
}

export function BalancesTable({ balances, loading, error, refetch }: BalancesTableProps) {
  if (error === "missing_credentials") {
    return (
      <div className="rounded-md border border-border/50 p-6 text-center">
        <h3 className="text-lg font-medium mb-2">API Credentials Required</h3>
        <p className="text-muted-foreground mb-4">
          To view your balances, you need to add your Blofin API credentials.
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
        {refetch && (
          <Button size="sm" variant="outline" onClick={refetch}>
            Try Again
          </Button>
        )}
      </div>
    )
  }

  if (error && error !== "missing_credentials" && error !== "rate_limited") {
    return (
      <div className="rounded-md border border-red-500/20 bg-red-500/10 p-4 text-red-700">
        <div className="flex items-center mb-2">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="font-medium">Error loading balances</p>
        </div>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary">
            <TableHead>Currency</TableHead>
            <TableHead className="text-right">Available</TableHead>
            <TableHead className="text-right">Frozen</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-20 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-24 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
          ) : balances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                No balances found
              </TableCell>
            </TableRow>
          ) : (
            balances.map((balance) => (
              <TableRow key={balance.ccy}>
                <TableCell className="font-medium">{balance.ccy}</TableCell>
                <TableCell className="text-right">{formatCurrency(Number.parseFloat(balance.availBal))}</TableCell>
                <TableCell className="text-right">{formatCurrency(Number.parseFloat(balance.frozenBal))}</TableCell>
                <TableCell className="text-right">{formatCurrency(Number.parseFloat(balance.totalBal))}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
