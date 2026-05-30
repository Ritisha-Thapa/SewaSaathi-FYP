import React from 'react';
import { useTranslation } from 'react-i18next';
import BookingStatusSummary from './BookingStatusSummary';
import BookingForm from './BookingForm';

const BookingSidebar = ({
    bookingDetails,
    item,
    currentStatusMsg,
    onViewImage,
    onShowPayment,
    handleResolution,
    onCancelBooking,
    orderingStatus,
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
    errorMessage,
    authError,
    timeSlots
}) => {
    const { t } = useTranslation();

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="p-4 bg-white text-white text-center">
                    <h3 className="font-bold text-xl text-primary border-b border-gray-300 pb-2">
                        {bookingDetails?.latest_claim_status && bookingDetails.latest_claim_resolution === 'none'
                            ? t('booking_form.insurance_status')
                            : orderingStatus === "success"
                                ? t('booking_form.booking_status')
                                : t('booking_form.book_this_service')}
                    </h3>
                </div>

                <div className="p-6">
                    {orderingStatus === "success" && bookingDetails ? (
                        <BookingStatusSummary
                            bookingDetails={bookingDetails}
                            item={item}
                            currentStatusMsg={currentStatusMsg}
                            onViewImage={onViewImage}
                            onShowPayment={onShowPayment}
                            handleResolution={handleResolution}
                            onCancelBooking={onCancelBooking}
                        />
                    ) : (
                        <BookingForm
                            address={address}
                            setAddress={setAddress}
                            phone={phone}
                            setPhone={setPhone}
                            date={date}
                            setDate={setDate}
                            time={time}
                            setTime={setTime}
                            issueDescription={issueDescription}
                            setIssueDescription={setIssueDescription}
                            issueImage={issueImage}
                            handleImageChange={handleImageChange}
                            clearIssueImage={clearIssueImage}
                            handleBookService={handleBookService}
                            orderingStatus={orderingStatus}
                            errorMessage={errorMessage}
                            authError={authError}
                            timeSlots={timeSlots}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingSidebar;
