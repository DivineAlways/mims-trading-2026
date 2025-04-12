"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Check, X, Loader2 } from "lucide-react"
import { getApiKeys } from "@/app/actions/api-keys"
import { getSupabaseClient } from "@/lib/supabase-singleton"

export default function ExchangesPage() {
  const [loading, setLoading] = useState(true)
  const [exchanges, setExchanges] = useState([
    { id: "blobfin", name: "Blobfin", connected: false, enabled: false },
    { id: "mexc", name: "MEXC", connected: false, enabled: false },
    { id: "binance", name: "Binance", connected: false, enabled: false },
    { id: "kucoin", name: "KuCoin", connected: false, enabled: false },
    { id: "bybit", name: "Bybit", connected: false, enabled: false },
  ])

  useEffect(() => {
    async function loadApiKeys() {
      setLoading(true)
      try {
        // First try to get keys directly from Supabase
        const supabase = getSupabaseClient()
        const { data: sessionData } = await supabase.auth.getSession()

        if (sessionData?.session) {
          const { data: apiKeysData, error } = await supabase
            .from("api_keys")
            .select("*")
            .eq("user_id", sessionData.session.user.id)

          if (!error && apiKeysData && apiKeysData.length > 0) {
            // Update exchanges with connection status based on saved API keys
            setExchanges((prev) =>
              prev.map((exchange) => {
                const savedKey = apiKeysData.find((key) => key.exchange.toLowerCase() === exchange.id.toLowerCase())
                return {
                  ...exchange,
                  connected: !!savedKey,
                  enabled: savedKey ? savedKey.enabled : exchange.enabled,
                }
              }),
            )
            setLoading(false)
            return
          }
        }

        // Fallback to using the server action
        const result = await getApiKeys()

        if (result.success && result.data) {
          // Update exchanges with connection status based on saved API keys
          setExchanges((prev) =>
            prev.map((exchange) => {
              const savedKey = result.data.find((key) => key.exchange.toLowerCase() === exchange.id.toLowerCase())
              return {
                ...exchange,
                connected: !!savedKey,
                // Use the enabled status from the database if available
                enabled: savedKey ? savedKey.enabled : exchange.enabled,
              }
            }),
          )
        }
      } catch (error) {
        console.error("Error loading API keys:", error)
      } finally {
        setLoading(false)
      }
    }

    loadApiKeys()
  }, [])

  const toggleConnection = (id: string) => {
    const exchange = exchanges.find((e) => e.id === id)

    if (exchange?.connected) {
      // If already connected, disconnect
      setExchanges(
        exchanges.map((exchange) =>
          exchange.id === id ? { ...exchange, connected: false, enabled: false } : exchange,
        ),
      )
    } else {
      // If not connected, redirect to API keys page
      window.location.href = "/dashboard/api-keys"
    }
  }

  const toggleEnabled = async (id: string) => {
    try {
      const supabase = getSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const exchange = exchanges.find((e) => e.id === id)
      const newEnabledState = !exchange?.enabled

      // Update the local state first for immediate feedback
      setExchanges(
        exchanges.map((exchange) => (exchange.id === id ? { ...exchange, enabled: newEnabledState } : exchange)),
      )

      // Then update in the database
      await supabase
        .from("api_keys")
        .update({ enabled: newEnabledState })
        .eq("user_id", session.user.id)
        .eq("exchange", id)
    } catch (error) {
      console.error("Error toggling enabled state:", error)
      // Revert the state change if there was an error
      setExchanges(
        exchanges.map((exchange) => (exchange.id === id ? { ...exchange, enabled: !exchange.enabled } : exchange)),
      )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exchanges</h1>
        <p className="text-foreground/70">Manage your connected exchanges</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {exchanges.map((exchange) => (
          <Card key={exchange.id} className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>{exchange.name}</CardTitle>
              <CardDescription>{exchange.connected ? "Connected and ready to trade" : "Not connected"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Connection Status</div>
                  <div className="flex items-center">
                    {exchange.connected ? (
                      <>
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-500">Connected</span>
                      </>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-500">Not Connected</span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  variant={exchange.connected ? "destructive" : "default"}
                  onClick={() => toggleConnection(exchange.id)}
                >
                  {exchange.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border/40 pt-4">
              <div className="flex items-center justify-between w-full">
                <Label htmlFor={`${exchange.id}-enabled`} className="cursor-pointer">
                  Enable Trading
                </Label>
                <Switch
                  id={`${exchange.id}-enabled`}
                  checked={exchange.enabled}
                  onCheckedChange={() => toggleEnabled(exchange.id)}
                  disabled={!exchange.connected}
                />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>Exchange Integration</CardTitle>
          <CardDescription>How to connect your exchange accounts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Steps to connect an exchange:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-foreground/70">
              <li>Create API keys in your exchange account with trading permissions</li>
              <li>Enter your API keys in the API Keys section</li>
              <li>Click "Connect" on the exchange card above</li>
              <li>Enable trading to allow the platform to execute trades</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
