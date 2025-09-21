"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";
import { 
  ArrowLeft, 
  Upload, 
  Image, 
  FileText, 
  Activity, 
  Loader2, 
  Eye, 
  Download,
  AlertCircle,
  CheckCircle,
  Calendar,
  Hash,
  MapPin,
  Ruler,
  BarChart3,
  Microscope,
  Droplets,
  Zap
} from 'lucide-react';
import ProtectedRoute from '@/app/protected/ProtectedRoute';
import { useAuth } from '@/app/protected/AuthProvider';

interface data {
    message: string,
    filename: string,
    supabaseUrl: string,
    analysis_generated: {
        number_of_stones: number,
        sizepos: spobj[],
        general_analysis: string,
    }
}

interface spobj {
    size: string, 
    location: string
}

export default function DiseaseDetailsPage() {
  const params = useParams();
  const diseaseId = params.diseaseId as string;

  const { user } = useAuth();
  
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<data | null>(null);
  const [type, setType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Urine analysis states - EXACTLY as your original
  const [risk, setRisk] = useState("");
  const [gravity, setGravity] = useState(0);
  const [ph, setPh] = useState(0);
  const [osmo, setOsmo] = useState(0);
  const [cond, setCond] = useState(0);
  const [urea, setUrea] = useState(0);
  const [calc, setCalc] = useState(0);
  
  // YOUR EXACT ORIGINAL useEffect
  useEffect(() => {
    const fetch = async () => {
      try {
        const requestData = {
          diseaseId: diseaseId
        }
        const response = await axios.post(
          "http://localhost:5000/disease/get-disease-by-id",
          requestData
        );
        console.log(response.data);
        let text = response.data.disease.analysis;
        console.log(text);
        setData(JSON.parse(text));
        setType(response.data.disease.type);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

  // YOUR EXACT ORIGINAL uploadImage function
  const uploadImage = async () => {
    if (!file) {
      console.log("file not selected");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('diseaseId', diseaseId);
    try {
      const response = await axios.post(
        "http://localhost:5000/ct/v1/upload",
        formData
      );
      console.log(response.data);
      setData(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsUploading(false);
    }
  }

  // YOUR EXACT ORIGINAL handleFileChange
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Create preview URL for UI
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  // YOUR EXACT ORIGINAL handleSubmit function
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const requestData ={
        vals : [[gravity, ph, osmo, cond, urea, calc]],
        diseaseId : diseaseId
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/urinalysis/v1/upload",
        requestData
      );
      console.log(response.data);
      setRisk(response.data.analysis);
      
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }
  }

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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Disease Data</h2>
          <p className="text-gray-600">Fetching analysis information...</p>
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
              <motion.button
                onClick={() => window.history.back()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-red-800" />
              </motion.button>
              
              <div className="w-10 h-10 bg-red-800 rounded-full flex items-center justify-center">
                {type === "ct scan" ? (
                  <Activity className="h-6 w-6 text-white" />
                ) : (
                  <Microscope className="h-6 w-6 text-white" />
                )}
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {type === "ct scan" ? "CT Scan Analysis" : "Urine Analysis"}
                </h1>
                <p className="text-gray-600">Disease ID: {diseaseId}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {user && user.type == "Diagnoser" &&
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-stone-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center">
                  <Upload className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {type === "ct scan" ? "Upload CT Scan" : "Enter Test Values"}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {type === "ct scan" ? "Upload medical images for analysis" : "Input urinalysis parameters"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {type === "ct scan" ? (
                <div className="space-y-6">
                  {/* File Upload - YOUR ORIGINAL INPUT */}
                  <div className="border-2 border-dashed border-red-200 rounded-xl p-8 text-center hover:border-red-300 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="text-gray-700 w-full p-4 border border-gray-300 rounded-lg"
                    />
                    {file && (
                      <div className="mt-4">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Image className="h-8 w-8 text-red-800" />
                        </div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Upload Button - YOUR ORIGINAL FUNCTION */}
                  <motion.button
                    onClick={uploadImage}
                    disabled={isUploading}
                    whileHover={!isUploading ? { scale: 1.02 } : {}}
                    whileTap={!isUploading ? { scale: 0.98 } : {}}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      isUploading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-800 text-white hover:bg-red-900 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2 inline" />
                        Analyzing Image...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2 inline" />
                        Upload Image
                      </>
                    )}
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* YOUR ORIGINAL URINE ANALYSIS FORM */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="gravity" className="block text-sm font-medium text-gray-700 mb-2">
                        <Droplets className="h-4 w-4 inline mr-2" />
                        Gravity
                      </label>
                      <input
                        id="gravity"
                        type="number"
                        value={gravity}
                        onChange={(e) => setGravity(e.target.value ? parseFloat(e.target.value) : 0)}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="ph" className="block text-sm font-medium text-gray-700 mb-2">
                        <Zap className="h-4 w-4 inline mr-2" />
                        pH
                      </label>
                      <input
                        id="ph"
                        type="number"
                        value={ph}
                        onChange={(e) => setPh(e.target.value ? parseFloat(e.target.value) : 0)}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="osmo" className="block text-sm font-medium text-gray-700 mb-2">
                        <BarChart3 className="h-4 w-4 inline mr-2" />
                        Osmo
                      </label>
                      <input
                        id="osmo"
                        type="number"
                        value={osmo}
                        onChange={(e) => setOsmo(e.target.value ? parseFloat(e.target.value) : 0)}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="cond" className="block text-sm font-medium text-gray-700 mb-2">
                        <Activity className="h-4 w-4 inline mr-2" />
                        Cond
                      </label>
                      <input
                        id="cond"
                        type="number"
                        value={cond}
                        onChange={(e) => setCond(e.target.value ? parseFloat(e.target.value) : 0)}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="urea" className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="h-4 w-4 inline mr-2" />
                        Urea
                      </label>
                      <input
                        id="urea"
                        type="number"
                        value={urea}
                        onChange={(e) => setUrea(e.target.value ? parseFloat(e.target.value) : 0)}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="calc" className="block text-sm font-medium text-gray-700 mb-2">
                        <Hash className="h-4 w-4 inline mr-2" />
                        Calc
                      </label>
                      <input
                        id="calc"
                        type="number"
                        value={calc}
                        onChange={(e) => setCalc(e.target.value ? parseFloat(e.target.value) : 0)}
                        className="text-gray-700 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button - YOUR ORIGINAL FUNCTION */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      isSubmitting
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-red-800 text-white hover:bg-red-900 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2 inline" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="h-5 w-5 mr-2 inline" />
                        Submit
                      </>
                    )}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-stone-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
                  <p className="text-gray-600 text-sm">
                    {type === "ct scan" ? "Selected image preview" : "Input parameters overview"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {type === "ct scan" ? (
                previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={previewUrl}
                        alt="CT Scan Preview"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No image selected</p>
                  </div>
                )
              ) : (
                <div className="space-y-3">
                  {[
                    { label: "Gravity", value: gravity },
                    { label: "pH", value: ph },
                    { label: "Osmo", value: osmo },
                    { label: "Cond", value: cond },
                    { label: "Urea", value: urea },
                    { label: "Calc", value: calc }
                  ].map((param) => (
                    <div key={param.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-700">{param.label}</span>
                      <span className="text-gray-900">{param.value || 0}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
        }

        {/* YOUR ORIGINAL RESULTS DISPLAY */}
        <AnimatePresence>
          {(data || risk) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              className="mt-8 bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Analysis Results</h2>
                    <p className="text-gray-600 text-sm">Generated analysis data</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {data && type === "ct scan" ? (
                  <div className="space-y-8">
                    {/* YOUR ORIGINAL CT SCAN RESULTS */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyzed Image</h3>
                        <div className="rounded-xl overflow-hidden border border-gray-200">
                          <img src={data.supabaseUrl} alt="Analysis Result" className="w-full h-64 object-cover" />
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{data.filename}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stone Analysis</h3>
                        <div className="space-y-4">
                          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                            <p className="font-semibold text-red-800">Number of Stones</p>
                            <p className="text-2xl font-bold text-red-900">{data.analysis_generated.number_of_stones}</p>
                          </div>

                          {data.analysis_generated.sizepos.map((obj, index) => (
                            <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <p className="font-semibold text-blue-800">Stone {index + 1}</p>
                              <p className="text-blue-700">Size: {obj.size}</p>
                              <p className="text-blue-700">Location: {obj.location}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">General Analysis</h3>
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <p className="text-gray-800">{data.analysis_generated.general_analysis}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-green-800">{data.message}</p>
                    </div>
                  </div>
                ) : risk && type === "urine analysis" ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                      <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                        <p className="text-orange-700">{risk}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No analysis data available</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}