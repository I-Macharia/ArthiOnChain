"use client"

import { useState } from "react"
import Link from "next/link"
import { FileCheck, Home, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LandTitleTable } from "@/components/land-title-table"
import { RegisterLandTitleForm } from "@/components/register-land-title-form"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("view")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <FileCheck className="h-6 w-6 text-primary" />
          <span>LandChain</span>
        </Link>
        <nav className="hidden flex-1 md:flex">
          <Link
            className="flex h-full items-center px-4 text-sm font-medium transition-colors hover:text-primary"
            href="/"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Link
            className="flex h-full items-center border-b-2 border-primary px-4 text-sm font-medium text-primary transition-colors"
            href="/dashboard"
          >
            Dashboard
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <form className="hidden items-center lg:flex">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="w-64 rounded-lg bg-background pl-8 shadow-none sm:w-80 md:w-96"
                placeholder="Search land titles..."
                type="search"
              />
            </div>
          </form>
          <Button variant="outline" size="sm">
            Connect Wallet
          </Button>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Land Title Registry Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Home className="mr-2 h-4 w-4" />
              View All
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Register New
            </Button>
          </div>
        </div>
        <Tabs defaultValue="view" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="view">View Land Titles</TabsTrigger>
            <TabsTrigger value="register">Register Land Title</TabsTrigger>
            <TabsTrigger value="update">Update Land Title</TabsTrigger>
          </TabsList>
          <TabsContent value="view" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Registered Titles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Land Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,245 acres</div>
                  <p className="text-xs text-muted-foreground">+120 acres from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">In the last 7 days</p>
                </CardContent>
              </Card>
            </div>
            <LandTitleTable />
          </TabsContent>
          <TabsContent value="register" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Register New Land Title</CardTitle>
                <CardDescription>Enter the details of the land title to register it on the blockchain.</CardDescription>
              </CardHeader>
              <CardContent>
                <RegisterLandTitleForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="update" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Update Land Title</CardTitle>
                <CardDescription>Update the details of an existing land title.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="title-id"
                      >
                        Title ID
                      </label>
                      <Input id="title-id" placeholder="Enter title ID to update" />
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full">Search</Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enter a valid title ID to load its details for updating.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Only authorized government entities can update land title information.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
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

