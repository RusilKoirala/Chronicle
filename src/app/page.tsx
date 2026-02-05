'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, BookOpen, Target, CheckSquare, Repeat, Zap, Shield, Smartphone, Star, Users, Download } from 'lucide-react';
import { LandingNavbar } from '@/components/landing/landing-navbar';
import { DownloadButtons } from '@/components/landing/download-buttons';
import { useDeviceDetection } from '@/hooks/use-device-detection';

export default function LandingPage() {
  const { isMobileApp } = useDeviceDetection();
  const router = useRouter();

  // Only block APK app users (Capacitor), not mobile web users
  useEffect(() => {
    if (isMobileApp) {
      router.replace('/dashboard');
    }
  }, [isMobileApp, router]);

  // Don't render landing page for APK app users only
  if (isMobileApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <p className="text-muted-foreground">Redirecting to app...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
              <Star className="w-4 h-4 mr-2" />
              Free & Open Source
            </Badge>
            
            {/* App Icon */}
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-8 bg-gradient-to-br from-primary to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/25">
              <span className="text-2xl md:text-3xl font-bold text-primary-foreground">C</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text text-transparent">
                Chronicle
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto font-medium">
              Your personal tracking companion
            </p>
            
            <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              Track achievements, save resources, set goals, manage tasks, and build routines. 
              Simple, clean, and focused on what matters most.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex justify-center items-center mb-16">
              <DownloadButtons variant="hero" />
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">5</div>
                <div className="text-sm text-muted-foreground">Core Features</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">0</div>
                <div className="text-sm text-muted-foreground">Complexity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">∞</div>
                <div className="text-sm text-muted-foreground">Possibilities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Free</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Features</Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Everything you need
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Five powerful features designed to help you track your progress and stay organized
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Achievements */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">
                    Track Achievements
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Remember books you've read, certificates earned, skills learned, and milestones reached
                  </p>
                </CardContent>
              </Card>

              {/* Resources */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">
                    Save Resources
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Store important notes, useful links, and valuable information in one organized place
                  </p>
                </CardContent>
              </Card>

              {/* Goals */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">
                    Set Goals
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Plan your future, track progress, and achieve your objectives with clear milestones
                  </p>
                </CardContent>
              </Card>

              {/* Tasks */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckSquare className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">
                    Manage Tasks
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Keep track of daily todos, important deadlines, and everything you need to get done
                  </p>
                </CardContent>
              </Card>

              {/* Routines */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Repeat className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">
                    Build Routines
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Create repeating daily and weekly routines to build lasting habits and consistency
                  </p>
                </CardContent>
              </Card>

              {/* Simple & Clean */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-slate-500 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">
                    Simple & Fast
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    No clutter, no complexity. Just the essential features you need to stay organized
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Chronicle Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Why Choose Chronicle</Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Built with you in mind
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Designed for simplicity, privacy, and effectiveness
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  Privacy First
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your data stays with you. No tracking, no ads, no unnecessary data collection.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  Works Everywhere
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Web, iOS, Android. Use Chronicle on any device, anywhere you need it.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">
                  Lightning Fast
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Instant responses, smooth interactions. No waiting, no loading screens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Users className="h-6 w-6 text-primary" />
              <Badge variant="secondary" className="px-4 py-2">
                Trusted by thousands
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join the community
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Thousands of people are already using Chronicle to track their progress and achieve their goals
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">Goals Achieved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
                <div className="text-muted-foreground">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Start your journey today
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Take control of your progress and build the life you want with Chronicle
            </p>
            
            <div className="flex justify-center items-center mb-8">
              <DownloadButtons variant="cta" />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Free forever. No account required to get started.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-xl">Chronicle</span>
              </div>
              <p className="text-muted-foreground text-center md:text-right">
                © 2026 Chronicle. Simple personal tracking for everyone.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}