import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Mock jobs data
    const mockJobs = [
      {
        id: "1",
        hrdId: "hrd_1",
        companyName: "PT. Tech Indonesia",
        position: "Frontend Developer",
        description: "Mencari Frontend Developer berpengalaman dengan React dan TypeScript",
        location: "Jakarta",
        salary: "Rp 8.000.000 - Rp 12.000.000",
        requirements: "- Min 2 tahun pengalaman React\n- Menguasai TypeScript\n- Portfolio yang baik",
        startDate: "2025-01-01",
        endDate: "2025-02-28",
        isActive: true,
        createdAt: "2025-10-01T00:00:00Z"
      },
      {
        id: "2", 
        hrdId: "hrd_2",
        companyName: "PT. Digital Solutions",
        position: "Backend Developer",
        description: "Backend Developer untuk mengembangkan API dan sistem backend",
        location: "Bandung",
        salary: "Rp 10.000.000 - Rp 15.000.000",
        requirements: "- Min 3 tahun pengalaman Node.js\n- Menguasai Database\n- Pengalaman API development",
        startDate: "2025-01-15",
        endDate: "2025-03-15",
        isActive: true,
        createdAt: "2025-10-05T00:00:00Z"
      },
      {
        id: "3",
        hrdId: "hrd_1",
        companyName: "PT. Tech Indonesia",
        position: "UI/UX Designer",
        description: "UI/UX Designer untuk merancang interface aplikasi mobile dan web",
        location: "Jakarta",
        salary: "Rp 7.000.000 - Rp 10.000.000",
        requirements: "- Portfolio design yang baik\n- Menguasai Figma\n- Pengalaman mobile design",
        startDate: "2025-02-01",
        endDate: "2025-04-01",
        isActive: true,
        createdAt: "2025-10-10T00:00:00Z"
      }
    ]

    return NextResponse.json({
      success: true,
      data: mockJobs
    })

  } catch (error) {
    console.error("Jobs fetch error:", error)
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}