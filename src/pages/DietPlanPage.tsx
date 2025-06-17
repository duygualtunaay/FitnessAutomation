import React, { useState, useEffect } from 'react';
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
  Crown,
  User,
  ChevronDown,
  ChevronUp,
  ShoppingCart,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { generateDietPlanPDF } from '../utils/pdfGenerator';
import toast from 'react-hot-toast';

interface BloodTestResult {
  parameter: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'high' | 'low';
}

interface AICoachResponse {
  strategicAnalysis: string;
  macroNutrientPlan: {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    reasoning: string;
  };
  weeklyNutritionPlan: {
    [key: string]: {
      breakfast: string[];
      lunch: string[];
      dinner: string[];
      snacks: string[];
      purpose: string;
    };
  };
  mealPrepGuide: {
    title: string;
    steps: string[];
  };
  shoppingList: {
    [category: string]: string[];
  };
  progressMetrics: {
    metric: string;
    description: string;
    target: string;
  }[];
  importantWarning: string;
}

const DietPlanPage: React.FC = () => {
  const { user } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bloodResults, setBloodResults] = useState<BloodTestResult[] | null>(null);
  const [aiResponse, setAiResponse] = useState<AICoachResponse | null>(null);
  const [analysisStep, setAnalysisStep] = useState<'upload' | 'analyzing' | 'results'>('upload');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    strategic: true,
    macro: false,
    weekly: false,
    mealprep: false,
    shopping: false,
    metrics: false
  });

  // Check if user has premium access
  const hasPremiumAccess = user?.membershipPlan === 'premium' || user?.membershipPlan === 'ai-plus';

  // Check if profile is complete
  const isProfileComplete = user?.physicalInfo && user?.goals;

  useEffect(() => {
    // Load existing AI response if available
    const loadExistingPlan = async () => {
      if (user && hasPremiumAccess && isProfileComplete) {
        try {
          const planDoc = await getDoc(doc(db, 'users', user.id, 'aiPlans', 'currentDietPlan'));
          if (planDoc.exists()) {
            const data = planDoc.data();
            setAiResponse(data.aiResponse);
            setBloodResults(data.bloodResults);
            setAnalysisStep('results');
          }
        } catch (error) {
          console.error('Error loading existing plan:', error);
        }
      }
    };

    loadExistingPlan();
  }, [user, hasPremiumAccess, isProfileComplete]);

  const handleFileUpload = (file: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Lütfen sadece PDF dosyası yükleyin');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Dosya boyutu 10MB\'dan küçük olmalıdır');
      return;
    }

    setUploadedFile(file);
    toast.success('Kan tahlili başarıyla yüklendi!');
  };

  const generateAIResponse = (bloodResults: BloodTestResult[]): AICoachResponse => {
    // Simulate AI analysis based on user data and blood results
    const hasHighGlucose = bloodResults.some(r => r.parameter.includes('Glukoz') && r.status === 'high');
    const hasHighCholesterol = bloodResults.some(r => r.parameter.includes('Kolesterol') && r.status === 'high');
    const hasLowVitaminD = bloodResults.some(r => r.parameter.includes('Vitamin D') && r.status === 'low');

    return {
      strategicAnalysis: `Mevcut kan tahlili sonuçlarınız ve fiziksel verileriniz analiz edildiğinde, ${user?.goals?.primaryGoal} hedefinize ulaşmak için stratejik bir yaklaşım gerekiyor. ${hasHighGlucose ? 'Glukoz seviyenizin yüksek olması nedeniyle karbonhidrat alımınızı kontrol etmemiz kritik.' : ''} ${hasHighCholesterol ? 'Kolesterol seviyenizi düşürmek için omega-3 açısından zengin gıdalar ve doymuş yağ kısıtlaması önemli.' : ''} ${hasLowVitaminD ? 'Vitamin D eksikliğiniz kas gelişimi ve metabolizmayı olumsuz etkileyebilir.' : ''} Mevcut ${user?.physicalInfo?.weight}kg kilonuzdan ${user?.goals?.targetWeight || 'hedef'}kg'a ulaşmak için günlük kalori dengesini optimize edeceğiz.`,
      
      macroNutrientPlan: {
        dailyCalories: hasHighGlucose ? 1650 : 1800,
        protein: hasHighGlucose ? 35 : 30,
        carbs: hasHighGlucose ? 35 : 40,
        fat: 30,
        reasoning: `${user?.physicalInfo?.age} yaş, ${user?.physicalInfo?.height}cm boy ve ${user?.physicalInfo?.weight}kg kilo verilerinize göre hesaplanmış makro dağılım. ${hasHighGlucose ? 'Glukoz kontrolü için protein oranı artırıldı.' : ''}`
      },

      weeklyNutritionPlan: {
        'Pazartesi (Göğüs & Triceps)': {
          breakfast: ['Yulaf ezmesi (50g) + protein tozu (25g)', 'Yaban mersini (1 avuç)', 'Badem (8-10 adet)', 'Yeşil çay'],
          lunch: ['Izgara tavuk göğsü (150g)', 'Kinoa (80g)', 'Brokoli salatası', 'Zeytinyağı (1 yemek kaşığı)'],
          dinner: ['Somon (120g)', 'Tatlı patates (100g)', 'Ispanak salatası', 'Avokado (1/2 adet)'],
          snacks: ['Protein bar', 'Elma + fıstık ezmesi'],
          purpose: 'Antrenman günü için yüksek protein ve karmaşık karbonhidrat'
        },
        'Salı (Sırt & Biceps)': {
          breakfast: ['Omlet (2 yumurta + 1 beyaz)', 'Tam buğday ekmeği (1 dilim)', 'Domates, salatalık', 'Kahve'],
          lunch: ['Izgara hindi (130g)', 'Bulgur pilavı (60g)', 'Mevsim salatası', 'Ceviz (5 adet)'],
          dinner: ['Levrek (150g)', 'Quinoa (70g)', 'Karışık sebze', 'Zeytinyağı'],
          snacks: ['Yoğurt + chia tohumu', 'Havuç çubukları'],
          purpose: 'Kas onarımı için yüksek protein, antioksidan açısından zengin'
        },
        'Çarşamba (Dinlenme)': {
          breakfast: ['Chia pudding + meyve', 'Badem sütü', 'Bal (1 tatlı kaşığı)'],
          lunch: ['Mercimek çorbası', 'Izgara sebze', 'Tam tahıllı ekmek', 'Zeytinyağı'],
          dinner: ['Tavuk salatası', 'Kinoa', 'Avokado', 'Limon sosu'],
          snacks: ['Meyve salatası', 'Fındık (8 adet)'],
          purpose: 'Dinlenme günü için hafif, sindirimi kolay besinler'
        },
        'Perşembe (Bacak)': {
          breakfast: ['Protein smoothie (muz + protein tozu)', 'Yulaf (40g)', 'Ceviz', 'Süt'],
          lunch: ['Izgara biftek (120g)', 'Tatlı patates (120g)', 'Roka salatası', 'Zeytinyağı'],
          dinner: ['Somon (130g)', 'Esmer pirinç (60g)', 'Buharda sebze', 'Avokado'],
          snacks: ['Protein bar', 'Muz + badem ezmesi'],
          purpose: 'Yoğun bacak antrenmanı için ekstra karbonhidrat ve protein'
        },
        'Cuma (Omuz & Abs)': {
          breakfast: ['Haşlanmış yumurta (2 adet)', 'Avokado toast', 'Domates', 'Yeşil çay'],
          lunch: ['Izgara tavuk (140g)', 'Bulgur salatası', 'Mevsim yeşillikleri', 'Ceviz'],
          dinner: ['Uskumru (120g)', 'Quinoa (70g)', 'Karışık salata', 'Zeytinyağı'],
          snacks: ['Yoğurt + meyve', 'Badem (10 adet)'],
          purpose: 'Omega-3 açısından zengin, kas tanımı için optimize edilmiş'
        },
        'Cumartesi (Cardio)': {
          breakfast: ['Meyve salatası', 'Yoğurt', 'Granola (30g)', 'Bal'],
          lunch: ['Sebze çorbası', 'Izgara balık', 'Salata', 'Zeytinyağı'],
          dinner: ['Tavuk salatası', 'Kinoa', 'Avokado', 'Limon'],
          snacks: ['Smoothie', 'Fındık'],
          purpose: 'Kardiyovasküler aktivite için hafif, enerji verici'
        },
        'Pazar (Dinlenme)': {
          breakfast: ['Pancake (yulaf unu)', 'Meyve', 'Bal', 'Kahve'],
          lunch: ['Sebze yemeği', 'Pirinç', 'Salata', 'Yoğurt'],
          dinner: ['Izgara balık', 'Sebze', 'Bulgur', 'Zeytinyağı'],
          snacks: ['Meyve', 'Kuruyemiş karışımı'],
          purpose: 'Hafta sonu rahatlaması, esnek beslenme'
        }
      },

      mealPrepGuide: {
        title: 'Pazar Günü Meal Prep Rehberi',
        steps: [
          '1. Protein Hazırlığı: 1kg tavuk göğsünü marine edin ve fırında pişirin, porsiyonlara ayırın',
          '2. Karbonhidrat Hazırlığı: Quinoa ve bulguru haşlayın, buzdolabı kaplarına paylaştırın',
          '3. Sebze Hazırlığı: Brokoli, karnabahar ve havuçları doğrayın, buharda pişirin',
          '4. Salata Hazırlığı: Yeşillikleri yıkayın, kurulayın ve hava geçirmez kaplarda saklayın',
          '5. Snack Hazırlığı: Protein topları yapın (hurma + badem + protein tozu)',
          '6. Soslar: Zeytinyağlı limon sosu ve avokado sosu hazırlayın',
          '7. Porsiyon Kontrolü: Her öğünü ayrı kaplara paylaştırın ve etiketleyin'
        ]
      },

      shoppingList: {
        'Protein Kaynakları': [
          'Tavuk göğsü (1kg)',
          'Somon fileto (500g)',
          'Yumurta (30 adet)',
          'Protein tozu (1 kutu)',
          'Yoğurt (1kg)',
          'Badem (500g)',
          'Ceviz (300g)'
        ],
        'Karbonhidrat Kaynakları': [
          'Quinoa (500g)',
          'Yulaf ezmesi (1kg)',
          'Tatlı patates (1kg)',
          'Esmer pirinç (500g)',
          'Tam buğday ekmeği (1 paket)'
        ],
        'Sebze & Meyve': [
          'Brokoli (2 adet)',
          'Ispanak (500g)',
          'Avokado (6 adet)',
          'Muz (1 demet)',
          'Yaban mersini (250g)',
          'Domates (1kg)',
          'Salatalık (5 adet)'
        ],
        'Yağ Kaynakları': [
          'Zeytinyağı (500ml)',
          'Badem ezmesi (1 kavanoz)',
          'Chia tohumu (200g)',
          'Fındık (300g)'
        ],
        'Diğer': [
          'Yeşil çay (1 kutu)',
          'Kahve (250g)',
          'Bal (1 kavanoz)',
          'Limon (5 adet)',
          'Baharat karışımı'
        ]
      },

      progressMetrics: [
        {
          metric: 'Sabah Enerji Seviyesi',
          description: 'Her sabah uyanışta 1-10 arası enerji seviyenizi değerlendirin',
          target: '7+ seviye hedefleniyor'
        },
        {
          metric: 'Haftalık Ortalama Uyku Süresi',
          description: 'Günlük uyku saatlerinizi kaydedin ve haftalık ortalamasını hesaplayın',
          target: '7-8 saat arası optimal'
        },
        {
          metric: 'Bel Çevresi Ölçümü',
          description: 'Haftada 2 kez, aynı saatte ve aç karnına bel çevrenizi ölçün',
          target: `${user?.physicalInfo?.gender === 'male' ? '90cm altı' : '80cm altı'} hedefleniyor`
        }
      ],

      importantWarning: 'ÖNEMLİ UYARI: Bu plan, sağlık verileriniz ve hedefleriniz doğrultusunda AI tarafından kişiselleştirilmiştir ancak tıbbi bir tedavi değildir. Uygulamadan önce mutlaka bir doktor ve diyetisyene danışınız. Herhangi bir sağlık problemi yaşarsanız derhal uzman desteği alınız.'
    };
  };

  const analyzeBloodTest = async () => {
    if (!uploadedFile) {
      toast.error('Lütfen önce kan tahlili dosyasını yükleyin');
      return;
    }

    if (!isProfileComplete) {
      toast.error('Lütfen önce profil bilgilerinizi tamamlayın');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep('analyzing');

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Generate mock blood results
      const mockBloodResults: BloodTestResult[] = [
        { parameter: 'Glukoz (Açlık)', value: 95, unit: 'mg/dL', normalRange: '70-100', status: 'normal' },
        { parameter: 'HbA1c', value: 5.4, unit: '%', normalRange: '<5.7', status: 'normal' },
        { parameter: 'Total Kolesterol', value: 180, unit: 'mg/dL', normalRange: '<200', status: 'normal' },
        { parameter: 'LDL Kolesterol', value: 110, unit: 'mg/dL', normalRange: '<100', status: 'high' },
        { parameter: 'HDL Kolesterol', value: 55, unit: 'mg/dL', normalRange: '>40', status: 'normal' },
        { parameter: 'Trigliserit', value: 120, unit: 'mg/dL', normalRange: '<150', status: 'normal' },
        { parameter: '25-OH Vitamin D', value: 25, unit: 'ng/mL', normalRange: '30-100', status: 'low' },
        { parameter: 'Vitamin B12', value: 450, unit: 'pg/mL', normalRange: '200-900', status: 'normal' },
        { parameter: 'Ferritin', value: 95, unit: 'ng/mL', normalRange: '15-150', status: 'normal' },
        { parameter: 'TSH', value: 2.1, unit: 'mIU/L', normalRange: '0.27-4.2', status: 'normal' }
      ];

      // Generate AI response
      const aiCoachResponse = generateAIResponse(mockBloodResults);

      setBloodResults(mockBloodResults);
      setAiResponse(aiCoachResponse);
      setAnalysisStep('results');

      // Save to Firestore
      if (user) {
        await setDoc(doc(db, 'users', user.id, 'aiPlans', 'currentDietPlan'), {
          aiResponse: aiCoachResponse,
          bloodResults: mockBloodResults,
          createdAt: new Date(),
          userId: user.id
        });
      }

      setIsAnalyzing(false);
      toast.success('AI Koç analizi tamamlandı!');
    } catch (error) {
      toast.error('Analiz sırasında bir hata oluştu');
      setIsAnalyzing(false);
      setAnalysisStep('upload');
    }
  };

  const downloadAIPlanPDF = () => {
    if (!aiResponse || !bloodResults || !user) {
      toast.error('PDF oluşturmak için gerekli veriler eksik');
      return;
    }

    try {
      generateDietPlanPDF(aiResponse, bloodResults, user.name);
      toast.success('AI Koç planınız PDF olarak indirildi!');
    } catch (error) {
      toast.error('PDF oluşturulurken bir hata oluştu');
    }
  };

  const resetAnalysis = () => {
    setUploadedFile(null);
    setBloodResults(null);
    setAiResponse(null);
    setAnalysisStep('upload');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
                AI Performans ve Beslenme Koçu özelliği Premium ve AI Plus planlarında mevcuttur.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/uyelik-paketleri"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Planları İncele
                </Link>
                <Link
                  to="/dashboard"
                  className="border-2 border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-gray-800"
                >
                  Dashboard'a Dön
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!isProfileComplete) {
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
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Profil Tamamlanması Gerekli
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                AI Koçunuzun size en uygun planı hazırlayabilmesi için öncelikle profil bilgilerinizi tamamlamanız gerekiyor.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/profil-ve-hedefler"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Profili Tamamla
                </Link>
                <Link
                  to="/dashboard"
                  className="border-2 border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-gray-800"
                >
                  Dashboard'a Dön
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (analysisStep === 'results' && aiResponse && bloodResults) {
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
              AI Performans ve <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Beslenme Koçu</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Kişiselleştirilmiş 8 adımlı koçluk planınız hazır
            </p>
          </motion.div>

          <div className="space-y-6">
            {/* Strategic Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection('strategic')}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                  <h3 className="text-xl font-bold text-white">1. Stratejik Analiz ve Yol Haritası</h3>
                </div>
                {expandedSections.strategic ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.strategic && (
                <div className="px-6 pb-6">
                  <p className="text-gray-300 leading-relaxed">{aiResponse.strategicAnalysis}</p>
                </div>
              )}
            </motion.div>

            {/* Macro Nutrient Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection('macro')}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Target className="h-6 w-6 text-green-400" />
                  <h3 className="text-xl font-bold text-white">2. Hedef Odaklı Makro Besin Planı</h3>
                </div>
                {expandedSections.macro ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.macro && (
                <div className="px-6 pb-6">
                  <div className="grid md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">{aiResponse.macroNutrientPlan.dailyCalories}</div>
                      <div className="text-gray-400 text-sm">Günlük Kalori</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">{aiResponse.macroNutrientPlan.protein}%</div>
                      <div className="text-gray-400 text-sm">Protein</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">{aiResponse.macroNutrientPlan.carbs}%</div>
                      <div className="text-gray-400 text-sm">Karbonhidrat</div>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">{aiResponse.macroNutrientPlan.fat}%</div>
                      <div className="text-gray-400 text-sm">Yağ</div>
                    </div>
                  </div>
                  <p className="text-gray-300">{aiResponse.macroNutrientPlan.reasoning}</p>
                </div>
              )}
            </motion.div>

            {/* Weekly Nutrition Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection('weekly')}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">3. Dinamik Haftalık Beslenme Planı</h3>
                </div>
                {expandedSections.weekly ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.weekly && (
                <div className="px-6 pb-6">
                  <div className="space-y-6">
                    {Object.entries(aiResponse.weeklyNutritionPlan).map(([day, plan], index) => (
                      <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-white mb-2">{day}</h4>
                        <p className="text-blue-400 text-sm mb-3">{plan.purpose}</p>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <h5 className="font-medium text-green-400 mb-2">Kahvaltı</h5>
                            <ul className="text-sm text-gray-300 space-y-1">
                              {plan.breakfast.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-yellow-400 mb-2">Öğle</h5>
                            <ul className="text-sm text-gray-300 space-y-1">
                              {plan.lunch.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-orange-400 mb-2">Akşam</h5>
                            <ul className="text-sm text-gray-300 space-y-1">
                              {plan.dinner.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-purple-400 mb-2">Ara Öğün</h5>
                            <ul className="text-sm text-gray-300 space-y-1">
                              {plan.snacks.map((item, i) => (
                                <li key={i}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Meal Prep Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection('mealprep')}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-orange-400" />
                  <h3 className="text-xl font-bold text-white">4. {aiResponse.mealPrepGuide.title}</h3>
                </div>
                {expandedSections.mealprep ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.mealprep && (
                <div className="px-6 pb-6">
                  <div className="space-y-3">
                    {aiResponse.mealPrepGuide.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-300">{step.substring(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Shopping List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection('shopping')}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="h-6 w-6 text-pink-400" />
                  <h3 className="text-xl font-bold text-white">5. Haftalık Alışveriş Listesi</h3>
                </div>
                {expandedSections.shopping ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.shopping && (
                <div className="px-6 pb-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(aiResponse.shoppingList).map(([category, items], index) => (
                      <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-pink-400 mb-3">{category}</h4>
                        <ul className="text-sm text-gray-300 space-y-1">
                          {items.map((item, i) => (
                            <li key={i}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Progress Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleSection('metrics')}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Activity className="h-6 w-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-white">6. İlerleme Takibi İçin Metrikler</h3>
                </div>
                {expandedSections.metrics ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.metrics && (
                <div className="px-6 pb-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    {aiResponse.progressMetrics.map((metric, index) => (
                      <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="font-semibold text-cyan-400 mb-2">{metric.metric}</h4>
                        <p className="text-gray-300 text-sm mb-2">{metric.description}</p>
                        <p className="text-green-400 text-sm font-medium">{metric.target}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Important Warning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6"
            >
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-2">Önemli Uyarı</h3>
                  <p className="text-red-300 leading-relaxed">{aiResponse.importantWarning}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="text-center mt-8 space-x-4">
            <button
              onClick={downloadAIPlanPDF}
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
            AI Performans ve <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Beslenme Koçu</span>
          </h1>
          <p className="text-gray-400 text-lg">
            e-Nabız kan tahlili sonuçlarınızı yükleyerek kişiselleştirilmiş 8 adımlı koçluk planınızı alın
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
                AI destekli 8 adımlı koçluk planı alın
              </p>
            </div>

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
                  <span>AI Koç Analizini Başlat</span>
                </button>
              </div>
            )}
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
            <h2 className="text-2xl font-bold text-white mb-4">AI Koç Analiz Ediyor...</h2>
            <p className="text-gray-400 mb-8">
              Kan tahlili, fiziksel veriler, hedefler ve antrenman programınız analiz ediliyor. 
              8 adımlı kişiselleştirilmiş plan hazırlanıyor...
            </p>
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="text-green-400 font-medium">İşleniyor...</span>
            </div>
            
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">e-Nabız kan tahlili analiz edildi</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Fiziksel veriler ve hedefler işlendi</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">Antrenman programı entegre edildi</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <Clock className="h-5 w-5 animate-spin" />
                <span className="text-sm">8 adımlı kişiselleştirilmiş plan oluşturuluyor...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DietPlanPage;