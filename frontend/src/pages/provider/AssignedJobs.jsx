import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowRight, User } from 'lucide-react';
import { api } from '../../utils/api';

const JobCard = ({ job, type, onUpdateStatus }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          type === 'Active' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {job.status}
        </span>
        <h3 className="font-bold text-[#1B3C53]">{job.service_name}</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-6 text-sm text-gray-600 mt-2">
         <div className="flex items-center">
            <User size={14} className="mr-2" /> {job.customer_name}
         </div>
         <div className="flex items-center">
           <MapPin size={14} className="mr-2" /> {job.customer_address ? `${job.customer_address}, ${job.customer_city}` : "Location not provided"}
         </div>
         <div className="flex items-center">
           <Calendar size={14} className="mr-2" /> {job.scheduled_date} at {job.scheduled_time}
         </div>
      </div>
      
      {job.issue_description && (
        <p className="text-sm text-gray-500 mt-3 bg-gray-50 p-2 rounded">
          <span className="font-semibold">Note:</span> {job.issue_description}
        </p>
      )}
    </div>

    <div className="flex flex-col sm:flex-row gap-3 min-w-[150px] justify-end">
      {type === 'Assigned' ? (
        <>
           <button 
             onClick={() => onUpdateStatus(job.id, 'rejected')}
             className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm">
             Reject
           </button>
           <button 
             onClick={() => onUpdateStatus(job.id, 'in_progress')}
             className="px-4 py-2 bg-[#1B3C53] text-white rounded-lg hover:bg-[#1a3248] text-sm">
             Start Job
           </button>
        </>
      ) : (
        <>
           <button 
             onClick={() => onUpdateStatus(job.id, 'completed')}
             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center gap-2">
             <ArrowRight size={16} /> Mark Complete
           </button>
        </>
      )}
    </div>
  </div>
);

const AssignedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await api.get('/api/booking/bookings/');
            setJobs(data);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.post(`/api/booking/bookings/${id}/update-status/`, { status: newStatus });
            // Refresh list or update local state
            fetchJobs();
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Failed to update status");
        }
    };

    // Filter jobs
    const assigned = jobs.filter(j => j.status === 'accepted' || j.status === 'assigned');

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Assigned Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#1B3C53] mb-4">Assigned Jobs</h2>
        <div className="space-y-4">
          {assigned.map(job => (
            <JobCard key={job.id} job={job} type="Assigned" onUpdateStatus={handleUpdateStatus} />
          ))}
          {assigned.length === 0 && <p className="text-gray-500">No assigned jobs.</p>}
        </div>
      </div>
    </div>
  );
};

export const ActiveJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await api.get('/api/booking/bookings/');
            setJobs(data);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            await api.post(`/api/booking/bookings/${id}/update-status/`, { status: newStatus });
            fetchJobs();
        } catch (err) {
             console.error("Failed to update status", err);
             alert("Failed to update status");
        }
    };

    const active = jobs.filter(j => j.status === 'in_progress');

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold text-[#1B3C53] mb-4">Active Jobs</h2>
             <div className="space-y-4">
              {active.map(job => (
                <JobCard key={job.id} job={job} type="Active" onUpdateStatus={handleUpdateStatus} />
              ))}
              {active.length === 0 && <p className="text-gray-500">No active jobs running.</p>}
            </div>
        </div>
    )
}

export default AssignedJobs;
