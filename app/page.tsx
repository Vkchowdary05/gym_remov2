"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useTheme, themes } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, TrendingUp, Box, Calendar, ChevronRight, Palette } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

const features = [
  {
    icon: Dumbbell,
    title: "Track Workouts",
    description: "Log every set, rep, and weight with our intuitive workout tracker",
  },
  {
    icon: TrendingUp,
    title: "Monitor Progress",
    description: "Visualize your gains with detailed charts and analytics",
  },
  {
    icon: Box,
    title: "3D Muscle View",
    description: "See your strength mapped onto an interactive 3D body model",
  },
  {
    icon: Calendar,
    title: "Workout History",
    description: "Access your complete workout history anytime, anywhere",
  },
]

export default function LandingPage() {
  const { user, profile } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    if (user && profile?.onboarded) {
      router.push("/dashboard")
    }
  }, [user, profile, router])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary glow-effect" />
            <span className="text-xl font-bold text-foreground">GymRemo</span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Palette className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {themes.map((t) => (
                  <DropdownMenuItem
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    className={cn(theme === t.name && "bg-accent")}
                  >
                    {t.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32">
        <div className="container px-4">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground text-balance">
              Transform Your
              <span className="text-primary glow-effect"> Fitness Journey</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
              Track your workouts, visualize your progress, and see your strength come to life with our revolutionary 3D
              muscle mapping technology.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/auth">
                <Button size="lg" className="text-lg px-8">
                  Start Training
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth?mode=signup">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Everything You Need to
              <span className="text-primary"> Succeed</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed to help you reach your fitness goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border bg-muted/30">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of athletes tracking their progress with GymRemo
            </p>
            <Link href="/auth?mode=signup">
              <Button size="lg" className="text-lg px-12">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">GymRemo</span>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} GymRemo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
