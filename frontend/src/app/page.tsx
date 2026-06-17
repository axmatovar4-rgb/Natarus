'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { Shield, FileText, Users, ArrowRight, Star } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#1a3a4a]/95 backdrop-blur border-b border-[#2d6a7a]/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#f5a623] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-bold text-white">Natarus</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-white/80 hover:text-white font-medium px-5 py-2 text-sm transition-colors">
              Kirish
            </Link>
            <Link href="/register" className="bg-[#f5a623] hover:bg-[#e09510] text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors">
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 bg-gradient-to-br from-[#1a3a4a] via-[#1e4a5c] to-[#2d6a7a]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/90 text-sm px-4 py-2 rounded-full mb-8 border border-white/20">
            <Star size={14} className="text-[#f5a623] fill-[#f5a623]" />
            O'zbekistondagi zamonaviy notarial xizmat
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Mol-mulkni rasmiy<br />
            <span className="text-[#f5a623]">o'tkazish platformasi</span>
          </h1>
          <p className="text-xl text-[#c5d9e0] mb-10 max-w-2xl mx-auto leading-relaxed">
            Notarius orqali har qanday turdagi mol-mulkni bir shaxsdan ikkinchisiga
            tez, xavfsiz va rasmiy ravishda o'tkazing.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register" className="bg-[#f5a623] hover:bg-[#e09510] text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 text-lg transition-colors">
              Boshlash <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors border border-white/20">
              Kirish
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-[#e8f0f3]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-[#1a3a4a]">500+</p>
              <p className="text-[#2d6a7a] mt-1">Yakunlangan ariza</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#1a3a4a]">50+</p>
              <p className="text-[#2d6a7a] mt-1">Faol notariuslar</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#1a3a4a]">99%</p>
              <p className="text-[#2d6a7a] mt-1">Muvaffaqiyat darajasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-[#f0f4f6]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a3a4a] mb-4">Nima uchun Natarus?</h2>
            <p className="text-[#2d6a7a] text-lg max-w-xl mx-auto">
              Mol-mulk o'tkazish jarayonini to'liq raqamlashtirdik
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield size={28} className="text-[#2d6a7a]" />}
              title="Xavfsiz va rasmiy"
              desc="Barcha jarayonlar notarius nazoratida amalga oshiriladi. Hujjatlar elektron shaklda saqlanadi."
              color="bg-[#e8f0f3]"
            />
            <FeatureCard
              icon={<FileText size={28} className="text-[#f5a623]" />}
              title="Har qanday mulk"
              desc="Ko'chmas mulk, transport vositasi, biznes ulushi va boshqa turdagi mol-mulklarni o'tkazish."
              color="bg-orange-50"
            />
            <FeatureCard
              icon={<Users size={28} className="text-[#0066cc]" />}
              title="Oson jarayon"
              desc="Beruvchi va qabul qiluvchi onlayn tarzda jarayonni kuzatib boradi. Hujjatlarni yuklash imkoni."
              color="bg-blue-50"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1a3a4a] mb-4">Qanday ishlaydi?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Ro\'yxatdan o\'ting', desc: 'Notarius yoki mijoz sifatida hisobingizni yarating' },
              { step: '2', title: 'Ariza yarating', desc: 'Notarius mol-mulk o\'tkazish arizasini to\'ldiradi' },
              { step: '3', title: 'Hujjat yuklang', desc: 'Kerakli hujjatlarni platformaga yuklang' },
              { step: '4', title: 'Tasdiqlang', desc: 'Notarius jarayonni tasdiqlaydi va yakunlaydi' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-[#1a3a4a] text-white rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-[#1a3a4a] mb-2">{item.title}</h3>
                <p className="text-[#2d6a7a] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-[#1a3a4a] to-[#2d6a7a]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Bugun boshlang</h2>
          <p className="text-[#c5d9e0] text-lg mb-8">
            Ro'yxatdan o'ting va mol-mulk o'tkazish jarayonini soddalashtiring
          </p>
          <Link href="/register" className="bg-[#f5a623] hover:bg-[#e09510] text-white font-semibold px-10 py-4 rounded-xl text-lg inline-flex items-center gap-2 transition-colors">
            Bepul ro'yxatdan o'tish <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a3a4a] py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#f5a623] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-white font-semibold">Natarus</span>
          </div>
          <p className="text-[#c5d9e0] text-sm">© 2026 Natarus. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: {
  icon: React.ReactNode; title: string; desc: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8f0f3] hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-5`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#1a3a4a] mb-3">{title}</h3>
      <p className="text-[#2d6a7a] leading-relaxed">{desc}</p>
    </div>
  );
}
