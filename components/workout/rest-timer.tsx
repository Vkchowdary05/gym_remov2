"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw, X, Timer, ChevronUp, ChevronDown } from "lucide-react"

interface RestTimerProps {
  defaultSeconds?: number
}

export function RestTimer({ defaultSeconds = 90 }: RestTimerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(defaultSeconds)
  const [totalTime, setTotalTime] = useState(defaultSeconds)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create a simple beep using AudioContext when timer finishes
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczFj+Sz+G2cjQjSp7X5rFuRChUnd3nsXFMN1qe4OsA"
      )
    }
  }, [])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            // Play sound
            try {
              const ctx = new AudioContext()
              const osc = ctx.createOscillator()
              const gain = ctx.createGain()
              osc.connect(gain)
              gain.connect(ctx.destination)
              osc.frequency.setValueAtTime(800, ctx.currentTime)
              gain.gain.setValueAtTime(0.3, ctx.currentTime)
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
              osc.start(ctx.currentTime)
              osc.stop(ctx.currentTime + 0.5)
            } catch {}
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning, timeLeft])

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(totalTime)
    }
    setIsRunning((prev) => !prev)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(totalTime)
  }

  const adjustTime = (delta: number) => {
    if (isRunning) return
    const newTime = Math.max(15, Math.min(600, totalTime + delta))
    setTotalTime(newTime)
    setTimeLeft(newTime)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const progressPercentage = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-6 right-6 z-50 bg-background/95 backdrop-blur-md border-primary/50 shadow-lg hover:shadow-primary/20 transition-all"
      >
        <Timer className="h-4 w-4 mr-2 text-primary" />
        Rest Timer
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 bg-card/95 backdrop-blur-md border-border shadow-2xl w-64 overflow-hidden">
      {/* Progress bar */}
      <div className="h-1 bg-muted w-full">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-card-foreground">Rest Timer</span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Time Display */}
        <div className="text-center">
          <span
            className={`text-4xl font-bold tabular-nums ${
              timeLeft === 0 ? "text-primary animate-pulse" : "text-card-foreground"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
          {timeLeft === 0 && (
            <p className="text-xs text-primary mt-1 font-medium">Time&apos;s up! Go!</p>
          )}
        </div>

        {/* Adjust Time */}
        {!isRunning && (
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent" onClick={() => adjustTime(-15)}>
              <ChevronDown className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground w-16 text-center">
              {formatTime(totalTime)}
            </span>
            <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent" onClick={() => adjustTime(15)}>
              <ChevronUp className="h-3 w-3" />
            </Button>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" className="bg-transparent" onClick={resetTimer}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button size="lg" className="flex-1" onClick={toggleTimer}>
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                {timeLeft === 0 ? "Restart" : "Start"}
              </>
            )}
          </Button>
        </div>

        {/* Quick presets */}
        <div className="flex gap-1">
          {[60, 90, 120, 180].map((secs) => (
            <Button
              key={secs}
              variant="ghost"
              size="sm"
              className={`flex-1 text-xs h-7 ${totalTime === secs ? "bg-primary/10 text-primary" : ""}`}
              onClick={() => {
                setTotalTime(secs)
                if (!isRunning) setTimeLeft(secs)
              }}
            >
              {secs < 60 ? `${secs}s` : `${secs / 60}m`}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  )
}
