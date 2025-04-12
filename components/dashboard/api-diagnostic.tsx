"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export function ApiDiagnostic() {
  const [loading, setLoading] = useState(false)
  const [diagnosticData, setDiagnosticData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const runDiagnostic = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/blofin/debug")
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to run diagnostic")
        return
      }

      setDiagnosticData(data)
      setLastUpdated(new Date())
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Run diagnostic on mount and every 30 seconds
  useEffect(() => {
    runDiagnostic()

    const intervalId = setInterval(() => {
      runDiagnostic()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Card className="bg-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
          API Connection Diagnostic
        </CardTitle>
        <CardDescription>
          Troubleshoot issues with your Blofin API connection
          {lastUpdated && (
            <span className="text-xs text-muted-foreground ml-2">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            <p>Running diagnostic...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-md p-4 text-red-700">
            <p className="font-medium mb-2">Error running diagnostic</p>
            <p className="text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={runDiagnostic} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : diagnosticData ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <div
                  className={`h-2 w-2 rounded-full mr-2 ${diagnosticData.keysFound > 0 ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <p className="font-medium">API Keys Found: {diagnosticData.keysFound}</p>
              </div>

              {diagnosticData.keysFound > 0 && (
                <>
                  <div className="flex items-center">
                    <div
                      className={`h-2 w-2 rounded-full mr-2 ${diagnosticData.keysEnabled > 0 ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <p className="font-medium">API Keys Enabled: {diagnosticData.keysEnabled}</p>
                  </div>

                  {diagnosticData.firstKey && (
                    <div className="bg-secondary/50 rounded-md p-3 mt-3">
                      <p className="text-sm font-medium mb-2">Key Details:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <p>Exchange: {diagnosticData.firstKey.exchange}</p>
                        <p>Enabled: {diagnosticData.firstKey.enabled ? "Yes" : "No"}</p>
                        <p>Has API Key: {diagnosticData.firstKey.hasApiKey ? "Yes" : "No"}</p>
                        <p>Has API Secret: {diagnosticData.firstKey.hasApiSecret ? "Yes" : "No"}</p>
                        <p>Has Passphrase: {diagnosticData.firstKey.hasPassphrase ? "Yes" : "No"}</p>
                        <p>
                          Last Used:{" "}
                          {diagnosticData.firstKey.last_used
                            ? new Date(diagnosticData.firstKey.last_used).toLocaleTimeString()
                            : "Never"}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button size="sm" onClick={runDiagnostic} className="flex items-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Diagnostic Again
              </Button>

              <Button size="sm" variant="outline" asChild>
                <Link href="/dashboard/api-keys">Manage API Keys</Link>
              </Button>

              <Button size="sm" variant="outline" asChild>
                <Link href="/api/blofin/test-connection" target="_blank">
                  Test API Connection
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <p>No diagnostic data available</p>
        )}
      </CardContent>
    </Card>
  )
}
