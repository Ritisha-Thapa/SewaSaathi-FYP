import React, { useState, useEffect } from 'react';
import { Clock, MapPin, User, Calendar, Image as ImageIcon, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton from '../../../shared/components/layout/Skeleton';
import { api, getCached, invalidateCache } from '../../../utils/api';
import ConfirmActionModal from '../components/shared/ConfirmActionModal';
import NotificationPopup from '../../notifications/components/NotificationPopup';
import ImageModal from '../../../shared/components/ui/ImageModal';
import Button from '../../../shared/components/ui/Button';
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
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getCached('/booking/bookings/', { ttlMs: 30000 });
      // Filter for pending requests only
      const pending = data.filter(b => b.status === 'pending');
      setRequests(pending);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    // Show confirmation modal
    const isAccept = action === 'Accepted';
    setConfirmModal({
      isOpen: true,
      action: action,
      requestId: id,
      title: isAccept ? 'Accept Booking' : 'Reject Booking',
      message: isAccept
        ? 'Are you sure you want to accept this booking request? This will move it to your active jobs.'
        : 'Are you sure you want to reject this booking request? This action cannot be undone.'
    });
  };

  const confirmAction = async () => {
    if (!confirmModal.requestId) return;

    setActionLoading(true);
    try {
      const status = confirmModal.action === 'Accepted' ? 'accepted' : 'rejected';
      const response = await api.post(`/booking/bookings/${confirmModal.requestId}/update-status/`, { status });

      invalidateCache('/booking/bookings/');
      invalidateCache('/booking/bookings/stats/');

      console.log(`Action ${status} successful for ID ${confirmModal.requestId}:`, response);

      // Remove from requests list
      setRequests(prev => prev.filter(req => req.id !== confirmModal.requestId));

      // Close modal
      setConfirmModal({ isOpen: false, action: null, requestId: null, title: '', message: '' });

      // Show success notification
      setNotification({
        isOpen: true,
        type: confirmModal.action === 'Accepted' ? 'success' : 'info',
        title: `Booking ${confirmModal.action}`,
        message: `Booking request has been ${confirmModal.action.toLowerCase()} successfully.`
      });

      if (confirmModal.action === 'Accepted') {
        setTimeout(() => {
          navigate('/provider/active');
        }, 1500);
      }
    } catch (err) {
      console.error("Action failed", err);
      alert("Failed to update status");
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <Skeleton className="w-full h-24 rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="w-3/4 h-4" />
                <Skeleton className="w-1/2 h-4" />
                <Skeleton className="w-2/3 h-4" />
              </div>
              <div className="p-4 bg-gray-50 flex gap-3">
                <Skeleton className="flex-1 h-10 rounded-lg" />
                <Skeleton className="flex-1 h-10 rounded-lg" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#1B3C53]">{t(`service_names.${req.service_name_key}`)}</h3>
                  <div className="flex items-center text-sm text-[#1B3C53]/60 mt-1">
                    <Clock size={14} className="mr-1" />
                    <span>{t('labels.date', 'Created')}: {new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-lg font-bold text-green-600">Rs. {req.total_price}</span>
                  <span className="text-xs text-gray-500">Total Price</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2 text-gray-400" />
                  {req.customer_name || t('labels.name', 'Customer')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={16} className="mr-2 text-gray-400" />
                  {req.phone || req.customer_phone || t('common.loading', "Not provided")}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={16} className="mr-2 text-gray-400" />
                  {req.address || (req.customer_address ? `${req.customer_address}, ${req.customer_city}` : t('common.loading', "Location not provided"))}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  {req.scheduled_date} at {req.scheduled_time}
                </div>
                {req.issue_description && (
                  <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                    "{req.issue_description}"
                  </div>
                )}
                {req.issue_images && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSelectedImage(req.issue_images);
                        setIsImageModalOpen(true);
                      }}
                      className="flex w-full items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-[#1B3C53] rounded border border-gray-200 hover:bg-gray-100 transition text-sm font-semibold"
                    >
                      <ImageIcon size={16} />
                      {t('bookings.view_attached_image')}
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-4 bg-gray-50 flex gap-3">
                <Button
                  onClick={() => handleAction(req.id, 'Rejected')}
                  fullWidth
                  rounded="lg"
                  disabled={actionLoading}
                  className="!px-4 !py-2 text-sm !bg-white !border !border-red-200 !text-red-600 hover:!bg-red-50"
                >
                  {t('common.cancel', 'Reject')}
                </Button>
                <Button
                  onClick={() => handleAction(req.id, 'Accepted')}
                  fullWidth
                  rounded="lg"
                  disabled={actionLoading}
                  className="!px-4 !py-2 text-sm"
                >
                  {t('status.accepted', 'Accept')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmActionModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        actionType={confirmModal.action === 'Accepted' ? 'accept' : 'reject'}
        loading={actionLoading}
      />

      <NotificationPopup
        isOpen={notification.isOpen}
        onClose={() => setNotification({ isOpen: false, type: 'success', title: '', message: '' })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
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
