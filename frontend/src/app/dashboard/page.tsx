'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import { Application, STATUS_LABELS } from '@/types';
import { FileText, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: () => api.get('/applications').then((r) => r.data),
  });

  const stats = {
    total:      applications.length,
    draft:      applications.filter((a) => a.status === 'DRAFT').length,
    inProgress: applications.filter((a) => ['SUBMITTED', 'IN_REVIEW'].includes(a.status)).length,
    completed:  applications.filter((a) => a.status === 'COMPLETED').length,
    rejected:   applications.filter((a) => a.status === 'REJECTED').length,
  };

  const recent = applications.slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1a3a4a]">
          Xush kelibsiz, {user?.fullName}
        </h1>
        <p className="text-[#2d6a7a] mt-1">
          {user?.role === 'NOTARIUS' ? 'Notarius paneli' : 'Mijoz paneli'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Jami arizalar"  value={stats.total}      icon={FileText}      bg="bg-[#e8f0f3]" fg="text-[#2d6a7a]" />
        <StatCard title="Jarayonda"      value={stats.inProgress} icon={Clock}         bg="bg-orange-50"  fg="text-orange-500" />
        <StatCard title="Yakunlangan"    value={stats.completed}  icon={CheckCircle}   bg="bg-teal-50"    fg="text-teal-600" />
        <StatCard title="Rad etilgan"    value={stats.rejected}   icon={AlertCircle}   bg="bg-red-50"     fg="text-red-500" />
      </div>

      {/* Recent */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#1a3a4a]">So'nggi arizalar</h2>
          <Link href="/dashboard/applications" className="text-[#0066cc] hover:underline text-sm">
            Barchasini ko'rish →
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-[#e8f0f3] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="mx-auto text-[#c5d9e0] mb-3" size={48} />
            <p className="text-[#2d6a7a]">Hali arizalar yo'q</p>
            {user?.role === 'NOTARIUS' && (
              <Link href="/dashboard/applications/new" className="btn-primary inline-block mt-4">
                Yangi ariza yaratish
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((app) => (
              <Link
                key={app.id}
                href={`/dashboard/applications/${app.id}`}
                className="flex items-center justify-between p-4 border border-[#e8f0f3] rounded-xl hover:bg-[#f0f4f6] transition-colors"
              >
                <div>
                  <p className="font-medium text-[#1a3a4a]">{app.title}</p>
                  <p className="text-sm text-[#2d6a7a] mt-0.5">
                    {app.sender?.fullName} → {app.receiver?.fullName}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#2d6a7a]">
                    {format(new Date(app.createdAt), 'dd.MM.yyyy')}
                  </span>
                  <StatusBadge status={app.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, bg, fg }: {
  title: string; value: number; icon: any; bg: string; fg: string;
}) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`p-3 rounded-xl ${bg}`}>
        <Icon size={22} className={fg} />
      </div>
      <div>
        <p className="text-2xl font-bold text-[#1a3a4a]">{value}</p>
        <p className="text-sm text-[#2d6a7a]">{title}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full badge-${status.toLowerCase()}`}>
      {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}
    </span>
  );
}
