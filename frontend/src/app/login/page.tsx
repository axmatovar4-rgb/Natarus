'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { Shield, FileText, Users, Clock, CheckCircle, Home, Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('To\'g\'ri email kiriting'),
  password: z.string().min(6, 'Parol kamida 6 ta belgi'),
});

type LoginForm = z.infer<typeof loginSchema>;

const features = [
  { icon: Shield,       text: 'Xavfsiz notarial jarayon',          color: 'bg-[#f5a623]' },
  { icon: Home,         text: 'Ko\'chmas mulk o\'tkazish',         color: 'bg-[#2d6a7a]' },
  { icon: FileText,     text: 'Elektron hujjatlar boshqaruvi',     color: 'bg-[#0066cc]' },
  { icon: Users,        text: 'Beruvchi va qabul qiluvchi tizimi', color: 'bg-emerald-500' },
  { icon: Clock,        text: 'Jarayon holatini kuzatib boring',   color: 'bg-purple-500' },
  { icon: CheckCircle,  text: 'Tez va rasmiy tasdiqlash',          color: 'bg-[#f5a623]' },
];

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', data);
      setAuth(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Email yoki parol noto\'g\'ri';
      setError(Array.isArray(msg) ? msg.join(', ') : msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80"
          alt="Mol-mulk"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a4a]/90 to-[#2d6a7a]/75" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#f5a623] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-white font-bold text-xl">Natarus</span>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
              Mol-mulk o'tkazish<br />
              <span className="text-[#f5a623]">tez va xavfsiz</span>
            </h2>
            <p className="text-white/70 text-base mb-8">
              Platformamiz sizga quyidagi imkoniyatlarni beradi:
            </p>

            {/* Scrolling feature badges */}
            <div className="overflow-hidden h-48 relative">
              <div className="animate-scroll-up flex flex-col gap-3">
                {[...features, ...features].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-3"
                  >
                    <div className={`w-8 h-8 ${f.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <f.icon size={16} className="text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-white/40 text-sm">© 2026 Natarus</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#f0f4f6]">
        <div className="bg-white rounded-2xl shadow-sm border border-[#e8f0f3] w-full max-w-md p-8 relative z-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1a3a4a]">Xush kelibsiz</h1>
            <p className="text-[#2d6a7a] mt-1">Hisobingizga kiring</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input {...register('email')} type="email" className="input" placeholder="example@mail.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Parol</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2d6a7a] hover:text-[#1a3a4a]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-200 flex items-center gap-2">
                <span className="text-red-500">⚠</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Kirish...
                </span>
              ) : 'Kirish'}
            </button>
          </form>

          <p className="text-center text-sm text-[#2d6a7a] mt-6">
            Hisobingiz yo'qmi?{' '}
            <Link href="/register" className="text-[#0066cc] hover:underline font-medium">
              Ro'yxatdan o'ting
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
