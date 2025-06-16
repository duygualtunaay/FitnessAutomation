import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Loader, ArrowLeft } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import toast from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error('Lütfen e-posta adresinizi girin.');
            return;
        }

        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Şifre sıfırlama e-postası gönderildi. Lütfen gelen kutunuzu kontrol edin.');
            setIsSent(true);
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                toast.error('Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.');
            } else {
                toast.error('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
            }
            console.error("Şifre sıfırlama hatası:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-md w-full"
            >
                <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
                    {isSent ? (
                        <div className="text-center">
                            <Mail className="h-16 w-16 text-green-400 mx-auto mb-6" />
                            <h2 className="text-2xl font-bold text-white mb-4">E-posta Gönderildi</h2>
                            <p className="text-gray-300 mb-6">
                                <strong className="text-white">{email}</strong> adresine şifrenizi sıfırlamanız için bir bağlantı gönderdik. Gelen kutunuzu ve spam klasörünüzü kontrol etmeyi unutmayın.
                            </p>
                            <Link
                                to="/giris"
                                className="w-full inline-flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all"
                            >
                                Giriş Sayfasına Dön
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Şifremi Unuttum</h2>
                                <p className="text-gray-400">Şifre sıfırlama bağlantısı almak için e-posta adresinizi girin.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                        Kayıtlı Email Adresiniz
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                                            placeholder="ornek@email.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader className="h-5 w-5 animate-spin" />
                                            <span>Gönderiliyor...</span>
                                        </>
                                    ) : (
                                        <span>Sıfırlama Bağlantısı Gönder</span>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <Link
                                    to="/giris"
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center justify-center space-x-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    <span>Giriş sayfasına geri dön</span>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;