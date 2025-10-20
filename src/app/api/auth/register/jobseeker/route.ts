import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Semua field harus diisi" },
        { status: 400 }
      )
    }

    // Mock user creation - in real app, this would save to database
    const mockUser = {
      id: `js_${Date.now()}`,
      name,
      email,
      role: "JOBSEEKER" as const,
      createdAt: new Date().toISOString(),
    }

    // Mock JWT token - in real app, this would be properly signed
    const mockToken = `mock_token_${mockUser.id}_${Date.now()}`

    // Simulate database save delay
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil",
      token: mockToken,
      user: mockUser,
    })

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}