"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketOverviewChart } from "@/components/dashboard/market-overview-chart"
import { MarketTickerTable } from "@/components/dashboard/market-ticker-table"
import { OrderBook } from "@/components/dashboard/order-book"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-foreground/70">Welcome to your AI trading dashboard</p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card w-full md:w-auto grid grid-cols-3 md:inline-flex">
          <TabsTrigger value="overview">Market Overview</TabsTrigger>
          <TabsTrigger value="tickers">Market Tickers</TabsTrigger>
          <TabsTrigger value="orderbook">Order Book</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Market Chart</CardTitle>
              <CardDescription>Price chart for selected market</CardDescription>
            </CardHeader>
            <CardContent>
              <MarketOverviewChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickers" className="space-y-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Market Tickers</CardTitle>
              <CardDescription>Real-time market data for all trading pairs</CardDescription>
            </CardHeader>
            <CardContent>
              <MarketTickerTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orderbook" className="space-y-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Order Book</CardTitle>
              <CardDescription>Real-time order book data for selected market</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderBook />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
