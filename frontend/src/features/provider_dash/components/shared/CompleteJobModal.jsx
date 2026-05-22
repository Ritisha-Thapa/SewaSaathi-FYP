import React, { useState, useEffect } from 'react';
import { X, Banknote, CheckCircle } from 'lucide-react';
import Button from '../../../../shared/components/ui/Button';

const getDefaultFinalPrice = (job) => {
  if (!job) return '';
  const price = job.final_price ?? job.service_price ?? job.total_price;
  if (price === null || price === undefined || price === '') return '';
  return String(Number(price));
};

const CompleteJobModal = ({ isOpen, onClose, job, onComplete }) => {
  const [finalPrice, setFinalPrice] = useState('');
  const [priceNote, setPriceNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && job) {
      setFinalPrice(getDefaultFinalPrice(job));
      setPriceNote(job.price_note ?? '');
    }
  }, [isOpen, job?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!finalPrice || finalPrice <= 0) {
      alert('Please enter a valid final price');
      return;
    }

    setLoading(true);
    try {
      const payload = { final_price: finalPrice };
      if (priceNote.trim()) payload.price_note = priceNote.trim();
      await onComplete(job.id, 'completed', payload);
      onClose();
    } catch (err) {
      console.error('Failed to complete job:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-[#F9F5F0]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-[#1B3C53]">Complete Job</h3>
          <Button
            type="button"
            onClick={onClose}
            variant="icon"
            fullWidth={false}
          >
            <X size={24} />
          </Button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[#1B3C53] mb-2">{job.service_name}</h4>
            <p className="text-sm text-gray-600">Customer: {job.customer_name}</p>
            <p className="text-sm text-gray-600">Original Price: Rs. {job.service_price}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Final Price (Rs.)
            </label>
            <div className="relative">
              <Banknote size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent"
                placeholder={job.service_price ? `Default: Rs. ${job.service_price}` : 'Enter final price'}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Set the final price based on actual work completed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Note <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={priceNote}
              onChange={(e) => setPriceNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent resize-none text-sm"
              placeholder="e.g. Extra parts were needed, additional labour for 2hrs..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This note will be shown to the customer on their payment screen.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              size="md"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="pay"
              size="md"
              isLoading={loading}
              loadingText="Completing..."
              className="flex-1"
            >
              <CheckCircle size={20} className="shrink-0" />
              Complete Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteJobModal;
