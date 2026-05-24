import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import api from '../../../src/services/api';

export default function ServicesList() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.services.list()
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(err => alert("Erreur : " + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Services List</h1>
        <button
          onClick={() => navigate('/admin/add-service')}
          className="px-4 py-2 bg-[#006591] text-white rounded-xl font-bold"
        >
          + Add Service
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-2xl p-5 border border-[#e2e8f0]">
            <p className="font-bold text-[#0f172a]">{service.name}</p>
            <p className="text-sm text-[#64748b]">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}