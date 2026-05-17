import React from 'react';
import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/ui/Button';

const BookingForm = ({
    address,
    setAddress,
    phone,
    setPhone,
    date,
    setDate,
    time,
    setTime,
    issueDescription,
    setIssueDescription,
    issueImage,
    handleImageChange,
    handleBookService,
    orderingStatus,
    errorMessage,
    authError,
    timeSlots
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            {/* Address & Phone */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('booking_form.address_label')}
                    </label>
                    <input
                        type="text"
                        placeholder={t('booking_form.address_placeholder')}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('booking_form.phone_label')}
                    </label>
                    <input
                        type="tel"
                        placeholder={t('booking_form.phone_placeholder')}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('booking_form.select_date')}
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition cursor-pointer"
                />
            </div>

            {/* Time Slots */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking_form.select_time')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                        <button
                            key={slot}
                            type="button"
                            onClick={() => setTime(slot)}
                            className={`py-2 px-1 rounded-lg text-xs font-medium transition border ${time === slot
                                ? "bg-[#1B3C53] text-white border-[#1B3C53]"
                                : "bg-white text-gray-600 border-gray-200 hover:border-[#1B3C53] hover:text-[#1B3C53]"
                                }`}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            </div>

            {/* Issue Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('booking_form.problem_desc')}
                </label>
                <textarea
                    value={issueDescription}
                    onChange={(e) => setIssueDescription(e.target.value)}
                    placeholder={t('booking_form.problem_placeholder')}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition h-24 resize-none"
                ></textarea>
            </div>

            {/* Image Upload */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('booking_form.upload_image')}
                </label>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500 pt-1">
                                {issueImage ? issueImage.name : t('booking_form.click_to_upload')}
                            </p>
                        </div>
                        <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-100">
                    {errorMessage}
                </div>
            )}

            {authError && (
                <div className="text-center">
                    <Link to="/login" className="text-[#1B3C53] underline font-medium">Login here</Link>
                </div>
            )}

            {/* Submit Button */}
            <Button
                onClick={handleBookService}
                isLoading={orderingStatus === "submitting"}
                loadingText={t('booking_form.processing')}
                className="!py-4 text-lg shadow-lg"
            >
                {t('booking_form.confirm_booking')}
            </Button>
        </div>
    );
};

export default BookingForm;
