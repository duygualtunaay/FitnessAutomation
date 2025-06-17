import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Lock, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle,
  Eye,
  EyeOff,
  Calendar,
  Crown,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const MembershipManagePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<PasswordChangeForm>();
  const newPassword = watch('newPassword');

  if (!user) return null;

  const getMembershipPlanName = (plan: string) => {
    switch (plan) {
      case 'basic': return 'Temel';
      case 'premium': return 'Premium';
      case 'ai-plus': return 'AI Plus';
      default: return plan;
    }
  };

  const getMembershipColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'from-green-500 to-emerald-500';
      case 'premium': return 'from-blue-500 to-purple-500';
      case 'ai-plus': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handlePasswordChange = async (data: PasswordChangeForm) => {
    setIsChangingPassword(true);
    
    try {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        toast.error('Kullanıcı bilgileri bulunamadı');
        return;
      }

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(currentUser.email, data.currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, data.newPassword);
      
      toast.success('Şifreniz başarıyla güncellendi');
      reset();
    } catch (error: any) {
      console.error('Password change error:', error);
      if (error.code === 'auth/wrong-password') {
        toast.error('Mevcut şifre yanlış');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Yeni şifre çok zayıf');
      } else {
        toast.error('Şifre güncellenirken bir hata oluştu');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancelMembership = async () => {
    setIsCancelling(true);
    
    try {
      // Simulate API call to cancel subscription
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Üyeliğiniz iptal edildi. Mevcut dönem sonunda sona erecek.');
      setShowCancelModal(false);
      
      // Optionally logout user or redirect
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      toast.error('Üyelik iptal edilirken bir hata oluştu');
    } finally {
      setIsCancelling(false);
    }
  };

  const membershipFeatures = {
    basic: [
      'QR kod ile giriş',
      'Temel ilerleme takibi',
      'Mobil uygulama',
      'Email destek'
    ],
    premium: [
      'Tüm Temel plan özellikleri',
      'AI vücut analizi',
      'Kişiselleştirilmiş antrenman planları',
      'Detaylı performans analizi',
      'Öncelikli destek'
    ],
    'ai-plus': [
      'Tüm Premium plan özellikleri',
      'AI beslenme uzmanı',
      'Kan tahlili analizi',
      'Kişiselleştirilmiş diyet planları',
      'AI koçluk desteği',
      '7/24 anlık destek'
    ]
  };

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
            Üyelik <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Yönetimi</span>
          </h1>
          <p className="text-gray-400">Üyelik bilgilerinizi yönetin ve hesap ayarlarınızı güncelleyin</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Membership Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <CreditCard className="h-6 w-6 text-blue-400" />
                <span>Mevcut Üyelik</span>
              </h2>
              
              <div className="text-center mb-6">
                <div className={`w-20 h-20 bg-gradient-to-r ${getMembershipColor(user.membershipPlan)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {getMembershipPlanName(user.membershipPlan)}
                </h3>
                <p className="text-gray-400">Aktif Plan</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Başlangıç:</span>
                  <span className="text-white">
                    {format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'dd MMMM yyyy', { locale: tr })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-gray-400">Bitiş:</span>
                  <span className="text-white">
                    {format(user.membershipExpiry, 'dd MMMM yyyy', { locale: tr })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Durum:</span>
                  <span className="text-green-400 flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Aktif</span>
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-white font-semibold mb-3">Plan Özellikleri:</h4>
                <ul className="space-y-2">
                  {membershipFeatures[user.membershipPlan as keyof typeof membershipFeatures]?.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">Hızlı İşlemler</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105">
                  Planı Yükselt
                </button>
                <button className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-white font-medium transition-colors">
                  Fatura Geçmişi
                </button>
                <button 
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg text-white font-medium transition-colors"
                >
                  Üyeliği Sonlandır
                </button>
              </div>
            </motion.div>
          </div>

          {/* Account Settings */}
          <div className="lg:col-span-2">
            {/* Profile Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <User className="h-6 w-6 text-green-400" />
                <span>Profil Bilgileri</span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Adresi
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Üye ID
                  </label>
                  <input
                    type="text"
                    value={user.id}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kayıt Tarihi
                  </label>
                  <input
                    type="text"
                    value={format(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), 'dd MMMM yyyy', { locale: tr })}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                  />
                </div>
              </div>
            </motion.div>

            {/* Password Change */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Lock className="h-6 w-6 text-yellow-400" />
                <span>Şifre Değiştir</span>
              </h2>
              
              <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mevcut Şifre *
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...register('currentPassword', { required: 'Mevcut şifre gerekli' })}
                      className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Mevcut şifrenizi girin"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Yeni Şifre *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      {...register('newPassword', { 
                        required: 'Yeni şifre gerekli',
                        minLength: { value: 6, message: 'Şifre en az 6 karakter olmalı' }
                      })}
                      className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Yeni şifrenizi girin"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.newPassword.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Yeni Şifre Onayı *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword', { 
                        required: 'Şifre onayı gerekli',
                        validate: value => value === newPassword || 'Şifreler eşleşmiyor'
                      })}
                      className="w-full px-4 py-3 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Yeni şifrenizi tekrar girin"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isChangingPassword ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Güncelleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      <span>Şifreyi Güncelle</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Cancel Membership Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Üyeliği Sonlandır</h3>
                <p className="text-gray-400">
                  Üyeliğinizi iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-400 text-sm">
                  <strong>Not:</strong> Üyeliğiniz mevcut dönem sonunda ({format(user.membershipExpiry, 'dd MMMM yyyy', { locale: tr })}) sona erecek. 
                  Bu tarihe kadar tüm özelliklerden yararlanmaya devam edebilirsiniz.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg text-white font-medium transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleCancelMembership}
                  disabled={isCancelling}
                  className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isCancelling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>İptal Ediliyor...</span>
                    </>
                  ) : (
                    <span>Üyeliği Sonlandır</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MembershipManagePage;