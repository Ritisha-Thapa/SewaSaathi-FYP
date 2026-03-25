import React, { useState, useEffect } from 'react';
import { Download, Calendar as CalendarIcon, Filter, TrendingUp } from 'lucide-react';
import { api } from '../../utils/api';
import Skeleton from '../../components/Skeleton';

const Earnings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('monthly'); // 'daily' or 'monthly'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const data = await api.get('/booking/bookings/');
      // Only paid bookings count as earnings
      const paidBookings = data.filter(b => b.is_paid && (b.status === 'paid' || b.status === 'completed'));
      setBookings(paidBookings);
    } catch (err) {
      console.error("Failed to fetch earnings", err);
    } finally {
      setLoading(false);
    }
  };

  const totalLifetimeEarnings = bookings.reduce((sum, b) => sum + Number(b.total_price), 0);
  
  const currentMonthEarnings = bookings.filter(b => {
    const d = new Date(b.paid_at || b.updated_at);
    return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
  }).reduce((sum, b) => sum + Number(b.total_price), 0);

  // Grouping for the chart/list
  const getAggregatedData = () => {
    const groups = {};
    bookings.forEach(b => {
      const d = new Date(b.paid_at || b.updated_at);
      if (d.getFullYear() !== Number(selectedYear)) return;

      let key;
      if (filterType === 'monthly') {
        key = d.toLocaleString('default', { month: 'long' });
      } else {
        if (d.getMonth() !== Number(selectedMonth)) return;
        key = d.toLocaleDateString();
      }

      groups[key] = (groups[key] || 0) + Number(b.total_price);
    });

    return Object.entries(groups).sort((a, b) => {
        if (filterType === 'monthly') {
          const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          return months.indexOf(a[0]) - months.indexOf(b[0]);
        }
        return new Date(a[0]) - new Date(b[0]);
    });
  };

  const aggregatedData = getAggregatedData();
  const maxEarning = Math.max(...aggregatedData.map(d => d[1]), 1);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-48 h-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Skeleton className="h-32 rounded-xl" />
           <Skeleton className="h-32 rounded-xl" />
        </div>
        <Skeleton className="w-full h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1B3C53]">Earnings & Payments</h2>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm">
           <Download size={16} /> Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1B3C53] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
           <div className="relative z-10">
             <p className="text-blue-100 text-sm font-medium opacity-80">Total Lifetime Earnings</p>
             <h3 className="text-4xl font-black mt-2">Rs. {totalLifetimeEarnings.toLocaleString()}</h3>
           </div>
           <TrendingUp className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white/5" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-sm font-medium">This Month</p>
             <h3 className="text-3xl font-bold mt-2 text-green-600">Rs. {currentMonthEarnings.toLocaleString()}</h3>
           </div>
           <div className="p-4 bg-green-50 rounded-2xl text-green-600">
             <TrendingUp size={24} />
           </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-lg font-bold text-[#1B3C53] flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            Earnings Breakdown
          </h3>
          
          <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button 
              onClick={() => setFilterType('monthly')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${filterType === 'monthly' ? 'bg-white text-[#1B3C53] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setFilterType('daily')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition ${filterType === 'daily' ? 'bg-white text-[#1B3C53] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Daily
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-8">
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/20"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            {filterType === 'daily' && (
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/20"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-4">
            {aggregatedData.length === 0 ? (
              <div className="text-center py-12 text-gray-400 italic bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                No earnings recorded for this period.
              </div>
            ) : (
              aggregatedData.map(([label, amount]) => (
                <div key={label} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-gray-600">{label}</span>
                    <span className="text-sm font-black text-[#1B3C53]">Rs. {amount.toLocaleString()}</span>
                  </div>
                  <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-[#1B3C53] rounded-full transition-all duration-500 ease-out group-hover:from-green-400 group-hover:to-green-600"
                      style={{ width: `${(amount / maxEarning) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Transaction History (Real) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
           <h3 className="text-lg font-bold text-[#1B3C53]">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
             <thead className="bg-gray-50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                <tr>
                   <th className="px-6 py-4 font-black">Date</th>
                   <th className="px-6 py-4 font-black">Service</th>
                   <th className="px-6 py-4 font-black">Method</th>
                   <th className="px-6 py-4 font-black text-right">Amount</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-50 text-sm">
                {bookings.slice(0, 10).map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-gray-500 font-medium">{new Date(txn.paid_at || txn.updated_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                       <p className="text-[#1B3C53] font-bold">{txn.service_name}</p>
                       <p className="text-[10px] text-gray-400">#{txn.id}</p>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          txn.payment_method === 'online' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                       }`}>
                          {txn.payment_method}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-[#1B3C53]">Rs. {Number(txn.total_price).toLocaleString()}</td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">No transactions found</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
