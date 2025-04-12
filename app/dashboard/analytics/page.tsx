"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, LineChart, Bot, Briefcase, TrendingUp, TrendingDown } from "lucide-react"

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("performance")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-foreground/70">Insights, positions, and automated trading</p>
      </div>

      <Tabs defaultValue="performance" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card w-full md:w-auto grid grid-cols-3 md:inline-flex">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="positions">Positions</TabsTrigger>
          <TabsTrigger value="automated">Automated Trading</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Your trading performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] items-center justify-center rounded-md border border-border/50 border-dashed">
                  <div className="flex flex-col items-center">
                    <BarChart3 className="h-10 w-10 text-primary mb-2" />
                    <p className="text-sm text-foreground/60">Performance chart coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Win/Loss Ratio</CardTitle>
                <CardDescription>Analysis of successful vs unsuccessful trades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] items-center justify-center rounded-md border border-border/50 border-dashed">
                  <div className="flex flex-col items-center">
                    <div className="flex gap-2 mb-2">
                      <TrendingUp className="h-8 w-8 text-green-500" />
                      <TrendingDown className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-sm text-foreground/60">Win/Loss chart coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Portfolio Allocation</CardTitle>
                <CardDescription>Distribution of your investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] items-center justify-center rounded-md border border-border/50 border-dashed">
                  <div className="flex flex-col items-center">
                    <Briefcase className="h-10 w-10 text-primary mb-2" />
                    <p className="text-sm text-foreground/60">Allocation chart coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Trading History</CardTitle>
              <CardDescription>Detailed view of your past trades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary text-left">
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Market</th>
                      <th className="px-4 py-3 font-medium">Side</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="px-4 py-3">{new Date(Date.now() - i * 86400000).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT"][i]}</td>
                        <td className="px-4 py-3">
                          <span className={i % 2 === 0 ? "text-green-500" : "text-red-500"}>
                            {i % 2 === 0 ? "Buy" : "Sell"}
                          </span>
                        </td>
                        <td className="px-4 py-3">${(Math.random() * 1000 + 100).toFixed(2)}</td>
                        <td className="px-4 py-3">{(Math.random() * 10).toFixed(3)}</td>
                        <td className={`px-4 py-3 ${i % 3 === 0 ? "text-red-500" : "text-green-500"}`}>
                          {i % 3 === 0 ? "-" : "+"}${(Math.random() * 500).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Active Positions</CardTitle>
              <CardDescription>Monitor and manage your open positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary text-left">
                      <th className="px-4 py-3 font-medium">Market</th>
                      <th className="px-4 py-3 font-medium">Side</th>
                      <th className="px-4 py-3 font-medium">Size</th>
                      <th className="px-4 py-3 font-medium">Entry Price</th>
                      <th className="px-4 py-3 font-medium">Current Price</th>
                      <th className="px-4 py-3 font-medium">P&L</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(3)].map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="px-4 py-3">{["BTC/USDT", "ETH/USDT", "SOL/USDT"][i]}</td>
                        <td className="px-4 py-3">
                          <span className={i % 2 === 0 ? "text-green-500" : "text-red-500"}>
                            {i % 2 === 0 ? "Long" : "Short"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {(Math.random() * (i === 0 ? 1 : i === 1 ? 10 : 100)).toFixed(i === 0 ? 3 : 2)}
                        </td>
                        <td className="px-4 py-3">
                          $
                          {(
                            Math.random() * (i === 0 ? 5000 : i === 1 ? 300 : 50) +
                            (i === 0 ? 30000 : i === 1 ? 1800 : 100)
                          ).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          $
                          {(
                            Math.random() * (i === 0 ? 5000 : i === 1 ? 300 : 50) +
                            (i === 0 ? 30000 : i === 1 ? 1800 : 100)
                          ).toFixed(2)}
                        </td>
                        <td className={`px-4 py-3 ${i % 3 === 0 ? "text-red-500" : "text-green-500"}`}>
                          {i % 3 === 0 ? "-" : "+"}${(Math.random() * 500).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="outline" size="sm">
                            Close
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Position History</CardTitle>
              <CardDescription>View your closed positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-secondary text-left">
                      <th className="px-4 py-3 font-medium">Date Closed</th>
                      <th className="px-4 py-3 font-medium">Market</th>
                      <th className="px-4 py-3 font-medium">Side</th>
                      <th className="px-4 py-3 font-medium">Size</th>
                      <th className="px-4 py-3 font-medium">Entry Price</th>
                      <th className="px-4 py-3 font-medium">Exit Price</th>
                      <th className="px-4 py-3 font-medium">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="px-4 py-3">{new Date(Date.now() - i * 86400000).toLocaleDateString()}</td>
                        <td className="px-4 py-3">{["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT"][i]}</td>
                        <td className="px-4 py-3">
                          <span className={i % 2 === 0 ? "text-green-500" : "text-red-500"}>
                            {i % 2 === 0 ? "Long" : "Short"}
                          </span>
                        </td>
                        <td className="px-4 py-3">{(Math.random() * 10).toFixed(3)}</td>
                        <td className="px-4 py-3">${(Math.random() * 1000 + 100).toFixed(2)}</td>
                        <td className="px-4 py-3">${(Math.random() * 1000 + 100).toFixed(2)}</td>
                        <td className={`px-4 py-3 ${i % 3 === 0 ? "text-red-500" : "text-green-500"}`}>
                          {i % 3 === 0 ? "-" : "+"}${(Math.random() * 500).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automated" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>AI Trading Strategies</CardTitle>
                <CardDescription>Configure and activate automated trading strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border border-border/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Momentum Strategy</h3>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">
                      Inactive
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/70 mb-4">
                    Trades based on price momentum indicators like RSI and MACD.
                  </p>
                  <Button size="sm">Activate</Button>
                </div>

                <div className="rounded-md border border-border/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Grid Trading</h3>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">
                      Inactive
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/70 mb-4">
                    Places buy and sell orders at regular price intervals to profit from market volatility.
                  </p>
                  <Button size="sm">Activate</Button>
                </div>

                <div className="rounded-md border border-border/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Trend Following</h3>
                    </div>
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500">
                      Inactive
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/70 mb-4">
                    Identifies and follows market trends using moving averages and breakout patterns.
                  </p>
                  <Button size="sm">Activate</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Strategy Performance</CardTitle>
                <CardDescription>Historical performance of automated strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[300px] items-center justify-center rounded-md border border-border/50 border-dashed">
                  <div className="flex flex-col items-center">
                    <LineChart className="h-10 w-10 text-primary mb-2" />
                    <p className="text-sm text-foreground/60">Strategy performance charts coming soon</p>
                    <p className="text-xs text-foreground/40 mt-2">Activate a strategy to see performance data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>AI Trading Settings</CardTitle>
              <CardDescription>Configure your AI trading preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Risk Level</label>
                  <select className="w-full rounded-md border border-border bg-background px-3 py-2">
                    <option value="low">Conservative (Low Risk)</option>
                    <option value="medium">Balanced (Medium Risk)</option>
                    <option value="high">Aggressive (High Risk)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Position Size</label>
                  <select className="w-full rounded-md border border-border bg-background px-3 py-2">
                    <option value="5">5% of Portfolio</option>
                    <option value="10">10% of Portfolio</option>
                    <option value="20">20% of Portfolio</option>
                    <option value="30">30% of Portfolio</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trading Pairs</label>
                  <select className="w-full rounded-md border border-border bg-background px-3 py-2">
                    <option value="btc">BTC/USDT Only</option>
                    <option value="major">Major Pairs (BTC, ETH, SOL)</option>
                    <option value="all">All Available Pairs</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trading Frequency</label>
                  <select className="w-full rounded-md border border-border bg-background px-3 py-2">
                    <option value="low">Low (1-5 trades per day)</option>
                    <option value="medium">Medium (5-15 trades per day)</option>
                    <option value="high">High (15+ trades per day)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full md:w-auto">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
