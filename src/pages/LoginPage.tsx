import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { APP_CONFIG } from '../config';
import logo from '../assets/Logo.svg';

type LoginFormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      setIsLoading(true);
      await login({ email: data.email, password: data.password });
    } catch (err: any) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
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
              <div className="h-10 w-10 flex items-center justify-center overflow-hidden">
                <img src={logo} alt="Logo" className="w-full h-full object-contain transform scale-125" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase mb-2">
              {APP_CONFIG.NAME.split(' ')[0]}
              <span className="text-indigo-400"> {APP_CONFIG.NAME.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-lg text-white/80">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Login Card */}
          <div className="glass-card p-8 animate-slide-in-up">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-100 px-4 py-3 rounded-xl animate-scale-in">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    {...register('email', {
                      required: 'Email harus diisi',
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: 'Format email tidak valid'
                      }
                    })}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="input-modern pl-10"
                    placeholder="nama@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-300 animate-slide-in-up">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    {...register('password', {
                      required: 'Kata sandi harus diisi',
                      minLength: {
                        value: 6,
                        message: 'Kata sandi minimal 6 karakter'
                      }
                    })}
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="input-modern pl-10"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-300 animate-slide-in-up">{errors.password.message}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-indigo-300 hover:text-emerald-400 transition-colors duration-200"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <div>
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
                      <span>Masuk</span>
                      <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </form>

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

export default LoginPage;
