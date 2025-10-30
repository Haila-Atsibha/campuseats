// frontend/app/page.js

import Link from "next/link"

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500">
              <span className="text-xl font-bold text-white">CE</span>
            </div>
            <span className="text-xl font-bold">CampusEats</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 border rounded hover:bg-gray-100">
                Sign In
              </button>
            </Link>
            <Link href="/signup?role=CUSTOMER">
                  <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-purple-600 rounded hover:bg-purple-700">
                    I am a Student →
                  </button>
                </Link>
                <Link href="/signup?role=CAFE_OWNER">
                  <button className="flex items-center gap-2 px-6 py-3 font-semibold text-purple-700 border border-purple-700 rounded hover:bg-purple-100">
                    I own a Cafe →
                  </button>
                </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-100 to-pink-100 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                Order Food Easily on Campus
              </h1>
              <p className="text-lg text-gray-600 md:text-xl">
                Skip the lines, order from your favorite campus cafés, and get your food delivered right to you.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <Link href="/signup?role=CUSTOMER">
                  <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white bg-purple-600 rounded hover:bg-purple-700">
                    I am a Student →
                  </button>
                </Link>
                <Link href="/signup?role=CAFE_OWNER">
                  <button className="flex items-center gap-2 px-6 py-3 font-semibold text-purple-700 border border-purple-700 rounded hover:bg-purple-100">
                    I own a Cafe →
                  </button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?fit=crop&w=800&q=80"
                alt="Students enjoying food on campus"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Why Choose CampusEats?</h2>
            <p className="mt-3 text-lg text-gray-600">Everything you need for convenient campus dining</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border bg-white p-8 text-center shadow-md hover:shadow-lg transition">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-2xl">
                🛍
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Easy Ordering</h3>
              <p className="text-gray-600">Browse menus, customize orders, and pay in just a few taps</p>
            </div>
            <div className="rounded-2xl border bg-white p-8 text-center shadow-md hover:shadow-lg transition">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-2xl">
                ⏱
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Fast Delivery</h3>
              <p className="text-gray-600">Get your food delivered quickly between classes</p>
            </div>
            <div className="rounded-2xl border bg-white p-8 text-center shadow-md hover:shadow-lg transition">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-2xl">
                🛡
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">Secure Payment</h3>
              <p className="text-gray-600">Safe and secure payment options for peace of mind</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to Get Started?</h2>
          <p className="mt-3 text-lg text-white/90">Join thousands of students ordering smarter on campus</p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/signup?role=CUSTOMER">
              <button className="flex items-center gap-2 px-6 py-3 font-semibold text-purple-700 bg-white rounded hover:bg-gray-100">
                I am a Student →
              </button>
            </Link>
            <Link href="/signup?role=CAFE_OWNER">
              <button className="flex items-center gap-2 px-6 py-3 font-semibold text-white border border-white rounded hover:bg-purple-700/80">
                I own a Cafe →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>&copy; 2025 CampusEats. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
