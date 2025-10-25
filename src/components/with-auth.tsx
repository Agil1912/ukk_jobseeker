"use client";

import { ComponentType } from "react";
import { useAuthGuard } from "../hooks/use-auth-guard";

interface WithAuthOptions {
  requiredRole?: "HRD" | "Society";
  redirectTo?: string;
  loadingComponent?: ComponentType;
}

export function withAuth<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const AuthenticatedComponent = (props: P) => {
    const { isAuthorized, loading } = useAuthGuard({
      requiredRole: options.requiredRole,
      redirectTo: options.redirectTo,
    });

    if (loading) {
      if (options.loadingComponent) {
        const LoadingComponent = options.loadingComponent;
        return <LoadingComponent />;
      }
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (!isAuthorized) {
      return null; // Redirecting is handled by useAuthGuard
    }

    return <WrappedComponent {...props} />;
  };

  AuthenticatedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return AuthenticatedComponent;
}
