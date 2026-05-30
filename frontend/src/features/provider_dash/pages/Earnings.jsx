import React, { useState, useEffect } from 'react';
import { Download, Filter, TrendingUp, AlertTriangle } from 'lucide-react';
import { getCached } from '../../../utils/api';
import Skeleton from '../../../shared/components/layout/Skeleton';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/ui/Button';

const Earnings = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [codDues, setCodDues] = useState([]);
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('monthly'); // 'daily' or 'monthly'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    fetchEarnings();
  }, []);

  const getServiceLabel = (serviceNameKey) =>
    t(`service_names.${serviceNameKey}`, {
      defaultValue: serviceNameKey || '-',
    });

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const data = await getCached('/booking/bookings/', { ttlMs: 30000 });
      const earnedBookings = data.filter(b => {
        if (!b.is_paid) return false;
        if (b.status !== 'paid' && b.status !== 'completed') return false;
        // Khalti: money sits in platform account until admin marks payout as sent
        if (b.payment_method === 'khalti_v2') return b.payout_status === 'sent';
        // COD: provider already collected cash from customer
        return true;
      });
      setBookings(earnedBookings);

      // COD dues: paid cash bookings where commission is still owed to the platform
      const dues = data.filter(b =>
        b.is_paid &&
        b.payment_method === 'cash' &&
        b.commission_status === 'due'
      );
      setCodDues(dues);

      // Pending payouts: online/Khalti bookings where platform hasn't sent the 90% yet
      const pending = data.filter(b =>
        b.is_paid &&
        b.payment_method === 'khalti_v2' &&
        b.payout_status === 'pending'
      );
      setPendingPayouts(pending);
    } catch (err) {
      console.error("Failed to fetch earnings", err);
    } finally {
      setLoading(false);
    }
  };

  const getCommissionDue = (b) => {
    if (b.commission_amount != null) return Number(b.commission_amount);
    const base = Number(b.total_price) - Number(b.insurance_fee || 0);
    return parseFloat((base * 0.10).toFixed(2));
  };

  // Returns the provider's actual take-home for a booking.
  // Uses provider_payout_amount when available (set by the commission engine).
  // Falls back to 90% of (total_price - insurance_fee) for older bookings.
  const getProviderEarning = (b) => {
    if (b.provider_payout_amount != null) return Number(b.provider_payout_amount);
    const base = Number(b.total_price) - Number(b.insurance_fee || 0);
    return base * 0.9;
  };

  const totalLifetimeEarnings = bookings.reduce((sum, b) => sum + getProviderEarning(b), 0);

  const currentMonthEarnings = bookings.filter(b => {
    const d = new Date(b.paid_at || b.updated_at);
    return d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
  }).reduce((sum, b) => sum + getProviderEarning(b), 0);

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

      groups[key] = (groups[key] || 0) + getProviderEarning(b);
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
        <Button
          type="button"
          variant="secondary"
          size="sm"
          fullWidth={false}
        >
          <Download size={16} className="shrink-0" /> Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1B3C53] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium">Total Lifetime Earnings</p>
            <p className="text-4xl font-black mt-2 text-white">
              Rs. {totalLifetimeEarnings.toLocaleString()}
            </p>
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

      {/* Pending Payouts from Platform (Khalti) */}
      {pendingPayouts.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden">
          <div className="p-6 bg-blue-50 border-b border-blue-100 flex items-start gap-3">
            <TrendingUp className="text-blue-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-lg font-bold text-blue-700">Pending Payouts from Platform (Khalti)</h3>
              <p className="text-sm text-blue-600 mt-1">
                These are online payments where the customer paid via Khalti and the money
                landed in the platform's account. The platform owes you 90% of each booking.
                This section clears once the admin transfers your payout and marks it as sent.
              </p>
            </div>
            <div className="ml-auto text-right shrink-0">
              <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Total Pending</p>
              <p className="text-2xl font-black text-blue-600">
                Rs. {pendingPayouts.reduce((s, b) => s + getProviderEarning(b), 0).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-blue-50 text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-black">Date</th>
                  <th className="px-6 py-3 font-black">Service</th>
                  <th className="px-6 py-3 font-black text-right">Booking Amount</th>
                  <th className="px-6 py-3 font-black text-right">Your Payout (90%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50 text-sm">
                {pendingPayouts.map(b => (
                  <tr key={b.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {new Date(b.paid_at || b.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#1B3C53] font-bold">{getServiceLabel(b.service_name_key)}</p>
                      <p className="text-[10px] text-gray-400">Booking #{b.id}</p>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 font-medium">
                      Rs. {Number(b.total_price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-blue-600">
                      Rs. {getProviderEarning(b).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COD Commission Dues */}
      {codDues.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-red-200 overflow-hidden">
          <div className="p-6 bg-red-50 border-b border-red-100 flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-lg font-bold text-red-700">Platform Commission Dues (COD)</h3>
              <p className="text-sm text-red-600 mt-1">
                For COD jobs, you collected cash directly from the customer. The platform's
                10% commission on these bookings is pending — please settle with the admin.
                This section clears once the admin marks each payment as received.
              </p>
            </div>
            <div className="ml-auto text-right shrink-0">
              <p className="text-xs text-red-500 font-medium uppercase tracking-wide">Total Due</p>
              <p className="text-2xl font-black text-red-600">
                Rs. {codDues.reduce((s, b) => s + getCommissionDue(b), 0).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="bg-red-50 text-[10px] uppercase font-bold text-red-400 tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-black">Date</th>
                  <th className="px-6 py-3 font-black">Service</th>
                  <th className="px-6 py-3 font-black text-right">Booking Amount</th>
                  <th className="px-6 py-3 font-black text-right">Commission Due (10%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-50 text-sm">
                {codDues.map(b => (
                  <tr key={b.id} className="hover:bg-red-50 transition">
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {new Date(b.paid_at || b.updated_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#1B3C53] font-bold">{getServiceLabel(b.service_name_key)}</p>
                      <p className="text-[10px] text-gray-400">Booking #{b.id}</p>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 font-medium">
                      Rs. {Number(b.total_price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-black text-red-600">
                      Rs. {getCommissionDue(b).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                    <p className="text-[#1B3C53] font-bold">
                      {getServiceLabel(txn.service_name_key)}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Booking #{txn.id}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${txn.payment_method === 'online' ? 'bg-indigo-50 text-indigo-600' : 'bg-green-50 text-green-600'
                      }`}>
                      {txn.payment_method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-black text-[#1B3C53]">Rs. {getProviderEarning(txn).toLocaleString()}</td>
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
