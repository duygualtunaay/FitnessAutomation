import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Camera, 
  CheckCircle, 
  XCircle, 
  Brain, 
  TrendingUp,
  Target,
  Clock,
  Dumbbell,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

interface PhotoStep {
  id: number;
  title: string;
  description: string;
  instruction: string;
  angle: 'front' | 'right' | 'left';
}

interface ValidationResult {
  isValid: boolean;
  message: string;
  issues: string[];
}

interface AnalysisResult {
  estimatedTimeToGoalMonths: number;
  focusAreas: string[];
  postureCorrectionAdvice: string;
  recommendedWorkoutSplit: string;
  suggestedEquipment: string[];
  initialAdvice: string;
}

const BodyAnalysisPage: React.FC = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedPhotos, setUploadedPhotos] = useState<{[key: number]: File}>({});
  const [validationResults, setValidationResults] = useState<{[key: number]: ValidationResult}>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const photoSteps: PhotoStep[] = [
    {
      id: 0,
      title: 'Ön Profil Fotoğrafı',
      description: 'Karşıdan çekilmiş tam vücut fotoğrafı',
      instruction: 'Lütfen tüm vücudunuzun göründüğü, karşıdan çekilmiş net bir fotoğraf yükleyin.',
      angle: 'front'
    },
    {
      id: 1,
      title: 'Sağ Yan Profil',
      description: 'Sağ tarafınızdan çekilmiş fotoğraf',
      instruction: 'Şimdi, sağ tarafınız dönük şekilde bir profil fotoğrafı yükleyin.',
      angle: 'right'
    },
    {
      id: 2,
      title: 'Sol Yan Profil',
      description: 'Sol tarafınızdan çekilmiş fotoğraf',
      instruction: 'Son olarak, sol tarafınız dönük şekilde bir profil fotoğrafı yükleyin.',
      angle: 'left'
    }
  ];

  const mockValidatePhoto = (file: File, angle: string): ValidationResult => {
    // Simulate validation logic
    const issues: string[] = [];
    
    // Mock validation based on file size and type
    if (file.size < 100000) { // Less than 100KB
      issues.push('Fotoğraf çok küçük, daha yüksek çözünürlük gerekli');
    }
    
    if (file.size > 10000000) { // More than 10MB
      issues.push('Fotoğraf çok büyük, lütfen boyutu küçültün');
    }

    // Simulate random validation results for demo
    const randomValidation = Math.random();
    if (randomValidation < 0.3) {
      issues.push('Fotoğrafta tüm vücudunuz görünmüyor');
    } else if (randomValidation < 0.5) {
      issues.push('Fotoğraf bulanık görünüyor');
    } else if (randomValidation < 0.7) {
      issues.push('Işık yetersiz, daha aydınlık ortamda çekim yapın');
    }

    return {
      isValid: issues.length === 0,
      message: issues.length === 0 
        ? `✓ ${angle === 'front' ? 'Ön' : angle === 'right' ? 'Sağ' : 'Sol'} Profil Onaylandı` 
        : `❌ Fotoğraf geçersiz`,
      issues
    };
  };

  const handleFileUpload = (file: File, stepIndex: number) => {
    if (!file) return;

    const step = photoSteps[stepIndex];
    
    // Validate the photo
    const validation = mockValidatePhoto(file, step.angle);
    
    setValidationResults(prev => ({
      ...prev,
      [stepIndex]: validation
    }));

    if (validation.isValid) {
      setUploadedPhotos(prev => ({
        ...prev,
        [stepIndex]: file
      }));
      toast.success(validation.message);
      
      // Auto-advance to next step if validation passes
      if (stepIndex < photoSteps.length - 1) {
        setTimeout(() => {
          setCurrentStep(stepIndex + 1);
        }, 1000);
      }
    } else {
      toast.error(validation.message);
    }
  };

  const analyzePhotos = async () => {
    if (Object.keys(uploadedPhotos).length < 3) {
      toast.error('Lütfen önce tüm fotoğrafları yükleyin');
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockResult: AnalysisResult = {
      estimatedTimeToGoalMonths: 6,
      focusAreas: ["Göğüs", "Karın (Abs)", "Quadriceps", "Kalça"],
      postureCorrectionAdvice: "Hafif anterior pelvik tilt tespit edildi. Core ve kalça güçlendirme egzersizlerine odaklanın.",
      recommendedWorkoutSplit: "3 günlük split: Push, Pull, Legs",
      suggestedEquipment: ["Dumbbell", "Bench Press", "Leg Press Makinesi", "Kablo Makinesi"],
      initialAdvice: "Güçlü bir temel oluşturmak için compound hareketlerle başlayın. Progressive overload prensibi uygulayın."
    };

    setAnalysisResult(mockResult);
    setIsAnalyzing(false);

    // Save analysis result to Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.id, 'bodyAnalysis', 'current'), {
          result: mockResult,
          photos: Object.keys(uploadedPhotos),
          createdAt: new Date(),
          userId: user.id
        });
        
        // Also save a basic workout program based on analysis
        const workoutProgram = generateWorkoutProgram(mockResult);
        await setDoc(doc(db, 'users', user.id, 'workoutProgram', 'current'), {
          program: workoutProgram,
          createdAt: new Date(),
          basedOnAnalysis: true
        });
        
        toast.success('Analiz tamamlandı ve kaydedildi!');
      } catch (error) {
        console.error('Error saving analysis:', error);
        toast.success('Analiz tamamlandı!');
      }
    } else {
      toast.success('Analiz tamamlandı!');
    }
  };

  const generateWorkoutProgram = (analysis: AnalysisResult) => {
    // Generate a basic workout program based on analysis results
    return [
      {
        day: 'Pazartesi',
        focus: 'Push (Göğüs, Omuz, Triceps)',
        completed: false,
        exercises: [
          { id: '1', name: 'Bench Press', sets: 4, reps: '8-10', completed: false, notes: '', restTime: '2-3 dk' },
          { id: '2', name: 'Overhead Press', sets: 3, reps: '10-12', completed: false, notes: '', restTime: '2 dk' },
          { id: '3', name: 'Dips', sets: 3, reps: '12-15', completed: false, notes: '', restTime: '90 sn' },
          { id: '4', name: 'Tricep Extensions', sets: 3, reps: '12-15', completed: false, notes: '', restTime: '90 sn' }
        ]
      },
      {
        day: 'Salı',
        focus: 'Pull (Sırt, Biceps)',
        completed: false,
        exercises: [
          { id: '5', name: 'Pull-ups', sets: 4, reps: '6-10', completed: false, notes: '', restTime: '2-3 dk' },
          { id: '6', name: 'Barbell Rows', sets: 4, reps: '8-10', completed: false, notes: '', restTime: '2-3 dk' },
          { id: '7', name: 'Lat Pulldowns', sets: 3, reps: '10-12', completed: false, notes: '', restTime: '2 dk' },
          { id: '8', name: 'Barbell Curls', sets: 3, reps: '10-12', completed: false, notes: '', restTime: '90 sn' }
        ]
      },
      {
        day: 'Çarşamba',
        focus: 'Dinlenme',
        completed: true,
        exercises: []
      },
      {
        day: 'Perşembe',
        focus: 'Legs (Bacak)',
        completed: false,
        exercises: [
          { id: '9', name: 'Squats', sets: 4, reps: '8-10', completed: false, notes: '', restTime: '3 dk' },
          { id: '10', name: 'Romanian Deadlifts', sets: 4, reps: '8-10', completed: false, notes: '', restTime: '3 dk' },
          { id: '11', name: 'Leg Press', sets: 3, reps: '12-15', completed: false, notes: '', restTime: '2 dk' },
          { id: '12', name: 'Calf Raises', sets: 4, reps: '15-20', completed: false, notes: '', restTime: '60 sn' }
        ]
      },
      {
        day: 'Cuma',
        focus: 'Core & Cardio',
        completed: false,
        exercises: [
          { id: '13', name: 'Plank', sets: 3, reps: '30-60 sn', completed: false, notes: '', restTime: '60 sn' },
          { id: '14', name: 'Russian Twists', sets: 3, reps: '20-30', completed: false, notes: '', restTime: '60 sn' },
          { id: '15', name: 'Treadmill', sets: 1, reps: '20 dk', completed: false, notes: '', restTime: '-' }
        ]
      },
      {
        day: 'Cumartesi',
        focus: 'Dinlenme veya Hafif Cardio',
        completed: false,
        exercises: [
          { id: '16', name: 'Yürüyüş', sets: 1, reps: '30-45 dk', completed: false, notes: '', restTime: '-' }
        ]
      },
      {
        day: 'Pazar',
        focus: 'Dinlenme',
        completed: true,
        exercises: []
      }
    ];
  };

  const resetAnalysis = () => {
    setCurrentStep(0);
    setUploadedPhotos({});
    setValidationResults({});
    setAnalysisResult(null);
  };

  if (analysisResult) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              AI Analiz <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Sonuçlarınız</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Kişiselleştirilmiş fitness planınız hazır!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Key Metrics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Target className="h-6 w-6 text-blue-400" />
                <span>Hedef Süresi</span>
              </h2>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  {analysisResult.estimatedTimeToGoalMonths} Ay
                </div>
                <p className="text-gray-400">Tahmini hedefe ulaşma süresi</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <TrendingUp className="h-6 w-6 text-green-400" />
                <span>Odak Alanları</span>
              </h2>
              <div className="space-y-2">
                {analysisResult.focusAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300">{area}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recommendations */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <span>Duruş Düzeltme Önerisi</span>
              </h3>
              <p className="text-gray-300 leading-relaxed">{analysisResult.postureCorrectionAdvice}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Dumbbell className="h-5 w-5 text-purple-400" />
                <span>Önerilen Antrenman Bölümü</span>
              </h3>
              <p className="text-gray-300 mb-4">{analysisResult.recommendedWorkoutSplit}</p>
              
              <h4 className="text-md font-semibold text-white mb-3">Önerilen Ekipmanlar:</h4>
              <div className="grid grid-cols-2 gap-2">
                {analysisResult.suggestedEquipment.map((equipment, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">{equipment}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Brain className="h-5 w-5 text-cyan-400" />
                <span>Başlangıç Tavsiyesi</span>
              </h3>
              <p className="text-gray-300 leading-relaxed">{analysisResult.initialAdvice}</p>
            </motion.div>
          </div>

          <div className="text-center mt-8 space-x-4">
            <button
              onClick={() => window.location.href = '/antrenman-programi'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2"
            >
              <Dumbbell className="h-5 w-5" />
              <span>Antrenman Programına Git</span>
            </button>
            <button
              onClick={resetAnalysis}
              className="border-2 border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-gray-800"
            >
              Yeni Analiz Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            AI Vücut <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Analizi</span>
          </h1>
          <p className="text-gray-400 text-lg">
            3 aşamalı fotoğraf yükleme süreciyle kişiselleştirilmiş fitness planınızı alın
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {photoSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${index < photoSteps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {validationResults[index]?.isValid ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < photoSteps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 rounded ${
                    index < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-700'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-gray-400">
              Adım {currentStep + 1} / {photoSteps.length}
            </span>
          </div>
        </div>

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                {photoSteps[currentStep].title}
              </h2>
              <p className="text-gray-400 text-lg mb-2">
                {photoSteps[currentStep].description}
              </p>
              <p className="text-gray-300">
                {photoSteps[currentStep].instruction}
              </p>
            </div>

            {/* File Upload */}
            <div className="max-w-md mx-auto">
              <label className="block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, currentStep);
                    }
                  }}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-xl p-8 text-center cursor-pointer transition-colors group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-white font-semibold mb-2">Fotoğraf Yükle</p>
                  <p className="text-gray-400 text-sm">
                    JPG, PNG veya WebP formatında
                  </p>
                </div>
              </label>

              {/* Validation Result */}
              {validationResults[currentStep] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-lg border ${
                    validationResults[currentStep].isValid
                      ? 'bg-green-500/20 border-green-500/30 text-green-400'
                      : 'bg-red-500/20 border-red-500/30 text-red-400'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {validationResults[currentStep].isValid ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <XCircle className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      {validationResults[currentStep].message}
                    </span>
                  </div>
                  {!validationResults[currentStep].isValid && validationResults[currentStep].issues.length > 0 && (
                    <ul className="text-sm space-y-1 ml-7">
                      {validationResults[currentStep].issues.map((issue, index) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
          >
            Önceki
          </button>

          {Object.keys(uploadedPhotos).length === 3 ? (
            <button
              onClick={analyzePhotos}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-3 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analiz Ediliyor...</span>
                </>
              ) : (
                <>
                  <Brain className="h-5 w-5" />
                  <span>Analiz Et</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(photoSteps.length - 1, currentStep + 1))}
              disabled={currentStep === photoSteps.length - 1 || !validationResults[currentStep]?.isValid}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
            >
              Sonraki
            </button>
          )}
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Camera className="h-5 w-5 text-blue-400" />
            <span>Kaliteli Fotoğraf İçin İpuçları:</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
            <div className="space-y-2">
              <p>• İyi ışık alan bir ortamda çekim yapın</p>
              <p>• Vücudunuzun tamamının göründüğünden emin olun</p>
              <p>• Düz bir duvar önünde poz verin</p>
            </div>
            <div className="space-y-2">
              <p>• Form fitting kıyafetler tercih edin</p>
              <p>• Telefonu sabit tutarak net çekim yapın</p>
              <p>• Doğal duruş sergileyip zorlamayın</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BodyAnalysisPage;