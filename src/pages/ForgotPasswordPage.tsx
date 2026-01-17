import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { APP_CONFIG } from '../config';
import logo from '../assets/Logo.svg';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const response = await authAPI.forgotPassword(email);
            setMessage({ type: 'success', text: String(response.data.message || '') });
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 gradient-bg-animated"></div>

            {/* Decorative Elements */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-[120px] mix-blend-soft-light animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[120px] mix-blend-soft-light animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-slate-500/10 rounded-full blur-[120px] mix-blend-soft-light animate-blob animation-delay-4000"></div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 animate-fade-in">
                    {/* Header */}
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                                <img src={logo} alt="Logo" className="w-full h-full object-contain transform scale-125" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-black text-white tracking-tight uppercase mb-2">
                            {APP_CONFIG.NAME.split(' ')[0]}
                            <span className="text-indigo-400"> {APP_CONFIG.NAME.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <h2 className="text-xl font-bold text-indigo-100/90 mb-2">
                            Lupa Kata Sandi?
                        </h2>
                        <p className="text-lg text-white/80">
                            Masukkan email Anda untuk menerima instruksi reset
                        </p>
                    </div>

                    {/* Card */}
                    <div className="glass-card p-8 animate-slide-in-up">
                        {message ? (
                            <div className="text-center animate-scale-in">
                                <div className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-100 border border-emerald-500/20' : 'bg-red-500/10 text-red-100 border border-red-500/20'}`}>
                                    {message.type === 'success' && <FiCheckCircle className="w-10 h-10 mx-auto mb-3 text-emerald-400" />}
                                    <p className="font-semibold">{message.text}</p>
                                </div>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center text-indigo-300 hover:text-white transition-colors font-bold"
                                >
                                    <FiArrowLeft className="mr-2" /> Kembali ke Login
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiMail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="input-modern pl-10 text-gray-900"
                                            placeholder="nama@email.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-modern btn-gradient-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="spinner-modern h-5 w-5 mr-3"></div>
                                            Memproses...
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <span>Kirim Instruksi Reset</span>
                                        </div>
                                    )}
                                </button>

                                <div className="text-center">
                                    <Link
                                        to="/login"
                                        className="text-sm font-semibold text-indigo-300 hover:text-emerald-400 transition-colors duration-200"
                                    >
                                        Kembali ke Login
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-sm text-white/60">
                            © 2026 {APP_CONFIG.NAME}. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
            `}</style>
        </div>
    );
};

export default ForgotPasswordPage;
