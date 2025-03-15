import { NextResponse } from "next/server"

// Mock users for demo purposes
const users = [
  {
    email: "patient@example.com",
    password: "password123",
    name: "John Doe",
    type: "patient",
  },
  {
    email: "insurer@example.com",
    password: "password123",
    name: "Insurance Admin",
    type: "insurer",
  },
]

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // In a real app, you would generate a JWT token
    // For demo purposes, we'll just return the user info (except password)
    const { password: _, ...userInfo } = user

    return NextResponse.json({
      user: userInfo,
    })
  } catch (error) {
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

