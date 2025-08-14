"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, Shield, Activity } from "lucide-react";
import Link from "next/link";

type UserData = {
  name: string;
  email: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear all session data
    localStorage.removeItem("sessionId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    router.push("/");
  };

  useEffect(() => {
    // Check for session in localStorage
    const sessionId = localStorage.getItem("sessionId");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
    
    if (!sessionId || !userName || !userEmail) {
      router.push("/login");
      return;
    }
    
    setUserData({ name: userName, email: userEmail });
    setIsLoading(false);
  }, [router]);

  // Show loading state during SSR and while checking session
  if (isLoading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-card rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back, {userData.name}!
                </h1>
                <p className="text-muted-foreground">{userData.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-accent transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/dashboard/profile"
            className="bg-card rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Edit Profile</h3>
                <p className="text-sm text-muted-foreground">
                  Update your personal information
                </p>
              </div>
            </div>
          </Link>

          <div className="bg-card rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Shield className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Account verified and secure
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">Activity</h3>
                <p className="text-sm text-muted-foreground">
                  Secure session active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-card rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Display Name</label>
              <p className="font-medium">
                {userData.name}
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="font-medium">
                {userData.email}
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Session Status</label>
              <p className="font-medium text-green-600">
                Active
              </p>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Login Method</label>
              <p className="font-medium">
                Server-side Authentication
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">Successful Login</p>
                <p className="text-sm text-muted-foreground">
                  {new Date().toLocaleString()}
                </p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                Success
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Activity logs would be fetched from server-side APIs in a production app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}