'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { format } from 'date-fns';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import {
  Application, STATUS_LABELS, PROPERTY_TYPE_LABELS,
  DOCUMENT_TYPE_LABELS, DocumentType,
} from '@/types';
import {
  ArrowLeft, Upload, Trash2, FileText,
  User, Home, Clock, CheckCircle,
} from 'lucide-react';

const NEXT_STATUSES: Record<string, { value: string; label: string; color: string }[]> = {
  DRAFT:      [{ value: 'SUBMITTED', label: 'Yuborish', color: 'btn-primary' }],
  SUBMITTED:  [{ value: 'IN_REVIEW', label: 'Ko\'rib chiqishga qabul qilish', color: 'btn-primary' }],
  IN_REVIEW:  [
    { value: 'APPROVED', label: 'Tasdiqlash', color: 'btn-primary' },
    { value: 'REJECTED', label: 'Rad etish', color: 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors' },
  ],
  APPROVED:   [{ value: 'COMPLETED', label: 'Yakunlash', color: 'btn-primary' }],
  REJECTED:   [],
  COMPLETED:  [],
};

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState<DocumentType>('OTHER');
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);

  const { data: app, isLoading } = useQuery<Application>({
    queryKey: ['application', id],
    queryFn: () => api.get(`/applications/${id}`).then((r) => r.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ status, comment }: { status: string; comment?: string }) =>
      api.patch(`/applications/${id}/status`, { status, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setComment('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (docId: string) => api.delete(`/documents/${docId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['application', id] }),
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', docType);

    setUploading(true);
    try {
      await api.post(`/documents/upload/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      queryClient.invalidateQueries({ queryKey: ['application', id] });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!app) return <div className="p-8 text-gray-500">Ariza topilmadi</div>;

  const nextStatuses = NEXT_STATUSES[app.status] || [];

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/applications" className="btn-secondary flex items-center gap-2">
            <ArrowLeft size={16} />
            Orqaga
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{app.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs font-medium px-3 py-1 rounded-full badge-${app.status.toLowerCase()}`}>
                {STATUS_LABELS[app.status]}
              </span>
              <span className="text-gray-400 text-sm">
                {format(new Date(app.createdAt), 'dd.MM.yyyy HH:mm')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Tomonlar */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-blue-600" /> Tomonlar
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoBox label="Beruvchi" value={app.sender?.fullName} sub={app.sender?.email} />
              <InfoBox label="Qabul qiluvchi" value={app.receiver?.fullName || (app as any).receiverName} sub={app.receiver?.email} />
            </div>
            {app.notarius && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <InfoBox label="Notarius" value={app.notarius.fullName} sub={app.notarius.email} />
              </div>
            )}
          </div>

          {/* Mulk */}
          {app.property && (
            <div className="card">
              <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home size={18} className="text-blue-600" /> Mulk ma'lumotlari
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoBox label="Turi" value={PROPERTY_TYPE_LABELS[app.property.type]} />
                <InfoBox label="Nomi" value={app.property.name} />
                {app.property.address && <InfoBox label="Manzil" value={app.property.address} />}
                {app.property.cadastralNumber && <InfoBox label="Kadastr raqami" value={app.property.cadastralNumber} />}
                {app.property.estimatedValue && (
                  <InfoBox
                    label="Taxminiy qiymat"
                    value={app.property.estimatedValue.toLocaleString('uz-UZ') + ' so\'m'}
                  />
                )}
              </div>
            </div>
          )}

          {/* Hujjatlar */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" /> Hujjatlar ({app.documents?.length || 0})
            </h2>

            {/* Upload */}
            <div className="flex gap-3 mb-4">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentType)}
                className="input w-auto"
              >
                {Object.entries(DOCUMENT_TYPE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="btn-secondary flex items-center gap-2 disabled:opacity-60"
              >
                <Upload size={16} />
                {uploading ? 'Yuklanmoqda...' : 'Fayl yuklash'}
              </button>
              <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} />
            </div>

            {app.documents?.length === 0 ? (
              <p className="text-gray-400 text-sm">Hujjatlar yo'q</p>
            ) : (
              <div className="space-y-2">
                {app.documents?.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                        <p className="text-xs text-gray-400">
                          {DOCUMENT_TYPE_LABELS[doc.type]} · {(doc.fileSize / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    {doc.uploadedBy === user?.id && (
                      <button
                        onClick={() => deleteMutation.mutate(doc.id)}
                        className="text-red-400 hover:text-red-600 p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — Status va tarix */}
        <div className="space-y-6">
          {/* Status o'zgartirish */}
          {user?.role === 'NOTARIUS' && nextStatuses.length > 0 && (
            <div className="card">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Holat o'zgartirish</h2>
              <div>
                <label className="label">Izoh (ixtiyoriy)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="input mb-3"
                  rows={2}
                  placeholder="Izoh kiriting..."
                />
              </div>
              <div className="space-y-2">
                {nextStatuses.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => statusMutation.mutate({ status: s.value, comment })}
                    disabled={statusMutation.isPending}
                    className={`${s.color} w-full text-center disabled:opacity-60`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tarix */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-blue-600" /> Tarix
            </h2>
            <div className="space-y-3">
              {app.history?.map((h) => (
                <div key={h.id} className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle size={14} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{STATUS_LABELS[h.status]}</p>
                    {h.comment && <p className="text-xs text-gray-500 mt-0.5">{h.comment}</p>}
                    <p className="text-xs text-gray-400 mt-0.5">
                      {format(new Date(h.createdAt), 'dd.MM.yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, sub }: { label: string; value?: string; sub?: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || '—'}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  );
}
