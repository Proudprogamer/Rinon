//@ts-nocheck
"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Users, Stethoscope, Search, Shield, Clock, CheckCircle } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-stone-50">
      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-50 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-red-100"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-red-800"
          >
            Rinon
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <motion.a
              href="/auth/login"
              whileHover={{ scale: 1.05, backgroundColor: "#7f1d1d" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 text-red-800 border border-red-200 rounded-lg hover:bg-red-800 hover:text-white transition-all duration-300 inline-block"
            >
              Login
            </motion.a>
            <motion.a
              href="/auth/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-all duration-300 shadow-lg inline-block"
            >
              Sign Up
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Advanced{" "}
                <span className="text-red-800">Kidney Stone</span>{" "}
                Detection & Analysis
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl text-gray-600 leading-relaxed max-w-2xl"
              >
                Revolutionizing kidney stone diagnosis with AI-powered CT scan analysis and comprehensive urine testing. Faster, more accurate results for better patient outcomes.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center px-8 py-4 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-all duration-300 shadow-lg group"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-red-200 text-red-800 rounded-lg hover:bg-red-50 transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-red-100 to-red-200 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center">
                      <Search className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Scan Analysis</h3>
                      <p className="text-gray-600 text-sm">AI-Powered Detection</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, delay: 1 }}
                        className="h-full bg-red-800"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Analysis Complete: 85%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Three Specialized Interfaces
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Designed for seamless collaboration between patients, doctors, and diagnostic specialists
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInLeft}
              className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Patient Portal</h3>
              <p className="text-gray-600 leading-relaxed">
                Easy access to test results, appointment scheduling, and communication with healthcare providers.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mb-6">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Doctor Dashboard</h3>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive patient management, test ordering, and result interpretation tools.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
              className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-red-800 rounded-full flex items-center justify-center mb-6">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Diagnoser Interface</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced imaging analysis, stone detection algorithms, and detailed reporting capabilities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20 bg-gradient-to-br from-red-50 to-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInLeft}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Why Choose Rinon?
              </h2>
              
              <div className="space-y-6">
                {[
                  { icon: Clock, title: "Faster Diagnosis", desc: "AI-powered analysis reduces diagnosis time by 70%" },
                  { icon: Shield, title: "99.8% Accuracy", desc: "Advanced algorithms ensure precise stone detection" },
                  { icon: CheckCircle, title: "Seamless Workflow", desc: "Integrated platform for all stakeholders" }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-12 h-12 bg-red-800 rounded-lg flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInRight}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-800 mb-1">10,000+</div>
                    <div className="text-sm text-gray-600">Scans Analyzed</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-800 mb-1">500+</div>
                    <div className="text-sm text-gray-600">Healthcare Partners</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-lg p-6 text-white">
                  <h4 className="font-semibold mb-2">Real-time Analysis</h4>
                  <p className="text-sm opacity-90">Get instant results with our advanced AI detection system</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold text-red-400">Rinon</div>
              <p className="text-gray-400">
                Advanced kidney stone detection and analysis platform for better healthcare outcomes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-400 transition-colors">Patient Portal</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Doctor Dashboard</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Diagnoser Interface</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-red-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-red-400 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Rinon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}