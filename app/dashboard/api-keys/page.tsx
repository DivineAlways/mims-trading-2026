"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react"
import { saveApiKeys, getApiKeys } from "@/app/actions/api-keys"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseClient } from "@/lib/supabase-singleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ApiKeysPage() {
  const [activeExchange, setActiveExchange] = useState("blofin")
  const [showBitmartSecret, setShowBitmartSecret] = useState(false)
  const [showBitmartMemo, setShowBitmartMemo] = useState(false)
  const [showBlofinSecret, setShowBlofinSecret] = useState(false)
  const [showBlofinPassphrase, setShowBlofinPassphrase] = useState(false)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null)
  const [savedKeys, setSavedKeys] = useState<any[]>([])

  const [bitmartForm, setBitmartForm] = useState({
    apiKey: "",
    apiSecret: "",
    memo: "",
  })

  const [blofinForm, setBlofinForm] = useState({
    apiKey: "",
    apiSecret: "",
    passphrase: "",
  })

  useEffect(() => {
    // Fetch existing API keys when the component mounts
    async function fetchApiKeys() {
      try {
        setLoading(true)
        const supabase = getSupabaseClient()

        // Get the current user session
        const { data: sessionData } = await supabase.auth.getSession()
        if (!sessionData?.session) return

        // Fetch the actual API keys (not just the masked versions)
        const { data, error } = await supabase.from("api_keys").select("*").eq("user_id", sessionData.session.user.id)

        if (error) {
          console.error("Error fetching API keys:", error)
          return
        }

        if (data && data.length > 0) {
          // Update savedKeys state
          setSavedKeys(data)

          // Populate form fields with existing data
          data.forEach((key) => {
            if (key.exchange === "bitmart") {
              setBitmartForm({
                apiKey: key.api_key,
                apiSecret: key.api_secret,
                memo: key.memo || "",
              })
            } else if (key.exchange === "blofin") {
              setBlofinForm({
                apiKey: key.api_key,
                apiSecret: key.api_secret,
                passphrase: key.passphrase || "",
              })
            }
          })
        }
      } catch (err) {
        console.error("Error loading API keys:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchApiKeys()
  }, [])

  const handleBitmartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBitmartForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBlofinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBlofinForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleBitmartSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      // Create FormData object
      const formData = new FormData()
      formData.append("exchange", "bitmart")
      formData.append("apiKey", bitmartForm.apiKey)
      formData.append("apiSecret", bitmartForm.apiSecret)
      formData.append("memo", bitmartForm.memo)

      // Call the server action
      const result = await saveApiKeys(formData)
      setStatus(result)

      if (result.success) {
        // Refresh the list of saved keys
        const keysResult = await getApiKeys()
        if (keysResult.success && keysResult.data) {
          setSavedKeys(keysResult.data)
        }
      }
    } catch (error: any) {
      setStatus({ success: false, message: `Error: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  const handleBlofinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      // Create FormData object
      const formData = new FormData()
      formData.append("exchange", "blofin")
      formData.append("apiKey", blofinForm.apiKey)
      formData.append("apiSecret", blofinForm.apiSecret)
      formData.append("passphrase", blofinForm.passphrase)

      // Call the server action
      const result = await saveApiKeys(formData)
      setStatus(result)

      if (result.success) {
        // Refresh the list of saved keys
        const keysResult = await getApiKeys()
        if (keysResult.success && keysResult.data) {
          setSavedKeys(keysResult.data)
        }
      }
    } catch (error: any) {
      setStatus({ success: false, message: `Error: ${error.message}` })
    } finally {
      setLoading(false)
    }
  }

  // Check if keys exist for an exchange
  const hasKeysForExchange = (exchange: string) => {
    return savedKeys.some((key) => key.exchange === exchange.toLowerCase())
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">API Keys</h1>
        <p className="text-foreground/70">Manage your exchange API keys</p>
      </div>

      {status && (
        <Alert
          variant={status.success ? "default" : "destructive"}
          className={status.success ? "bg-green-900/20 text-green-400 border-green-900" : ""}
        >
          {status.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={activeExchange} onValueChange={setActiveExchange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blofin">Blofin</TabsTrigger>
          <TabsTrigger value="bitmart">Bitmart</TabsTrigger>
        </TabsList>

        <TabsContent value="blofin">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Blofin API Keys</CardTitle>
              <CardDescription>
                {hasKeysForExchange("blofin")
                  ? "Update your Blofin API credentials"
                  : "Enter your Blofin API credentials to enable futures trading"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleBlofinSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="blofin-api-key">API Key</Label>
                  <Input
                    id="blofin-api-key"
                    name="apiKey"
                    value={blofinForm.apiKey}
                    onChange={handleBlofinChange}
                    placeholder="Enter your Blofin API key"
                    className="bg-background"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blofin-api-secret">API Secret</Label>
                  <div className="relative">
                    <Input
                      id="blofin-api-secret"
                      name="apiSecret"
                      type={showBlofinSecret ? "text" : "password"}
                      value={blofinForm.apiSecret}
                      onChange={handleBlofinChange}
                      placeholder="Enter your Blofin API secret"
                      className="bg-background pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowBlofinSecret(!showBlofinSecret)}
                    >
                      {showBlofinSecret ? (
                        <EyeOff className="h-4 w-4 text-foreground/60" />
                      ) : (
                        <Eye className="h-4 w-4 text-foreground/60" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blofin-passphrase">API Passphrase</Label>
                  <div className="relative">
                    <Input
                      id="blofin-passphrase"
                      name="passphrase"
                      type={showBlofinPassphrase ? "text" : "password"}
                      value={blofinForm.passphrase}
                      onChange={handleBlofinChange}
                      placeholder="Enter your Blofin API passphrase"
                      className="bg-background pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowBlofinPassphrase(!showBlofinPassphrase)}
                    >
                      {showBlofinPassphrase ? (
                        <EyeOff className="h-4 w-4 text-foreground/60" />
                      ) : (
                        <Eye className="h-4 w-4 text-foreground/60" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : hasKeysForExchange("blofin") ? "Update Blofin Keys" : "Save Blofin Keys"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="bitmart">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Bitmart API Keys</CardTitle>
              <CardDescription>
                {hasKeysForExchange("bitmart")
                  ? "Update your Bitmart API credentials"
                  : "Enter your Bitmart API credentials to enable spot trading"}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleBitmartSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bitmart-api-key">API Key</Label>
                  <Input
                    id="bitmart-api-key"
                    name="apiKey"
                    value={bitmartForm.apiKey}
                    onChange={handleBitmartChange}
                    placeholder="Enter your Bitmart API key"
                    className="bg-background"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bitmart-api-secret">API Secret</Label>
                  <div className="relative">
                    <Input
                      id="bitmart-api-secret"
                      name="apiSecret"
                      type={showBitmartSecret ? "text" : "password"}
                      value={bitmartForm.apiSecret}
                      onChange={handleBitmartChange}
                      placeholder="Enter your Bitmart API secret"
                      className="bg-background pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowBitmartSecret(!showBitmartSecret)}
                    >
                      {showBitmartSecret ? (
                        <EyeOff className="h-4 w-4 text-foreground/60" />
                      ) : (
                        <Eye className="h-4 w-4 text-foreground/60" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bitmart-memo">Memo</Label>
                  <div className="relative">
                    <Input
                      id="bitmart-memo"
                      name="memo"
                      type={showBitmartMemo ? "text" : "password"}
                      value={bitmartForm.memo}
                      onChange={handleBitmartChange}
                      placeholder="Enter your Bitmart memo"
                      className="bg-background pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      onClick={() => setShowBitmartMemo(!showBitmartMemo)}
                    >
                      {showBitmartMemo ? (
                        <EyeOff className="h-4 w-4 text-foreground/60" />
                      ) : (
                        <Eye className="h-4 w-4 text-foreground/60" />
                      )}
                    </button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : hasKeysForExchange("bitmart") ? "Update Bitmart Keys" : "Save Bitmart Keys"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle>API Key Security</CardTitle>
          <CardDescription>Your API keys are securely stored with enterprise-grade encryption</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2 text-foreground/70">
            <li>All API keys are encrypted at rest using AES-256 encryption</li>
            <li>API secrets are never stored in plain text</li>
            <li>Keys are only decrypted when needed for trading operations</li>
            <li>We recommend using API keys with trading permissions only (no withdrawal access)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
