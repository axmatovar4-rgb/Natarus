'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { Application, STATUS_LABELS, PROPERTY_TYPE_LABELS } from '@/types';
import { Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

export default function ApplicationsPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: () => api.get('/applications').then((r) => r.data),
  });

  const filtered = applications.filter((app) => {
    const matchSearch =
      app.title.toLowerCase().includes(search.toLowerCase()) ||
      app.sender?.fullName.toLowerCase().includes(search.toLowerCase()) ||
      app.receiver?.fullName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || app.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a4a]">Arizalar</h1>
          <p className="text-[#2d6a7a] mt-1">{applications.length} ta ariza</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2d6a7a]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
            placeholder="Qidirish..."
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#2d6a7a]" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input w-auto"
          >
            <option value="ALL">Barchasi</option>
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-[#e8f0f3] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[#2d6a7a] text-lg">Arizalar topilmadi</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#f0f4f6] border-b border-[#e8f0f3]">
              <tr>
                <th className="text-left text-xs font-semibold text-[#2d6a7a] uppercase px-6 py-4">Sarlavha</th>
                <th className="text-left text-xs font-semibold text-[#2d6a7a] uppercase px-6 py-4">Beruvchi</th>
                <th className="text-left text-xs font-semibold text-[#2d6a7a] uppercase px-6 py-4">Qabul qiluvchi</th>
                <th className="text-left text-xs font-semibold text-[#2d6a7a] uppercase px-6 py-4">Mulk turi</th>
                <th className="text-left text-xs font-semibold text-[#2d6a7a] uppercase px-6 py-4">Holat</th>
                <th className="text-left text-xs font-semibold text-[#2d6a7a] uppercase px-6 py-4">Sana</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f4f6]">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-[#f0f4f6] transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/dashboard/applications/${app.id}`}
                      className="font-medium text-[#0066cc] hover:underline"
                    >
                      {app.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a3a4a]">{app.sender?.fullName}</td>
                  <td className="px-6 py-4 text-sm text-[#1a3a4a]">{app.receiver?.fullName}</td>
                  <td className="px-6 py-4 text-sm text-[#2d6a7a]">
                    {PROPERTY_TYPE_LABELS[app.propertyType]}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full badge-${app.status.toLowerCase()}`}>
                      {STATUS_LABELS[app.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#2d6a7a]">
                    {format(new Date(app.createdAt), 'dd.MM.yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
