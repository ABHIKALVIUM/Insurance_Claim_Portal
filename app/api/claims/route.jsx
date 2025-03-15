import { NextResponse } from "next/server"
import { mockClaims } from "@/lib/mock-data"

// GET all claims
export async function GET(request) {
  // In a real app, you would fetch from a database
  // For demo purposes, we'll use mock data
  return NextResponse.json(mockClaims)
}

// POST a new claim
export async function POST(request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.claimAmount || !body.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, you would save to a database
    // For demo purposes, we'll just return a success response
    const newClaim = {
      id: `CLM-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...body,
      status: "pending",
      submissionDate: new Date().toISOString(),
    }

    return NextResponse.json(newClaim, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 })
  }
}

