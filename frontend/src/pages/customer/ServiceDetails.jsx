import React, { useState, useEffect } from "react";

import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "../../components/customer/Footer";

const formatPrice = (n) => `Rs. ${n.toLocaleString()}`;

const ServiceDetails = () => {
  const { category, serviceId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/services/service/${serviceId}/`
        );
        if (!res.ok) throw new Error("Failed to fetch service");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(""); // '', 'finding', 'found'
  const [errorMessage, setErrorMessage] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading service details...
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-700">Service not found.</p>
        <Link
          to={`/services/${category}`}
          className="text-[#1B3C53] mt-4 inline-block"
        >
          Back to {category}
        </Link>
      </div>
    );
  }

  const handleRequestService = () => {
    setErrorMessage("");
    setStatus("");

    if (!date || !time || !address || !phone) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const convertTo24Hour = (timeStr) => {
      const [timePart, modifier] = timeStr.split(" ");
      let [hours, minutes] = timePart.split(":");
      if (hours === "12") {
        hours = "00";
      }
      if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
      }
      return `${hours}:${minutes}`;
    };

    const time24 = convertTo24Hour(time);
    const selectedDateTime = new Date(`${date}T${time24}`);
    const now = new Date();
    const diffInHours = (selectedDateTime - now) / (1000 * 60 * 60);

    if (diffInHours < 2) {
      setErrorMessage(
        "Service request must be at least 2 hours ahead of the current time."
      );
      return;
    }

    setStatus("finding");

    // Simulate finding a provider
    setTimeout(() => {
      setStatus("found");
    }, 2500);
  };

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
  ];

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      <div className="container mx-auto px-4 max-w-7xl py-10">
        {/* Breadcrumb / Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to={`/services/${category}`}
              className="text-gray-500 hover:text-[#1B3C53] text-sm mb-2 inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to {category}
            </Link>
            <h2 className="text-4xl font-bold text-[#1B3C53]">{item.name}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: Service Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-96 object-cover"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              {/* <h3 className="text-2xl font-bold text-[#1B3C53] mb-4">descriptionription</h3> */}
              <p className="text-gray-700 leading-relaxed text-lg">
                {item.description}
              </p>

              <div className="mt-8 pt-8 border-t border-gray-100">
                {/* <h3 className="text-xl font-bold text-[#1B3C53] mb-4">Pricing</h3> */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-lg">Starting Price:</span>
                  <span className="text-3xl font-bold text-[#1B3C53]">
                    {formatPrice(item.base_price)}
                  </span>
                </div>
                <p className="text-gray-500 mt-2 text-sm bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
                  Note: Extra 1% insurance charge will be added later.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className=" p-4 text-center">
                <h3 className="text-[#1B3C53] font-bold text-xl">
                  Request a Service
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Address & Phone */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      placeholder="Full Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition cursor-pointer"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`py-2 px-1 rounded-lg text-sm font-medium transition border ${
                          time === slot
                            ? "bg-[#1B3C53] text-white border-[#1B3C53]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#1B3C53] hover:text-[#1B3C53]"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Must be after 2 hours from now
                  </p>
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-100 flex items-start">
                    <svg
                      className="w-4 h-4 mr-1.5 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  {status === "finding" ? (
                    <div className="w-full py-4 bg-blue-50 text-[#1B3C53] rounded-xl flex items-center justify-center font-medium border border-blue-100">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#1B3C53]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Finding Service Provider...
                    </div>
                  ) : status === "found" ? (
                    <div className="w-full py-4 bg-green-50 text-green-700 rounded-xl flex flex-col items-center justify-center font-medium border border-green-100 text-center">
                      <div className="flex items-center mb-1">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span>Request Sent!</span>
                      </div>
                      <span className="text-xs">
                        Service Provider will contact shortly.
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleRequestService}
                      className="w-full py-4 bg-[#1B3C53] text-white rounded-xl font-medium text-lg shadow-lg hover:bg-[#152e40] transition transform active:scale-95"
                    >
                      Request Service
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetails;
