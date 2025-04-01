"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { WaitlistForm } from "@/components/waitlist-form"

export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <FileCheck className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">ArdhiChain</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/">
            Home
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-muted/40">
        <div className="w-full max-w-md">
          {!submitted ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Join the Waitlist</CardTitle>
                <CardDescription>
                  Sign up to be notified when LandChain launches. Select your role to get access to relevant features.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <WaitlistForm onSubmitSuccess={() => setSubmitted(true)} />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-green-600 flex items-center">
                  <FileCheck className="mr-2 h-6 w-6" />
                  You're on the list!
                </CardTitle>
                <CardDescription>
                  Thank you for joining the LandChain waitlist. We'll notify you when we launch.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  We're working hard to revolutionize land title management with blockchain technology. Your selected
                  role will help us tailor the experience to your needs.
                </p>
                <div className="flex justify-center">
                  <Link href="/">
                    <Button variant="outline" className="flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col items-center justify-between gap-4 py-4 md:h-16 md:flex-row md:py-0">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} LandChain. All rights reserved.
          </div>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

