import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Users,
  Headphones
} from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'info@fitnesshub.com',
      description: 'Genel sorularınız için',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Telefon',
      details: '+90 212 555 0123',
      description: 'Acil durumlar için',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPin,
      title: 'Adres',
      details: 'Maslak Mahallesi, Teknoloji Caddesi No:42',
      description: 'İstanbul, Türkiye',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      details: 'Pazartesi - Cuma: 09:00 - 18:00',
      description: 'Hafta sonu: 10:00 - 16:00',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Canlı Destek',
      description: 'Anında yardım alın',
      action: 'Sohbet Başlat',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Topluluk Forumu',
      description: 'Diğer kullanıcılarla etkileşim',
      action: 'Foruma Git',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Headphones,
      title: 'Teknik Destek',
      description: 'Uzman ekibimizden yardım',
      action: 'Destek Talebi',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const subjects = [
    'Genel Bilgi',
    'Teknik Destek',
    'Faturalama',
    'Özellik Talebi',
    'İş Birliği',
    'Diğer'
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
              İletişim
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Sorularınız, önerileriniz veya destek talepleriniz için bizimle iletişime geçin. 
            Ekibimiz size yardımcı olmak için burada.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Mesaj Gönder</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="Adınızı girin"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Adresi *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="email@ornek.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Konu *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all duration-200"
                  >
                    <option value="">Konu seçin</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 resize-none"
                    placeholder="Mesajınızı buraya yazın..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Gönderiliyor...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Mesaj Gönder</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Contact Info & Support */}
          <div className="space-y-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">İletişim Bilgileri</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <info.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{info.title}</h4>
                      <p className="text-gray-300 text-sm mb-1">{info.details}</p>
                      <p className="text-gray-400 text-xs">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Support Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-6">Destek Seçenekleri</h3>
              <div className="space-y-4">
                {supportOptions.map((option, index) => (
                  <div
                    key={index}
                    className="group bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600 hover:border-gray-500 rounded-xl p-4 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-8 h-8 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center`}>
                        <option.icon className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="text-white font-semibold">{option.title}</h4>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{option.description}</p>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                      {option.action} →
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">💡 Hızlı İpuçları</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <p>• Teknik sorunlar için lütfen hata mesajını ve tarayıcı bilgilerinizi paylaşın</p>
                <p>• Faturalama konularında hesap bilgilerinizi belirtin</p>
                <p>• Özellik talepleri için detaylı açıklama yapın</p>
                <p>• Acil durumlar için telefon numaramızı arayın</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Sık Sorulan Sorular
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: 'Destek ekibiniz ne kadar sürede yanıt veriyor?',
                answer: 'Genellikle 24 saat içinde yanıt veriyoruz. Acil durumlar için telefon desteği mevcuttur.'
              },
              {
                question: 'Teknik sorunları nasıl raporlayabilirim?',
                answer: 'İletişim formunu kullanarak veya doğrudan teknik destek e-postamıza yazarak raporlayabilirsiniz.'
              },
              {
                question: 'Özellik taleplerim nasıl değerlendirilir?',
                answer: 'Tüm özellik talepleri ürün ekibimiz tarafından değerlendirilir ve yol haritamıza eklenir.'
              },
              {
                question: 'İş birliği tekliflerim kimle paylaşmalıyım?',
                answer: 'İş birliği tekliflerinizi iletişim formunda "İş Birliği" konusunu seçerek gönderebilirsiniz.'
              }
            ].map((faq, index) => (
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
      </div>
    </div>
  );
};

export default ContactPage;