import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Temel',
      price: '₺49',
      period: '/ay',
      description: 'Başlangıç seviyesi için temel özellikler',
      features: [
        'QR kod ile giriş',
        'Temel ilerleme takibi',
        'Mobil uygulama',
        'Email destek',
        'Temel raporlar'
      ],
      color: 'from-green-500 to-emerald-500',
      popular: false,
      cta: 'Temel Planı Seç'
    },
    {
      name: 'Premium',
      price: '₺99',
      period: '/ay',
      description: 'Gelişmiş fitness takibi ve AI özellikleri',
      features: [
        'Tüm Temel plan özellikleri',
        'AI vücut analizi',
        'Kişiselleştirilmiş antrenman planları',
        'Detaylı performans analizi',
        'Öncelikli destek',
        'Gelişmiş raporlama',
        'Beslenme takibi'
      ],
      color: 'from-blue-500 to-purple-500',
      popular: true,
      cta: 'Premium Planı Seç'
    },
    {
      name: 'AI Plus',
      price: '₺149',
      period: '/ay',
      description: 'Tam AI destekli fitness deneyimi',
      features: [
        'Tüm Premium plan özellikleri',
        'AI beslenme uzmanı',
        'Kan tahlili analizi',
        'Kişiselleştirilmiş diyet planları',
        'AI koçluk desteği',
        '7/24 anlık destek',
        'Özel antrenör danışmanlığı',
        'Sağlık entegrasyonu'
      ],
      color: 'from-purple-500 to-pink-500',
      popular: false,
      cta: 'AI Plus Planı Seç'
    }
  ];

  const faqs = [
    {
      question: 'Üyelik iptali nasıl yapılır?',
      answer: 'Üyeliğinizi istediğiniz zaman dashboard üzerinden iptal edebilirsiniz. İptal işlemi mevcut dönemin sonunda etkili olur.'
    },
    {
      question: 'AI analiz ne kadar sürer?',
      answer: 'Vücut analizi genellikle 2-3 dakika, kan tahlili analizi ise 5-10 dakika sürmektedir.'
    },
    {
      question: 'Verilerim güvende mi?',
      answer: 'Evet, tüm verileriniz SSL şifreleme ile korunur ve KVKK\'ya uygun şekilde saklanır.'
    },
    {
      question: 'Ücretsiz deneme var mı?',
      answer: 'Evet, tüm planlar için 7 günlük ücretsiz deneme sunuyoruz. Kredi kartı bilgisi gerektirmez.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Üyelik Paketleri
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Size en uygun planı seçin ve fitness yolculuğunuza başlayın. 
            Tüm planlar 7 günlük ücretsiz deneme ile birlikte gelir.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-8 ${
                plan.popular 
                  ? 'border-blue-500 ring-2 ring-blue-500/20 transform scale-105' 
                  : 'border-gray-700 hover:border-gray-600'
              } transition-all duration-300 hover:transform hover:scale-105`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 rounded-full text-white text-sm font-semibold flex items-center space-x-1">
                    <Crown className="h-4 w-4" />
                    <span>En Popüler</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <div className={`w-5 h-5 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Check className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/kayit"
                className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-center block`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Özellik Karşılaştırması
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-400">Özellik</th>
                  <th className="text-center py-4 px-4 text-gray-400">Temel</th>
                  <th className="text-center py-4 px-4 text-gray-400">Premium</th>
                  <th className="text-center py-4 px-4 text-gray-400">AI Plus</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4">QR Kod Giriş</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4">AI Vücut Analizi</td>
                  <td className="text-center py-4 px-4 text-gray-500">—</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4">AI Beslenme Uzmanı</td>
                  <td className="text-center py-4 px-4 text-gray-500">—</td>
                  <td className="text-center py-4 px-4 text-gray-500">—</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4">Kan Tahlili Analizi</td>
                  <td className="text-center py-4 px-4 text-gray-500">—</td>
                  <td className="text-center py-4 px-4 text-gray-500">—</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4">7/24 Destek</td>
                  <td className="text-center py-4 px-4 text-gray-500">—</td>
                  <td className="text-center py-4 px-4 text-gray-500">—</td>
                  <td className="text-center py-4 px-4"><Check className="h-5 w-5 text-green-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Security & Trust */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Güvenli Ödeme</h3>
              <p className="text-gray-400">SSL şifreleme ile korunan güvenli ödeme sistemi</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Anında Aktivasyon</h3>
              <p className="text-gray-400">Ödeme sonrası anında hesabınız aktif olur</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Destek</h3>
              <p className="text-gray-400">Uzman ekibimizden 7/24 destek alın</p>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Sıkça Sorulan Sorular
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Fitness yolculuğunuza bugün başlayın
          </h2>
          <p className="text-gray-400 mb-8">
            7 günlük ücretsiz deneme ile risk almadan keşfedin
          </p>
          <Link
            to="/kayit"
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Ücretsiz Denemeyi Başlat
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;