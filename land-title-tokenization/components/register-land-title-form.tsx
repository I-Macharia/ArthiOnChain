"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FileCheck } from "lucide-react"

export function RegisterLandTitleForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)
    }, 1500)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title-id">Title ID</Label>
              <Input id="title-id" placeholder="Enter unique ID" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner-address">Owner Address</Label>
              <Input id="owner-address" placeholder="0x..." required />
              <p className="text-xs text-muted-foreground">Enter the blockchain address of the property owner</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Property Location</Label>
            <Textarea id="location" placeholder="Full address of the property" required className="min-h-[80px]" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input id="area" type="number" placeholder="Property area in square feet" min="1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="document-hash">Document Hash</Label>
              <Input id="document-hash" placeholder="0x..." required />
              <p className="text-xs text-muted-foreground">Hash of the document that proves ownership</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additional-info">Additional Information (Optional)</Label>
            <Textarea
              id="additional-info"
              placeholder="Any additional details about the property"
              className="min-h-[80px]"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Registering..." : "Register Land Title"}
          </Button>
        </div>
      </form>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <FileCheck className="mr-2 h-5 w-5 text-green-500" />
              Registration Successful
            </AlertDialogTitle>
            <AlertDialogDescription>
              The land title has been successfully registered on the blockchain and tokenized. You can now view it in
              the land title registry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>View Registry</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

