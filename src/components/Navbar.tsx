"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { user, signOut } = useAuth();

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/10 backdrop-blur-md supports-[backdrop-filter]:bg-white/10">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:scale-105 transition-transform duration-300 px-2 py-1 rounded-md hover:bg-yellow-500/20"
          >
            <BookOpen className="h-6 w-6 text-yellow-300" />
            <span className="text-xl font-bold text-white">E-Library</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white/90 hover:text-white hover:bg-yellow-500/90 hover:shadow-lg px-3 py-2 rounded-md transition-all duration-300 font-medium hover:scale-105"
            >
              Home
            </Link>
            <Link
              href="/books"
              className="text-white/90 hover:text-white hover:bg-yellow-500/90 hover:shadow-lg px-3 py-2 rounded-md transition-all duration-300 font-medium hover:scale-105"
            >
              Books
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-white/90 hover:text-white hover:bg-yellow-500/90 hover:shadow-lg px-3 py-2 rounded-md transition-all duration-300 font-medium hover:scale-105"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/my-books"
                  className="text-white/90 hover:text-white hover:bg-yellow-500/90 hover:shadow-lg px-3 py-2 rounded-md transition-all duration-300 font-medium hover:scale-105"
                >
                  My Books
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {user.name?.charAt(0) ||
                          user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-gray-600">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {user.role.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/my-books"
                      className="flex items-center"
                    >
                      My Books
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "ADMIN" || user.role === "LIBRARIAN") && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/books/upload"
                        className="flex items-center"
                      >
                        Manage Books
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-red-600"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  asChild
                  className="text-white hover:text-white hover:bg-yellow-500/90 hover:shadow-lg transition-all duration-300 hover:scale-105 px-4 py-2"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-yellow-300 text-black hover:bg-yellow-400"
                >
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
