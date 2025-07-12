
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GraduationCap, 
  MessageSquare, 
  BarChart3,
  ArrowRight,
  Brain,
  Users,
  BookOpen,
  Sparkles,
  TrendingUp,
  Eye,
  Menu,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI Learning</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-700 hover:text-indigo-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition-colors">Contact</a>
              <Link to="/ai-chat">
                <Button variant="outline" size="sm">Get Started</Button>
              </Link>
            </div>
            
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                AI-Powered
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                  Learning Assistant
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your classroom with multimodal AI technology. Engage students with interactive chat, 
                real-time analytics, and personalized learning experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/ai-chat">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-lg">
                    Start Learning
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/analytics">
                  <Button variant="outline" className="px-8 py-4 text-lg">
                    View Analytics
                    <BarChart3 className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&crop=center" 
                  alt="AI Learning Interface"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Sparkles className="w-12 h-12 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section id="features" className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Powerful Learning Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of education with AI-powered tools designed for modern classrooms
            </p>
          </div>

          {/* Main Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            {/* AI Chat */}
            <Card className="group hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border-0 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=200&fit=crop&crop=center" 
                  alt="AI Chat Interface"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent"></div>
              </div>
              <div className="p-10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Learning Chat</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Interactive AI assistant with voice and text support across multiple subjects
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Voice Recognition</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Multi-Subject</span>
                </div>
                <Link to="/ai-chat">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Try AI Chat
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Analytics Dashboard */}
            <Card className="group hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl border-0 bg-gradient-to-br from-green-50 to-teal-50 overflow-hidden">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&h=200&fit=crop&crop=center" 
                  alt="Analytics Dashboard"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 to-transparent"></div>
              </div>
              <div className="p-10">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Learning Analytics</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Real-time engagement monitoring and comprehensive learning insights
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Live Tracking</span>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">Visual Reports</span>
                </div>
                <Link to="/analytics">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white">
                    View Analytics
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-50">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multimodal AI</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced AI that processes text, voice, and visual inputs for comprehensive learning support.
              </p>
            </Card>
            
            <Card className="p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-cyan-50 to-blue-50">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor engagement and comprehension with intelligent feedback systems.
              </p>
            </Card>
            
            <Card className="p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-violet-50 to-purple-50">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Visual Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Dynamic generation of charts, diagrams, and interactive educational content.
              </p>
            </Card>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Revolutionizing Education with AI
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our AI Learning Assistant combines cutting-edge technology with educational expertise 
                to create engaging, personalized learning experiences for every student.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  </div>
                  <span className="text-gray-700">Multimodal AI Technology</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  </div>
                  <span className="text-gray-700">Real-time Engagement Monitoring</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  </div>
                  <span className="text-gray-700">Personalized Learning Paths</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop&crop=center" 
                alt="Students learning with technology"
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">AI Learning Assistant</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering educators and students with AI-powered learning tools for the future of education.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Github className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Twitter className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Linkedin className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-3 text-gray-400">
                <li><Link to="/ai-chat" className="hover:text-white transition-colors">AI Chat</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Voice Recognition</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Visual Learning</a></li>
              </ul>
            </div>
            
            <div id="contact">
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@ailearning.com</span>
                </li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 AI Learning Assistant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
