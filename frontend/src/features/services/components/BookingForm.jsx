import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/ui/Button';
import FileUploadField from '../../../shared/components/ui/FileUploadField';
import {
    getLocalDateString,
    isSlotSelectable,
    isTimeSelectionValid,
} from '../../../utils/bookingTimeSlots';

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
    clearIssueImage,
    handleBookService,
    orderingStatus,
    errorMessage,
    authError,
    timeSlots
}) => {
    const { t } = useTranslation();
    const [now, setNow] = useState(() => new Date());

    const minDate = getLocalDateString(now);
    const isToday = date === minDate;
    const showTimeHint = Boolean(date) && isToday;

    useEffect(() => {
        const intervalId = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (time && date && !isTimeSelectionValid(time, date, now)) {
            setTime('');
        }
    }, [date, time, now, setTime]);

    const handleDateChange = (e) => {
        const nextDate = e.target.value;
        setDate(nextDate);
        if (time && nextDate && !isSlotSelectable(time, nextDate, now)) {
            setTime('');
        }
    };

    return (
        <div className="space-y-6">
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
                    onChange={handleDateChange}
                    min={minDate}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition cursor-pointer"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('booking_form.select_time')}
                </label>
                {showTimeHint && (
                    <p className="text-xs text-gray-500 mb-2">
                        {t('booking_form.time_buffer_hint')}
                    </p>
                )}
                <div className="grid grid-cols-4 gap-2">
                    {timeSlots.map((slot) => {
                        const selectable = date && isSlotSelectable(slot, date, now);
                        const isSelected = time === slot;

                        return (
                            <button
                                key={slot}
                                type="button"
                                disabled={!selectable}
                                onClick={() => selectable && setTime(slot)}
                                className={`py-2 px-1 rounded-lg text-xs font-medium transition border ${
                                    !selectable
                                        ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                                        : isSelected
                                          ? 'bg-[#1B3C53] text-white border-[#1B3C53]'
                                          : 'bg-white text-gray-600 border-gray-200 hover:border-[#1B3C53] hover:text-[#1B3C53]'
                                }`}
                            >
                                {slot}
                            </button>
                        );
                    })}
                </div>
            </div>

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

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('booking_form.upload_image')}
                </label>
                <FileUploadField
                    accept="image/*"
                    file={issueImage}
                    onChange={handleImageChange}
                    onClear={clearIssueImage}
                    hint={t('booking_form.click_to_upload')}
                />
            </div>

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

            <Button
                onClick={handleBookService}
                variant="primary"
                size="lg"
                isLoading={orderingStatus === "submitting"}
                loadingText={t('booking_form.processing')}
            >
                {t('booking_form.confirm_booking')}
            </Button>
        </div>
    );
};

export default BookingForm;
