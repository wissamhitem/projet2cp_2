import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import api from '../../../src/services/api';

export default function Schedule() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.schedules.list(),
      api.doctors.list(),
    ])
      .then(([schedulesData, doctorsData]) => {
        setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
        setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f1f5f9]">
      <p className="text-[#64748b] text-lg">Chargement...</p>
    </div>
  );

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayLabels = { sunday: 'Dim', monday: 'Lun', tuesday: 'Mar', wednesday: 'Mer', thursday: 'Jeu', friday: 'Ven', saturday: 'Sam' };

  return (
    <div className="bg-[#f1f5f9] min-h-screen p-8">
      <div className="mb-8 flex items-center justify-between">
  <div>
    <h1 className="text-3xl font-extrabold text-[#171c1f] tracking-tight">Master Schedule</h1>
    <p className="text-[#64748b] mt-1">Emploi du temps de tous les médecins</p>
  </div>
  <button
    onClick={() => navigate('/admin/add-schedule')}
    className="px-4 py-2 bg-[#006591] text-white rounded-xl font-bold"
  >
    + Add Schedule
  </button>
</div>

      {doctors.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-[#64748b]">
          Aucun médecin trouvé.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {doctors.map(doctor => {
            const doctorSchedules = schedules.filter(s => s.doctor === doctor.id);
            return (
              <div key={doctor.id} className="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden">
                <div className="flex items-center gap-4 p-5 border-b border-[#e2e8f0]">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-[#006591] to-[#0ea5e9] flex items-center justify-center text-white font-bold text-lg">
                    {(doctor.user?.first_name || doctor.first_name || '?')[0]}{(doctor.user?.last_name || doctor.last_name || '?')[0]}
                  </div>
                  <div>
                    <p className="font-bold text-[#171c1f] text-lg">
  Dr. {doctor.full_name || `${doctor.user?.first_name || ''} ${doctor.user?.last_name || ''}`}
</p>
<p className="text-[#64748b] text-sm">{doctor.service || doctor.service?.name} — {doctor.grade}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-[#e0f2fe] text-[#0369a1] text-xs font-bold px-3 py-1 rounded-full">
                      {doctorSchedules.length} jour{doctorSchedules.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {doctorSchedules.length === 0 ? (
                  <div className="p-5 text-[#94a3b8] text-sm">Aucun horaire défini.</div>
                ) : (
                  <div className="grid grid-cols-7 gap-0">
                    {days.map(day => {
                      const s = doctorSchedules.find(sch => sch.day_of_week === day);
                      return (
                        <div key={day} className={`p-4 border-r border-[#e2e8f0] last:border-r-0 ${s ? 'bg-[#f0f9ff]' : 'bg-[#fafafa]'}`}>
                          <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${s ? 'text-[#0369a1]' : 'text-[#cbd5e1]'}`}>
                            {dayLabels[day]}
                          </p>
                          {s ? (
                            <div>
                              <p className="text-[#171c1f] text-xs font-semibold">{s.start_time?.slice(0,5)}</p>
                              <p className="text-[#64748b] text-xs">→ {s.end_time?.slice(0,5)}</p>
                              <p className="text-[#0ea5e9] text-xs mt-1 font-medium">{s.max_appointments} max</p>
                            </div>
                          ) : (
                            <p className="text-[#cbd5e1] text-xs">—</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}