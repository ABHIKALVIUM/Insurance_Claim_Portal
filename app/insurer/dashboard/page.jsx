"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatDate } from "@/lib/utils"
import { InsurerNavbar } from "@/components/insurer-navbar"
import { mockClaims } from "@/lib/mock-data"

export default function InsurerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [claims, setClaims] = useState([])
  const [filteredClaims, setFilteredClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    searchTerm: "",
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

    // In a real app, fetch claims from API
    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setClaims(mockClaims)
      setFilteredClaims(mockClaims)
      setLoading(false)
    }, 1000)
  }, [router])

  useEffect(() => {
    // Apply filters
    let result = [...claims]

    // Filter by status
    if (filters.status !== "all") {
      result = result.filter((claim) => claim.status === filters.status)
    }

    // Filter by date range
    if (filters.dateRange !== "all") {
      const now = new Date()
      const pastDate = new Date()

      switch (filters.dateRange) {
        case "today":
          pastDate.setDate(now.getDate() - 1)
          break
        case "week":
          pastDate.setDate(now.getDate() - 7)
          break
        case "month":
          pastDate.setMonth(now.getMonth() - 1)
          break
        default:
          break
      }

      result = result.filter((claim) => {
        const claimDate = new Date(claim.submissionDate)
        return claimDate >= pastDate && claimDate <= now
      })
    }

    // Filter by search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      result = result.filter(
        (claim) => claim.description.toLowerCase().includes(term) || claim.id.toLowerCase().includes(term),
      )
    }

    setFilteredClaims(result)
  }, [filters, claims])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
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
          <h1 className="text-3xl font-bold">Claims Dashboard</h1>
          <p className="text-muted-foreground">Manage and review patient insurance claims</p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{claims.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{claims.filter((c) => c.status === "pending").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Approved Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  claims.filter((c) => c.status === "approved").reduce((sum, claim) => sum + claim.approvedAmount, 0),
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter claims by status, date, or search term</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateRange">Date Range</Label>
                <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange("dateRange", value)}>
                  <SelectTrigger id="dateRange">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Search by ID or description"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Claims ({filteredClaims.length})</h2>

          {filteredClaims.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-muted-foreground">No claims match your filters.</p>
              </CardContent>
            </Card>
          ) : (
            filteredClaims.map((claim) => (
              <Card key={claim.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{claim.description}</CardTitle>
                      <CardDescription>
                        ID: {claim.id} | Submitted on {formatDate(claim.submissionDate)}
                      </CardDescription>
                    </div>
                    {getStatusBadge(claim.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 md:grid-cols-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Patient</p>
                      <p className="font-semibold">{claim.name}</p>
                      <p className="text-sm">{claim.email}</p>
                    </div>
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
                    <div className="flex items-end justify-end">
                      <Button asChild>
                        <Link href={`/insurer/claim/${claim.id}`}>
                          {claim.status === "pending" ? "Review Claim" : "View Details"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

