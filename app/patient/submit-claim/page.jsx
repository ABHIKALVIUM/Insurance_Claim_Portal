"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PatientNavbar } from "@/components/patient-navbar"
import { toast } from "@/hooks/use-toast"

export default function SubmitClaim() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    claimAmount: "",
    description: "",
    document: null,
  })

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/patient/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.type !== "patient") {
      router.push("/patient/login")
      return
    }

    setUser(parsedUser)
    setFormData((prev) => ({
      ...prev,
      name: parsedUser.name,
      email: parsedUser.email,
    }))
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      document: e.target.files[0],
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate form
    if (!formData.claimAmount || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // In a real app, you would submit the form data to your API
    // For demo purposes, we'll simulate a successful submission
    setTimeout(() => {
      toast({
        title: "Claim Submitted",
        description: "Your claim has been submitted successfully",
      })
      router.push("/patient/dashboard")
      setLoading(false)
    }, 1500)
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PatientNavbar user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Submit a New Claim</h1>
          <p className="text-muted-foreground">Fill out the form below to submit a new insurance claim</p>
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Claim Details</CardTitle>
            <CardDescription>Please provide accurate information about your claim</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="claimAmount">Claim Amount ($)</Label>
                <Input
                  id="claimAmount"
                  name="claimAmount"
                  type="number"
                  placeholder="0.00"
                  value={formData.claimAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Please describe your claim in detail"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document">Upload Document</Label>
                <Input
                  id="document"
                  name="document"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Upload receipts, prescriptions, or other supporting documents (PDF, JPG, PNG)
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex w-full gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push("/patient/dashboard")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Claim"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}

