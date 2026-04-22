"use client"

import { useState } from "react"
import { ProtectedLayout } from "@/components/layout/protected-layout"
import { useAuth } from "@/contexts/auth-context"
import { useTheme, themes } from "@/contexts/theme-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getOverallStrengthLevel, strengthLevelLabels, calculateStrengthLevel } from "@/lib/strength-calculator"
import { User, Dumbbell, Palette, LogOut, Save, X, Edit2, History } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <ProtectedLayout>
      <ProfileContent />
    </ProtectedLayout>
  )
}

function ProfileContent() {
  const { user, profile, strengthAssessment, updateProfile, updateStrengthAssessment, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingStrength, setIsEditingStrength] = useState(false)

  const [editedProfile, setEditedProfile] = useState({
    name: profile?.name || "",
    gender: profile?.gender || "male",
    weight: profile?.weight || 70,
    height: profile?.height || 175,
  })

  const [editedStrength, setEditedStrength] = useState({
    benchPress: strengthAssessment?.benchPress || 0,
    squat: strengthAssessment?.squat || 0,
    deadlift: strengthAssessment?.deadlift || 0,
    shoulderPress: strengthAssessment?.shoulderPress || 0,
    barbellRow: strengthAssessment?.barbellRow || 0,
    overheadPress: strengthAssessment?.overheadPress || 0,
    legPress: strengthAssessment?.legPress || 0,
    pullUps: strengthAssessment?.pullUps || 1,
  })

  const overallLevel =
    strengthAssessment && profile
      ? getOverallStrengthLevel(
          {
            benchPress: strengthAssessment.benchPress,
            squat: strengthAssessment.squat,
            deadlift: strengthAssessment.deadlift,
            shoulderPress: strengthAssessment.shoulderPress,
            barbellRow: strengthAssessment.barbellRow,
            overheadPress: strengthAssessment.overheadPress,
            legPress: strengthAssessment.legPress,
            pullUps: strengthAssessment.pullUps * profile.weight,
          },
          profile.weight,
        )
      : "average"

  const handleSaveProfile = async () => {
    await updateProfile(editedProfile)
    setIsEditingProfile(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    })
  }

  const handleSaveStrength = async () => {
    await updateStrengthAssessment(editedStrength)
    setIsEditingStrength(false)
    toast({
      title: "Strength assessment updated",
      description: "Your max lifts have been saved successfully.",
    })
  }

  const handleCancelProfile = () => {
    setEditedProfile({
      name: profile?.name || "",
      gender: profile?.gender || "male",
      weight: profile?.weight || 70,
      height: profile?.height || 175,
    })
    setIsEditingProfile(false)
  }

  const handleCancelStrength = () => {
    setEditedStrength({
      benchPress: strengthAssessment?.benchPress || 0,
      squat: strengthAssessment?.squat || 0,
      deadlift: strengthAssessment?.deadlift || 0,
      shoulderPress: strengthAssessment?.shoulderPress || 0,
      barbellRow: strengthAssessment?.barbellRow || 0,
      overheadPress: strengthAssessment?.overheadPress || 0,
      legPress: strengthAssessment?.legPress || 0,
      pullUps: strengthAssessment?.pullUps || 1,
    })
    setIsEditingStrength(false)
  }

  const exerciseLabels: Record<string, string> = {
    benchPress: "Bench Press",
    squat: "Squat",
    deadlift: "Deadlift",
    shoulderPress: "Shoulder Press",
    barbellRow: "Barbell Row",
    overheadPress: "Overhead Press",
    legPress: "Leg Press",
    pullUps: "Pull-ups",
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Personal Info */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">Personal Information</CardTitle>
              <CardDescription>Your basic details</CardDescription>
            </div>
          </div>
          {!isEditingProfile && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(true)}>
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingProfile ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={editedProfile.gender}
                    onValueChange={(v: "male" | "female" | "other") =>
                      setEditedProfile((prev) => ({ ...prev, gender: v }))
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={editedProfile.weight}
                    onChange={(e) => setEditedProfile((prev) => ({ ...prev, weight: Number(e.target.value) }))}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={editedProfile.height}
                    onChange={(e) => setEditedProfile((prev) => ({ ...prev, height: Number(e.target.value) }))}
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancelProfile} className="bg-transparent">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium text-card-foreground">{profile?.name || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium text-card-foreground">{user?.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Gender</dt>
                <dd className="font-medium text-card-foreground capitalize">{profile?.gender || "Not set"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Weight</dt>
                <dd className="font-medium text-card-foreground">{profile?.weight || 0} kg</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Height</dt>
                <dd className="font-medium text-card-foreground">{profile?.height || 0} cm</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      {/* Strength Assessment */}
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-card-foreground">Strength Assessment</CardTitle>
                <Badge variant="secondary">{strengthLevelLabels[overallLevel]}</Badge>
              </div>
              <CardDescription>Your max lifts</CardDescription>
            </div>
          </div>
          {!isEditingStrength && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditingStrength(true)}>
              <Edit2 className="h-4 w-4 mr-1" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditingStrength ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(editedStrength).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>
                      {exerciseLabels[key]} {key === "pullUps" ? "(× BW)" : "(kg)"}
                    </Label>
                    <Input
                      id={key}
                      type="number"
                      step={key === "pullUps" ? 0.1 : 1}
                      value={value}
                      onChange={(e) =>
                        setEditedStrength((prev) => ({
                          ...prev,
                          [key]: Number(e.target.value),
                        }))
                      }
                      className="bg-background"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleSaveStrength}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancelStrength} className="bg-transparent">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <dl className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(strengthAssessment || {}).map(([key, value]) => {
                const level =
                  profile && value > 0
                    ? calculateStrengthLevel(
                        key as keyof typeof strengthAssessment,
                        key === "pullUps" ? (value as number) * profile.weight : (value as number),
                        profile.weight,
                      )
                    : null
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <dt className="text-muted-foreground">{exerciseLabels[key]}</dt>
                      <dd className="font-medium text-card-foreground">
                        {value} {key === "pullUps" ? "× BW" : "kg"}
                      </dd>
                    </div>
                    {level && (
                      <Badge variant="outline" className="text-xs">
                        {strengthLevelLabels[level]}
                      </Badge>
                    )}
                  </div>
                )
              })}
            </dl>
          )}
        </CardContent>
      </Card>

      {/* Workout History Link */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <Link href="/workout-history">
            <Button variant="outline" className="w-full justify-between bg-transparent">
              <div className="flex items-center gap-3">
                <History className="h-5 w-5" />
                <span>View Workout History</span>
              </div>
              <span className="text-muted-foreground">→</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Palette className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-card-foreground">Settings</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme" className="text-card-foreground">
              Theme
            </Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themes.map((t) => (
                  <SelectItem key={t.name} value={t.name}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <Button variant="destructive" onClick={logout} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
