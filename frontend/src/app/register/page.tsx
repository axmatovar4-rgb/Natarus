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

const registerSchema = z.object({
  fullName: z.string().min(3, 'Ism kamida 3 ta belgi'),
  email: z.string().email('To\'g\'ri email kiriting'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Parol kamida 6 ta belgi'),
  role: z.enum(['NOTARIUS', 'CLIENT']),
});

type RegisterForm = z.infer<typeof registerSchema>;

const features = [
  { icon: Shield,       text: 'Xavfsiz notarial jarayon',         color: 'bg-[#f5a623]' },
  { icon: Home,         text: 'Ko\'chmas mulk o\'tkazish',        color: 'bg-[#2d6a7a]' },
  { icon: FileText,     text: 'Elektron hujjatlar boshqaruvi',    color: 'bg-[#0066cc]' },
  { icon: Users,        text: 'Beruvchi va qabul qiluvchi tizimi', color: 'bg-emerald-500' },
  { icon: Clock,        text: 'Jarayon holatini kuzatib boring',  color: 'bg-purple-500' },
  { icon: CheckCircle,  text: 'Tez va rasmiy tasdiqlash',         color: 'bg-[#f5a623]' },
];

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'CLIENT' },
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', data);
      setAuth(res.data.user, res.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=900&q=80"
          alt="Ko'chmas mulk"
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
              Birinchi qadamni<br />
              <span className="text-[#f5a623]">boshlang</span>
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
            <h1 className="text-2xl font-bold text-[#1a3a4a]">Ro'yxatdan o'tish</h1>
            <p className="text-[#2d6a7a] mt-1">Yangi hisob yarating</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">To'liq ism</label>
              <input {...register('fullName')} className="input" placeholder="Alisher Rahimov" />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input {...register('email')} type="email" className="input" placeholder="example@mail.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Telefon (ixtiyoriy)</label>
              <input {...register('phone')} className="input" placeholder="+998 90 123 45 67" />
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
            <div>
              <label className="label">Rol</label>
              <select {...register('role')} className="input">
                <option value="CLIENT">Mijoz</option>
                <option value="NOTARIUS">Notarius</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base disabled:opacity-60">
              {loading ? 'Yuklanmoqda...' : 'Ro\'yxatdan o\'tish'}
            </button>
          </form>

          <p className="text-center text-sm text-[#2d6a7a] mt-6">
            Hisobingiz bormi?{' '}
            <Link href="/login" className="text-[#0066cc] hover:underline font-medium">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
