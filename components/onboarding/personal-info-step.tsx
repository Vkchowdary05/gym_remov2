"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PersonalInfoData {
  name: string
  gender: "male" | "female" | "other"
  weight: number
  height: number
}

interface PersonalInfoStepProps {
  data: PersonalInfoData
  onUpdate: (updates: Partial<PersonalInfoData>) => void
}

export function PersonalInfoStep({ data, onUpdate }: PersonalInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={data.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="bg-background"
        />
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label htmlFor="gender" className="text-foreground">
          Gender
        </Label>
        <Select value={data.gender} onValueChange={(value: "male" | "female" | "other") => onUpdate({ gender: value })}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Weight & Height Row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-foreground">
            Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            min={30}
            max={300}
            value={data.weight}
            onChange={(e) => onUpdate({ weight: Number(e.target.value) })}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">Range: 30-300 kg</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="height" className="text-foreground">
            Height (cm)
          </Label>
          <Input
            id="height"
            type="number"
            min={100}
            max={250}
            value={data.height}
            onChange={(e) => onUpdate({ height: Number(e.target.value) })}
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">Range: 100-250 cm</p>
        </div>
      </div>
    </div>
  )
}
