import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
              RUN IT UP
            </h1>

            <div className="flex items-center space-x-4">
              <Link 
                href="/signup" 
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Sign Up
              </Link>
              <Link 
                href="/login" 
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Run It Up</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empowering you to achieve more. Join our platform and discover endless possibilities 
            for growth and success.
          </p>
          <div className="mt-10">
            <Link 
              href="/signup" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
