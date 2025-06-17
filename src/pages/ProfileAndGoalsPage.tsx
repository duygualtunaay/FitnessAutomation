import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Target, 
  Utensils, 
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ProfileAndGoalsPage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Physical Info
    age: '',
    height: '',
    weight: '',
    gender: '' as 'male' | 'female' | '',
    // Goals
    primaryGoal: '',
    targetBodyFat: '',
    targetWeight: '',
    // Nutrition Profile
    preferences: '',
    avoidances: '',
    allergies: '',
    dailyRoutine: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        age: user.physicalInfo?.age?.toString() || '',
        height: user.physicalInfo?.height?.toString() || '',
        weight: user.physicalInfo?.weight?.toString() || '',
        gender: user.physicalInfo?.gender || '',
        primaryGoal: user.goals?.primaryGoal || '',
        targetBodyFat: user.goals?.targetBodyFat?.toString() || '',
        targetWeight: user.goals?.targetWeight?.toString() || '',
        preferences: user.nutritionProfile?.preferences || '',
        avoidances: user.nutritionProfile?.avoidances || '',
        allergies: user.nutritionProfile?.allergies || '',
        dailyRoutine: user.nutritionProfile?.dailyRoutine || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updates = {
        physicalInfo: {
          age: parseInt(formData.age),
          height: parseInt(formData.height),
          weight: parseFloat(formData.weight),
          gender: formData.gender as 'male' | 'female'
        },
        goals: {
          primaryGoal: formData.primaryGoal,
          targetBodyFat: formData.targetBodyFat ? parseFloat(formData.targetBodyFat) : undefined,
          targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined
        },
        nutritionProfile: {
          preferences: formData.preferences,
          avoidances: formData.avoidances,
          allergies: formData.allergies,
          dailyRoutine: formData.dailyRoutine
        }
      };

      const success = await updateUserProfile(updates);
      if (success) {
        toast.success('Profil bilgileriniz başarıyla kaydedildi!');
      } else {
        toast.error('Bilgiler kaydedilirken bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bilgiler kaydedilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormComplete = () => {
    return formData.age && formData.height && formData.weight && 
           formData.gender && formData.primaryGoal;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Profil ve <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Hedefler</span>
          </h1>
          <p className="text-gray-400">
            AI koçunuzun size en uygun planı hazırlayabilmesi için lütfen aşağıdaki bilgileri doldurun
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Physical Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <User className="h-6 w-6 text-blue-400" />
              <span>Fiziksel Bilgiler</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Yaş *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Boy (cm) *
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="175"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kilo (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="70.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cinsiyet *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">Seçiniz</option>
                  <option value="male">Erkek</option>
                  <option value="female">Kadın</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Goals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Target className="h-6 w-6 text-green-400" />
              <span>Hedefler</span>
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Net Hedef *
                </label>
                <textarea
                  name="primaryGoal"
                  value={formData.primaryGoal}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                  placeholder="Örn: Mevcut kilomu korurken, vücut yağ oranımı %18'den %12'ye düşürmek ve kas kütlemi artırmak istiyorum..."
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hedef Vücut Yağ Oranı (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="targetBodyFat"
                    value={formData.targetBodyFat}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="12.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hedef Kilo (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="targetWeight"
                    value={formData.targetWeight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="75.0"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nutrition Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Utensils className="h-6 w-6 text-purple-400" />
              <span>Beslenme Profili</span>
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tercihler
                </label>
                <textarea
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                  placeholder="Örn: Beyaz et, balık, sebze ağırlıklı beslenme..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Kaçınılanlar
                </label>
                <textarea
                  name="avoidances"
                  value={formData.avoidances}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                  placeholder="Örn: Hamur işleri, şekerli içecekler..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Alerji/Hassasiyet
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                  placeholder="Örn: Yok / Laktoz intoleransı var..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Günlük Rutin
                </label>
                <textarea
                  name="dailyRoutine"
                  value={formData.dailyRoutine}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
                  placeholder="Örn: Sabah 08:00 kahvaltı, öğle 13:00, akşam en geç 20:00..."
                />
              </div>
            </div>
          </motion.div>

          {/* Form Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className={`p-4 rounded-lg border ${
              isFormComplete() 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}
          >
            <div className="flex items-center space-x-2">
              {isFormComplete() ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              )}
              <span className={`text-sm font-medium ${
                isFormComplete() ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {isFormComplete() 
                  ? 'Tüm zorunlu alanlar dolduruldu' 
                  : 'Lütfen zorunlu alanları (*) doldurun'
                }
              </span>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <button
              type="submit"
              disabled={isLoading || !isFormComplete()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 mx-auto"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Bilgileri Kaydet</span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default ProfileAndGoalsPage;