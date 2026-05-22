import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Calendar, Image as ImageIcon, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../../../shared/components/layout/Skeleton';
import { api, getCached, invalidateCache } from '../../../utils/api';
import ConfirmActionModal from '../components/shared/ConfirmActionModal';
import ImageModal from '../../../shared/components/ui/ImageModal';
import Button from '../../../shared/components/ui/Button';
import { toast } from '../../../shared/components/layout/ToastProvider';
import { useTranslation } from 'react-i18next';

const JobRequests = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null,
    requestId: null,
    title: '',
    message: ''
  });
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const data = await getCached('/booking/bookings/', { ttlMs: 30000, forceRefresh });
      const pending = data.filter(
        (b) => b.status === 'pending' && !b.provider
      );
      setRequests(pending);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    const isAccept = action === 'Accepted';
    setConfirmModal({
      isOpen: true,
      action: action,
      requestId: id,
      title: isAccept ? 'Accept Booking' : 'Reject Booking',
      message: isAccept
        ? 'Are you sure you want to accept this booking request? This will move it to your active jobs.'
        : t(
            'provider.decline_request_confirm',
            'Decline for now? This request stays on your list until the scheduled time passes or another provider accepts. You can still accept it later.'
          )
    });
  };

  const confirmAction = async () => {
    if (!confirmModal.requestId) return;

    setActionLoading(true);
    try {
      const response = confirmModal.action === 'Accepted'
        ? await api.post(`/booking/bookings/${confirmModal.requestId}/update-status/`, { status: 'accepted' })
        : await api.post(`/booking/bookings/${confirmModal.requestId}/decline/`);

      invalidateCache('/booking/bookings/');
      invalidateCache('/booking/bookings/stats/');

      console.log(`Action ${confirmModal.action} successful for ID ${confirmModal.requestId}:`, response);

      if (confirmModal.action === 'Accepted') {
        setRequests(prev => prev.filter(req => req.id !== confirmModal.requestId));
      } else {
        await fetchRequests(true);
      }

      setConfirmModal({ isOpen: false, action: null, requestId: null, title: '', message: '' });

      if (confirmModal.action === 'Accepted') {
        toast.success(t('provider.booking_accepted_toast', 'Booking accepted.'));
      } else {
        toast.info(t('provider.booking_declined_toast', 'Booking declined for now.'));
      }

      if (confirmModal.action === 'Accepted') {
        setTimeout(() => {
          navigate('/provider/active');
        }, 1500);
      }
    } catch (err) {
      console.error("Action failed", err);
      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        t('provider.action_failed', 'Failed to update status');
      toast.error(message);
      if (err.response?.status === 409) {
        await fetchRequests(true);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const closeConfirmModal = () => {
    if (!actionLoading) {
      setConfirmModal({ isOpen: false, action: null, requestId: null, title: '', message: '' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-64 h-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 md:p-5">
              <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_16rem]">
                <Skeleton className="h-5 w-48" />
                <div className="flex flex-col gap-2 sm:col-start-2 sm:row-start-1 sm:row-span-3">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-44" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1B3C53]">{t('provider.job_requests', 'Incoming Job Requests')}</h2>

      {requests.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
          {t('bookings.no_bookings_found', 'No pending requests at the moment.')}
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`w-full bg-white rounded-xl shadow-sm border p-4 md:p-5 hover:shadow-md transition-shadow ${
                req.provider_has_declined
                  ? 'border-amber-200 bg-amber-50/30'
                  : 'border-gray-100'
              }`}
            >
              {req.provider_has_declined && (
                <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 space-y-0.5">
                  <p className="font-semibold">
                    {t('provider.job_request_previously_declined', 'You previously rejected this request.')}
                  </p>
                  <p>{t('provider.job_request_still_open', 'This job is still open.')}</p>
                  <p>{t('provider.job_request_can_still_accept', 'You can still accept this booking.')}</p>
                </div>
              )}
              <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,1fr)_16rem] justify-items-start">
                <div className="order-1 w-full sm:col-start-1 sm:row-start-1 flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-left">
                  <p className="mb-0 text-base font-semibold text-[#1B3C53]">
                    {t(`service_names.${req.service_name_key}`, {
                      defaultValue: req.service_name_key,
                    })}
                  </p>
                  {req.created_at && (
                    <span className="inline-flex items-center text-xs text-[#1B3C53]/60">
                      <Clock size={12} className="mr-1 shrink-0" />
                      {t('provider.booked_date', 'Booked')}: {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="order-3 w-full sm:order-none sm:col-start-2 sm:row-start-1 sm:row-span-3 flex flex-col gap-2 sm:justify-self-end sm:items-stretch">
                  <div className="text-right -mt-0.5 -mb-1">
                    <span className="block text-[10px] text-gray-500 leading-tight">
                      {t('labels.total_price', 'Total Price')}
                    </span>
                    <span className="block text-lg font-bold text-green-600">Rs. {req.total_price}</span>
                  </div>
                  <Button
                    onClick={() => handleAction(req.id, 'Accepted')}
                    variant="primary"
                    size="sm"
                    disabled={actionLoading}
                  >
                    {t('provider.accept', 'Accept')}
                  </Button>
                  {!req.provider_has_declined && (
                    <Button
                      onClick={() => handleAction(req.id, 'Rejected')}
                      variant="danger-outline"
                      size="sm"
                      disabled={actionLoading}
                    >
                      {t('common.cancel', 'Cancel')}
                    </Button>
                  )}
                </div>

                <div className="order-2 w-full sm:order-none sm:col-start-1 sm:row-start-2 flex flex-col items-start gap-y-1 text-sm text-gray-600 text-left">
                  <div className="flex items-center">
                    <User size={14} className="mr-2 shrink-0" />
                    {req.customer_name || t('labels.name', 'Customer')}
                  </div>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2 shrink-0" />
                    {req.address || (req.customer_address ? `${req.customer_address}, ${req.customer_city}` : t('common.loading', 'Location not provided'))}
                  </div>
                  <div className="flex items-center">
                    <Phone size={14} className="mr-2 shrink-0" />
                    {req.phone || req.customer_phone || t('common.loading', 'Not provided')}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 shrink-0" />
                    {req.scheduled_date} at {req.scheduled_time}
                  </div>
                </div>

                {req.issue_description && (
                  <p className="order-4 sm:order-none sm:col-start-1 sm:row-start-3 text-sm text-gray-500 mt-1 bg-gray-50 p-2 rounded">
                    <span className="font-semibold">{t('labels.note', 'Note')}:</span>{' '}
                    {req.issue_description}
                  </p>
                )}

                {req.issue_images && (
                  <div className="order-5 sm:order-none sm:col-start-1 sm:row-start-4 mt-1">
                    <Button
                      type="button"
                      onClick={() => {
                        setSelectedImage(req.issue_images);
                        setIsImageModalOpen(true);
                      }}
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
            </div>
          ))}
        </div>
      )}

      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        actionType={confirmModal.action === 'Accepted' ? 'accept' : 'reject'}
        loading={actionLoading}
      />

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={selectedImage}
      />
    </div>
  );
};

export default JobRequests;
