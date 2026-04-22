"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PersonalInfoStep } from "@/components/onboarding/personal-info-step"
import { StrengthAssessmentStep } from "@/components/onboarding/strength-assessment-step"
import { ReviewStep } from "@/components/onboarding/review-step"
import { Dumbbell, Loader2, ArrowLeft, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

interface OnboardingData {
  name: string
  gender: "male" | "female" | "other"
  weight: number
  height: number
  benchPress: number
  squat: number
  deadlift: number
  shoulderPress: number
  barbellRow: number
  overheadPress: number
  legPress: number
  pullUps: number
}

const initialData: OnboardingData = {
  name: "",
  gender: "male",
  weight: 70,
  height: 175,
  benchPress: 0,
  squat: 0,
  deadlift: 0,
  shoulderPress: 0,
  barbellRow: 0,
  overheadPress: 0,
  legPress: 0,
  pullUps: 1,
}

const steps = [
  { id: 1, title: "Personal Information", description: "Tell us about yourself" },
  { id: 2, title: "Strength Assessment", description: "Enter your current lifts" },
  { id: 3, title: "Review & Submit", description: "Confirm your information" },
]

export default function OnboardingPage() {
  const { user, profile, loading, completeOnboarding } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [stepErrors, setStepErrors] = useState<string[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    } else if (!loading && profile?.onboarded) {
      router.push("/dashboard")
    }
  }, [user, profile, loading, router])

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }))
    setStepErrors([])
  }

  const validateStep1 = (): boolean => {
    const errors: string[] = []
    if (!data.name.trim()) errors.push("Name is required")
    if (data.weight < 30 || data.weight > 300) errors.push("Weight must be between 30-300 kg")
    if (data.height < 100 || data.height > 250) errors.push("Height must be between 100-250 cm")
    setStepErrors(errors)
    return errors.length === 0
  }

  const validateStep2 = (): boolean => {
    // Strength assessment is optional - any values are valid
    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    setStepErrors([])
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const userProfile = {
        name: data.name,
        gender: data.gender,
        weight: data.weight,
        height: data.height,
        onboarded: true,
      }

      const strengthAssessment = {
        benchPress: data.benchPress,
        squat: data.squat,
        deadlift: data.deadlift,
        shoulderPress: data.shoulderPress,
        barbellRow: data.barbellRow,
        overheadPress: data.overheadPress,
        legPress: data.legPress,
        pullUps: data.pullUps,
      }

      await completeOnboarding(userProfile, strengthAssessment)
    } catch (error) {
      console.error("Onboarding failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const progressPercent = (currentStep / steps.length) * 100

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary glow-effect" />
            <span className="text-xl font-bold text-foreground">GymRemo</span>
          </Link>
          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="container px-4 py-4">
          <Progress value={progressPercent} className="h-2" />
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${step.id <= currentStep ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                    step.id < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : step.id === currentStep
                        ? "border-primary text-primary"
                        : "border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-card border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-card-foreground">{steps[currentStep - 1].title}</CardTitle>
            <CardDescription className="text-muted-foreground">{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Messages */}
            {stepErrors.length > 0 && (
              <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <ul className="space-y-1">
                  {stepErrors.map((error, index) => (
                    <li key={index} className="text-sm text-destructive">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step Content */}
            {currentStep === 1 && <PersonalInfoStep data={data} onUpdate={updateData} />}
            {currentStep === 2 && <StrengthAssessmentStep data={data} onUpdate={updateData} />}
            {currentStep === 3 && <ReviewStep data={data} onEdit={setCurrentStep} />}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < 3 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
