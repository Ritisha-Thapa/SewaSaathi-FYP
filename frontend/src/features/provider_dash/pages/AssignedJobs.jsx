import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowRight, User, Image as ImageIcon, Phone } from 'lucide-react';
import Skeleton from '../../../shared/components/layout/Skeleton';
import { api, getCached, invalidateCache } from '../../../utils/api';
import CompleteJobModal from '../components/shared/CompleteJobModal';
import NotificationPopup from '../../notifications/components/NotificationPopup';
import ImageModal from '../../../shared/components/ui/ImageModal';
import Button from '../../../shared/components/ui/Button';
import toast from 'react-hot-toast';

import { useTranslation } from 'react-i18next';

const JobCard = ({ job, type, onUpdateStatus, onCompleteJob, isUpdating, pendingStatus }) => {
  const { t } = useTranslation();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const effectiveStatus = pendingStatus || job.status;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${effectiveStatus === 'in_progress' ? 'bg-orange-100 text-orange-700' :
            effectiveStatus === 'accepted' ? 'bg-blue-100 text-blue-700' :
              'bg-blue-100 text-blue-700'
            }`}>
            {t(`status.${effectiveStatus}`, { defaultValue: effectiveStatus.replace('_', ' ') })}
          </span>
          <h3 className="font-bold text-[#1B3C53]">{t(`service_names.${job.service_name_key}`)}</h3>
          {job.is_rework && (
            <span className="ml-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded uppercase animate-pulse">
              {t('bookings.rework_insurance', 'Rework Insurance')}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-6 text-sm text-gray-600 mt-2">
          <div className="flex items-center">
            <User size={14} className="mr-2" /> {job.customer_name}
          </div>
          <div className="flex items-center">
            <Phone size={14} className="mr-2" /> {job.phone || job.customer_phone || t('common.loading', "Not provided")}
          </div>
          <div className="flex items-center">
            <MapPin size={14} className="mr-2" /> {job.address || (job.customer_address ? `${job.customer_address}, ${job.customer_city}` : t('common.loading', "Location not provided"))}
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" /> {job.scheduled_date} at {job.scheduled_time}
          </div>
        </div>

        {job.issue_description && (
          <p className="text-sm text-gray-500 mt-3 bg-gray-50 p-2 rounded">
            <span className="font-semibold">{t('labels.note', 'Note')}:</span> {job.issue_description}
          </p>
        )}
        {job.issue_images && (
          <div className="mt-2">
            <button
              onClick={() => setIsImageModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-[#1B3C53] rounded border border-gray-200 hover:bg-gray-100 transition text-xs font-semibold"
            >
              <ImageIcon size={14} />
              {t('bookings.view_attached_image')}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 min-w-[150px] justify-end">
        {effectiveStatus === 'accepted' ? (
          <Button
            onClick={() => onUpdateStatus(job.id, 'in_progress')}
            isLoading={isUpdating}
            loadingText={t('provider.starting_job', 'Starting...')}
            fullWidth={false}
            rounded="lg"
            className="!px-4 !py-2 text-sm"
          >
            {t('provider.start_job', 'Start Job')}
          </Button>
        ) : effectiveStatus === 'in_progress' ? (
          <Button
            onClick={() => onCompleteJob(job)}
            isLoading={isUpdating}
            loadingText={t('provider.completing_job', 'Completing...')}
            fullWidth={false}
            rounded="lg"
            className="!px-4 !py-2 text-sm !bg-green-600 hover:!bg-green-700"
          >
            {!isUpdating && <ArrowRight size={16} className="mr-2" />}
            {t('provider.complete_job', 'Complete Job')}
          </Button>
        ) : (effectiveStatus === 'completed' && !job.is_paid) ? (
          <Button
            onClick={() => {
              if (job.payment_method === 'cash') {
                onUpdateStatus(job.id, 'paid', { payment_method: 'cash' });
              } else {
                toast.error('Payment already completed via Khalti');
              }
            }}
            isLoading={isUpdating}
            loadingText={t('provider.updating_payment', 'Updating...')}
            disabled={job.payment_method !== 'cash'}
            fullWidth={false}
            rounded="lg"
            className={`!px-4 !py-2 text-sm ${job.payment_method === 'cash'
              ? '!bg-green-600 hover:!bg-green-700'
              : '!bg-gray-400 cursor-not-allowed'
              }`}
          >
            {job.payment_method === 'cash' ? t('provider.confirm_cash', 'Confirm Cash Received') : t('bookings.paid')}
          </Button>
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
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingState, setUpdatingState] = useState({ id: null, nextStatus: null });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getCached('/booking/bookings/', { ttlMs: 30000 });
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus, additionalData = {}) => {
    const prevJobs = jobs;
    setUpdatingState({ id, nextStatus: newStatus });
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus, ...additionalData } : j));
    try {
      const updatedBooking = await api.post(`/booking/bookings/${id}/update-status/`, { status: newStatus, ...additionalData });
      invalidateCache('/booking/bookings/');
      invalidateCache('/booking/bookings/stats/');
      if (updatedBooking?.id) {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updatedBooking } : j));
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
      setJobs(prevJobs);
    } finally {
      setUpdatingState({ id: null, nextStatus: null });
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
        <h2 className="text-2xl font-bold text-[#1B3C53] mb-4">{t('provider.assigned_jobs', 'Assigned Jobs')}</h2>
        <div className="space-y-4">
          {assigned.map(job => (
            <JobCard
              key={job.id}
              job={job}
              type="Assigned"
              onUpdateStatus={handleUpdateStatus}
              isUpdating={updatingState.id === job.id}
              pendingStatus={updatingState.id === job.id ? updatingState.nextStatus : null}
            />
          ))}
          {assigned.length === 0 && <p className="text-gray-500">No assigned jobs.</p>}
        </div>
      </div>
    </div>
  );
};

export const ActiveJobs = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [updatingState, setUpdatingState] = useState({ id: null, nextStatus: null });
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getCached('/booking/bookings/', { ttlMs: 30000 });
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus, additionalData = {}) => {
    const prevJobs = jobs;
    setUpdatingState({ id, nextStatus: newStatus });
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus, ...additionalData } : j));
    try {
      const payload = { status: newStatus, ...additionalData };
      console.log('Sending payload:', payload);
      console.log('Booking ID:', id);
      const response = await api.post(`/booking/bookings/${id}/update-status/`, payload);
      invalidateCache('/booking/bookings/');
      invalidateCache('/booking/bookings/stats/');
      console.log('Response:', response);
      if (response?.id) {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, ...response } : j));
      }

      // Show success notification
      if (newStatus === 'paid') {
        setNotification({
          isOpen: true,
          type: 'success',
          title: 'Cash Payment Confirmed',
          message: 'Payment has been successfully confirmed.'
        });

        // Trigger review modal for customer by updating the booking
        // This will be handled by the customer's MyBookings page when they refresh
        toast.success('Payment confirmed! Customer can now leave a review.');
      }
    } catch (err) {
      console.error("Failed to update status", err);
      console.error('Error response:', err.response?.data);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update status. Please try again.'
      });
      setJobs(prevJobs);
    } finally {
      setUpdatingState({ id: null, nextStatus: null });
    }
  };

  const handleCompleteJob = async (jobId, status, additionalData = {}) => {
    const prevJobs = jobs;
    setUpdatingState({ id: jobId, nextStatus: status });
    setJobs(prev => prev.map(j => {
      if (j.id !== jobId) return j;
      const updatedJob = { ...j, status, ...additionalData };
      if (j.is_rework && status === 'completed') {
        updatedJob.is_paid = true;
      }
      return updatedJob;
    }));
    try {
      const payload = { status, ...additionalData };
      const updatedBooking = await api.post(`/booking/bookings/${jobId}/update-status/`, payload);
      invalidateCache('/booking/bookings/');
      invalidateCache('/booking/bookings/stats/');
      if (updatedBooking?.id) {
        setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updatedBooking } : j));
      }
    } catch (err) {
      console.error("Failed to complete job", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.detail || "Failed to complete job";
      alert(errorMsg);
      setJobs(prevJobs);
      throw err;
    } finally {
      setUpdatingState({ id: null, nextStatus: null });
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
            isUpdating={updatingState.id === job.id}
            pendingStatus={updatingState.id === job.id ? updatingState.nextStatus : null}
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

      <NotificationPopup
        isOpen={notification.isOpen}
        onClose={() => setNotification({ isOpen: false, type: 'success', title: '', message: '' })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  )
}

export default AssignedJobs;
