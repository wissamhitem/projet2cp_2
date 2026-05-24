import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import api from '../../../src/services/api';

export default function DoctorsList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.doctors.listPublic()
      .then(data => setDoctors(Array.isArray(data) ? data : []))
      .catch(err => alert("Erreur : " + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Doctors List</h1>
        <button
          onClick={() => navigate('/admin/add-doctor')}
          className="px-4 py-2 bg-[#006591] text-white rounded-xl font-bold"
        >
          + Add Doctor
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {doctors.map(doc => (
          <div key={doc.id} className="bg-white rounded-2xl p-5 border border-[#e2e8f0]">
            <p className="font-bold text-[#0f172a]">{doc.full_name}</p>
            <p className="text-sm text-[#64748b]">Grade : {doc.grade}</p>
            <p className="text-sm text-[#64748b]">Service : {doc.service}</p>
          </div>
        ))}
      </div>
    </div>
  );
}