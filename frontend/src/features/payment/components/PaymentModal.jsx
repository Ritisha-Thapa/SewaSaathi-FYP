import React from 'react';
import { X, Banknote, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '../../../utils/api';
import khaltiLogo from "../../../assets/khalti_logo.png";
import Button from '../../../shared/components/ui/Button';

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
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/20">

        {/* Header */}
        <div className="bg-primary p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Banknote size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold">Complete Payment</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1 bg-white/10 rounded-full hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 text-lg mb-1">{booking.service_name}</h4>
            <p className="text-sm text-gray-500 mb-6">Service provided by {booking.provider_name}</p>

            {/* Bill Breakdown */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">

              {/* Original service cost */}
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-medium">Original Service Cost</span>
                <span className={`font-semibold ${hasPriceAdjustment ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                  {formatPrice(booking.service_price)}
                </span>
              </div>

              {/* Final price — only shown if provider adjusted it */}
              {hasPriceAdjustment && (
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-orange-700 font-medium">
                    <ArrowRight size={14} />
                    Final Service Cost
                  </span>
                  <span className="font-bold text-orange-600">{formatPrice(booking.final_price)}</span>
                </div>
              )}

              {/* Provider note — shown only if set */}
              {booking.price_note && (
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex gap-2.5 text-[13px] text-orange-800 leading-relaxed shadow-sm">
                  <MessageSquare size={14} className="mt-1 shrink-0 text-orange-600" />
                  <span>
                    <span className="font-bold">Note: </span>
                    {booking.price_note}
                  </span>
                </div>
              )}

              {/* Insurance */}
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck size={16} className="text-blue-500" />
                  Insurance Fee (1%)
                </span>
                <span className="font-semibold text-gray-900">{formatPrice(booking.insurance_fee)}</span>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-black text-gray-900 text-lg uppercase tracking-tight">Total Due</span>
                <span className="text-2xl font-black text-primary">{formatPrice(booking.total_price)}</span>
              </div>
            </div>
          </div>

          {/* Payment options */}
          <div className="space-y-4 pt-2">
            <Button
              onClick={handleKhaltiPayment}
              rounded="xl"
              className="bg-[#5C2D91] hover:bg-[#4a2475] py-4 text-base shadow-xl shadow-purple-200 border-b-4 border-purple-800 active:border-b-0"
            >
              <img src={khaltiLogo} alt="Khalti" className="h-6 mr-2" />
              Pay Online via Khalti
            </Button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] font-black uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <Button
              onClick={handleCashPayment}
              variant="secondary"
              rounded="xl"
              className="py-4 text-base border-2 border-green-600 text-green-700 hover:bg-green-50 shadow-sm"
            >
              <Banknote size={22} className="mr-2" />
              Pay Offline with Cash
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentModal;
