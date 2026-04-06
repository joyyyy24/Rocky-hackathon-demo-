import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl mb-6">
                <span className="text-3xl">🌍</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                Welcome to <span className="text-primary-600">Rocky</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                An immersive 3D educational world where kids explore subjects,
                complete creative challenges, and learn with an AI companion.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" asChild>
                <Link href="/student">Start Learning</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/world">Explore World</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Role-based Access Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Experience
          </h2>
          <p className="text-lg text-gray-600">
            Select the role that best describes you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-medium transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <span className="text-3xl">🎓</span>
              </div>
              <CardTitle className="text-primary-700">Student</CardTitle>
              <CardDescription>
                Explore the 3D world, complete challenges, and learn with AI
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild className="w-full">
                <Link href="/student">Enter as Student</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medium transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-success-200 transition-colors">
                <span className="text-3xl">👨‍🏫</span>
              </div>
              <CardTitle className="text-success-700">Teacher</CardTitle>
              <CardDescription>
                Assign challenges and monitor student progress
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="success" asChild className="w-full">
                <Link href="/teacher">Teacher Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-medium transition-shadow cursor-pointer group">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-warning-200 transition-colors">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <CardTitle className="text-warning-700">Parent</CardTitle>
              <CardDescription>
                View your child's world and progress read-only
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" asChild className="w-full">
                <Link href="/parent">Parent Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Rocky?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Interactive Learning
              </h3>
              <p className="text-sm text-gray-600">
                Hands-on challenges in a 3D world
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Companion</h3>
              <p className="text-sm text-gray-600">
                Personalized guidance and encouragement
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-sm text-gray-600">
                Monitor learning achievements
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-danger-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safe & Fun</h3>
              <p className="text-sm text-gray-600">
                Child-friendly educational experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
