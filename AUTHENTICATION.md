# Authentication & Authorization System

This project implements a comprehensive authentication and authorization system using Next.js middleware and custom hooks.

## Overview

The system provides:
- Server-side route protection using Next.js middleware
- Client-side route protection using custom hooks and HOCs
- Role-based access control (RBAC) for HRD and JOBSEEKER roles
- Automatic redirects based on user roles

## Components

### 1. Middleware (`src/middleware.ts`)

The middleware runs on every request and provides:
- **Authentication Check**: Verifies if user has valid token
- **Role-based Access Control**: Prevents unauthorized role access
- **Automatic Redirects**: Routes users to appropriate dashboards

#### Protected Routes:
- `/hrd/*` - Only accessible by HRD users
- `/jobseeker/*` - Only accessible by JOBSEEKER users
- All other routes except public ones require authentication

#### Public Routes:
- `/` (landing page)
- `/login`
- `/register`

#### Redirect Logic:
- Unauthenticated users → `/login`
- HRD users accessing jobseeker routes → `/hrd/dashboard`
- JOBSEEKER users accessing HRD routes → `/jobseeker/jobs`
- Authenticated users accessing login/register → their respective dashboard

### 2. Auth Service (`src/lib/auth.ts`)

Updated to store both token and role in cookies for middleware access:
- Stores JWT token in localStorage and httpOnly cookie
- Stores user role in cookie for middleware access
- Handles login, registration, and logout

### 3. Client-side Protection

#### useAuthGuard Hook (`src/hooks/use-auth-guard.ts`)
```typescript
const { isAuthorized, user, loading } = useAuthGuard({
  requiredRole: "HRD", // Optional: specific role requirement
  redirectTo: "/login" // Optional: custom redirect path
})
```

#### withAuth HOC (`src/components/with-auth.tsx`)
```typescript
export default withAuth(MyComponent, {
  requiredRole: "JOBSEEKER",
  redirectTo: "/login",
  loadingComponent: CustomLoader
})
```

## Usage Examples

### Protecting a Page with Hook
```typescript
"use client"

function MyPage() {
  const { isAuthorized, loading } = useAuthGuard({ 
    requiredRole: "HRD" 
  })

  if (loading) return <div>Loading...</div>
  if (!isAuthorized) return null // Redirecting...

  return <div>Protected Content</div>
}
```

### Protecting a Page with HOC
```typescript
"use client"

function MyPage() {
  return <div>Protected Content</div>
}

export default withAuth(MyPage, { requiredRole: "HRD" })
```

## Implementation Status

✅ **Completed:**
- Middleware with role-based routing
- Updated auth service with role cookies
- Client-side auth guard hook
- Higher-order component for page protection
- Example implementation in HRD dashboard

🔄 **To Implement:**
Apply the same pattern to other protected pages:

### HRD Pages:
```typescript
// Apply to these files:
- src/app/hrd/jobs/page.tsx
- src/app/hrd/jobs/[id]/page.tsx
- src/app/hrd/jobs/[id]/edit/page.tsx
- src/app/hrd/jobs/new/page.tsx
- src/app/hrd/profile/page.tsx
```

### JOBSEEKER Pages:
```typescript
// Apply to these files:
- src/app/jobseeker/applications/page.tsx
- src/app/jobseeker/jobs/page.tsx
- src/app/jobseeker/profile/page.tsx
```

## Security Notes

🔒 **Current Implementation:**
- Middleware provides server-side protection
- Client-side hooks provide UX improvements
- Role stored in cookie for middleware access

⚠️ **Production Considerations:**
- JWT verification should be implemented in middleware
- Consider using httpOnly cookies for enhanced security
- Implement token refresh mechanism
- Add rate limiting for auth endpoints

## Testing the System

1. **Login as HRD user**
   - Should redirect to `/hrd/dashboard`
   - Cannot access `/jobseeker/*` routes

2. **Login as JOBSEEKER user**
   - Should redirect to `/jobseeker/jobs`
   - Cannot access `/hrd/*` routes

3. **Unauthenticated access**
   - Any protected route should redirect to `/login`

4. **Role switching**
   - Attempting to access wrong role routes should redirect to appropriate dashboard