import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  CheckCircle,
  Banknote,
  Star,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getCached } from "../../../utils/api";
import Skeleton from "../../../shared/components/layout/Skeleton";
import { useTranslation } from "react-i18next";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-[#1B3C53]">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const ProviderDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    pendingRequests: 0,
    completedJobs: 0,
    totalEarnings: 0,
    averageRating: 0,
  });
  const [recentWork, setRecentWork] = useState([]);
  const [codDues, setCodDues] = useState([]);
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getServiceLabel = (serviceNameKey) =>
    t(`service_names.${serviceNameKey}`, {
      defaultValue: serviceNameKey || "-",
    });

  const fetchDashboardData = async () => {
    setLoadingStats(true);
    setLoadingTable(true);
    try {
      const statsData = await getCached("/booking/bookings/stats/", {
        ttlMs: 15000,
      });

      if (statsData) {
        setStats({
          pendingRequests: statsData.pending,
          completedJobs: statsData.completed,
          totalEarnings: statsData.earnings,
          averageRating: statsData.average_rating || 0,
        });
      }
      setLoadingStats(false);

      const bookingsData = await getCached("/booking/bookings/", {
        ttlMs: 30000,
      });

      const recentWorkData = (bookingsData || [])
        .filter((b) => b.status === "completed" || b.status === "paid")
        .sort(
          (a, b) =>
            new Date(b.completed_at || b.updated_at) -
            new Date(a.completed_at || a.updated_at)
        )
        .slice(0, 5)
        .map((b) => ({
          id: b.id,
          serviceNameKey: b.service_name_key,
          customerName: b.customer_name,
          is_paid: b.is_paid,
        }));

      setRecentWork(recentWorkData);

      // COD dues: cash bookings where commission is still owed to the platform
      const dues = (bookingsData || []).filter(b =>
        b.is_paid &&
        b.payment_method === 'cash' &&
        b.commission_status === 'due'
      );
      setCodDues(dues);

      // Pending payouts: Khalti bookings where platform hasn't sent the 90% yet
      const pending = (bookingsData || []).filter(b =>
        b.is_paid &&
        b.payment_method === 'khalti_v2' &&
        b.payout_status === 'pending'
      );
      setPendingPayouts(pending);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      setRecentWork([]);
    } finally {
      setLoadingStats(false);
      setLoadingTable(false);
    }
  };

  if (loadingStats) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-56 h-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-16 h-8" />
                </div>
                <Skeleton className="w-12 h-12 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
          <Skeleton className="w-48 h-6" />
          <Skeleton className="w-full h-40 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1B3C53]">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={ClipboardList}
          color="bg-blue-500"
        />
<StatCard
          title="Completed Jobs"
          value={stats.completedJobs}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Total Earnings"
          value={`Rs. ${stats.totalEarnings.toLocaleString()}`}
          icon={Banknote}
          color="bg-indigo-500"
        />
        <StatCard
          title="Rating"
          value={stats.averageRating}
          icon={Star}
          color="bg-yellow-500"
        />
      </div>

      {/* Pending Payout from Platform (Khalti) */}
      {pendingPayouts.length > 0 && (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Banknote className="text-blue-500 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-bold text-blue-700 text-base">
                Platform Owes You — Rs.{" "}
                {pendingPayouts
                  .reduce((s, b) => s + Number(b.provider_payout_amount || 0), 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 mt-0.5">
                You have {pendingPayouts.length} Khalti job{pendingPayouts.length > 1 ? "s" : ""} where
                the platform received the payment but hasn't transferred your 90% yet.
                The admin will process these shortly.
              </p>
            </div>
          </div>
          <Link
            to="/provider/earnings"
            className="shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition"
          >
            View Details
          </Link>
        </div>
      )}

      {/* COD Commission Dues Alert */}
      {codDues.length > 0 && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-bold text-red-700 text-base">
                Platform Commission Due — Rs.{" "}
                {codDues
                  .reduce((s, b) => s + Number(b.commission_amount || 0), 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-red-600 mt-0.5">
                You have {codDues.length} COD job{codDues.length > 1 ? "s" : ""} where
                the platform's 10% commission hasn't been settled yet. Please contact
                the admin to clear this.
              </p>
            </div>
          </div>
          <Link
            to="/provider/earnings"
            className="shrink-0 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition"
          >
            View Details
          </Link>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-[#1B3C53] mb-4">
          Recent Work Activity
        </h3>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Service
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Customer
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loadingTable &&
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={`rw-skel-${i}`}>
                    <td className="px-4 py-3">
                      <Skeleton className="w-24 h-4" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="w-20 h-4" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="w-16 h-5 rounded-full" />
                    </td>
                  </tr>
                ))}
              {!loadingTable &&
                recentWork.map((work) => (
                  <tr key={work.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-[#1B3C53]">
                      {getServiceLabel(work.serviceNameKey)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {work.customerName}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          work.is_paid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {work.is_paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                  </tr>
                ))}
              {!loadingTable && recentWork.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-8 text-center text-gray-400 italic"
                  >
                    No recent work activity
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
