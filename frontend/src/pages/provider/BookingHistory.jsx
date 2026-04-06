import { MapPin, Calendar, User, Banknote, CheckCircle, Clock, Filter, Image as ImageIcon, Phone } from 'lucide-react';
import Skeleton from '../../components/Skeleton';
import { api } from '../../utils/api';
import Pagination from '../../components/common/Pagination';
import { useState, useEffect } from 'react';
import ImageModal from '../../components/common/ImageModal';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, serviceFilter, timeFilter]);

  const fetchBookings = async () => {
    try {
      const data = await api.get('/booking/bookings/');
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-500" />;
      case 'accepted': return <Clock size={16} className="text-blue-500" />;
      case 'in_progress': return <Clock size={16} className="text-orange-500" />;
      case 'completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'paid': return <CheckCircle size={16} className="text-emerald-500" />;
      case 'cancelled': return <Clock size={16} className="text-red-500" />;
      default: return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'accepted': return 'bg-[#1B3C53]/10 text-[#1B3C53]';
      case 'in_progress': return 'bg-orange-100 text-orange-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'paid': return 'bg-emerald-100 text-emerald-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const uniqueServices = ['all', ...new Set(bookings.map(b => b.service_name))];

  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };

  const isThisWeek = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay());
    firstDay.setHours(0, 0, 0, 0);
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);
    lastDay.setHours(23, 59, 59, 999);
    return d >= firstDay && d <= lastDay;
  };

  const isThisMonth = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  };

  const filteredBookings = bookings.filter(booking => {
    const matchStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchService = serviceFilter === 'all' || booking.service_name === serviceFilter;
    let matchTime = true;
    const compareDate = booking.scheduled_date || booking.created_at;
    if (timeFilter === 'today') matchTime = isToday(compareDate);
    else if (timeFilter === 'this_week') matchTime = isThisWeek(compareDate);
    else if (timeFilter === 'this_month') matchTime = isThisMonth(compareDate);

    return matchStatus && matchService && matchTime;
  });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="w-64 h-8 mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="w-40 h-6" />
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-48 h-4" />
              </div>
              <Skeleton className="w-24 h-8" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-[#1B3C53]">Booking History</h2>

        {bookings.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 text-[#1B3C53] font-bold px-2">
              <Filter size={18} />
              <span className="text-sm">Filter</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B3C53] bg-gray-50 text-gray-700"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B3C53] bg-gray-50 text-gray-700 max-w-[150px] truncate"
            >
              {uniqueServices.map(service => (
                <option key={service} value={service}>{service === 'all' ? 'All Services' : service}</option>
              ))}
            </select>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B3C53] bg-gray-50 text-gray-700"
            >
              <option value="all">Any Time</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
            </select>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {paginatedBookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  {getStatusIcon(booking.status)}
                  <h3 className="font-bold text-[#1B3C53] text-lg">{booking.service_name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ')}
                  </span>
                  {booking.is_rework && (
                    <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-bold rounded uppercase">
                      Rework
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    <span>{booking.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    <span>{booking.phone || booking.customer_phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span>{booking.address || `${booking.customer_address}, ${booking.customer_city}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{booking.scheduled_date} at {booking.scheduled_time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote size={14} className="text-gray-400" />
                    <span className="font-semibold">Rs. {parseFloat(booking.total_price).toLocaleString()}</span>
                  </div>
                </div>

                {booking.issue_description && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Note:</span> {booking.issue_description}
                    </p>
                  </div>
                )}

                {booking.issue_images && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setSelectedImage(booking.issue_images);
                        setIsImageModalOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-[#1B3C53] rounded border border-gray-200 hover:bg-gray-100 transition text-sm font-semibold inline-flex"
                    >
                      <ImageIcon size={14} />
                      View Attached Image
                    </button>
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">
                  {booking.created_at && new Date(booking.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {filteredBookings.length === 0 && bookings.length > 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-2">No bookings match the selected filters.</p>
          <button onClick={() => { setStatusFilter('all'); setServiceFilter('all'); setTimeFilter('all'); }} className="text-[#1B3C53] font-bold text-sm underline hover:opacity-80">Clear Filters</button>
        </div>
      )}

      {bookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No bookings found.</p>
        </div>
      )}

      <ImageModal 
        isOpen={isImageModalOpen} 
        onClose={() => setIsImageModalOpen(false)} 
        imageUrl={selectedImage} 
      />
    </div>
  );
};

export default BookingHistory;
