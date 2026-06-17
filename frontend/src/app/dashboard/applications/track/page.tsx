'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Application, STATUS_LABELS, PROPERTY_TYPE_LABELS } from '@/types';
import { Search, ChevronRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

function generateCaptcha() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const ops = ['+', '-', '*'] as const;
  const op = ops[Math.floor(Math.random() * 2)]; // faqat + va -
  const answer = op === '+' ? a + b : a - b;
  return { question: `${a} ${op} ${b}`, answer };
}

export default function TrackApplicationPage() {
  const [appNumber, setAppNumber] = useState('');
  const [password, setPassword] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput('');
  };

  const handleSearch = async () => {
    setError('');

    if (!appNumber.trim()) {
      setError('Ariza raqamini kiriting');
      return;
    }
    if (!password.trim()) {
      setError('Tekshirish uchun parolni kiriting');
      return;
    }
    if (parseInt(captchaInput) !== captcha.answer) {
      setError('Himoya kodi noto\'g\'ri');
      refreshCaptcha();
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/applications/${appNumber.trim()}`);
      setResult(res.data);
      setSearched(true);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Bunday raqamli ariza topilmadi');
      } else {
        setError('Xatolik yuz berdi. Qaytadan urinib ko\'ring');
      }
      setResult(null);
    } finally {
      setLoading(false);
      refreshCaptcha();
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#2d6a7a] mb-6">
        <Link href="/dashboard" className="hover:underline">Bosh sahifa</Link>
        <ChevronRight size={14} />
        <Link href="/dashboard/applications" className="hover:underline">Arizalar</Link>
        <ChevronRight size={14} />
        <span className="text-[#1a3a4a] font-medium">Ariza kuzatish</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-[#1a3a4a] text-center mb-8">
        Arizaning ko'rib chiqilishini kuzatish
      </h1>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-[#e8f0f3] shadow-sm p-8">
        <div className="space-y-5">

          {/* Ariza raqami */}
          <div>
            <label className="label">
              Ariza raqami <span className="text-red-500">*</span>
            </label>
            <input
              value={appNumber}
              onChange={(e) => setAppNumber(e.target.value)}
              className="input"
              placeholder="Ariza raqami (ID)"
            />
            <button className="text-[#0066cc] text-sm mt-1 hover:underline">
              Ariza raqami qayerdan olinadi?
            </button>
          </div>

          {/* Parol */}
          <div>
            <label className="label">
              Arizani tekshirish uchun parol <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Tekshirish uchun parol"
            />
            <button className="text-[#0066cc] text-sm mt-1 hover:underline">
              Tekshirish kodi qayerdan olinadi?
            </button>
          </div>

          {/* Captcha */}
          <div>
            <label className="label">
              Himoya kodi <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              {/* Captcha display */}
              <div className="flex items-center justify-center bg-[#f0f4f6] border border-[#c5d9e0] rounded-lg px-6 py-3 min-w-[120px]">
                <span className="text-3xl font-bold text-[#1a3a4a] tracking-widest select-none">
                  {captcha.question}
                </span>
              </div>
              <input
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="input flex-1"
                placeholder="Arifmetik amal javobini kiriting"
                type="number"
              />
              <button
                type="button"
                onClick={refreshCaptcha}
                className="p-2.5 border border-[#c5d9e0] rounded-lg hover:bg-[#e8f0f3] transition-colors"
                title="Yangilash"
              >
                <RefreshCw size={18} className="text-[#2d6a7a]" />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-[#2d6a7a] hover:bg-[#1a3a4a] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            <Search size={18} />
            {loading ? 'Qidirilmoqda...' : 'Ma\'lumotlarni ko\'rish'}
          </button>
        </div>
      </div>

      {/* Result */}
      {searched && result && (
        <div className="mt-8 bg-white rounded-2xl border border-[#e8f0f3] shadow-sm p-8">
          <h2 className="text-lg font-bold text-[#1a3a4a] mb-6 pb-3 border-b border-[#e8f0f3]">
            Ariza ma'lumotlari
          </h2>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <InfoRow label="Ariza raqami" value={result.id} />
            <InfoRow label="Holat">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full badge-${result.status.toLowerCase()}`}>
                {STATUS_LABELS[result.status]}
              </span>
            </InfoRow>
            <InfoRow label="Sarlavha" value={result.title} />
            <InfoRow label="Mulk turi" value={PROPERTY_TYPE_LABELS[result.propertyType]} />
            <InfoRow label="Beruvchi" value={result.sender?.fullName} />
            <InfoRow label="Qabul qiluvchi" value={result.receiver?.fullName} />
            <InfoRow label="Notarius" value={result.notarius?.fullName} />
            <InfoRow label="Yaratilgan sana" value={format(new Date(result.createdAt), 'dd.MM.yyyy HH:mm')} />
          </div>

          {/* Tarix */}
          {result.history && result.history.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#e8f0f3]">
              <h3 className="font-semibold text-[#1a3a4a] mb-4">Jarayon tarixi</h3>
              <div className="space-y-3">
                {result.history.map((h, i) => (
                  <div key={h.id} className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? 'bg-[#2d6a7a]' : 'bg-[#c5d9e0]'}`} />
                    <div>
                      <p className="text-sm font-medium text-[#1a3a4a]">{STATUS_LABELS[h.status]}</p>
                      {h.comment && <p className="text-xs text-[#2d6a7a]">{h.comment}</p>}
                      <p className="text-xs text-gray-400">{format(new Date(h.createdAt), 'dd.MM.yyyy HH:mm')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-[#e8f0f3]">
            <Link
              href={`/dashboard/applications/${result.id}`}
              className="text-[#0066cc] text-sm hover:underline"
            >
              Batafsil ko'rish →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[#2d6a7a] text-xs mb-1">{label}</p>
      {children ?? <p className="font-medium text-[#1a3a4a]">{value || '—'}</p>}
    </div>
  );
}
