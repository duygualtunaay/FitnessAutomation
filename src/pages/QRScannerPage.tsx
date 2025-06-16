import React, { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Camera, Scan } from 'lucide-react';

interface ScanResult {
  success: boolean;
  memberName?: string;
  membershipPlan?: string;
  message: string;
}

const QRScannerPage: React.FC = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  const startScanning = () => {
    setIsScanning(true);
    setScanResult(null);

    const scanner = new Html5QrcodeScanner(
      'qr-reader',
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        // Process the scanned QR code
        try {
          const data = JSON.parse(decodedText);
          
          // Validate the QR code data
          if (data.userId && data.membershipPlan && data.expiry) {
            const now = Date.now();
            const expiryTime = data.expiry;
            
            if (now > expiryTime) {
              setScanResult({
                success: false,
                message: 'Üyelik süresi dolmuş! Lütfen üyeliğinizi yenileyin.'
              });
            } else {
              // Mock member data lookup
              const memberNames = {
                '1': 'Fitness Admin',
                '2': 'Ahmet Yılmaz'
              };
              
              const planNames = {
                'basic': 'Temel',
                'premium': 'Premium',
                'ai-plus': 'AI Plus'
              };

              setScanResult({
                success: true,
                memberName: memberNames[data.userId as keyof typeof memberNames] || 'Bilinmeyen Üye',
                membershipPlan: planNames[data.membershipPlan as keyof typeof planNames] || data.membershipPlan,
                message: 'Giriş başarılı! Hoş geldiniz.'
              });
            }
          } else {
            setScanResult({
              success: false,
              message: 'Geçersiz QR kod formatı!'
            });
          }
        } catch (error) {
          setScanResult({
            success: false,
            message: 'QR kod okunamadı! Lütfen tekrar deneyin.'
          });
        }
        
        // Stop scanning after successful read
        scanner.clear();
        setIsScanning(false);
      },
      (error) => {
        console.warn('QR Code scanning error:', error);
      }
    );
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const resetScanner = () => {
    setScanResult(null);
    stopScanning();
  };

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
            QR Kod <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Tarayıcı</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Üye giriş QR kodunu tarayarak erişim kontrolü yapın
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {!scanResult ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8"
            >
              {!isScanning ? (
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Camera className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">QR Kod Taramaya Başla</h2>
                  <p className="text-gray-400 mb-8">
                    Üyenin QR kodunu kamera ile tarayarak giriş kontrolü yapın
                  </p>
                  <button
                    onClick={startScanning}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                  >
                    <Scan className="h-6 w-6" />
                    <span>Taramaya Başla</span>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">QR Kod Taranıyor...</h2>
                    <button
                      onClick={stopScanning}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                    >
                      Durdur
                    </button>
                  </div>
                  <div 
                    id="qr-reader" 
                    className="rounded-lg overflow-hidden border border-gray-600"
                  ></div>
                  <p className="text-gray-400 text-center mt-4">
                    QR kodu kamera önüne getirin
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`bg-gray-800/50 backdrop-blur-sm border rounded-2xl p-8 text-center ${
                scanResult.success ? 'border-green-500/50' : 'border-red-500/50'
              }`}
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                scanResult.success 
                  ? 'bg-green-500/20 border-2 border-green-500' 
                  : 'bg-red-500/20 border-2 border-red-500'
              }`}>
                {scanResult.success ? (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500" />
                )}
              </div>

              <h2 className={`text-3xl font-bold mb-4 ${
                scanResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {scanResult.success ? 'GİRİŞ BAŞARILI' : 'GİRİŞ REDDEDİLDİ'}
              </h2>

              {scanResult.success && scanResult.memberName && (
                <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                  <p className="text-white text-xl font-semibold mb-2">
                    {scanResult.memberName}
                  </p>
                  <p className="text-gray-400">
                    Üyelik: {scanResult.membershipPlan}
                  </p>
                </div>
              )}

              <p className={`text-lg mb-8 ${
                scanResult.success ? 'text-green-300' : 'text-red-300'
              }`}>
                {scanResult.message}
              </p>

              <button
                onClick={resetScanner}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Yeni Tarama Yap
              </button>
            </motion.div>
          )}
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Kullanım Talimatları:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <div className="space-y-2">
              <p className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <span>Taramaya Başla butonuna tıklayın</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <span>Kamera erişimi izni verin</span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <span>QR kodu kamera önüne getirin</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">4</span>
                <span>Otomatik tarama sonucunu bekleyin</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QRScannerPage;