import React from "react";
import {
  ClipboardList,
  Briefcase,
  CheckCircle,
  DollarSign,
  Star,
} from "lucide-react";
import { providerStats, jobRequests } from "../../data/providerMockData";

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
    <div className={`p-3 rounded-full ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const ProviderDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1B3C53]">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Pending Requests"
          value={providerStats.pendingRequests}
          icon={ClipboardList}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Jobs"
          value={providerStats.activeJobs}
          icon={Briefcase}
          color="bg-orange-500"
        />
        <StatCard
          title="Completed Jobs"
          value={providerStats.completedJobs}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Total Earnings"
          value={`Rs. ${providerStats.totalEarnings.toLocaleString()}`}
          icon={DollarSign}
          color="bg-indigo-500"
        />
        <StatCard
          title="Rating"
          value={providerStats.averageRating}
          icon={Star}
          color="bg-yellow-500"
        />
      </div>

      {/* Recent Activity */}
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
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Location
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
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
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {job.location}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {job.dateTime}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">
                    Rs. {job.estimatedPrice}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New Request
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
