import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowRight, User, Loader2, Image as ImageIcon, Phone } from 'lucide-react';
import Skeleton from '../../components/Skeleton';
import { api } from '../../utils/api';
import CompleteJobModal from '../../components/provider/CompleteJobModal';
import ImageModal from '../../components/common/ImageModal';

const JobCard = ({ job, type, onUpdateStatus, onCompleteJob, isUpdating }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  return (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className={`px-2 py-1 rounded text-xs font-semibold ${
          job.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
          job.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {job.status === 'in_progress' ? 'In Progress' : job.status === 'accepted' ? 'Accepted' : job.status}
        </span>
        <h3 className="font-bold text-[#1B3C53]">{job.service_name}</h3>
        {job.is_rework && (
          <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded uppercase animate-pulse">
            Rework Insurance
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-6 text-sm text-gray-600 mt-2">
        <div className="flex items-center">
          <User size={14} className="mr-2" /> {job.customer_name}
        </div>
        <div className="flex items-center">
          <Phone size={14} className="mr-2" /> {job.phone || job.customer_phone || "Not provided"}
        </div>
        <div className="flex items-center">
          <MapPin size={14} className="mr-2" /> {job.address || (job.customer_address ? `${job.customer_address}, ${job.customer_city}` : "Location not provided")}
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
      {job.issue_images && (
        <div className="mt-2">
          <button
            onClick={() => setIsImageModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-[#1B3C53] rounded border border-gray-200 hover:bg-gray-100 transition text-xs font-semibold"
          >
            <ImageIcon size={14} />
            View Attached Image
          </button>
        </div>
      )}
    </div>

    <div className="flex flex-col sm:flex-row gap-3 min-w-[150px] justify-end">
      {job.status === 'accepted' ? (
        <button
          onClick={() => onUpdateStatus(job.id, 'in_progress')}
          disabled={isUpdating}
          className="px-4 py-2 bg-[#1B3C53] text-white rounded-lg hover:bg-[#1a3248] text-sm flex items-center justify-center gap-2 disabled:opacity-70">
          {isUpdating ? (
            <Loader2 className="animate-spin h-4 w-4 text-white" />
          ) : null}
          {isUpdating ? 'Starting...' : 'Start Job'}
        </button>
      ) : (job.status === 'in_progress' || job.status === 'accepted') ? (
        <button
          onClick={() => onCompleteJob(job)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center gap-2">
          <ArrowRight size={16} /> Complete Job
        </button>
      ) : (job.status === 'completed' && !job.is_paid) ? (
        <button
          onClick={() => onUpdateStatus(job.id, 'paid', { payment_method: 'cash' })}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center gap-2">
          Confirm Cash Received
        </button>
      ) : null}
    </div>
    
    <ImageModal 
      isOpen={isImageModalOpen} 
      onClose={() => setIsImageModalOpen(false)} 
      imageUrl={job.issue_images} 
    />
  </div>
  );
};

const AssignedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.get('/booking/bookings/');
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus, additionalData = {}) => {
    setUpdatingId(id);
    try {
      await api.post(`/booking/bookings/${id}/update-status/`, { status: newStatus, ...additionalData });
      // Optimistic update
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j));
      await fetchJobs();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter jobs
  const assigned = jobs.filter(j => j.status === 'accepted' || j.status === 'assigned');

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-40 h-7" />
                <Skeleton className="w-20 h-6 rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-48 h-4" />
                <Skeleton className="w-36 h-4" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Assigned Section */}
      <div>
        <h2 className="text-2xl font-bold text-[#1B3C53] mb-4">Assigned Jobs</h2>
        <div className="space-y-4">
          {assigned.map(job => (
            <JobCard key={job.id} job={job} type="Assigned" onUpdateStatus={handleUpdateStatus} isUpdating={updatingId === job.id} />
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
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.get('/booking/bookings/');
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus, additionalData = {}) => {
    setUpdatingId(id);
    try {
      await api.post(`/booking/bookings/${id}/update-status/`, { status: newStatus, ...additionalData });
      setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j));
      await fetchJobs();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCompleteJob = async (jobId, status, additionalData = {}) => {
    setUpdatingId(jobId);
    try {
      const payload = { status, ...additionalData };
      await api.post(`/booking/bookings/${jobId}/update-status/`, payload);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status, ...additionalData } : j));
      await fetchJobs();
    } catch (err) {
      console.error("Failed to complete job", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || "Failed to complete job";
      alert(errorMsg);
      throw err;
    } finally {
      setUpdatingId(null);
    }
  };

  const openCompleteModal = (job) => {
    setSelectedJob(job);
    setShowCompleteModal(true);
  };

  const closeCompleteModal = () => {
    setSelectedJob(null);
    setShowCompleteModal(false);
  };

  const active = jobs.filter(j => 
    (['accepted', 'in_progress', 'completed'].includes(j.status) && !j.is_paid) || 
    (j.is_rework && ['accepted', 'in_progress'].includes(j.status))
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-40 h-7" />
                <Skeleton className="w-20 h-6 rounded" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-48 h-4" />
                <Skeleton className="w-36 h-4" />
              </div>
            </div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1B3C53] mb-4">Active Jobs</h2>
      <div className="space-y-4">
        {active.map(job => (
          <JobCard 
            key={job.id} 
            job={job} 
            type="Active" 
            onUpdateStatus={handleUpdateStatus} 
            onCompleteJob={(job) => {
              if (job.is_rework) {
                if (window.confirm("Confirm completion of this rework?")) {
                  handleCompleteJob(job.id, 'completed', { final_price: 0 });
                }
              } else {
                openCompleteModal(job);
              }
            }} 
            isUpdating={updatingId === job.id} 
          />
        ))}
        {active.length === 0 && <p className="text-gray-500">No active jobs running.</p>}
      </div>
      
      <CompleteJobModal
        isOpen={showCompleteModal}
        onClose={closeCompleteModal}
        job={selectedJob}
        onComplete={handleCompleteJob}
      />
    </div>
  )
}

export default AssignedJobs;
