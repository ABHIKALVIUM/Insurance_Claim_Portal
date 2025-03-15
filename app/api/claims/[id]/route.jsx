import { NextResponse } from "next/server"
import { mockClaims } from "@/lib/mock-data"

// GET a specific claim
export async function GET(request, { params }) {
  const { id } = params

  // In a real app, you would fetch from a database
  // For demo purposes, we'll use mock data
  const claim = mockClaims.find((claim) => claim.id === id)

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 })
  }

  return NextResponse.json(claim)
}

// PUT (update) a claim
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()

    // In a real app, you would update in a database
    // For demo purposes, we'll just return a success response
    const updatedClaim = {
      id,
      ...body,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(updatedClaim)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update claim" }, { status: 500 })
  }
}

