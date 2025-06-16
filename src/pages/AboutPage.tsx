import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Users, 
  Brain, 
  Shield, 
  Award, 
  Zap,
  Heart,
  TrendingUp,
  Globe,
  CheckCircle,
  MapPin
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Brain,
      title: 'Yapay Zeka Liderliği',
      description: 'Fitness sektöründe AI teknolojilerini öncülük ederek kullanıyoruz',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Kullanıcı Odaklı',
      description: 'Her bireyin benzersiz ihtiyaçlarına odaklanarak kişiselleştirilmiş çözümler sunuyoruz',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Güvenlik ve Gizlilik',
      description: 'Verilerinizin güvenliği bizim için en önemli önceliktir',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'Sonuç Odaklı',
      description: 'Ölçülebilir sonuçlar elde etmenizi sağlayan etkili çözümler geliştiriyoruz',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Mutlu Kullanıcı', icon: Users },
    { number: '1,000+', label: 'Partner Spor Salonu', icon: Award },
    { number: '99.9%', label: 'Uptime Garantisi', icon: Shield },
    { number: '24/7', label: 'Destek Hizmeti', icon: Heart }
  ];

  const features = [
    'AI destekli vücut analizi ve kişiselleştirilmiş antrenman planları',
    'e-Nabız kan tahlili analizi ile beslenme önerileri',
    'QR kod tabanlı güvenli giriş sistemi',
    'Gerçek zamanlı ilerleme takibi',
    'Multi-tenant SaaS mimarisi',
    'Mobil-first responsive tasarım'
  ];

  const team = [
    {
      name: 'Dr. Ahmet Kaya',
      role: 'CTO & AI Uzmanı',
      description: 'Makine öğrenmesi ve sağlık teknolojileri alanında 15+ yıl deneyim'
    },
    {
      name: 'Elif Demir',
      role: 'Ürün Geliştirme Direktörü',
      description: 'Fitness ve sağlık sektöründe 12+ yıl ürün yönetimi deneyimi'
    },
    {
      name: 'Mehmet Özkan',
      role: 'Baş Mimar',
      description: 'Bulut teknolojileri ve ölçeklenebilir sistemler uzmanı'
    }
  ];

  // Istanbul coordinates for the map
  const istanbulPosition: [number, number] = [41.0082, 28.9784];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Hakkımızda
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Fitness Hub, yapay zeka teknolojilerini kullanarak spor salonları ve 
              üyeleri için yeni nesil bir platform sunuyor. Amacımız, herkesi 
              kişiselleştirilmiş fitness yolculuğunda desteklemek.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">Misyonumuz</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Yapay zeka ve modern teknolojilerin gücüyle, fitness sektörünü 
                dönüştürmek ve herkesi sağlıklı yaşam tarzına ulaştırmak. 
                Kişiselleştirilmiş çözümlerle bireylerin hedeflerine 
                ulaşmasını sağlamak ve spor salonlarının operasyonel 
                verimliliğini artırmak.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-6">Vizyonumuz</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Fitness ve sağlık alanında küresel bir teknoloji lideri olmak. 
                AI destekli çözümlerimizle dünya çapında milyonlarca insanın 
                yaşam kalitesini artırmak ve fitness sektörünün dijital 
                dönüşümünde öncü rol oynamak.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Bu değerler, her yaptığımız işte bizi yönlendiren temel ilkelerdir
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 text-center hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Rakamlarla <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Fitness Hub</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-10 w-10 text-white" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Teknoloji <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Altyapımız</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Modern web teknolojileri ve yapay zeka algoritmaları kullanarak 
                ölçeklenebilir, güvenli ve kullanıcı dostu bir platform geliştirdik.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">AI Analiz</h3>
                  <p className="text-gray-400 text-sm">Gelişmiş makine öğrenmesi algoritmaları</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Hızlı İşlem</h3>
                  <p className="text-gray-400 text-sm">Milisaniye cinsinden yanıt süreleri</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Güvenlik</h3>
                  <p className="text-gray-400 text-sm">End-to-end şifreleme ve KVKK uyumluluğu</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Ölçeklenebilir</h3>
                  <p className="text-gray-400 text-sm">Milyonlarca kullanıcıya hizmet verebilir</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Location Map */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Lokasyonumuz
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              İstanbul'un kalbinde, teknoloji ve inovasyonun merkezi Maslak'ta yer alıyoruz
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Merkez Ofisimiz</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Adres</h4>
                  <p className="text-gray-300">
                    Maslak Mahallesi, Teknoloji Caddesi No:42<br />
                    Sarıyer, İstanbul 34485<br />
                    Türkiye
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">İletişim</h4>
                  <p className="text-gray-300">
                    Telefon: +90 212 555 0123<br />
                    Email: info@fitnesshub.com
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Çalışma Saatleri</h4>
                  <p className="text-gray-300">
                    Pazartesi - Cuma: 09:00 - 18:00<br />
                    Hafta sonu: 10:00 - 16:00
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Ulaşım</h4>
                  <p className="text-gray-300">
                    Metro: 4. Levent - M2 Hattı<br />
                    Otobüs: Maslak durağı<br />
                    Ücretsiz otopark mevcuttur
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-2 overflow-hidden"
            >
              <div className="h-96 rounded-xl overflow-hidden">
                <MapContainer
                  center={istanbulPosition}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-xl"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={istanbulPosition}>
                    <Popup>
                      <div className="text-center">
                        <strong>Fitness Hub Merkez Ofis</strong><br />
                        Maslak Mahallesi, Teknoloji Caddesi No:42<br />
                        Sarıyer, İstanbul
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ekibimiz
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Alanında uzman, tutkulu ve yenilikçi ekibimizle geleceği şekillendiriyoruz
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 text-center hover:border-gray-600 transition-all duration-300"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-blue-400 font-medium mb-4">{member.role}</p>
                <p className="text-gray-400 leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bizimle İletişime Geçin
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Sorularınız mı var? Projelerinizde işbirliği yapmak mı istiyorsunuz? 
              Ekibimiz sizinle konuşmak için sabırsızlanıyor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/iletisim"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <span>İletişime Geç</span>
              </a>
              <a
                href="/uyelik-paketleri"
                className="inline-flex items-center space-x-2 border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
              >
                <span>Paketleri İncele</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;