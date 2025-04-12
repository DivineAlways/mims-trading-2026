import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Zap, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI Trading Platform</span>
          </Link>
          <nav className="hidden space-x-6 md:flex">
            <Link href="#features" className="text-sm text-foreground/80 hover:text-foreground">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-foreground/80 hover:text-foreground">
              Pricing
            </Link>
            <Link href="/auth/simplified-login" className="text-sm text-foreground/80 hover:text-foreground">
              Sign In
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/auth/simplified-login" className="hidden md:block">
              <Button>Get Started</Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-3xl font-bold md:text-6xl">
            AI-Powered Trading <br className="hidden md:block" /> Automation
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg md:text-xl text-foreground/70">
            Combine human inputs with collaborative AI agents to make real-time trading decisions and execute trades
            across multiple exchanges.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/simplified-login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/simplified-login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-20 bg-background/50">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl md:text-3xl font-bold">Key Features</h2>
          <div className="grid gap-6 md:gap-8 md:grid-cols-3">
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-2">
                <div className="feature-icon mb-4">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle>Secure Credential Management</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                Securely store your trading API keys with enterprise-grade encryption.
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-2">
                <div className="feature-icon mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle>Multi-Agent AI System</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                Collaborative AI agents work together to analyze markets and generate trading signals.
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-2">
                <div className="feature-icon mb-4">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <CardTitle>Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                Monitor your portfolio performance with real-time data and advanced analytics.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl md:text-3xl font-bold">Pricing Plans</h2>
          <div className="grid gap-6 md:gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <Card className="bg-card border-border/50">
              <CardHeader className="text-center">
                <CardTitle>Basic</CardTitle>
                <div className="mt-4 text-4xl font-bold">
                  $29<span className="text-lg font-normal text-foreground/70">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <p className="mb-6 text-center text-foreground/70">For individual traders getting started with AI</p>
                <Link href="/auth/simplified-login" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 relative">
              <div className="absolute -top-3 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold">
                Popular
              </div>
              <CardHeader className="text-center">
                <CardTitle>Pro</CardTitle>
                <div className="mt-4 text-4xl font-bold">
                  $79<span className="text-lg font-normal text-foreground/70">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <p className="mb-6 text-center text-foreground/70">
                  For serious traders who want advanced AI capabilities
                </p>
                <Link href="/auth/simplified-login" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="text-center">
                <CardTitle>Enterprise</CardTitle>
                <div className="mt-4 text-4xl font-bold">
                  $299<span className="text-lg font-normal text-foreground/70">/month</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <p className="mb-6 text-center text-foreground/70">For professional trading firms with custom needs</p>
                <Link href="/auth/simplified-login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Contact Sales
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">AI Trading Platform</span>
          </div>
          <p className="text-sm text-foreground/60">
            © {new Date().getFullYear()} AI Trading Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
