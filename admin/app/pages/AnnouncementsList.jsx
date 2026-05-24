import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import api from '../../../src/services/api';

export default function AnnouncementsList() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.announcements.list()
      .then(data => setAnnouncements(Array.isArray(data) ? data : []))
      .catch(err => alert("Erreur : " + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#0f172a]">Announcements</h1>
        <button
          onClick={() => navigate('/admin/new-announcement')}
          className="px-4 py-2 bg-[#006591] text-white rounded-xl font-bold"
        >
          + New Announcement
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {announcements.map(ann => (
          <div key={ann.id} className="bg-white rounded-2xl p-5 border border-[#e2e8f0]">
            <p className="font-bold text-[#0f172a]">{ann.content}</p>
            <p className="text-sm text-[#64748b]">Target : {ann.target_audience}</p>
            <p className="text-sm text-[#64748b]">Date : {ann.published_at}</p>
          </div>
        ))}
      </div>
    </div>
  );
}