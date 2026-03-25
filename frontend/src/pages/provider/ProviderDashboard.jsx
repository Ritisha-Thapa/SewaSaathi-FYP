import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Briefcase,
  CheckCircle,
  Banknote,
  Star,
} from "lucide-react";
import { api } from "../../utils/api";

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
  const [stats, setStats] = useState({
    pendingRequests: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalEarnings: 0,
    averageRating: 0
  });
  const [jobRequests, setJobRequests] = useState([]);
  const [recentWork, setRecentWork] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsData, statsData] = await Promise.all([
        api.get('/booking/bookings/'),
        api.get('/booking/bookings/stats/')
      ]);

      setStats({
        pendingRequests: statsData.pending,
        activeJobs: statsData.active,
        completedJobs: statsData.completed,
        totalEarnings: statsData.earnings,
        averageRating: statsData.average_rating || 0
      });

      // Get recent requests (all statuses except completed/paid)
      const recentRequests = bookingsData
        .filter(b => ['pending', 'accepted', 'in_progress', 'rejected', 'cancelled'].includes(b.status))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(b => ({
          id: b.id,
          serviceName: b.service_name,
          customerName: b.customer_name,
          location: b.address || b.customer_address,
          dateTime: `${b.scheduled_date} at ${b.scheduled_time}`,
          estimatedPrice: b.total_price,
          status: b.status
        }));

      setJobRequests(recentRequests);

      // Get recent work (completed/paid)
      const recentWorkData = bookingsData
        .filter(b => b.status === 'completed' || b.status === 'paid')
        .sort((a, b) => new Date(b.completed_at || b.updated_at) - new Date(a.completed_at || a.updated_at))
        .slice(0, 5)
        .map(b => ({
          id: b.id,
          serviceName: b.service_name,
          customerName: b.customer_name,
          location: b.address || b.customer_address,
          dateTime: `${b.scheduled_date} at ${b.scheduled_time}`,
          price: b.total_price,
          status: b.status,
          is_paid: b.is_paid
        }));

      setRecentWork(recentWorkData);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1B3C53]">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={ClipboardList}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={Briefcase}
          color="bg-orange-500"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Job Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-[#1B3C53] mb-4">
            Recent Job Requests
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
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 border-r border-gray-100">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobRequests.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-[#1B3C53]">
                      {job.serviceName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {job.customerName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        job.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'in_progress' ? 'bg-orange-100 text-orange-800' :
                        job.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1).replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
                {jobRequests.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-400 italic">No recent requests</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Work Activity */}
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
                {recentWork.map((work) => (
                  <tr key={work.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-[#1B3C53]">
                      {work.serviceName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {work.customerName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        work.is_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {work.is_paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentWork.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-gray-400 italic">No recent work activity</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
