"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/protected/AuthProvider";
import { 
  User, 
  Heart, 
  Activity, 
  FileText, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Loader2,
  Microscope,
  AlertCircle,
  CheckCircle,
  LogOut,
  Eye,
  Search,
  Filter
} from "lucide-react";
import { useRouter } from "next/navigation";

function Patient() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [diseases, setDiseases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Your exact original fetchDiseases function
  const fetchDiseases = async () => {
    setIsLoading(true);
    try {
      if (user) {
        const response = await fetch('http://localhost:5000/disease/get-patient-diseases', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientId: user.id
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.diseases) {
            setDiseases(data.diseases);
          }
        }
      }
    } catch (e) {
      console.log("there was an error in fetching the diseases");
    } finally {
      setIsLoading(false);
    }
  };

  // Your exact original useEffect
  useEffect(() => {
    fetchDiseases();
  }, [user]);

  const handleDiseaseClick = (diseaseId: string) => {
    window.location.href = `/dashboard/disease/${diseaseId}`;
  };

  const filteredDiseases = diseases.filter(disease =>
    disease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    disease.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (analysis: string | null) => {
    if (analysis && analysis !== "null") {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    return <Clock className="h-5 w-5 text-orange-600" />;
  };

  const getStatusText = (analysis: string | null) => {
    if (analysis && analysis !== "null") {
      return "Analysis Complete";
    }
    return "Pending Analysis";
  };

  const getStatusColor = (analysis: string | null) => {
    if (analysis && analysis !== "null") {
      return "bg-green-50 border-green-200 text-green-800";
    }
    return "bg-orange-50 border-orange-200 text-orange-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-stone-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="h-8 w-8 text-red-800 animate-spin" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Fetching your medical records...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-stone-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md border-b border-red-100 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name || 'Patient'}</p>
              </div>
            </div>
            
            <motion.button
              onClick={() => {logout();
                router.push('/');
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-all duration-300 shadow-lg"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        

        {/* Medical Records Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden"
        >
          {/* Section Header */}
          <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-stone-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Medical Records</h2>
                  <p className="text-gray-600 text-sm">Your diagnostic history and test results</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-gray-700 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Filter className="h-4 w-4 text-gray-600" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Records List */}
          <div className="p-6">
            {filteredDiseases.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No records found" : "No medical records yet"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? "Try adjusting your search terms" : "Your diagnostic records will appear here once created by your healthcare provider"}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredDiseases.map((disease, index) => (
                    <motion.div
                      key={disease.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleDiseaseClick(disease.id)}
                      className="bg-gradient-to-br from-red-50 to-stone-50 rounded-xl p-6 border border-red-200 cursor-pointer hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            disease.type === "ct scan" ? "bg-blue-600" : "bg-green-600"
                          }`}>
                            {disease.type === "ct scan" ? (
                              <Activity className="h-6 w-6 text-white" />
                            ) : (
                              <Microscope className="h-6 w-6 text-white" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900 group-hover:text-red-800 transition-colors">
                                {disease.name}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(disease.analysis)}`}>
                                {getStatusText(disease.analysis)}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="capitalize flex items-center space-x-1">
                                <span>Type: {disease.type}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>ID: {disease.id.slice(0, 8)}...</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          {getStatusIcon(disease.analysis)}
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-800 transition-colors" />
                        </div>
                      </div>

                      {disease.analysis && disease.analysis !== "null" && (
                        <div className="mt-4 pt-4 border-t border-red-200">
                          <div className="flex items-center space-x-2 text-sm">
                            <Eye className="h-4 w-4 text-green-600" />
                            <span className="text-green-700 font-medium">Analysis available - Click to view detailed results</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>

        {/* Health Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Health Tips</h2>
                <p className="text-gray-600 text-sm">Kidney stone prevention and management</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Stay Hydrated",
                  description: "Drink at least 8-10 glasses of water daily to help prevent stone formation",
                  icon: "💧"
                },
                {
                  title: "Watch Your Diet",
                  description: "Limit sodium, reduce animal protein, and eat more fruits and vegetables",
                  icon: "🥬"
                },
                {
                  title: "Regular Checkups",
                  description: "Schedule regular follow-ups with your healthcare provider for monitoring",
                  icon: "🏥"
                },
                {
                  title: "Exercise Regularly",
                  description: "Maintain physical activity to support overall kidney health",
                  icon: "🏃‍♂️"
                }
              ].map((tip, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{tip.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Patient;