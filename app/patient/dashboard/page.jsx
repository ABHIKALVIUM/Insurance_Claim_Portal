"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import { PatientNavbar } from "@/components/patient-navbar"
import { mockClaims } from "@/lib/mock-data"

export default function PatientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)

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

    // In a real app, fetch claims from API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setClaims(mockClaims)
      setLoading(false)
    }, 1000)
  }, [router])

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
      <PatientNavbar user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Claims Dashboard</h1>
          <Button asChild>
            <Link href="/patient/submit-claim">Submit New Claim</Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Claims</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {claims.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">You haven&apos;t submitted any claims yet.</p>
                </CardContent>
              </Card>
            ) : (
              claims.map((claim) => (
                <Card key={claim.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{claim.description}</CardTitle>
                        <CardDescription>Submitted on {formatDate(claim.submissionDate)}</CardDescription>
                      </div>
                      {getStatusBadge(claim.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Claim Amount</p>
                        <p className="text-lg font-semibold">{formatCurrency(claim.claimAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Approved Amount</p>
                        <p className="text-lg font-semibold">
                          {claim.status === "approved" ? formatCurrency(claim.approvedAmount) : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Insurer Comment</p>
                        <p className="text-sm">{claim.insurerComment || "No comments yet"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/patient/claim/${claim.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {claims
              .filter((claim) => claim.status === "pending")
              .map((claim) => (
                <Card key={claim.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{claim.description}</CardTitle>
                        <CardDescription>Submitted on {formatDate(claim.submissionDate)}</CardDescription>
                      </div>
                      {getStatusBadge(claim.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Claim Amount</p>
                        <p className="text-lg font-semibold">{formatCurrency(claim.claimAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <p className="text-sm">Waiting for insurer review</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/patient/claim/${claim.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {claims
              .filter((claim) => claim.status === "approved")
              .map((claim) => (
                <Card key={claim.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{claim.description}</CardTitle>
                        <CardDescription>Submitted on {formatDate(claim.submissionDate)}</CardDescription>
                      </div>
                      {getStatusBadge(claim.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Claim Amount</p>
                        <p className="text-lg font-semibold">{formatCurrency(claim.claimAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Approved Amount</p>
                        <p className="text-lg font-semibold">{formatCurrency(claim.approvedAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Insurer Comment</p>
                        <p className="text-sm">{claim.insurerComment || "No comments"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/patient/claim/${claim.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {claims
              .filter((claim) => claim.status === "rejected")
              .map((claim) => (
                <Card key={claim.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{claim.description}</CardTitle>
                        <CardDescription>Submitted on {formatDate(claim.submissionDate)}</CardDescription>
                      </div>
                      {getStatusBadge(claim.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Claim Amount</p>
                        <p className="text-lg font-semibold">{formatCurrency(claim.claimAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Reason for Rejection</p>
                        <p className="text-sm">{claim.insurerComment || "No reason provided"}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/patient/claim/${claim.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

