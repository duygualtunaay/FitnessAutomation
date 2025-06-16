import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Brain, Shield, Smartphone, Users, Award, Upload, Calculator, Dumbbell } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const HomePage: React.FC = () => {
  const [showFreemiumModal, setShowFreemiumModal] = useState(false);
  const [freemiumStep, setFreemiumStep] = useState<'bmi' | 'photo' | 'result'>('bmi');
  const [bmiData, setBmiData] = useState({ height: '', weight: '' });
  const [uploadedPhoto, setUploadedPhoto] = useState<File | null>(null);
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasUsedFreemium, setHasUsedFreemium] = useState(false);

  useEffect(() => {
    // Check if user has already used freemium feature (IP-based simulation)
    const usedFreemium = localStorage.getItem('freemium_used');
    if (usedFreemium) {
      setHasUsedFreemium(true);
    }
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI Vücut Analizi',
      description: 'Yapay zeka ile kişiselleştirilmiş antrenman programları',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Akıllı Beslenme',
      description: 'e-Nabız kan tahlili analizi ile kişisel diyet planları',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Smartphone,
      title: 'QR Kod Erişim',
      description: 'Kolayca spor salonuna giriş yapın',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Güvenli Ödeme',
      description: 'Stripe ile güvenli ödeme sistemi',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Üye Yönetimi',
      description: 'Kapsamlı üye takip sistemi',
      color: 'from-teal-500 to-blue-500'
    },
    {
      icon: Award,
      title: 'İlerleme Takibi',
      description: 'Detaylı performans analizi ve raporlama',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Aktif Üye' },
    { number: '500+', label: 'Spor Salonu' },
    { number: '99.9%', label: 'Uptime' },
    { number: '4.9', label: 'Kullanıcı Puanı' }
  ];

  const calculateBMI = () => {
    const height = parseFloat(bmiData.height) / 100; // Convert cm to m
    const weight = parseFloat(bmiData.weight);
    
    if (height > 0 && weight > 0) {
      const bmi = weight / (height * height);
      setBmiResult(bmi);
      setFreemiumStep('photo');
    } else {
      toast.error('Lütfen geçerli boy ve kilo değerleri girin');
    }
  };

  const handlePhotoUpload = (file: File) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen sadece resim dosyası yükleyin');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }
    
    setUploadedPhoto(file);
    analyzePhoto();
  };

  const analyzePhoto = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate sample workout plan based on BMI
    const plan = {
      duration: '1 hafta',
      focus: bmiResult && bmiResult < 18.5 ? 'Kas Geliştirme' : 
             bmiResult && bmiResult > 25 ? 'Yağ Yakma' : 'Genel Fitness',
      exercises: [
        { day: 'Pazartesi', exercise: 'Push-up', sets: '3x10', rest: '60sn' },
        { day: 'Salı', exercise: 'Squat', sets: '3x15', rest: '45sn' },
        { day: 'Çarşamba', exercise: 'Plank', sets: '3x30sn', rest: '30sn' },
        { day: 'Perşembe', exercise: 'Burpee', sets: '3x8', rest: '90sn' },
        { day: 'Cuma', exercise: 'Mountain Climber', sets: '3x20', rest: '60sn' },
        { day: 'Cumartesi', exercise: 'Cardio', sets: '20dk', rest: '-' },
        { day: 'Pazar', exercise: 'Dinlenme', sets: '-', rest: '-' }
      ]
    };
    
    setWorkoutPlan(plan);
    setFreemiumStep('result');
    setIsAnalyzing(false);
    
    // Mark as used (IP-based simulation)
    localStorage.setItem('freemium_used', 'true');
    setHasUsedFreemium(true);
    
    toast.success('Analiz tamamlandı! Örnek antrenman planınız hazır.');
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Zayıf', color: 'text-blue-400' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-400' };
    if (bmi < 30) return { category: 'Fazla Kilolu', color: 'text-yellow-400' };
    return { category: 'Obez', color: 'text-red-400' };
  };

  const resetFreemium = () => {
    setShowFreemiumModal(false);
    setFreemiumStep('bmi');
    setBmiData({ height: '', weight: '' });
    setUploadedPhoto(null);
    setBmiResult(null);
    setWorkoutPlan(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Yeni Nesil
              </span>
              <br />
              <span className="text-white">Fitness Hub</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Yapay zeka destekli vücut analizi ve kişiselleştirilmiş beslenme planları ile 
              fitness hedeflerinize ulaşın. Spor salonunuz için tam kapsamlı dijital çözüm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                to="/kayit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Ücretsiz Başla</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/uyelik-paketleri"
                className="border-2 border-gray-600 hover:border-gray-500 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-gray-800"
              >
                Paketleri İncele
              </Link>
            </div>
            
            {/* Freemium Feature */}
            {!hasUsedFreemium && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 max-w-md mx-auto"
              >
                <h3 className="text-lg font-bold text-yellow-400 mb-2">🎁 Ücretsiz Deneme</h3>
                <p className="text-gray-300 text-sm mb-4">
                  BMI hesaplama + AI fotoğraf analizi ile 1 haftalık örnek antrenman planı alın!
                </p>
                <button
                  onClick={() => setShowFreemiumModal(true)}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-6 py-3 rounded-lg text-black font-semibold transition-all duration-300 transform hover:scale-105 w-full"
                >
                  Hemen Dene (Tek Kullanım)
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Neden <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Fitness Hub?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Modern teknoloji ile fitness dünyasında devrim yaratıyoruz. 
              İşte size sunduğumuz özellikler.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Fitness Yolculuğunuza Başlayın
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              7 günlük ücretsiz deneme ile tüm premium özelliklerimizi keşfedin. 
              Kredi kartı bilgisi gerektirmez.
            </p>
            <Link
              to="/kayit"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <span>Hemen Başla</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Freemium Modal */}
      {showFreemiumModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {freemiumStep === 'bmi' && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">BMI Hesaplama</h3>
                  <p className="text-gray-400">Boy ve kilo bilgilerinizi girin</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Boy (cm)
                    </label>
                    <input
                      type="number"
                      value={bmiData.height}
                      onChange={(e) => setBmiData(prev => ({ ...prev, height: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="175"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Kilo (kg)
                    </label>
                    <input
                      type="number"
                      value={bmiData.weight}
                      onChange={(e) => setBmiData(prev => ({ ...prev, weight: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="70"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={resetFreemium}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-white font-medium transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    onClick={calculateBMI}
                    disabled={!bmiData.height || !bmiData.weight}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-4 py-3 rounded-lg text-black font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Devam Et
                  </button>
                </div>
              </>
            )}

            {freemiumStep === 'photo' && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Fotoğraf Yükle</h3>
                  <p className="text-gray-400">Vücut fotoğrafınızı yükleyin</p>
                </div>

                {bmiResult && (
                  <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                    <h4 className="text-white font-semibold mb-2">BMI Sonucunuz</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-white">{bmiResult.toFixed(1)}</span>
                      <span className={`font-medium ${getBMICategory(bmiResult).color}`}>
                        {getBMICategory(bmiResult).category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handlePhotoUpload(file);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-xl p-6 text-center cursor-pointer transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-white font-medium mb-1">Fotoğraf Yükle</p>
                      <p className="text-gray-400 text-sm">JPG, PNG (max 5MB)</p>
                    </div>
                  </label>
                </div>

                {isAnalyzing && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p className="text-blue-400">AI analiz ediyor...</p>
                  </div>
                )}

                <button
                  onClick={resetFreemium}
                  className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-white font-medium transition-colors"
                >
                  İptal
                </button>
              </>
            )}

            {freemiumStep === 'result' && workoutPlan && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Dumbbell className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Örnek Antrenman Planınız</h3>
                  <p className="text-gray-400">1 haftalık başlangıç programı</p>
                </div>

                <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">BMI:</span>
                    <span className="text-white font-semibold">{bmiResult?.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Odak:</span>
                    <span className="text-green-400 font-semibold">{workoutPlan.focus}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {workoutPlan.exercises.map((exercise: any, index: number) => (
                    <div key={index} className="bg-gray-700/30 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{exercise.day}</div>
                          <div className="text-gray-400 text-sm">{exercise.exercise}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-blue-400 text-sm">{exercise.sets}</div>
                          <div className="text-gray-500 text-xs">{exercise.rest}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <p className="text-yellow-400 text-sm">
                    <strong>Not:</strong> Bu örnek bir programdır. Tam kişiselleştirilmiş planlar için üye olun!
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={resetFreemium}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-white font-medium transition-colors"
                  >
                    Kapat
                  </button>
                  <Link
                    to="/kayit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 text-center"
                    onClick={resetFreemium}
                  >
                    Üye Ol
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;