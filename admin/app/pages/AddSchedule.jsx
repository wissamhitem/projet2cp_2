import { useState, useEffect } from 'react';
import { Calendar, ArrowLeft, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import api from '../../../src/services/api';

const ALL_DAYS = [
  { value: 'monday',    label: 'Lundi' },
  { value: 'tuesday',   label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday',  label: 'Jeudi' },
  { value: 'friday',    label: 'Vendredi' },
  { value: 'saturday',  label: 'Samedi' },
  { value: 'sunday',    label: 'Dimanche' },
];

export default function AddSchedule() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [daySchedules, setDaySchedules] = useState([]);

  useEffect(() => {
    api.doctors.list()
      .then(data => setDoctors(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, []);

  const addDay = (dayValue) => {
    if (daySchedules.find(d => d.day === dayValue)) return;
    setDaySchedules(prev => [...prev, {
      day: dayValue,
      start_time: '08:00',
      end_time: '16:00',
      max_appointments: 10,
    }]);
  };

  const removeDay = (dayValue) => {
    setDaySchedules(prev => prev.filter(d => d.day !== dayValue));
  };

  const updateDay = (dayValue, field, value) => {
    setDaySchedules(prev => prev.map(d =>
      d.day === dayValue ? { ...d, [field]: value } : d
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) { alert('Sélectionnez un médecin !'); return; }
    if (daySchedules.length === 0) { alert('Ajoutez au moins un jour !'); return; }
    setLoading(true);
    try {
      await Promise.all(daySchedules.map(d =>
        api.schedules.create({
          doctor: selectedDoctor,
          day_of_week: d.day,
          start_time: d.start_time,
          end_time: d.end_time,
          max_appointments: d.max_appointments,
        })
      ));
      setSuccess(true);
      setTimeout(() => navigate('/admin/schedule'), 1500);
    } catch (error) {
      alert("Erreur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f1f5f9]">
        <div className="w-full max-w-md bg-white rounded-[32px] p-12 border border-white shadow-2xl text-center">
          <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="size-10" />
          </div>
          <h2 className="text-2xl font-bold text-[#0f172a] mb-2">Horaires Créés</h2>
          <p className="text-[#64748b]">Redirection vers le planning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[#f1f5f9]">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[32px] p-10 border border-[#e2e8f0] shadow-xl">
          <button
            onClick={() => navigate('/admin/schedule')}
            className="flex items-center gap-2 text-sm font-semibold text-[#64748b] hover:text-[#006591] mb-8 transition-colors"
          >
            <ArrowLeft className="size-4" /> Retour au planning
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="size-14 bg-gradient-to-br from-[#006591] to-[#0ea5e9] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Calendar className="size-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0f172a]">Ajouter des Horaires</h1>
              <p className="text-sm text-[#64748b]">Définir le planning d'un médecin</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Médecin */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1e293b]">Médecin</label>
              <select
                required
                value={selectedDoctor}
                onChange={e => setSelectedDoctor(e.target.value)}
                className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl outline-none focus:ring-4 focus:ring-[#006591]/10 focus:border-[#006591] transition-all text-sm"
              >
                <option value="">Sélectionner un médecin</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>
                    Dr. {d.full_name || `${d.user?.first_name || ''} ${d.user?.last_name || ''}`} — {d.service || d.service?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sélection des jours */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1e293b]">Ajouter des jours</label>
              <div className="grid grid-cols-4 gap-2">
                {ALL_DAYS.map(day => {
                  const isAdded = daySchedules.find(d => d.day === day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => isAdded ? removeDay(day.value) : addDay(day.value)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-colors flex items-center justify-center gap-1 ${
                        isAdded
                          ? 'border-[#006591] bg-[#006591] text-white'
                          : 'border-[#e2e8f0] text-[#64748b] hover:border-[#006591] hover:text-[#006591]'
                      }`}
                    >
                      {isAdded ? '✓' : '+'} {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Horaires par jour */}
            {daySchedules.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-[#1e293b]">Horaires par jour</label>
                {daySchedules.map(d => {
                  const dayLabel = ALL_DAYS.find(day => day.value === d.day)?.label;
                  return (
                    <div key={d.day} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-[#006591] text-sm">{dayLabel}</span>
                        <button
                          type="button"
                          onClick={() => removeDay(d.day)}
                          className="text-[#dc2626] hover:text-[#b91c1c] transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#94a3b8]">Début</label>
                          <input
                            type="time"
                            value={d.start_time}
                            onChange={e => updateDay(d.day, 'start_time', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#e2e8f0] rounded-xl outline-none focus:border-[#006591] text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#94a3b8]">Fin</label>
                          <input
                            type="time"
                            value={d.end_time}
                            onChange={e => updateDay(d.day, 'end_time', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#e2e8f0] rounded-xl outline-none focus:border-[#006591] text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-[#94a3b8]">Max RDV</label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={d.max_appointments}
                            onChange={e => updateDay(d.day, 'max_appointments', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#e2e8f0] rounded-xl outline-none focus:border-[#006591] text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#006591] to-[#0ea5e9] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {loading ? 'Création...' : `Créer ${daySchedules.length} horaire${daySchedules.length !== 1 ? 's' : ''}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}