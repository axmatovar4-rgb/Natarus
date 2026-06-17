'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { PROPERTY_TYPE_LABELS } from '@/types';
import { ArrowLeft, Save, Info } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
  title:              z.string().min(3, 'Sarlavha kamida 3 ta belgi'),
  description:        z.string().optional(),
  propertyType:       z.enum(['REAL_ESTATE', 'VEHICLE', 'BUSINESS', 'INTELLECTUAL', 'OTHER']),
  receiverName:       z.string().min(2, 'Qabul qiluvchi ismini kiriting'),
  applicationCode:    z.string().min(1, 'Ariza raqamini kiriting'),
  accessPassword:     z.string().min(3, 'Tekshirish parolini kiriting'),
  propertyName:       z.string().min(2, 'Mulk nomini kiriting'),
  propertyDescription:z.string().optional(),
  propertyAddress:    z.string().optional(),
  cadastralNumber:    z.string().optional(),
  estimatedValue:     z.number().positive().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewApplicationPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { propertyType: 'REAL_ESTATE' },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/applications', data),
    onSuccess: (res) => router.push(`/dashboard/applications/${res.data.id}`),
    onError: (err: any) => {
      setServerError(err.response?.data?.message || 'Xatolik yuz berdi');
    },
  });

  const onSubmit = (data: FormData) => {
    setServerError('');
    mutation.mutate(data);
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/applications" className="btn-secondary flex items-center gap-2">
          <ArrowLeft size={16} /> Orqaga
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a4a]">Yangi ariza</h1>
          <p className="text-[#2d6a7a] text-sm mt-0.5">Mol-mulk o'tkazish arizasini to'ldiring</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Ariza ma'lumotlari */}
        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-[#1a3a4a] pb-2 border-b border-[#e8f0f3]">
            Ariza ma'lumotlari
          </h2>

          <div>
            <label className="label">Sarlavha *</label>
            <input {...register('title')} className="input" placeholder="Masalan: Kvartira o'tkazish" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="label">Izoh (ixtiyoriy)</label>
            <textarea {...register('description')} className="input" rows={2} placeholder="Qo'shimcha ma'lumot..." />
          </div>

          <div>
            <label className="label">Mulk turi *</label>
            <select {...register('propertyType')} className="input">
              {Object.entries(PROPERTY_TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ariza raqami va tekshirish paroli */}
        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-[#1a3a4a] pb-2 border-b border-[#e8f0f3]">
            Ariza raqami va tekshirish
          </h2>

          <div className="bg-[#e8f0f3] rounded-xl px-4 py-3 flex gap-2 text-sm text-[#1a3a4a]">
            <Info size={16} className="text-[#2d6a7a] flex-shrink-0 mt-0.5" />
            <span>Ariza raqami va tekshirish parolini o'zingiz belgilaysiz. Bu ma'lumotlar orqali ariza holatini kuzatib borasiz.</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Ariza raqami *</label>
              <input
                {...register('applicationCode')}
                className="input"
                placeholder="Masalan: ARZ-2026-001"
              />
              {errors.applicationCode && <p className="text-red-500 text-xs mt-1">{errors.applicationCode.message}</p>}
            </div>
            <div>
              <label className="label">Tekshirish paroli *</label>
              <input
                {...register('accessPassword')}
                className="input"
                placeholder="Masalan: 1234"
                type="text"
              />
              {errors.accessPassword && <p className="text-red-500 text-xs mt-1">{errors.accessPassword.message}</p>}
            </div>
          </div>
        </div>

        {/* Tomonlar */}
        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-[#1a3a4a] pb-2 border-b border-[#e8f0f3]">
            Tomonlar
          </h2>

          {/* Beruvchi — o'zi */}
          <div>
            <label className="label">Beruvchi (siz)</label>
            <div className="bg-[#e8f0f3] rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2d6a7a] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.fullName?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a3a4a]">{user?.fullName}</p>
                <p className="text-xs text-[#2d6a7a]">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Qabul qiluvchi — ism yozish */}
          <div>
            <label className="label">Qabul qiluvchi ismi *</label>
            <input
              {...register('receiverName')}
              className="input"
              placeholder="Qabul qiluvchining to'liq ismi"
            />
            {errors.receiverName && <p className="text-red-500 text-xs mt-1">{errors.receiverName.message}</p>}
          </div>
        </div>

        {/* Mulk ma'lumotlari */}
        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-[#1a3a4a] pb-2 border-b border-[#e8f0f3]">
            Mulk ma'lumotlari
          </h2>

          <div>
            <label className="label">Mulk nomi *</label>
            <input {...register('propertyName')} className="input" placeholder="Masalan: 3 xonali kvartira" />
            {errors.propertyName && <p className="text-red-500 text-xs mt-1">{errors.propertyName.message}</p>}
          </div>

          <div>
            <label className="label">Manzil</label>
            <input {...register('propertyAddress')} className="input" placeholder="Toshkent sh., Yunusobod t., ..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Kadastr raqami</label>
              <input {...register('cadastralNumber')} className="input" placeholder="XX-XX-XXXXXXX" />
            </div>
            <div>
              <label className="label">Taxminiy qiymat (so'm)</label>
              <input
                {...register('estimatedValue', { valueAsNumber: true })}
                type="number"
                className="input"
                placeholder="500000000"
              />
            </div>
          </div>

          <div>
            <label className="label">Mulk tavsifi</label>
            <textarea {...register('propertyDescription')} className="input" rows={2} placeholder="Qo'shimcha ma'lumot..." />
          </div>
        </div>

        {serverError && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
            ⚠ {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn-primary flex items-center gap-2 py-3 px-8 disabled:opacity-60 text-base"
        >
          <Save size={18} />
          {mutation.isPending ? 'Saqlanmoqda...' : 'Ariza yuborish'}
        </button>
      </form>
    </div>
  );
}
