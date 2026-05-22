import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowRight, User, Image as ImageIcon, Phone, Clock } from 'lucide-react';
import Skeleton from '../../../shared/components/layout/Skeleton';
import { api, getCached, invalidateCache } from '../../../utils/api';
import CompleteJobModal from '../components/shared/CompleteJobModal';
import ImageModal from '../../../shared/components/ui/ImageModal';
import Button from '../../../shared/components/ui/Button';
import { toast } from '../../../shared/components/layout/ToastProvider';

import { useTranslation } from 'react-i18next';

const JobCard = ({ job, type, onUpdateStatus, onCompleteJob, isUpdating, pendingStatus, fromStatus }) => {
  const { t } = useTranslation();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const effectiveStatus = pendingStatus || job.status;
  const actionStatus = isUpdating && fromStatus != null ? fromStatus : job.status;

  const statusBadgeClass =
    effectiveStatus === 'in_progress'
      ? 'bg-orange-100 text-orange-700'
      : effectiveStatus === 'accepted'
        ? 'bg-blue-100 text-blue-700'
        : 'bg-blue-100 text-blue-700';

  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,1fr)_16rem] justify-items-start">
        <div className="order-1 w-full sm:col-start-1 sm:row-start-1 flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-left">
          <p className="mb-0 text-base font-semibold text-[#1B3C53]">
            {t(`service_names.${job.service_name_key}`, { defaultValue: job.service_name_key })}
          </p>
          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusBadgeClass}`}>
            {t(`status.${effectiveStatus}`, { defaultValue: effectiveStatus.replace('_', ' ') })}
          </span>
          {job.is_rework && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded uppercase animate-pulse">
              {t('bookings.rework_insurance', 'Rework Insurance')}
            </span>
          )}
          {job.created_at && (
            <span className="inline-flex items-center text-xs text-[#1B3C53]/60">
              <Clock size={12} className="mr-1 shrink-0" />
              {t('provider.booked_date', 'Booked')}: {new Date(job.created_at).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="order-3 w-full sm:order-none sm:col-start-2 sm:row-start-1 sm:row-span-3 flex flex-col gap-2 sm:justify-self-end sm:items-stretch">
          <div className="text-right -mt-0.5 -mb-1">
            <span className="block text-[10px] text-gray-500 leading-tight">
              {t('labels.total_price', 'Total Price')}
            </span>
            <span className="block text-lg font-bold text-green-600">Rs. {job.total_price}</span>
          </div>
          {actionStatus === 'accepted' ? (
            <Button
              onClick={() => onUpdateStatus(job.id, 'in_progress')}
              variant="primary"
              size="sm"
              isLoading={isUpdating}
              loadingText={t('provider.starting_job', 'Starting...')}
            >
              {t('provider.start_job', 'Start Job')}
            </Button>
          ) : actionStatus === 'in_progress' ? (
            <Button
              onClick={() => onCompleteJob(job)}
              variant="pay"
              size="sm"
              isLoading={isUpdating}
              loadingText={t('provider.completing_job', 'Completing...')}
            >
              {!isUpdating && <ArrowRight size={16} className="shrink-0" />}
              {t('provider.complete_job', 'Complete Job')}
            </Button>
          ) : actionStatus === 'completed' && !job.is_paid ? (
            <Button
              onClick={() => {
                if (job.payment_method === 'cash') {
                  onUpdateStatus(job.id, 'paid', { payment_method: 'cash' });
                } else {
                  toast.error('Payment already completed via Khalti');
                }
              }}
              variant="pay"
              size="sm"
              isLoading={isUpdating}
              loadingText={t('provider.updating_payment', 'Updating...')}
              disabled={job.payment_method !== 'cash'}
            >
              {job.payment_method === 'cash' ? t('provider.confirm_cash', 'Confirm Cash Received') : t('bookings.paid')}
            </Button>
          ) : null}
        </div>

        <div className="order-2 w-full sm:order-none sm:col-start-1 sm:row-start-2 flex flex-col items-start gap-y-1 text-sm text-gray-600 text-left">
          <div className="flex items-center">
            <User size={14} className="mr-2 shrink-0" />
            {job.customer_name}
          </div>
          <div className="flex items-center">
            <MapPin size={14} className="mr-2 shrink-0" />
            {job.address || (job.customer_address ? `${job.customer_address}, ${job.customer_city}` : t('common.loading', 'Location not provided'))}
          </div>
          <div className="flex items-center">
            <Phone size={14} className="mr-2 shrink-0" />
            {job.phone || job.customer_phone || t('common.loading', 'Not provided')}
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-2 shrink-0" />
            {job.scheduled_date} at {job.scheduled_time}
          </div>
        </div>

        {job.issue_description && (
          <p className="order-4 sm:order-none sm:col-start-1 sm:row-start-3 text-sm text-gray-500 mt-1 bg-gray-50 p-2 rounded">
            <span className="font-semibold">{t('labels.note', 'Note')}:</span> {job.issue_description}
          </p>
        )}
        {job.issue_images && (
          <div className="order-5 sm:order-none sm:col-start-1 sm:row-start-4 mt-1">
            <Button
              type="button"
              onClick={() => setIsImageModalOpen(true)}
              variant="secondary"
              size="sm"
              fullWidth={false}
            >
              <ImageIcon size={14} className="shrink-0" />
              {t('bookings.view_attached_image')}
            </Button>
          </div>
        )}
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
  const [updatingState, setUpdatingState] = useState({ id: null, nextStatus: null, fromStatus: null });

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
    const fromStatus = jobs.find(j => j.id === id)?.status;
    setUpdatingState({ id, nextStatus: newStatus, fromStatus });
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
      toast.error(t('provider.update_status_failed', 'Could not update status.'));
      setJobs(prevJobs);
    } finally {
      setUpdatingState({ id: null, nextStatus: null, fromStatus: null });
    }
  };

  // Filter jobs
  const assigned = jobs.filter(j => j.status === 'accepted' || j.status === 'assigned');

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 md:p-5">
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_16rem]">
              <Skeleton className="h-5 w-48" />
              <div className="flex flex-col gap-2 sm:col-start-2 sm:row-start-1 sm:row-span-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
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
              fromStatus={updatingState.id === job.id ? updatingState.fromStatus : null}
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
  const [updatingState, setUpdatingState] = useState({ id: null, nextStatus: null, fromStatus: null });

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
    const fromStatus = jobs.find(j => j.id === id)?.status;
    setUpdatingState({ id, nextStatus: newStatus, fromStatus });
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus, ...additionalData } : j));
    try {
      const payload = { status: newStatus, ...additionalData };
      const response = await api.post(`/booking/bookings/${id}/update-status/`, payload);
      invalidateCache('/booking/bookings/');
      invalidateCache('/booking/bookings/stats/');
      if (response?.id) {
        setJobs(prev => prev.map(j => j.id === id ? { ...j, ...response } : j));
      }

      if (newStatus === 'paid') {
        toast.success(t('provider.payment_confirmed_toast', 'Payment confirmed.'));
      }
    } catch (err) {
      console.error("Failed to update status", err);
      toast.error(t('provider.update_status_failed', 'Could not update status.'));
      setJobs(prevJobs);
    } finally {
      setUpdatingState({ id: null, nextStatus: null, fromStatus: null });
    }
  };

  const handleCompleteJob = async (jobId, status, additionalData = {}) => {
    const prevJobs = jobs;
    const fromStatus = jobs.find(j => j.id === jobId)?.status;
    setUpdatingState({ id: jobId, nextStatus: status, fromStatus });
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
      if (status === 'completed') {
        toast.success(t('provider.job_completed_toast', 'Job marked complete.'));
      }
    } catch (err) {
      console.error("Failed to complete job", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        t('provider.complete_job_failed', 'Failed to complete job');
      toast.error(errorMsg);
      setJobs(prevJobs);
      throw err;
    } finally {
      setUpdatingState({ id: null, nextStatus: null, fromStatus: null });
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
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 md:p-5">
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_16rem]">
              <Skeleton className="h-5 w-48" />
              <div className="flex flex-col gap-2 sm:col-start-2 sm:row-start-1 sm:row-span-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
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
            fromStatus={updatingState.id === job.id ? updatingState.fromStatus : null}
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
