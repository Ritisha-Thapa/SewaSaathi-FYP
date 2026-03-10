import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import DashboardHeader from '../../components/customer/DashboardHeader';
import Footer from '../../components/customer/Footer';
import { Calendar, MapPin, CheckCircle, Clock, AlertCircle, Filter } from 'lucide-react';
import Skeleton from '../../components/Skeleton';
import { Link } from 'react-router-dom';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [claims, setClaims] = useState({});
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [bookingsData, claimsData] = await Promise.all([
                api.get('/booking/bookings/'),
                api.get('/insurance/claims/')
            ]);
            setBookings(bookingsData);

            // Map claims by booking ID
            const claimsMap = {};
            claimsData.forEach(claim => {
                claimsMap[claim.booking] = claim;
            });
            setClaims(claimsMap);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolution = async (bookingId, resolution) => {
        const claim = claims[bookingId];
        if (!claim) return;

        try {
            await api.post(`/insurance/claims/${claim.id}/choose-resolution/`, { resolution });
            fetchData(); // Refresh
        } catch (err) {
            console.error("Failed to set resolution", err);
            alert("Failed to set resolution.");
        }
    };

    const isEligibleForClaim = (booking) => {
        if (booking.status !== 'completed' || !booking.completed_at) return false;
        const completionTime = new Date(booking.completed_at).getTime();
        const currentTime = new Date().getTime();
        const fortyEightHours = 48 * 60 * 60 * 1000;
        return (currentTime - completionTime) <= fortyEightHours;
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F5F0]">
                <DashboardHeader />
                <div className="container mx-auto px-4 py-10 max-w-7xl">
                    <Skeleton className="w-48 h-10 mb-8" />
                    <div className="space-y-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-40 h-7" />
                                        <Skeleton className="w-20 h-6 rounded-full" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Skeleton className="w-32 h-4" />
                                        <Skeleton className="w-48 h-4" />
                                        <Skeleton className="w-36 h-4" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full md:w-32">
                                    <Skeleton className="h-10 rounded-xl" />
                                    <Skeleton className="h-10 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F5F0]">
            <DashboardHeader />
            <div className="container mx-auto px-4 py-10 max-w-7xl">
                <h1 className="text-3xl font-bold text-[#1B3C53] mb-8">My Bookings</h1>

                {bookings.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex items-center gap-2 text-[#1B3C53] font-bold w-full md:w-auto text-lg mb-2 md:mb-0 border-b md:border-b-0 pb-2 md:pb-0">
                            <Filter size={24} />
                            <span>Filter By </span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B3C53] bg-gray-50 text-gray-700"
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
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B3C53] bg-gray-50 text-gray-700"
                            >
                                {uniqueServices.map(service => (
                                    <option key={service} value={service}>{service === 'all' ? 'All Services' : service}</option>
                                ))}
                            </select>
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B3C53] bg-gray-50 text-gray-700"
                            >
                                <option value="all">Any Time</option>
                                <option value="today">Today</option>
                                <option value="this_week">This Week</option>
                                <option value="this_month">This Month</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {filteredBookings.map(booking => (
                        <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-[#1B3C53]">{booking.service_name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    booking.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                        booking.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
                                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {booking.status.replace('_', ' ')}
                                    </span>
                                    {claims[booking.id] && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${claims[booking.id].status === 'approved' ? 'bg-green-600 text-white' :
                                            claims[booking.id].status === 'rejected' ? 'bg-red-600 text-white' : 'bg-orange-400 text-white'
                                            }`}>
                                            Claim {claims[booking.id].status}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-600 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} />
                                        <span>{booking.scheduled_date} at {booking.scheduled_time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span className="truncate">{booking.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle size={16} className={booking.is_paid ? "text-green-500" : "text-red-500"} />
                                        <span>{booking.is_paid ? "Paid" : "Unpaid"} - Rs. {booking.total_price}</span>
                                    </div>
                                    {claims[booking.id] && claims[booking.id].status === 'approved' && claims[booking.id].resolution === 'none' && (
                                        <div className="col-span-1 sm:col-span-2 mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                            <p className="font-bold text-green-800 mb-2">Claim Approved! Choose your resolution:</p>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleResolution(booking.id, 'refund')}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition"
                                                >
                                                    80% Refund
                                                </button>
                                                <button
                                                    onClick={() => handleResolution(booking.id, 'rework')}
                                                    className="px-4 py-2 bg-[#1B3C53] text-white rounded-lg text-xs font-bold hover:bg-[#1a3248] transition"
                                                >
                                                    Request Rework
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {claims[booking.id] && claims[booking.id].resolution !== 'none' && (
                                        <div className="col-span-1 sm:col-span-2 mt-4 p-3 bg-gray-100 rounded-xl border border-gray-200">
                                            <p className="font-bold text-gray-800">Resolution: <span className="capitalize">{claims[booking.id].resolution}</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full md:w-auto">
                                {booking.status === 'completed' && !booking.is_paid && (
                                    <button
                                        onClick={async () => {
                                            try {
                                                await api.post(`/booking/bookings/${booking.id}/pay/`);
                                                fetchData(); // Refresh to show paid status
                                                alert("Payment successful!");
                                            } catch (err) {
                                                console.error("Payment failed", err);
                                                alert("Payment failed. Please try again.");
                                            }
                                        }}
                                        className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition text-center shadow-md flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} />
                                        Pay Now
                                    </button>
                                )}
                                {isEligibleForClaim(booking) && !claims[booking.id] && (
                                    <Link
                                        to={`/claim-insurance/${booking.id}`}
                                        className="px-6 py-2 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition text-center shadow-md flex items-center justify-center gap-2"
                                    >
                                        <AlertCircle size={18} />
                                        Claim Insurance
                                    </Link>
                                )}
                                <Link
                                    to={`/services/${booking.service_category_name}/${booking.service}`}
                                    className="px-6 py-2 border border-[#1B3C53] text-[#1B3C53] rounded-xl font-bold hover:bg-gray-50 transition text-center"
                                >
                                    View Service
                                </Link>
                            </div>
                        </div>
                    ))}

                    {filteredBookings.length === 0 && bookings.length > 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No bookings match the selected filters.</p>
                            <button onClick={() => { setStatusFilter('all'); setServiceFilter('all'); setTimeFilter('all'); }} className="text-[#1B3C53] font-bold mt-4 inline-block underline">Clear Filters</button>
                        </div>
                    )}

                    {bookings.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No bookings found.</p>
                            <Link to="/services-category" className="text-[#1B3C53] font-bold mt-4 inline-block underline">Browse Services</Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default MyBookings;
