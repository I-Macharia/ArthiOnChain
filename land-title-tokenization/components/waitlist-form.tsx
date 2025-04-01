"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

interface WaitlistFormProps {
  onSubmitSuccess: () => void
}

export function WaitlistForm({ onSubmitSuccess }: WaitlistFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [role, setRole] = useState("user")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)

      // Redirect based on role
      if (role === "admin") {
        router.push("/dashboard")
      } else if (role === "user") {
        router.push("/dashboard?tab=view")
      } else {
        // For government role, show the success message
        onSubmitSuccess()
      }
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input id="full-name" placeholder="Enter your full name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="you@example.com" required />
        </div>

        <div className="space-y-2">
          <Label>Select Your Role</Label>
          <RadioGroup defaultValue="user" value={role} onValueChange={setRole} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user" className="flex flex-col cursor-pointer">
                <span className="font-medium">User</span>
                <span className="text-xs text-muted-foreground">
                  View and verify land titles, access ownership information
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin" className="flex flex-col cursor-pointer">
                <span className="font-medium">Admin</span>
                <span className="text-xs text-muted-foreground">
                  Manage platform operations, user accounts, and system settings
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="government" id="government" />
              <Label htmlFor="government" className="flex flex-col cursor-pointer">
                <span className="font-medium">Government</span>
                <span className="text-xs text-muted-foreground">
                  Register and update land titles, manage official records
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {role === "government" && (
          <div className="space-y-2">
            <Label htmlFor="organization">Government Organization</Label>
            <Input id="organization" placeholder="Enter your organization name" required />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="message">Additional Information (Optional)</Label>
          <Textarea id="message" placeholder="Tell us more about your interest in LandChain" className="min-h-[80px]" />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : role === "government" ? "Join Waitlist" : "Continue"}
      </Button>

      {role !== "government" && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          {role === "admin"
            ? "You'll be redirected to the admin dashboard"
            : "You'll be redirected to view land titles"}
        </p>
      )}
    </form>
  )
}

