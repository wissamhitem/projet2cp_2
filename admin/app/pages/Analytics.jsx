import { ArrowLeft, TrendingUp, TrendingDown, Users, Calendar, Activity, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Analytics() {
  const navigate = useNavigate();

  const kpis = [
    { label: 'Patient Satisfaction', value: '94%', change: '+3.2%', up: true, color: 'text-emerald-600' },
    { label: 'Avg Wait Time', value: '12 min', change: '-18%', up: false, color: 'text-emerald-600' },
    { label: 'Bed Occupancy', value: '78%', change: '+5%', up: true, color: 'text-amber-600' },
    { label: 'Readmission Rate', value: '4.2%', change: '-1.1%', up: false, color: 'text-emerald-600' },
  ];

  const departmentPerf = [
    { name: 'Pulmonology', throughput: 85, change: '+12.5%', color: '#0ea5e9' },
    { name: 'Hematology', throughput: 72, change: '+8.2%', color: '#f43f5e' },
    { name: 'Nephrology', throughput: 45, change: '-2.4%', color: '#f59e0b', negative: true },
    { name: 'Gastroenterology', throughput: 91, change: '+18.0%', color: '#6366f1' },
    { name: 'Cardiology', throughput: 88, change: '+9.7%', color: '#10b981' },
  ];

  const monthlyData = [
    { month: 'Jan', patients: 145 }, { month: 'Feb', patients: 162 }, { month: 'Mar', patients: 178 },
    { month: 'Apr', patients: 155 }, { month: 'May', patients: 192 }, { month: 'Jun', patients: 0 },
  ];
  const maxP = Math.max(...monthlyData.map(d => d.patients));

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/doctor')} className="p-2 hover:bg-[#f1f5f9] rounded-xl transition-colors"><ArrowLeft className="size-5 text-[#64748b]" /></button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#171c1f] tracking-tight">Analytics & Reports</h1>
            <p className="text-sm text-[#64748b]">Performance metrics and trends</p>
          </div>
        </div>
        <select className="bg-white border border-[#e2e8f0] rounded-xl px-4 py-2 text-sm font-semibold text-[#171c1f]">
          <option>This Month</option><option>Last Month</option><option>Last 3 Months</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748b] mb-2">{k.label}</p>
            <p className="text-3xl font-extrabold text-[#171c1f]">{k.value}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${k.color}`}>
              {k.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}{k.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Volume */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
          <h3 className="font-bold text-[#171c1f] mb-6">Monthly Patient Volume</h3>
          <div className="flex items-end gap-3 h-48">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-[#171c1f]">{d.patients || '—'}</span>
                <div className={`w-full rounded-t-lg transition-all ${d.patients ? 'bg-gradient-to-t from-[#006591] to-[#0ea5e9]' : 'bg-[#f1f5f9]'}`} style={{ height: `${d.patients ? (d.patients / maxP) * 140 : 20}px` }} />
                <span className="text-xs font-semibold text-[#64748b]">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Performance */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6">
          <h3 className="font-bold text-[#171c1f] mb-6">Department Performance</h3>
          <div className="space-y-4">
            {departmentPerf.map((d, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-[#171c1f]">{d.name}</span>
                  <span className={`text-xs font-bold ${d.negative ? 'text-red-500' : 'text-emerald-600'}`}>{d.change}</span>
                </div>
                <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${d.throughput}%`, backgroundColor: d.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
