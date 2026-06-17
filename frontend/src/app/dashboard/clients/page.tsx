'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { User, Mail, Phone } from 'lucide-react';

export default function ClientsPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.role !== 'NOTARIUS') router.push('/dashboard');
  }, [user, router]);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => api.get('/users/clients').then((r) => r.data),
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mijozlar</h1>
        <p className="text-gray-500 mt-1">{clients.length} ta mijoz</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-400">Hali mijozlar yo'q</p>
          <p className="text-gray-400 text-sm mt-1">Mijozlar ro'yxatdan o'tganda bu yerda ko'rinadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client: any) => (
            <div key={client.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{client.fullName}</p>
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                    <Mail size={13} />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-0.5">
                      <Phone size={13} />
                      <span>{client.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
