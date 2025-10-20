import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const role = request.cookies.get("role")?.value
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register"]
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))

  // Protected routes for specific roles
  const hrdRoutes = ["/hrd"]
  const jobseekerRoutes = ["/jobseeker"]

  // If trying to access protected route without valid token
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If authenticated and trying to access login/register, redirect to appropriate dashboard
  if (token && role && (pathname === "/login" || pathname === "/register")) {
    if (role === "HRD") {
      return NextResponse.redirect(new URL("/hrd/dashboard", request.url))
    } else if (role === "JOBSEEKER") {
      return NextResponse.redirect(new URL("/jobseeker/jobs", request.url))
    }
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Role-based route protection
  if (token && role) {
    // Prevent HRD from accessing jobseeker routes
    if (role === "HRD" && jobseekerRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/hrd/dashboard", request.url))
    }

    // Prevent JOBSEEKER from accessing HRD routes
    if (role === "JOBSEEKER" && hrdRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/jobseeker/jobs", request.url))
    }

    // Redirect root path to appropriate dashboard
    if (pathname === "/") {
      if (role === "HRD") {
        return NextResponse.redirect(new URL("/hrd/dashboard", request.url))
      } else if (role === "JOBSEEKER") {
        return NextResponse.redirect(new URL("/jobseeker/jobs", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
