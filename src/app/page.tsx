'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Trophy, BookOpen, Target, CheckSquare, Repeat, Zap, Shield, Smartphone } from 'lucide-react';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { DownloadButtons } from '@/components/landing/download-buttons';
import { useDeviceDetection } from '@/hooks/use-device-detection';

export default function LandingPage() {
  const { isMobile } = useDeviceDetection();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <LandingNavbar />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto text-center">
          {/* App Icon/Logo */}
          <div className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-8 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
            <span className="text-2xl md:text-4xl font-bold text-white">C</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent mb-6 leading-tight">
            Chronicle
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 mb-4 max-w-4xl mx-auto font-light">
            Your personal tracking companion
          </p>
          
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-3xl mx-auto">
            Track achievements, save resources, set goals, manage tasks, and build routines. 
            Simple, clean, and focused on what matters.
          </p>
          
          {/* Download Buttons */}
          <div id="download" className="mb-16">
            <DownloadButtons variant="hero" />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">5</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Core Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">0</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Complexity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">∞</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Possibilities</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">100%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Free</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Everything you need
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Five powerful features designed to help you track your progress and stay organized
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Achievements */}
            <Card className="group hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  Track Achievements
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Remember books you've read, certificates earned, skills learned, and milestones reached
                </p>
              </CardContent>
            </Card>

            {/* Resources */}
            <Card className="group hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  Save Resources
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Store important notes, useful links, and valuable information in one organized place
                </p>
              </CardContent>
            </Card>

            {/* Goals */}
            <Card className="group hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  Set Goals
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Plan your future, track progress, and achieve your objectives with clear milestones
                </p>
              </CardContent>
            </Card>

            {/* Tasks */}
            <Card className="group hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  Manage Tasks
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Keep track of daily todos, important deadlines, and everything you need to get done
                </p>
              </CardContent>
            </Card>

            {/* Routines */}
            <Card className="group hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Repeat className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  Build Routines
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Create repeating daily and weekly routines to build lasting habits and consistency
                </p>
              </CardContent>
            </Card>

            {/* Simple & Clean */}
            <Card className="group hover:shadow-xl hover:shadow-slate-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-slate-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  Simple & Fast
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  No clutter, no complexity. Just the essential features you need to stay organized
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Chronicle Section */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Why Chronicle?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
                Built with simplicity and effectiveness in mind
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  Privacy First
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Your data stays with you. No tracking, no ads, no unnecessary data collection.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  Works Everywhere
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Web, iOS, Android. Use Chronicle on any device, anywhere you need it.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  Lightning Fast
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Instant responses, smooth interactions. No waiting, no loading screens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Start your journey today
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto">
            Join thousands of people who are already tracking their progress with Chronicle
          </p>
          
          <DownloadButtons variant="cta" className="mb-8" />
          
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Free forever. No account required to get started.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-xl text-slate-900 dark:text-white">Chronicle</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-center md:text-right">
                © 2026 Chronicle. Simple personal tracking for everyone.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}