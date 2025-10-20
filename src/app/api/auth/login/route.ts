import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password harus diisi" },
        { status: 400 }
      )
    }

    // Mock login - in real app, this would check against database
    let mockUser
    
    // Simulate different user types based on email
    if (email.includes("hrd") || email.includes("company")) {
      mockUser = {
        id: `hrd_${Date.now()}`,
        name: "PT. Mock Company",
        email,
        role: "HRD" as const,
        companyName: "PT. Mock Company",
        companyAddress: "Jakarta, Indonesia",
        companyDescription: "Mock company for testing",
        createdAt: new Date().toISOString(),
      }
    } else {
      mockUser = {
        id: `js_${Date.now()}`,
        name: "John Doe",
        email,
        role: "JOBSEEKER" as const,
        phone: "+62123456789",
        address: "Jakarta, Indonesia",
        skills: ["JavaScript", "React", "Node.js"],
        bio: "Experienced developer",
        createdAt: new Date().toISOString(),
      }
    }

    // Mock JWT token - in real app, this would be properly signed
    const mockToken = `mock_token_${mockUser.id}_${Date.now()}`

    // Simulate database check delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "Login berhasil",
      token: mockToken,
      user: mockUser,
    })

  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}