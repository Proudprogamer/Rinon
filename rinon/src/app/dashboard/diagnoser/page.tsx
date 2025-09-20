"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { 
  Search, 
  Users, 
  Plus, 
  User, 
  Mail, 
  LogOut, 
  Loader2,
  Stethoscope,
  FileText,
  Calendar,
  Activity,
  ChevronRight,
  Filter
} from "lucide-react";
import { useAuth } from "@/app/protected/AuthProvider";

function DiagnoserDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showCreateDisease, setShowCreateDisease] = useState(false);
  const [showPatientDiseases, setShowPatientDiseases] = useState(false);
  const [patientDiseases, setPatientDiseases] = useState<any[]>([]);
  const [isLoadingDiseases, setIsLoadingDiseases] = useState(false);
  const [newDisease, setNewDisease] = useState({
    name: "",
    type: "ct scan" as "ct scan" | "urine analysis"
  });
  const [isCreatingDisease, setIsCreatingDisease] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const {logout, user} = useAuth();
  const router = useRouter();

  const resetPatientView=()=>{
    setShowPatientDiseases(false);
    setSelectedPatient(null);
    setPatientDiseases([]);
  }

  useEffect(() => {
    const getPatients = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/patient/get-patients", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch patients");
        }
        
        const data = await response.json();
        if (data && data.patients) {
          setPatients(data.patients);
        }
      } catch (e) {
        console.error("Failed to fetch patients", e);
      } finally {
        setIsLoading(false);
      }
    };

    getPatients();
  }, []);

  // Filter patients based on search term
  const filteredPatients = useMemo(() => {
    if (!searchTerm) return patients;
    
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  // Fetch diseases for a specific patient
  const fetchPatientDiseases = async (patientId: string) => {
    setIsLoadingDiseases(true);
    try {
      const response = await axios.post("http://localhost:5000/disease/get-diseases", {
        patientId: patientId
      });
      
      if (response.data) {
        setPatientDiseases(response.data.diseases);
      }
    } catch (error) {
      console.error("Failed to fetch patient diseases:", error);
      setPatientDiseases([]);
    } finally {
      setIsLoadingDiseases(false);
    }
  };

  const handlePatientClick = (patient: any) => {
    setSelectedPatient(patient);
    setShowPatientDiseases(true);
    fetchPatientDiseases(patient.id);
  };

  const handleDiseaseClick = (disease: any) => {
    setIsNavigating(true);
    router.push(`/dashboard/disease/${disease.id}`);
  };

  const openCreateDiseaseModal = () => {
    setShowPatientDiseases(false);
    setShowCreateDisease(true);
  };

  const handleCreateDisease = async () => {
    if (!selectedPatient || !newDisease.name) return;
    
    setIsCreatingDisease(true);
    try {
      const creds = {
        patientId: selectedPatient.id,
        name: newDisease.name,
        type: newDisease.type,
        //@ts-ignore
        diagnoserId: user.id,
      };
      
      console.log("Creating disease with data:", creds);
      
      // TODO: Replace this with your actual API call to create disease
      const response = await axios.post(
        "http://localhost:5000/disease/create-disease",
          creds,
          {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`
              }
          }
        );
      
      const result = response.data;
      console.log("Disease created successfully:", result);
      
      // Get the disease ID from the response
      const diseaseId = result.diseaseId || result.id || result.disease?.id;
      
      // Reset form and close modal
      resetCreateDisease();
      
      // Route to dynamic disease page with the disease ID
      router.push(`/dashboard/disease/${diseaseId}`);
      
    } catch (error) {
      console.error("Failed to create disease:", error);
      // You can add error handling here, like showing an error message
    } finally {
      setIsCreatingDisease(false);
    }
  };

  const resetCreateDisease = () => {
    setShowCreateDisease(false);
    setSelectedPatient(null);
    setNewDisease({ name: "", type: "ct scan" });
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
          <p className="text-gray-600">Fetching patient data...</p>
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
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Diagnoser Dashboard</h1>
                <p className="text-gray-600">Manage patient diagnostics</p>
              </div>
            </div>
            
            <motion.button
              onClick={()=>{logout()}}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: Users, label: "Total Patients", value: patients.length, color: "bg-red-800" },
            { icon: FileText, label: "Active Cases", value: "12", color: "bg-blue-600" },
            { icon: Calendar, label: "Today's Scans", value: "8", color: "bg-green-600" },
            { icon: Activity, label: "Pending Reports", value: "5", color: "bg-orange-600" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-red-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Patients Section */}
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
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Patient Database</h2>
                  <p className="text-gray-600 text-sm">Click on a patient to create diseases</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-64"
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

          {/* Patients List */}
          <div className="p-6">
            {filteredPatients.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No patients found" : "No patients available"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm ? "Try adjusting your search terms" : "Patients will appear here once added to the system"}
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredPatients.map((patient, index) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePatientClick(patient)}
                      className="bg-gradient-to-br from-red-50 to-stone-50 rounded-xl p-6 border border-red-200 cursor-pointer hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-800 transition-colors" />
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-red-800 transition-colors">
                          {patient.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{patient.email}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Patient ID: {patient.id}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Navigation Loader */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full mx-4"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 text-red-800 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Navigating...</h2>
              <p className="text-gray-600">Taking you to the disease page</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Patient Diseases Modal */}
      <AnimatePresence>
        {showPatientDiseases && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && resetPatientView()}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-red-100"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-stone-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedPatient.name}</h2>
                      <p className="text-gray-600 text-sm">{selectedPatient.email}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openCreateDiseaseModal}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-all duration-300 shadow-lg"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Disease</span>
                  </motion.button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {isLoadingDiseases ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 text-red-800 animate-spin mx-auto mb-4" />
                      <p className="text-gray-600">Loading diseases...</p>
                    </div>
                  </div>
                ) : patientDiseases.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Diseases Found</h3>
                    <p className="text-gray-600 mb-4">This patient doesn't have any diseases recorded yet.</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={openCreateDiseaseModal}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-all duration-300"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create First Disease</span>
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Diseases ({patientDiseases.length})
                      </h3>
                    </div>
                    
                    <div className="grid gap-3">
                      {patientDiseases.map((disease, index) => (
                        <motion.div
                          key={disease.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDiseaseClick(disease)}
                          className="p-4 bg-gradient-to-br from-red-50 to-stone-50 rounded-lg border border-red-200 cursor-pointer hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                disease.type === "ct scan" ? "bg-blue-600" : "bg-green-600"
                              }`}>
                                {disease.type === "ct scan" ? (
                                  <Activity className="h-5 w-5 text-white" />
                                ) : (
                                  <FileText className="h-5 w-5 text-white" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 group-hover:text-red-800 transition-colors">
                                  {disease.name}
                                </h4>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <span className="capitalize">{disease.type}</span>
                                  <span>•</span>
                                  <span>ID: {disease.id.slice(0, 8)}...</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-800 transition-colors" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-red-100 bg-gray-50">
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetPatientView}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Disease Modal */}
      <AnimatePresence>
        {showCreateDisease && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && resetCreateDisease()}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-red-100"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-red-800" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create Disease</h2>
                <p className="text-gray-600">
                  Creating disease for <span className="font-medium text-red-800">{selectedPatient.name}</span>
                </p>
              </div>

              <div className="space-y-4">
                {/* Disease Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disease Name
                  </label>
                  <input
                    type="text"
                    value={newDisease.name}
                    onChange={(e) => setNewDisease({ ...newDisease, name: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter disease name..."
                  />
                </div>

                {/* Disease Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Disease Type
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: "ct scan", label: "CT Scan", desc: "Upload medical images" },
                      { value: "urine analysis", label: "Urine Analysis", desc: "Upload test results" }
                    ].map((type) => (
                      <motion.label
                        key={type.value}
                        whileHover={{ scale: 1.02 }}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          newDisease.type === type.value
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="diseaseType"
                          value={type.value}
                          checked={newDisease.type === type.value}
                          onChange={(e) => setNewDisease({ ...newDisease, type: e.target.value as "ct scan" | "urine analysis" })}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          newDisease.type === type.value ? "border-red-500 bg-red-500" : "border-gray-300"
                        }`}>
                          {newDisease.type === type.value && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                          )}
                        </div>
                        <div>
                          <div className={`font-medium ${
                            newDisease.type === type.value ? "text-red-800" : "text-gray-900"
                          }`}>
                            {type.label}
                          </div>
                          <div className="text-sm text-gray-600">{type.desc}</div>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetCreateDisease}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateDisease}
                  disabled={!newDisease.name || isCreatingDisease}
                  className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-all ${
                    !newDisease.name || isCreatingDisease
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-800 hover:bg-red-900 shadow-lg"
                  }`}
                >
                  {isCreatingDisease ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                      Creating...
                    </>
                  ) : (
                    "Create Disease"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DiagnoserDashboard;