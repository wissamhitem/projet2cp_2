import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router';
import api from '../../../src/services/api';

export default function Analytics() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics.dashboard()
      .then(setData)
      .catch(err => alert("Erreur : " + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!data) return <div className="p-8 text-center">Aucune donnée disponible</div>;

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/admin')} className="p-2 hover:bg-[#f1f5f9] rounded-xl transition-colors">
          <ArrowLeft className="size-5 text-[#64748b]" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#171c1f]">Analytics & Reports</h1>
          <p className="text-sm text-[#64748b]">Performance metrics and trends</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-bold uppercase text-[#64748b] mb-2">Total Doctors</p>
          <p className="text-3xl font-extrabold text-[#171c1f]">{data.total_doctors ?? '—'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-bold uppercase text-[#64748b] mb-2">Total Patients</p>
          <p className="text-3xl font-extrabold text-[#171c1f]">{data.total_patients ?? '—'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-bold uppercase text-[#64748b] mb-2">Appointments Today</p>
          <p className="text-3xl font-extrabold text-[#171c1f]">{data.appointments_today ?? '—'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
          <p className="text-xs font-bold uppercase text-[#64748b] mb-2">New Registrations</p>
          <p className="text-3xl font-extrabold text-[#171c1f]">{data.new_registrations ?? '—'}</p>
        </div>
      </div>
    </div>
  );
}