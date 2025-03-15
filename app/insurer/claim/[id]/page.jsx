"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency, formatDate } from "@/lib/utils"
import { InsurerNavbar } from "@/components/insurer-navbar"
import { mockClaims } from "@/lib/mock-data"
import { toast } from "@/hooks/use-toast"

export default function ClaimReview({ params }) {
  const router = useRouter()
  const { id } = params
  const [user, setUser] = useState(null)
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    status: "",
    approvedAmount: "",
    comment: "",
  })

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/insurer/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.type !== "insurer") {
      router.push("/insurer/login")
      return
    }

    setUser(parsedUser)

    // In a real app, fetch claim from API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      const foundClaim = mockClaims.find((c) => c.id === id)
      if (!foundClaim) {
        router.push("/insurer/dashboard")
        return
      }
      setClaim(foundClaim)

      // Pre-fill form if claim is already reviewed
      if (foundClaim.status !== "pending") {
        setFormData({
          status: foundClaim.status,
          approvedAmount: foundClaim.approvedAmount || "",
          comment: foundClaim.insurerComment || "",
        })
      }

      setLoading(false)
    }, 1000)
  }, [router, id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStatusChange = (status) => {
    setFormData((prev) => ({
      ...prev,
      status,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Validate form
    if (!formData.status) {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive",
      })
      setSubmitting(false)
      return
    }

    if (formData.status === "approved" && !formData.approvedAmount) {
      toast({
        title: "Error",
        description: "Please enter an approved amount",
        variant: "destructive",
      })
      setSubmitting(false)
      return
    }

    // In a real app, you would submit the form data to your API
    // For demo purposes, we'll simulate a successful submission
    setTimeout(() => {
      toast({
        title: "Claim Updated",
        description: `Claim has been ${formData.status} successfully`,
      })
      router.push("/insurer/dashboard")
      setSubmitting(false)
    }, 1500)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <InsurerNavbar user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="outline" size="sm" className="mb-4" onClick={() => router.back()}>
            &larr; Back
          </Button>
          <h1 className="text-3xl font-bold">{claim.status === "pending" ? "Review Claim" : "Claim Details"}</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{claim.description}</CardTitle>
                    <CardDescription>Claim ID: {claim.id}</CardDescription>
                  </div>
                  {getStatusBadge(claim.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patient Name</p>
                    <p>{claim.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Patient Email</p>
                    <p>{claim.email}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Submission Date</p>
                    <p>{formatDate(claim.submissionDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p>{formatDate(claim.lastUpdated || claim.submissionDate)}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Claim Amount</p>
                    <p className="text-xl font-semibold">{formatCurrency(claim.claimAmount)}</p>
                  </div>
                  {claim.status === "approved" && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Approved Amount</p>
                      <p className="text-xl font-semibold">{formatCurrency(claim.approvedAmount)}</p>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="mt-1">{claim.description}</p>
                </div>

                {claim.insurerComment && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Your Comment</p>
                    <div className="mt-1 rounded-md bg-muted p-3">
                      <p>{claim.insurerComment}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {claim.status === "pending" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Review Decision</CardTitle>
                  <CardDescription>Approve or reject this claim</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant={formData.status === "approved" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => handleStatusChange("approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        type="button"
                        variant={formData.status === "rejected" ? "destructive" : "outline"}
                        className="flex-1"
                        onClick={() => handleStatusChange("rejected")}
                      >
                        Reject
                      </Button>
                    </div>

                    {formData.status === "approved" && (
                      <div className="space-y-2">
                        <Label htmlFor="approvedAmount">Approved Amount ($)</Label>
                        <Input
                          id="approvedAmount"
                          name="approvedAmount"
                          type="number"
                          placeholder="0.00"
                          value={formData.approvedAmount}
                          onChange={handleChange}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Enter the amount to be approved (must be less than or equal to the claim amount)
                        </p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="comment">Comment</Label>
                      <Textarea
                        id="comment"
                        name="comment"
                        placeholder="Add a comment about your decision"
                        value={formData.comment}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={!formData.status || submitting}>
                      {submitting ? "Submitting..." : "Submit Decision"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
                <CardDescription>Documents submitted with this claim</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="rounded-md bg-primary/10 p-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 text-primary"
                          >
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Receipt.pdf</p>
                          <p className="text-xs text-muted-foreground">PDF, 2.4 MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Claim Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${claim.status === "pending" ? "bg-yellow-500" : claim.status === "approved" ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <p className="font-medium capitalize">{claim.status}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Timeline</p>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                          <div className="h-full w-px bg-border"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Claim Submitted</p>
                          <p className="text-xs text-muted-foreground">{formatDate(claim.submissionDate)}</p>
                        </div>
                      </div>

                      {claim.status !== "pending" && (
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Claim {claim.status === "approved" ? "Approved" : "Rejected"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(claim.lastUpdated || new Date())}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

