"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "USER" | "ADMIN" | "LIBRARIAN";
  allowedRoles?: ("USER" | "ADMIN" | "LIBRARIAN")[];
}

export function ProtectedRoute({
  children,
  requiredRole,
  allowedRoles = ["USER", "ADMIN", "LIBRARIAN"],
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Check role permissions
  const hasPermission = (): boolean => {
    if (!user) return false;

    if (requiredRole) {
      return user.role === requiredRole || user.role === "ADMIN";
    }

    return allowedRoles.includes(user.role);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!hasPermission()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don&apos;t have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
