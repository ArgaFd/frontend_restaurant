import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiLock, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { APP_CONFIG } from '../config';
import logo from '../assets/Logo.svg';

const ResetPasswordPage: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok.' });
            return;
        }

        setIsLoading(true);
        setStatus(null);

        try {
            await authAPI.resetPassword({ token: token!, password });
            setStatus({ type: 'success', text: 'Kata sandi berhasil diperbarui!' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error: any) {
            setStatus({
                type: 'error',
                text: error.response?.data?.message || 'Tautan reset tidak valid atau kedaluwarsa.'
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
                        <p className="text-lg text-white/80">
                            Masukkan kata sandi baru untuk akun Anda
                        </p>
                    </div>

                    {/* Card */}
                    <div className="glass-card p-8 animate-slide-in-up">
                        {status?.type === 'success' ? (
                            <div className="text-center animate-scale-in">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30">
                                    <FiCheckCircle className="w-10 h-10" />
                                </div>
                                <p className="text-emerald-400 font-black text-xl mb-2">Berhasil!</p>
                                <p className="text-indigo-100 font-medium mb-6">Mengarahkan Anda ke laman login...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {status?.type === 'error' && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-100 text-sm font-semibold text-center animate-shake">
                                        {status.text}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-white mb-2">
                                            Kata Sandi Baru
                                        </label>
                                        <div className="relative group">
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                minLength={6}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="input-modern pl-12 pr-12 text-gray-900"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-white mb-2">
                                            Konfirmasi Kata Sandi
                                        </label>
                                        <div className="relative group">
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                minLength={6}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="input-modern pl-12 pr-12 text-gray-900"
                                                placeholder="••••••••"
                                            />
                                        </div>
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
                                            <span>Simpan Kata Sandi</span>
                                        </div>
                                    )}
                                </button>

                                <div className="text-center">
                                    <Link
                                        to="/login"
                                        className="text-sm font-semibold text-indigo-300 hover:text-emerald-400 transition-colors duration-200"
                                    >
                                        Batal & Kembali
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
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake { animation: shake 0.5s ease-in-out; }
            `}</style>
        </div>
    );
};

export default ResetPasswordPage;
