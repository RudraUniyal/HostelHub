import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState, useEffect, Suspense, lazy } from "react";
import { LandingPageSkeleton, DashboardSkeleton, ProfileSkeleton } from "./components/LoadingSkeleton";

// Lazy load components for better performance
const Dashboard = lazy(() => import("./components/Dashboard").then(module => ({ default: module.Dashboard })));
const IssueReportForm = lazy(() => import("./components/IssueReportForm").then(module => ({ default: module.IssueReportForm })));
const ProfileSetup = lazy(() => import("./components/ProfileSetup").then(module => ({ default: module.ProfileSetup })));
const ProfileView = lazy(() => import("./components/ProfileView").then(module => ({ default: module.ProfileView })));

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const userProfile = useQuery(api.users.getUserProfile);

  // Handle initial load state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 100); // Short delay to show skeleton briefly

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const parallax = document.querySelector('.parallax-bg') as HTMLElement;
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--color-bg-primary)' }}>
      {/* Dark theme animated background */}
      <div className="parallax-bg absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ background: 'rgba(138, 43, 226, 0.3)' }}></div>
        <div className="absolute top-40 right-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" style={{ background: 'rgba(3, 218, 198, 0.3)' }}></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000" style={{ background: 'rgba(138, 43, 226, 0.2)' }}></div>
      </div>

      {/* Dark theme header */}
      <header className="dark-header sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h1 className="text-2xl font-bold text-gradient">
                Hostel Hub
              </h1>
            </div>
            
            <Authenticated>
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === "dashboard"
                      ? "dark-button"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("report")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === "report"
                      ? "dark-button"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  Report Issue
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    activeTab === "profile"
                      ? "dark-button"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  Profile
                </button>
              </nav>
            </Authenticated>

            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <Unauthenticated>
          {isInitialLoad ? (
            <LandingPageSkeleton />
          ) : (
            <div className="min-h-screen p-6">
              {/* Hero Section */}
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-full max-w-md">
                  <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gradient mb-4">
                      Welcome to Hostel Hub
                    </h2>
                    <p className="text-gray-300 text-lg">
                      AI-powered issue resolution platform for hostelers
                    </p>
                  </div>
                  <div className="glass rounded-2xl p-8">
                    <SignInForm />
                  </div>
                </div>
              </div>

            {/* How it Works Section */}
            <div className="max-w-6xl mx-auto py-16">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gradient mb-4">
                  How It Works
                </h2>
                <p className="text-gray-300 text-lg">
                  Simple steps to resolve hostel issues efficiently
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="dark-card p-8 text-center hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl" style={{ background: 'var(--gradient-primary)' }}>
                    1️⃣
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Report Issue</h3>
                  <p className="text-gray-300">
                    Quickly report hostel issues with our intuitive form. Our AI analyzes your description to prioritize and categorize the problem.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="dark-card p-8 text-center hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl" style={{ background: 'var(--gradient-secondary)' }}>
                    2️⃣
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">AI Analysis</h3>
                  <p className="text-gray-300">
                    Our advanced AI system analyzes your issue, suggests solutions, and automatically assigns priority levels for faster resolution.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="dark-card p-8 text-center hover:scale-105 transition-all duration-300">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(45deg, #4CAF50, #2E7D32)' }}>
                    3️⃣
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">Track Progress</h3>
                  <p className="text-gray-300">
                    Monitor your issue status in real-time. Get updates from hostel authorities and see resolution progress through our dashboard.
                  </p>
                </div>
              </div>

              {/* Features Section */}
              <div className="mt-20">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gradient mb-4">
                    Key Features
                  </h2>
                  <p className="text-gray-300 text-lg">
                    Everything you need for efficient hostel management
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="dark-card p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--gradient-primary)' }}>
                      🤖
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">AI-Powered</h3>
                    <p className="text-gray-300 text-sm">Smart analysis and prioritization</p>
                  </div>

                  <div className="dark-card p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl" style={{ background: 'var(--gradient-secondary)' }}>
                      📱
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Real-time</h3>
                    <p className="text-gray-300 text-sm">Instant updates and tracking</p>
                  </div>

                  <div className="dark-card p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(45deg, #FF9800, #FF5722)' }}>
                      🔒
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Secure</h3>
                    <p className="text-gray-300 text-sm">Anonymous reporting options</p>
                  </div>

                  <div className="dark-card p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl" style={{ background: 'linear-gradient(45deg, #9C27B0, #7B1FA2)' }}>
                      📊
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Analytics</h3>
                    <p className="text-gray-300 text-sm">Detailed insights and reports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </Unauthenticated>

        <Authenticated>
          {userProfile === undefined ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-primary)' }}></div>
            </div>
          ) : !userProfile?.profile ? (
            <Suspense fallback={<ProfileSkeleton />}>
              <ProfileSetup />
            </Suspense>
          ) : (
            <div className="container mx-auto px-6 py-8">
              {/* Mobile navigation */}
              <div className="md:hidden mb-6">
                <div className="flex space-x-2 glass rounded-xl p-2">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${
                      activeTab === "dashboard"
                        ? "dark-button"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab("report")}
                    className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${
                      activeTab === "report"
                        ? "dark-button"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Report Issue
                  </button>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex-1 py-3 px-4 rounded-lg transition-all duration-300 ${
                      activeTab === "profile"
                        ? "dark-button"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    Profile
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="animate-fade-in">
                <Suspense fallback={<DashboardSkeleton />}>
                  {activeTab === "dashboard" && <Dashboard userProfile={userProfile} />}
                  {activeTab === "report" && <IssueReportForm />}
                  {activeTab === "profile" && <ProfileView userProfile={userProfile} />}
                </Suspense>
              </div>
            </div>
          )}
        </Authenticated>
      </main>

      <Toaster position="bottom-right" />
    </div>
  );
}
