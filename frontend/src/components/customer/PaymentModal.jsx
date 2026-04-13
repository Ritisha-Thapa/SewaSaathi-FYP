import React from 'react';
import { X, Banknote, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../utils/api';
import khaltiLogo from '../../assets/khalti_logo.png';

const PaymentModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
  if (!isOpen || !booking) return null;

  const formatPrice = (n) => `Rs. ${Number(n).toLocaleString()}`;

  const hasPriceAdjustment = booking.final_price &&
    Number(booking.final_price) !== Number(booking.service_price);

  const handleKhaltiPayment = async () => {
    try {
      toast.loading('Preparing Khalti payment...', { id: 'khalti' });
      const res = await api.post(`/booking/bookings/${booking.id}/initialize-payment/`, {
        return_url: `${window.location.origin}/payment-response`
      });
      if (res.payment_url) {
        toast.success('Redirecting to Khalti...', { id: 'khalti' });
        window.location.href = res.payment_url;
      } else {
        toast.error(res.error || 'Payment URL not received.', { id: 'khalti' });
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.details || 'Payment initialization failed. Please try again.';
      toast.error(msg, { id: 'khalti' });
      console.error('Payment initialization failed', err?.response?.data);
    }
  };

  const handleCashPayment = async () => {
    try {
      // Set payment method to cash
      await api.patch(`/booking/bookings/${booking.id}/`, { payment_method: 'cash' });
      
      toast.success(
        `Please hand ${formatPrice(booking.total_price)} in cash to your provider. The provider will confirm receipt to complete this transaction.`,
        { duration: 8000 }
      );
      
      // Notify parent that "payment" (choice) is done
      if (onPaymentSuccess) {
        onPaymentSuccess(booking);
      }
      onClose();
    } catch (err) {
      console.error('Failed to set payment method', err);
      toast.error('Failed to process cash payment request.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-[#1B3C53] p-5 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold">Complete Payment</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 text-lg mb-1">{booking.service_name}</h4>
            <p className="text-sm text-gray-500 mb-4">Provided by: {booking.provider_name}</p>

            {/* Bill Breakdown */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3">

              {/* Original service cost */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Original Service Cost</span>
                <span className={`font-medium ${hasPriceAdjustment ? 'line-through text-gray-400' : ''}`}>
                  {formatPrice(booking.service_price)}
                </span>
              </div>

              {/* Final price — only shown if provider adjusted it */}
              {hasPriceAdjustment && (
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-orange-700">
                    <ArrowRight size={13} />
                    Final Service Cost
                  </span>
                  <span className="font-semibold text-orange-600">{formatPrice(booking.final_price)}</span>
                </div>
              )}

              {/* Provider note — shown only if set */}
              {booking.price_note && (
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-2.5 flex gap-2 text-xs text-orange-800">
                  <MessageSquare size={13} className="mt-0.5 shrink-0" />
                  <span>
                    <span className="font-semibold">Provider note: </span>
                    {booking.price_note}
                  </span>
                </div>
              )}

              {/* Insurance */}
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-blue-500" />
                  Insurance Fee (1%)
                </span>
                <span className="font-medium">{formatPrice(booking.insurance_fee)}</span>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total Due</span>
                <span className="text-xl font-bold text-[#1B3C53]">{formatPrice(booking.total_price)}</span>
              </div>
            </div>
          </div>

          {/* Payment options */}
          <div className="space-y-3">
            <button
              onClick={handleKhaltiPayment}
              className="w-full py-3.5 bg-[#5C2D91] text-white rounded-xl font-bold hover:bg-[#4a2475] transition shadow-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transform"
            >
              <img src={khaltiLogo} alt="Khalti" className="h-5" />
              Pay Online via Khalti
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              onClick={handleCashPayment}
              className="w-full py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transform"
            >
              <Banknote size={20} />
              Pay Offline with Cash
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;
