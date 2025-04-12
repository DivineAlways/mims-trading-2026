"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

export default function SettingsPage() {
  const [riskLevel, setRiskLevel] = useState([50])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-foreground/70">Manage your application preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Trading Settings</CardTitle>
            <CardDescription>Configure your trading parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-exchange">Default Exchange</Label>
              <Select defaultValue="blobfin">
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blobfin">Blobfin</SelectItem>
                  <SelectItem value="mexc">MEXC</SelectItem>
                  <SelectItem value="binance">Binance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-pair">Default Trading Pair</Label>
              <Select defaultValue="btc-usdt">
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select trading pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btc-usdt">BTC/USDT</SelectItem>
                  <SelectItem value="eth-usdt">ETH/USDT</SelectItem>
                  <SelectItem value="sol-usdt">SOL/USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Risk Level</Label>
              <div className="pt-2">
                <Slider value={riskLevel} onValueChange={setRiskLevel} max={100} step={1} />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-foreground/60">Conservative</span>
                  <span className="text-xs font-medium">{riskLevel}%</span>
                  <span className="text-xs text-foreground/60">Aggressive</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="trade-confirmation">Trade Confirmation</Label>
                <p className="text-sm text-foreground/60">Require confirmation before executing trades</p>
              </div>
              <Switch id="trade-confirmation" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-foreground/60">Receive updates via email</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="trade-alerts">Trade Alerts</Label>
                <p className="text-sm text-foreground/60">Get notified about executed trades</p>
              </div>
              <Switch id="trade-alerts" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="price-alerts">Price Alerts</Label>
                <p className="text-sm text-foreground/60">Get notified about significant price movements</p>
              </div>
              <Switch id="price-alerts" defaultChecked />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Notification Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" className="bg-background" />
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
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-trading">AI Trading</Label>
              <p className="text-sm text-foreground/60">Enable AI-powered automated trading</p>
            </div>
            <Switch id="ai-trading" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-suggestions">AI Suggestions</Label>
              <p className="text-sm text-foreground/60">Receive trading suggestions from AI</p>
            </div>
            <Switch id="ai-suggestions" defaultChecked />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-model">AI Model</Label>
            <Select defaultValue="balanced">
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save Settings</Button>
      </div>
    </div>
  )
}
