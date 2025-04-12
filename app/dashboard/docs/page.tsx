import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, BookOpen, Code, Key, BarChart3 } from "lucide-react"

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Documentation</h1>
        <p className="text-foreground/70">Learn how to use the AI Trading Platform</p>
      </div>

      <Tabs defaultValue="getting-started" className="space-y-4">
        <TabsList className="bg-card">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <CardTitle>Welcome to the AI Trading Platform</CardTitle>
              </div>
              <CardDescription>Everything you need to know to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Overview</h3>
                <p className="text-foreground/70">
                  The AI Trading Platform is a powerful tool that allows you to trade cryptocurrencies on both Blofin
                  (futures trading) and Bitmart (spot trading) exchanges using AI-powered automated strategies. This
                  documentation will guide you through setting up your account, connecting your API keys, and using the
                  platform's features.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Quick Start Guide</h3>
                <ol className="list-decimal pl-5 space-y-2 text-foreground/70">
                  <li>
                    <strong>Set up your exchange accounts</strong> - Create accounts on Blofin and/or{" "}
                    <a
                      href="https://www.bitmart.com/invite/R4Jdty/en"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline hover:text-primary/80"
                    >
                      Bitmart
                    </a>{" "}
                    exchanges if you don't already have them.
                  </li>
                  <li>
                    <strong>Generate API keys</strong> - In your exchange accounts, navigate to API Management and
                    create new API keys with trading permissions.
                  </li>
                  <li>
                    <strong>Add your API keys</strong> - In the platform, go to the API Keys section and enter your
                    exchange API credentials.
                  </li>
                  <li>
                    <strong>Start using automated trading</strong> - Once your API keys are set up, you can configure
                    and activate automated trading strategies in the Analytics section.
                  </li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Platform Features</h3>
                <ul className="list-disc pl-5 space-y-2 text-foreground/70">
                  <li>
                    <strong>Dashboard</strong> - View market data, charts, and order books for any cryptocurrency pair.
                  </li>
                  <li>
                    <strong>Analytics</strong> - Track your trading performance, monitor positions, and set up automated
                    trading strategies.
                  </li>
                  <li>
                    <strong>API Keys</strong> - Securely store and manage your exchange API credentials.
                  </li>
                  <li>
                    <strong>Settings</strong> - Configure your platform preferences and notification settings.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <CardTitle>API Keys Setup</CardTitle>
              </div>
              <CardDescription>How to set up and manage your exchange API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Blofin API Keys (Futures Trading)</h3>
                <ol className="list-decimal pl-5 space-y-2 text-foreground/70">
                  <li>Log in to your Blofin account.</li>
                  <li>Navigate to "Account" &gt; "API Management".</li>
                  <li>Click on "Create API" to generate a new API key.</li>
                  <li>
                    Set the appropriate permissions. For trading, you'll need "Enable Trading" permission. For security
                    reasons, do not enable withdrawal permissions unless absolutely necessary.
                  </li>
                  <li>Create and save your API Passphrase. This is required for authentication with Blofin.</li>
                  <li>
                    Complete any security verification steps required by Blofin (such as email or SMS verification).
                  </li>
                  <li>
                    Once created, Blofin will display your API Key and Secret. Make sure to copy and store these
                    securely, as the Secret will only be shown once.
                  </li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Bitmart API Keys (Spot Trading)</h3>
                <ol className="list-decimal pl-5 space-y-2 text-foreground/70">
                  <li>Log in to your Bitmart account.</li>
                  <li>Navigate to "Account" &gt; "API Management".</li>
                  <li>Click on "Create API" to generate a new API key.</li>
                  <li>
                    Set the appropriate permissions. For trading, you'll need "Enable Trading" permission. For security
                    reasons, do not enable withdrawal permissions unless absolutely necessary.
                  </li>
                  <li>Create and save your memo. This is required for authentication with Bitmart.</li>
                  <li>
                    Complete any security verification steps required by Bitmart (such as email or SMS verification).
                  </li>
                  <li>
                    Once created, Bitmart will display your API Key and Secret. Make sure to copy and store these
                    securely, as the Secret will only be shown once.
                  </li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Adding API Keys to the Platform</h3>
                <ol className="list-decimal pl-5 space-y-2 text-foreground/70">
                  <li>In the AI Trading Platform, navigate to the "API Keys" section from the sidebar.</li>
                  <li>Select the exchange tab (Blofin or Bitmart) for which you want to add API keys.</li>
                  <li>Enter your API Key in the "API Key" field.</li>
                  <li>Enter your API Secret in the "API Secret" field.</li>
                  <li>
                    For Blofin, enter your API Passphrase in the "API Passphrase" field. For Bitmart, enter your memo in
                    the "Memo" field.
                  </li>
                  <li>Click "Save Keys" to store your credentials.</li>
                </ol>
                <div className="bg-blue-900/20 border border-blue-900/30 rounded-md p-4 text-blue-400 mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">Security Note</p>
                  </div>
                  <p className="text-sm">
                    Your API keys are encrypted using AES-256 encryption before being stored in our database. We never
                    store your API secrets in plain text, and they are only decrypted when needed for trading
                    operations.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">API Key Best Practices</h3>
                <ul className="list-disc pl-5 space-y-2 text-foreground/70">
                  <li>
                    <strong>Use Trading-Only Permissions</strong> - Never enable withdrawal permissions unless
                    absolutely necessary.
                  </li>
                  <li>
                    <strong>IP Restrictions</strong> - If your exchange offers IP restriction, consider limiting API
                    access to specific IP addresses.
                  </li>
                  <li>
                    <strong>Regular Rotation</strong> - Periodically rotate your API keys for enhanced security.
                  </li>
                  <li>
                    <strong>Separate Keys for Different Purposes</strong> - Use different API keys for different
                    applications or services.
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Analytics & Automated Trading</CardTitle>
              </div>
              <CardDescription>How to use analytics and set up automated trading</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Performance Analytics</h3>
                <p className="text-foreground/70">
                  The Analytics section provides insights into your trading performance. You can:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-foreground/70">
                  <li>
                    <strong>View Performance Summary</strong> - See your overall trading performance over time.
                  </li>
                  <li>
                    <strong>Check Win/Loss Ratio</strong> - Analyze your successful vs. unsuccessful trades.
                  </li>
                  <li>
                    <strong>Monitor Portfolio Allocation</strong> - See how your investments are distributed across
                    different cryptocurrencies.
                  </li>
                  <li>
                    <strong>Review Trading History</strong> - View a detailed list of your past trades.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Positions Management</h3>
                <p className="text-foreground/70">
                  The Positions tab allows you to monitor and manage your open positions:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-foreground/70">
                  <li>
                    <strong>Active Positions</strong> - View all your currently open positions, including entry price,
                    current price, and profit/loss.
                  </li>
                  <li>
                    <strong>Close Positions</strong> - Close any open position directly from the interface.
                  </li>
                  <li>
                    <strong>Position History</strong> - Review your closed positions and their performance.
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Automated Trading</h3>
                <p className="text-foreground/70">
                  The Automated Trading tab allows you to set up and manage AI-powered trading strategies:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-foreground/70">
                  <li>
                    <strong>Select a Strategy</strong> - Choose from available strategies like Momentum, Grid Trading,
                    or Trend Following.
                  </li>
                  <li>
                    <strong>Configure Settings</strong> - Set your risk level, maximum position size, trading pairs, and
                    trading frequency.
                  </li>
                  <li>
                    <strong>Activate the Strategy</strong> - Click the "Activate" button to start the automated trading
                    strategy.
                  </li>
                  <li>
                    <strong>Monitor Performance</strong> - Track the performance of your automated strategies over time.
                  </li>
                </ol>
                <div className="bg-green-900/20 border border-green-900/30 rounded-md p-4 text-green-400 mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-5 w-5" />
                    <p className="font-medium">Pro Tip</p>
                  </div>
                  <p className="text-sm">
                    Start with a conservative risk level and small position sizes when first using automated trading
                    strategies. You can gradually increase these as you become more comfortable with the system's
                    performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                <CardTitle>Frequently Asked Questions</CardTitle>
              </div>
              <CardDescription>Common questions and answers about the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Is my API key information secure?</h3>
                  <p className="text-foreground/70">
                    Yes, all API keys are encrypted using AES-256 encryption before being stored in our database. We
                    never store your API secrets in plain text, and they are only decrypted when needed for trading
                    operations.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Which exchanges are supported?</h3>
                  <p className="text-foreground/70">
                    Currently, the platform supports Blofin for futures trading and Bitmart for spot trading. We plan to
                    add support for additional exchanges in the future.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What's the difference between API Passphrase and Memo?</h3>
                  <p className="text-foreground/70">
                    Different exchanges use different authentication methods. Blofin requires an API Passphrase while
                    Bitmart requires a Memo. Both serve as additional security measures for API authentication. When you
                    create API keys on these exchanges, you'll be asked to set these values, which must be provided
                    along with your API key and secret for all API requests.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How do the automated trading strategies work?</h3>
                  <p className="text-foreground/70">
                    Our automated trading strategies use artificial intelligence and machine learning algorithms to
                    analyze market data and execute trades based on predefined rules. Each strategy has a different
                    approach:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-foreground/70">
                    <li>
                      <strong>Momentum Strategy</strong> - Trades based on price momentum indicators like RSI and MACD.
                    </li>
                    <li>
                      <strong>Grid Trading</strong> - Places buy and sell orders at regular price intervals to profit
                      from market volatility.
                    </li>
                    <li>
                      <strong>Trend Following</strong> - Identifies and follows market trends using moving averages and
                      breakout patterns.
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What cryptocurrencies can I trade?</h3>
                  <p className="text-foreground/70">
                    You can trade any cryptocurrency pair that is available on the exchanges you've connected. The
                    platform allows you to search for and select any market pair.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How do I get started with automated trading?</h3>
                  <p className="text-foreground/70">
                    To get started with automated trading, navigate to the Analytics section and select the Automated
                    Trading tab. From there, you can select a strategy, configure your settings, and activate the
                    strategy.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What if I encounter an error or need support?</h3>
                  <p className="text-foreground/70">
                    If you encounter any issues or need assistance, please contact our support team at
                    support@aitrading.com. We're here to help you get the most out of the platform.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
