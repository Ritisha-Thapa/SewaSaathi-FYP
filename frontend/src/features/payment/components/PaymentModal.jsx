import React from 'react';
import { X, Banknote, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';
import { toast } from '../../../shared/components/layout/ToastProvider';
import { api } from '../../../utils/api';
import Button from '../../../shared/components/ui/Button';
import khaltiLogo from "../../../assets/khalti_logo.png";

const PaymentModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
  const [cashLoading, setCashLoading] = React.useState(false);
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
    setCashLoading(true);
    try {
      await api.patch(`/booking/bookings/${booking.id}/`, { payment_method: 'cash' });

      toast.success(
        `Please hand ${formatPrice(booking.total_price)} in cash to your provider. The provider will confirm receipt to complete this transaction.`,
        { duration: 8000 }
      );

      if (onPaymentSuccess) {
        onPaymentSuccess(booking);
      }
      onClose();
    } catch (err) {
      console.error('Failed to set payment method', err);
      toast.error('Failed to process cash payment request.');
    } finally {
      setCashLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-50/50 to-indigo-50/30 p-5 sm:p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />
          <div className="relative flex items-center gap-3 z-10">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 text-primary rounded-xl shrink-0 shadow-sm border border-primary/5">
              <Banknote size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-none mb-0.5">
              Complete Payment
            </h3>
          </div>
          <Button
            type="button"
            onClick={onClose}
            variant="icon"
            fullWidth={false}
            aria-label="Close"
            className="relative z-10 border border-transparent hover:border-gray-200"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="p-5 sm:p-6 bg-gray-50/30">
          <div className="mb-2">
            <h4 className="font-semibold text-gray-900 text-base mb-1 truncate">{booking.service_name}</h4>
            <p className="text-sm text-gray-500 mb-5">Service by <span className="font-medium text-gray-700">{booking.provider_name}</span></p>

            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Original Service Cost</span>
                <span className={`font-medium ${hasPriceAdjustment ? 'line-through text-gray-400 decoration-gray-300' : 'text-gray-900'}`}>
                  {formatPrice(booking.service_price)}
                </span>
              </div>

              {hasPriceAdjustment && (
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <ArrowRight size={14} className="text-gray-400" />
                    Final Service Cost
                  </span>
                  <span className="font-semibold text-gray-900">{formatPrice(booking.final_price)}</span>
                </div>
              )}

              {booking.price_note && (
                <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-3 flex gap-2.5 text-sm text-blue-800 leading-relaxed shadow-sm mt-2">
                  <MessageSquare size={16} className="mt-0.5 shrink-0 text-blue-500" />
                  <span>
                    <span className="font-semibold">Note: </span>
                    {booking.price_note}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1.5 text-gray-500 font-medium">
                  <ShieldCheck size={16} className="text-blue-500" />
                  Insurance Fee (1%)
                </span>
                <span className="font-medium text-gray-900">{formatPrice(booking.insurance_fee)}</span>
              </div>

              <div className="h-px bg-gray-100 w-full my-1" />

              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-gray-900 text-base">Total Due</span>
                <span className="text-xl font-bold text-primary tracking-tight">{formatPrice(booking.total_price)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <Button
              onClick={handleKhaltiPayment}
              variant="khalti"
              size="md"
            >
              <img src={khaltiLogo} alt="Khalti" className="h-5 object-contain shrink-0" />
              Pay Online via Khalti
            </Button>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-gray-200" />
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-medium uppercase tracking-wider">OR</span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            <Button
              onClick={handleCashPayment}
              variant="secondary"
              size="md"
              isLoading={cashLoading}
              loadingText="Processing..."
              disabled={cashLoading}
            >
              <Banknote size={18} className="shrink-0 text-gray-500" />
              Pay Offline with Cash
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
