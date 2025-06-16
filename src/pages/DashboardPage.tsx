import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  QrCode, 
  Brain, 
  Utensils, 
  TrendingUp, 
  Calendar, 
  Award,
  Activity,
  Target,
  Clock,
  Crown,
  Settings,
  Download,
  Dumbbell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import { format, differenceInDays } from 'date-fns';
import { tr } from 'date-fns/locale';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    if (user) {
      // Generate QR code with user access token
      const accessData = {
        userId: user.id,
        membershipPlan: user.membershipPlan,
        timestamp: Date.now(),
        expiry: user.membershipExpiry.getTime()
      };
      
      QRCode.toDataURL(JSON.stringify(accessData))
        .then(url => setQrCodeUrl(url))
        .catch(err => console.error(err));
    }
  }, [user]);

  if (!user) return null;

  const daysUntilExpiry = differenceInDays(user.membershipExpiry, new Date());
  const isExpiring = daysUntilExpiry <= 7;

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

  const quickActions = [
    {
      title: 'AI Vücut Analizi',
      description: 'Fotoğraflarınızı yükleyerek kişisel antrenman planı alın',
      icon: Brain,
      link: '/vucut-analizi',
      color: 'from-blue-500 to-cyan-500',
      premium: false
    },
    {
      title: 'AI Beslenme Planı',
      description: 'Kan tahlili ile kişiselleştirilmiş diyet programı',
      icon: Utensils,
      link: '/diyet-plani',
      color: 'from-green-500 to-emerald-500',
      premium: true
    },
    {
      title: 'İlerleme Takibi',
      description: 'Antrenman ve beslenme ilerlemenizi görüntüleyin',
      icon: TrendingUp,
      link: '/ilerleme-takibi',
      color: 'from-purple-500 to-pink-500',
      premium: false
    },
    {
      title: 'Antrenman Programı',
      description: 'Kişiselleştirilmiş egzersiz rutininizi görün',
      icon: Activity,
      link: '/antrenman-programi',
      color: 'from-orange-500 to-red-500',
      premium: false
    }
  ];

  const stats = [
    { label: 'Bu Ay Antrenman', value: '12', icon: Activity, color: 'text-blue-400' },
    { label: 'Hedef Tamamlama', value: '78%', icon: Target, color: 'text-green-400' },
    { label: 'Ortalama Süre', value: '45dk', icon: Clock, color: 'text-purple-400' },
    { label: 'Başarı Puanı', value: '85', icon: Award, color: 'text-yellow-400' }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Hoş geldin, <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{user.name}</span>
          </h1>
          <p className="text-gray-400">Fitness yolculuğuna bugün de devam et!</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Hızlı İşlemler</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className={`group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 ${
                      action.premium && user.membershipPlan === 'basic' ? 'opacity-60' : ''
                    }`}
                  >
                    {action.premium && user.membershipPlan === 'basic' && (
                      <div className="absolute top-4 right-4">
                        <Crown className="h-5 w-5 text-yellow-500" />
                      </div>
                    )}
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.description}</p>
                    {action.premium && user.membershipPlan === 'basic' && (
                      <p className="text-yellow-500 text-xs mt-2 font-medium">Premium özellik</p>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* My AI Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">AI Planlarım</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Workout Plan */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Dumbbell className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Antrenman Programım</h3>
                        <p className="text-gray-400 text-sm">3 günlük split program</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Bu hafta:</span>
                      <span className="text-white">4/6 gün tamamlandı</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to="/antrenman-programi"
                      className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors text-center"
                    >
                      Görüntüle
                    </Link>
                    <button className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors flex items-center space-x-1">
                      <Download className="h-4 w-4" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                {/* Diet Plan */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <Utensils className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">Diyet Programım</h3>
                        <p className="text-gray-400 text-sm">1800 kalori/gün</p>
                      </div>
                    </div>
                    {user.membershipPlan === 'basic' && (
                      <Crown className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  {user.membershipPlan !== 'basic' ? (
                    <>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Günlük hedef:</span>
                          <span className="text-white">1650/1800 kcal</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to="/diyet-plani"
                          className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors text-center"
                        >
                          Görüntüle
                        </Link>
                        <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-400 text-sm mb-3">Premium özellik</p>
                      <Link
                        to="/uyelik-paketleri"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-300"
                      >
                        Planı Yükselt
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">İstatistikler</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-center"
                  >
                    <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">Giriş QR Kodu</h3>
              </div>
              <div className="text-center">
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="w-48 h-48 mx-auto mb-4 rounded-lg border border-gray-600"
                  />
                )}
                <p className="text-gray-400 text-sm">
                  Bu QR kodu spor salonuna giriş için kullanın
                </p>
              </div>
            </motion.div>

            {/* Membership Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Üyelik Bilgilerim</h3>
                <Link
                  to="/uyelik-yonetimi"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Plan:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getMembershipColor(user.membershipPlan)} text-white`}>
                    {getMembershipPlanName(user.membershipPlan)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Bitiş Tarihi:</span>
                  <span className={`text-sm font-medium ${isExpiring ? 'text-red-400' : 'text-white'}`}>
                    {format(user.membershipExpiry, 'dd MMMM yyyy', { locale: tr })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Kalan Süre:</span>
                  <span className={`text-sm font-medium ${isExpiring ? 'text-red-400' : 'text-green-400'}`}>
                    {daysUntilExpiry} gün
                  </span>
                </div>
                {isExpiring && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">
                      Üyeliğiniz yakında sona eriyor. Yenilemeyi unutmayın!
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Son Aktiviteler</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Bugün 45 dk antrenman</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Dün AI vücut analizi</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">3 gün önce diyet planı güncellendi</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;