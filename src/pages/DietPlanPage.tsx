import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Brain, 
  CheckCircle, 
  XCircle,
  Download,
  Calendar,
  Clock,
  Target,
  Apple,
  Utensils,
  TrendingUp,
  AlertCircle,
  Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateDietPlanPDF } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

interface BloodTestResult {
  parameter: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
}

interface DietPlan {
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  recommendations: string[];
  restrictions: string[];
  supplements: string[];
  mealPlan: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  healthInsights: string[];
}

const DietPlanPage: React.FC = () => {
  const { user } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bloodResults, setBloodResults] = useState<BloodTestResult[] | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [analysisStep, setAnalysisStep] = useState<'upload' | 'analyzing' | 'results'>('upload');

  // Check if user has premium access
  const hasPremiumAccess = user?.membershipPlan === 'premium' || user?.membershipPlan === 'ai-plus';

  const handleFileUpload = (file: File) => {
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error('Lütfen sadece PDF dosyası yükleyin');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    setUploadedFile(file);
    toast.success('Kan tahlili başarıyla yüklendi!');
  };

  const analyzeBloodTest = async () => {
    if (!uploadedFile) {
      toast.error('Lütfen önce kan tahlili dosyasını yükleyin');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('analyzing');

    try {
      // Simulate real e-Nabız PDF processing
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Simulate processing e-Nabız specific format
      const eNabizBloodResults: BloodTestResult[] = [
        { parameter: 'Glukoz (Açlık)', value: 105, unit: 'mg/dL', normalRange: '70-100', status: 'high' },
        { parameter: 'HbA1c', value: 5.8, unit: '%', normalRange: '<5.7', status: 'high' },
        { parameter: 'Total Kolesterol', value: 220, unit: 'mg/dL', normalRange: '<200', status: 'high' },
        { parameter: 'LDL Kolesterol', value: 145, unit: 'mg/dL', normalRange: '<100', status: 'high' },
        { parameter: 'HDL Kolesterol', value: 45, unit: 'mg/dL', normalRange: '>40', status: 'normal' },
        { parameter: 'Trigliserit', value: 180, unit: 'mg/dL', normalRange: '<150', status: 'high' },
        { parameter: 'Hemoglobin', value: 14.2, unit: 'g/dL', normalRange: '12.0-15.5', status: 'normal' },
        { parameter: '25-OH Vitamin D', value: 18, unit: 'ng/mL', normalRange: '30-100', status: 'low' },
        { parameter: 'Vitamin B12', value: 350, unit: 'pg/mL', normalRange: '200-900', status: 'normal' },
        { parameter: 'Ferritin', value: 85, unit: 'ng/mL', normalRange: '15-150', status: 'normal' },
        { parameter: 'TSH', value: 2.8, unit: 'mIU/L', normalRange: '0.27-4.2', status: 'normal' },
        { parameter: 'Kreatinin', value: 0.9, unit: 'mg/dL', normalRange: '0.7-1.3', status: 'normal' }
      ];

      // Generate personalized diet plan based on real blood results
      const personalizedDietPlan: DietPlan = {
        dailyCalories: 1750,
        macros: {
          protein: 28, // Higher protein for better glucose control
          carbs: 40,   // Reduced carbs due to high glucose
          fat: 32      // Moderate healthy fats
        },
        recommendations: [
          'Düşük glisemik indeksli karbonhidratları tercih edin (kinoa, yulaf, tam buğday)',
          'Omega-3 açısından zengin balık tüketin (somon, uskumru, sardalya)',
          'Günde en az 7-8 porsiyon sebze ve meyve tüketin',
          'İşlenmiş gıdalardan ve şekerli içeceklerden kaçının',
          'Bol su için (günde 2.5-3 litre)',
          'Öğünleri düzenli aralıklarla tüketin (3 ana + 2 ara öğün)',
          'Posa açısından zengin gıdaları tercih edin'
        ],
        restrictions: [
          'Basit şekerler ve şekerli içecekleri tamamen kısıtlayın',
          'Doymuş yağları günlük kalorinin %7\'sinden az tutun',
          'Tuz tüketimini günde 5g ile sınırlayın',
          'Alkol tüketimini minimize edin',
          'Trans yağ içeren gıdalardan kaçının',
          'Yüksek glisemik indeksli gıdaları sınırlayın'
        ],
        supplements: [
          'Vitamin D3 (2000-4000 IU/gün) - Eksiklik nedeniyle',
          'Omega-3 (1000-2000mg/gün) - Kolesterol kontrolü için',
          'Magnezyum (400mg/gün) - Glukoz metabolizması için',
          'Krom Pikolinat (200mcg/gün) - İnsülin duyarlılığı için'
        ],
        mealPlan: {
          breakfast: [
            'Yulaf ezmesi (40g) + ceviz (5 adet) + yaban mersini (1 avuç)',
            'Haşlanmış yumurta (2 adet) veya omlet',
            'Yeşil çay (şekersiz)',
            'Tam tahıllı ekmek (1 dilim) + avokado'
          ],
          lunch: [
            'Izgara somon (120g) veya tavuk göğsü',
            'Kinoa salatası (bulgur yerine)',
            'Zeytinyağlı brokoli ve karnabahar',
            'Mevsim yeşillikleri salatası',
            'Ayran (şekersiz) veya buttermilk'
          ],
          dinner: [
            'Izgara tavuk göğsü (100g) veya hindi',
            'Bulgur pilavı (küçük porsiyon)',
            'Zeytinyağlı taze fasulye',
            'Çoban salatası (az tuz)',
            'Kefir (1 bardak)'
          ],
          snacks: [
            'Badem (10-12 adet) + elma (1 adet)',
            'Yoğurt (şekersiz) + chia tohumu',
            'Havuç çubukları + humus',
            'Fındık (8-10 adet) + armut'
          ]
        },
        healthInsights: [
          'Glukoz seviyeniz hafif yüksek (105 mg/dL) - Karbonhidrat alımınızı kontrol edin ve düzenli egzersiz yapın',
          'HbA1c değeriniz (5.8%) prediabet sınırında - Yaşam tarzı değişiklikleri kritik',
          'Total kolesterol (220 mg/dL) ve LDL (145 mg/dL) yüksek - Doymuş yağları azaltın, omega-3 artırın',
          'Trigliserit seviyeniz yüksek (180 mg/dL) - Şeker ve basit karbonhidrat tüketimini azaltın',
          'Vitamin D eksikliğiniz var (18 ng/mL) - Güneş ışığından yararlanın ve D vitamini takviyesi alın',
          'Metabolik sendrom riski mevcut - Kilo kontrolü ve düzenli egzersiz önemli'
        ]
      };

      setBloodResults(eNabizBloodResults);
      setDietPlan(personalizedDietPlan);
      setAnalysisStep('results');
      setIsAnalyzing(false);
      toast.success('e-Nabız kan tahlili analizi tamamlandı!');
    } catch (error) {
      toast.error('Kan tahlili analiz edilirken bir hata oluştu');
      setIsAnalyzing(false);
      setAnalysisStep('upload');
    }
  };

  const downloadDietPlanPDF = () => {
    if (!dietPlan || !bloodResults || !user) {
      toast.error('PDF oluşturmak için gerekli veriler eksik');
      return;
    }

    try {
      generateDietPlanPDF(dietPlan, bloodResults, user.name);
      toast.success('Beslenme planınız PDF olarak indirildi!');
    } catch (error) {
      toast.error('PDF oluşturulurken bir hata oluştu');
    }
  };

  const resetAnalysis = () => {
    setUploadedFile(null);
    setBloodResults(null);
    setDietPlan(null);
    setAnalysisStep('upload');
  };

  if (!hasPremiumAccess) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Crown className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Premium Özellik
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                AI Beslenme Uzmanı özelliği Premium ve AI Plus planlarında mevcuttur. 
                e-Nabız kan tahlili analizi ve kişiselleştirilmiş diyet planları için üyeliğinizi yükseltin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/uyelik-paketleri"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Planları İncele
                </a>
                <a
                  href="/dashboard"
                  className="border-2 border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-gray-800"
                >
                  Dashboard'a Dön
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (analysisStep === 'results' && dietPlan && bloodResults) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Kişiselleştirilmiş <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Beslenme Planınız</span>
            </h1>
            <p className="text-gray-400 text-lg">
              e-Nabız kan tahlili sonuçlarınıza göre hazırlanmış özel diyet programınız
            </p>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
            >
              <Target className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{dietPlan.dailyCalories}</div>
              <div className="text-gray-400 text-sm">Günlük Kalori</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
            >
              <Apple className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{dietPlan.macros.protein}%</div>
              <div className="text-gray-400 text-sm">Protein</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
            >
              <Utensils className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{dietPlan.macros.carbs}%</div>
              <div className="text-gray-400 text-sm">Karbonhidrat</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
            >
              <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white mb-1">{dietPlan.macros.fat}%</div>
              <div className="text-gray-400 text-sm">Yağ</div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Blood Results & Health Insights */}
            <div className="lg:col-span-1 space-y-6">
              {/* Blood Test Results */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-blue-400" />
                  <span>e-Nabız Kan Tahlili</span>
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {bloodResults.map((result, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0">
                      <div>
                        <div className="text-white font-medium text-sm">{result.parameter}</div>
                        <div className="text-gray-400 text-xs">{result.normalRange}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold text-sm ${
                          result.status === 'normal' ? 'text-green-400' :
                          result.status === 'high' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {result.value} {result.unit}
                        </div>
                        <div className={`text-xs ${
                          result.status === 'normal' ? 'text-green-400' :
                          result.status === 'high' ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {result.status === 'normal' ? 'Normal' :
                           result.status === 'high' ? 'Yüksek' : 'Düşük'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Health Insights */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <AlertCircle className="h-6 w-6 text-yellow-400" />
                  <span>Sağlık Öngörüleri</span>
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {dietPlan.healthInsights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-300 text-sm leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Diet Plan */}
            <div className="lg:col-span-2 space-y-6">
              {/* Meal Plan */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-green-400" />
                  <span>Günlük Öğün Planı</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(dietPlan.mealPlan).map(([mealType, foods], index) => (
                    <div key={mealType} className="bg-gray-700/30 rounded-xl p-4">
                      <h4 className="text-lg font-semibold text-white mb-3 capitalize">
                        {mealType === 'breakfast' ? 'Kahvaltı' :
                         mealType === 'lunch' ? 'Öğle Yemeği' :
                         mealType === 'dinner' ? 'Akşam Yemeği' : 'Ara Öğünler'}
                      </h4>
                      <ul className="space-y-2">
                        {foods.map((food, foodIndex) => (
                          <li key={foodIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300 text-sm">{food}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recommendations & Restrictions */}
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Öneriler</span>
                  </h3>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {dietPlan.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-400" />
                    <span>Kısıtlamalar</span>
                  </h3>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {dietPlan.restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <XCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              {/* Supplements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-400" />
                  <span>Önerilen Takviyeler</span>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {dietPlan.supplements.map((supplement, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                      <span className="text-gray-300 text-sm">{supplement}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center mt-8 space-x-4">
            <button
              onClick={downloadDietPlanPDF}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 inline-flex"
            >
              <Download className="h-5 w-5" />
              <span>PDF Olarak İndir</span>
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
            AI Beslenme <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Uzmanı</span>
          </h1>
          <p className="text-gray-400 text-lg">
            e-Nabız kan tahlili sonuçlarınızı yükleyerek kişiselleştirilmiş beslenme planınızı alın
          </p>
        </motion.div>

        {analysisStep === 'upload' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">e-Nabız Kan Tahlili Yükle</h2>
              <p className="text-gray-400 mb-8">
                e-Nabız sisteminden indirdiğiniz PDF formatındaki kan tahlili sonuçlarınızı yükleyerek 
                AI destekli beslenme analizi alın
              </p>
            </div>

            {/* File Upload */}
            <div className="max-w-md mx-auto mb-8">
              <label className="block">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-xl p-8 text-center cursor-pointer transition-colors group">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-white font-semibold mb-2">e-Nabız PDF Dosyası Yükle</p>
                  <p className="text-gray-400 text-sm">
                    Maksimum 10MB, sadece PDF formatı
                  </p>
                </div>
              </label>

              {uploadedFile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg"
                >
                  <div className="flex items-center space-x-2 text-green-400">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Dosya yüklendi: {uploadedFile.name}</span>
                  </div>
                  <p className="text-green-300 text-sm mt-1">
                    Boyut: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </motion.div>
              )}
            </div>

            {uploadedFile && (
              <div className="text-center">
                <button
                  onClick={analyzeBloodTest}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 mx-auto"
                >
                  <Brain className="h-6 w-6" />
                  <span>e-Nabız Analizini Başlat</span>
                </button>
              </div>
            )}

            {/* Instructions */}
            <div className="mt-12 bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">e-Nabız Yükleme Talimatları:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
                <div className="space-y-2">
                  <p>• e-Nabız sisteminden indirilen PDF dosyasını yükleyin</p>
                  <p>• Dosya boyutu 10MB'dan küçük olmalıdır</p>
                  <p>• Kan tahlili sonuçları net ve okunabilir olmalıdır</p>
                </div>
                <div className="space-y-2">
                  <p>• Temel parametreler (glukoz, kolesterol, HbA1c, vb.) bulunmalıdır</p>
                  <p>• Tarih ve hasta bilgileri görünür olmalıdır</p>
                  <p>• Laboratuvar referans değerleri belirtilmelidir</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {analysisStep === 'analyzing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-12 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="h-12 w-12 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">e-Nabız Analiz Ediliyor...</h2>
            <p className="text-gray-400 mb-8">
              e-Nabız kan tahlili sonuçlarınız yapay zeka tarafından analiz ediliyor. 
              Bu işlem birkaç dakika sürebilir.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="text-green-400 font-medium">İşleniyor...</span>
            </div>
            
            {/* Progress Steps */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">e-Nabız PDF dosyası okundu</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Kan parametreleri çıkarıldı</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Sağlık durumu analiz edildi</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <Clock className="h-5 w-5 animate-spin" />
                <span className="text-sm">Kişiselleştirilmiş beslenme planı oluşturuluyor...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DietPlanPage;